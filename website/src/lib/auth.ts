import { apiPath, dashboardUrl, homeUrl } from './paths'

export interface AuthUser {
  id: string
  username: string
  name: string
  profileImageUrl?: string
}

export interface GenesisAgent {
  id: string
  name: string
  status: 'pending_verification' | 'active'
  verificationCode: string
}

export interface ChildAgent {
  id: string
  genesisId: string
  name: string
  purpose: string
  status: 'spawning' | 'active' | 'paused' | 'tokenized'
  feesEarned: number
  token?: {
    ticker: string
    mintAddress: string
    pumpFunUrl: string
    createdAt: number
  }
  createdAt: number
}

export interface AuthState {
  authenticated: boolean
  user?: AuthUser
  genesis?: GenesisAgent | null
  children?: ChildAgent[]
}

const DEV_USER: AuthUser = {
  id: 'dev_user_1',
  username: 'devuser',
  name: 'Dev User',
  profileImageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=genesis',
}

function devAuthState(): AuthState {
  const raw = localStorage.getItem('genesis_dev')
  if (!raw) return { authenticated: true, user: DEV_USER, genesis: null, children: [] }
  try {
    return JSON.parse(raw)
  } catch {
    return { authenticated: true, user: DEV_USER, genesis: null, children: [] }
  }
}

function saveDevState(state: AuthState) {
  localStorage.setItem('genesis_dev', JSON.stringify(state))
}

async function apiAvailable(): Promise<boolean> {
  try {
    const res = await fetch(apiPath('/health'), { signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}

const usesRemoteApi = () => Boolean(import.meta.env.VITE_API_URL)

export async function fetchAuth(): Promise<AuthState> {
  try {
    const res = await fetch(apiPath('/auth/me'), { credentials: 'include' })
    if (res.ok) return res.json()
    if (usesRemoteApi()) return { authenticated: false }
  } catch {
    if (usesRemoteApi()) return { authenticated: false }
  }
  return devAuthState()
}

export async function completeAuthSession(code: string): Promise<AuthState | null> {
  try {
    const res = await fetch(apiPath('/auth/session/complete'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    if (res.ok) return res.json()
  } catch {
    // ignore
  }
  return null
}

export async function loginWithX(): Promise<void> {
  if (usesRemoteApi() || await apiAvailable()) {
    window.location.href = apiPath('/auth/x')
    return
  }

  saveDevState({ authenticated: true, user: DEV_USER, genesis: null, children: [] })
  window.location.href = dashboardUrl()
}

export async function createGenesis(name?: string): Promise<GenesisAgent> {
  try {
    const res = await fetch(apiPath('/auth/genesis'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      const data = await res.json()
      return data.genesis
    }
  } catch { /* dev fallback */ }

  const genesis: GenesisAgent = {
    id: 'gen_dev',
    name: name ?? "Dev User's Genesis",
    status: 'pending_verification',
    verificationCode: 'GEN-DEV001',
  }
  const state = devAuthState()
  state.genesis = genesis
  saveDevState(state)
  return genesis
}

export async function verifyGenesis(): Promise<GenesisAgent> {
  try {
    const res = await fetch(apiPath('/auth/genesis/verify'), { method: 'POST', credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      return data.genesis
    }
  } catch { /* dev fallback */ }

  const state = devAuthState()
  if (state.genesis) {
    state.genesis.status = 'active'
    saveDevState(state)
    return state.genesis
  }
  throw new Error('No genesis')
}

export async function spawnChild(name: string, purpose: string): Promise<ChildAgent> {
  try {
    const res = await fetch(apiPath('/agents/children'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, purpose }),
    })
    if (res.ok) {
      const data = await res.json()
      return data.child
    }
  } catch { /* dev fallback */ }

  const child: ChildAgent = {
    id: `child_${Date.now()}`,
    genesisId: 'gen_dev',
    name,
    purpose,
    status: 'active',
    feesEarned: 0,
    createdAt: Date.now(),
  }
  const state = devAuthState()
  state.children = [...(state.children ?? []), child]
  saveDevState(state)
  return child
}

export async function tokenizeChild(childId: string, ticker: string): Promise<ChildAgent> {
  try {
    const res = await fetch(apiPath(`/agents/children/${childId}/tokenize`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker }),
    })
    if (res.ok) {
      const data = await res.json()
      return data.child
    }
  } catch { /* dev fallback */ }

  const state = devAuthState()
  const child = state.children?.find((c) => c.id === childId)
  if (!child) throw new Error('Not found')
  child.status = 'tokenized'
  child.token = {
    ticker,
    mintAddress: `${ticker}DEV123`,
    pumpFunUrl: `https://pump.fun/coin/${ticker}DEV123`,
    createdAt: Date.now(),
  }
  saveDevState(state)
  return child
}

export async function pauseChild(childId: string): Promise<void> {
  try {
    await fetch(apiPath(`/agents/children/${childId}/pause`), { method: 'POST', credentials: 'include' })
    return
  } catch { /* dev */ }
  const state = devAuthState()
  const child = state.children?.find((c) => c.id === childId)
  if (child) { child.status = 'paused'; saveDevState(state) }
}

export async function resumeChild(childId: string): Promise<void> {
  try {
    await fetch(apiPath(`/agents/children/${childId}/resume`), { method: 'POST', credentials: 'include' })
    return
  } catch { /* dev */ }
  const state = devAuthState()
  const child = state.children?.find((c) => c.id === childId)
  if (child) { child.status = 'active'; saveDevState(state) }
}

export async function logout(): Promise<void> {
  try {
    await fetch(apiPath('/auth/logout'), { method: 'POST', credentials: 'include' })
  } catch { /* dev */ }
  localStorage.removeItem('genesis_dev')
  window.location.href = homeUrl()
}