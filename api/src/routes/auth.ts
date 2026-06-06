import { Hono, type Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { randomHex, sha256Base64Url } from '../crypto.js'
import { db } from '../db.js'
import { findVerificationTweet } from '../x-api.js'
import { isMockAuth } from '../dev.js'
import {
  clearSessionCookieOptions,
  isProduction,
  sessionCookieOptions,
} from '../cookies.js'

const X_AUTH_URL = 'https://twitter.com/i/oauth2/authorize'
const X_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token'
const X_USER_URL = 'https://api.twitter.com/2/users/me'

const SCOPES = ['tweet.read', 'users.read', 'offline.access'].join(' ')
const DEFAULT_FRONTEND = 'https://nostalgicgarethdev.github.io/genesis'

function frontendUrl(): string {
  const url = process.env.FRONTEND_URL?.trim()
  if (url) return url
  if (!isProduction()) return 'http://localhost:5173'
  return DEFAULT_FRONTEND
}

function dashboardRedirect(frontend: string, authCode?: string): string {
  const base = `${frontend.replace(/\/$/, '')}/dashboard`
  return authCode ? `${base}?auth_code=${encodeURIComponent(authCode)}` : base
}

function homeRedirect(frontend: string, query: string): string {
  const base = frontend.replace(/\/$/, '')
  return query ? `${base}/?${query}` : `${base}/`
}

export const auth = new Hono()

function setUserSession(c: Context, xUserId: string): string {
  const sessionId = randomHex(32)
  db.createSession(sessionId, xUserId)
  setCookie(c, 'genesis_session', sessionId, sessionCookieOptions())
  return sessionId
}

function authPayload(sessionId: string) {
  const user = db.getSession(sessionId)
  if (!user) return null

  const genesis = db.getGenesisByXUser(user.id)

  return {
    authenticated: true as const,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
    },
    genesis: genesis
      ? {
          id: genesis.id,
          name: genesis.name,
          status: genesis.status,
          verificationCode: genesis.verificationCode,
        }
      : null,
    children: genesis?.status === 'active' ? db.listChildren(genesis.id) : [],
  }
}

auth.get('/x', async (c) => {
  const frontend = frontendUrl()

  if (isMockAuth()) {
    db.saveUser({
      id: 'dev_user_1',
      username: 'devuser',
      name: 'Dev User',
      profileImageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=genesis',
      accessToken: 'mock',
    })
    setUserSession(c, 'dev_user_1')
    console.log('[dev] Mock login — no X credentials needed')
    return c.redirect(dashboardRedirect(frontend))
  }

  const clientId = process.env.X_CLIENT_ID
  const redirectUri = process.env.X_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return c.json({ error: 'OAuth not configured. Set X_CLIENT_ID and X_REDIRECT_URI in .env' }, 500)
  }

  const state = randomHex(16)
  const codeVerifier = randomHex(32)
  const codeChallenge = await sha256Base64Url(codeVerifier)

  db.saveOAuthPending(state, codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  return c.redirect(`${X_AUTH_URL}?${params}`)
})

auth.get('/x/callback', async (c) => {
  const frontend = frontendUrl()
  const code = c.req.query('code')
  const state = c.req.query('state')
  const codeVerifier = state ? db.consumeOAuthPending(state) : null

  if (!code || !state || !codeVerifier) {
    console.error('[auth] OAuth callback failed:', { hasCode: Boolean(code), hasState: Boolean(state), hasVerifier: Boolean(codeVerifier) })
    return c.redirect(homeRedirect(frontend, 'auth=error&reason=invalid_state'))
  }

  const clientId = process.env.X_CLIENT_ID!
  const clientSecret = process.env.X_CLIENT_SECRET!
  const redirectUri = process.env.X_REDIRECT_URI!

  const tokenRes = await fetch(X_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    console.error('Token exchange failed:', err)
    return c.redirect(homeRedirect(frontend, 'auth=error&reason=token_exchange'))
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string
    refresh_token?: string
  }

  const userRes = await fetch(`${X_USER_URL}?user.fields=profile_image_url`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  if (!userRes.ok) {
    return c.redirect(homeRedirect(frontend, 'auth=error&reason=user_fetch'))
  }

  const { data } = (await userRes.json()) as {
    data: { id: string; username: string; name: string; profile_image_url?: string }
  }

  db.saveUser({
    id: data.id,
    username: data.username,
    name: data.name,
    profileImageUrl: data.profile_image_url,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  })

  const sessionId = setUserSession(c, data.id)
  const authCode = db.createAuthCode(sessionId)
  return c.redirect(dashboardRedirect(frontend, authCode))
})

auth.get('/me', (c) => {
  const sessionId = getCookie(c, 'genesis_session')
  if (!sessionId) return c.json({ authenticated: false })

  const payload = authPayload(sessionId)
  if (!payload) return c.json({ authenticated: false })

  return c.json(payload)
})

auth.post('/session/complete', async (c) => {
  const body = await c.req.json<{ code?: string }>()
  const sessionId = body.code ? db.consumeAuthCode(body.code) : null
  if (!sessionId) return c.json({ error: 'Invalid or expired login code' }, 400)

  setCookie(c, 'genesis_session', sessionId, sessionCookieOptions())

  const payload = authPayload(sessionId)
  if (!payload) return c.json({ error: 'Session not found' }, 404)

  return c.json(payload)
})

auth.post('/genesis', async (c) => {
  const sessionId = getCookie(c, 'genesis_session')
  if (!sessionId) return c.json({ error: 'Unauthorized' }, 401)

  const user = db.getSession(sessionId)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const existing = db.getGenesisByXUser(user.id)
  if (existing) return c.json({ error: 'Genesis already exists', genesis: existing }, 409)

  const body = await c.req.json<{ name?: string }>()
  const name = body.name?.trim() || `${user.name}'s Genesis`

  try {
    const genesis = db.createGenesis(user.id, name)
    return c.json({ genesis })
  } catch {
    return c.json({ error: 'Failed to create genesis' }, 500)
  }
})

auth.post('/genesis/verify', async (c) => {
  const sessionId = getCookie(c, 'genesis_session')
  if (!sessionId) return c.json({ error: 'Unauthorized' }, 401)

  const user = db.getSession(sessionId)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis found' }, 404)
  if (genesis.status === 'active') return c.json({ genesis })

  const found =
    isMockAuth() || user.accessToken === 'mock'
      ? true
      : await findVerificationTweet(user.id, user.accessToken, genesis.verificationCode)

  if (!found) {
    return c.json({
      error: 'Verification tweet not found',
      hint: `Post a tweet containing: ${genesis.verificationCode}`,
    }, 400)
  }

  const verified = db.verifyGenesis(genesis.id)
  return c.json({ genesis: verified })
})

auth.post('/logout', (c) => {
  const sessionId = getCookie(c, 'genesis_session')
  if (sessionId) db.deleteSession(sessionId)
  deleteCookie(c, 'genesis_session', clearSessionCookieOptions())
  return c.json({ ok: true })
})