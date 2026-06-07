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
  launchWalletPubkey?: string
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
  proposals?: TokenizationProposal[]
}

export interface TokenizationProposal {
  id: string
  childId: string
  genesisId: string
  ticker: string
  devBuySol?: number
  twitter?: string
  telegram?: string
  website?: string
  imageUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
  approvedAt?: number
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

export interface TokenizeOptions {
  devBuySol?: number
  imageUrl?: string
  twitter?: string
  telegram?: string
  website?: string
}

export async function proposeTokenize(
  childId: string,
  ticker: string,
  devBuySol = 0,
  opts: TokenizeOptions = {}
): Promise<TokenizationProposal> {
  const payload: any = {
    ticker,
    devBuySol: devBuySol > 0 ? devBuySol : undefined,
    imageUrl: opts.imageUrl || undefined,
    twitter: opts.twitter || undefined,
    telegram: opts.telegram || undefined,
    website: opts.website || undefined,
  }

  try {
    const res = await fetch(apiPath(`/agents/children/${childId}/propose-tokenize`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const data = await res.json()
      return data.proposal
    }
  } catch { /* dev fallback */ }

  // const state = devAuthState()
  const proposal: TokenizationProposal = {
    id: `prop_${Date.now()}`,
    childId,
    genesisId: 'gen_dev',
    ticker,
    devBuySol: devBuySol > 0 ? devBuySol : undefined,
    twitter: opts.twitter,
    telegram: opts.telegram,
    website: opts.website,
    imageUrl: opts.imageUrl,
    status: 'pending',
    createdAt: Date.now(),
  }
  // In dev, we can store in local but for simplicity just return
  return proposal
}

export async function approveProposal(proposalId: string): Promise<any> {
  try {
    const res = await fetch(apiPath(`/agents/proposals/${proposalId}/approve`), {
      method: 'POST',
      credentials: 'include',
    })
    if (res.ok) return res.json()
  } catch { /* dev */ }
  // const state = devAuthState()
  // Simulate approve and tokenize in dev
  return { proposal: { id: proposalId, status: 'approved' } }
}

export async function rejectProposal(proposalId: string): Promise<any> {
  try {
    const res = await fetch(apiPath(`/agents/proposals/${proposalId}/reject`), {
      method: 'POST',
      credentials: 'include',
    })
    if (res.ok) return res.json()
  } catch { /* dev */ }
  // const state = devAuthState()
  return { proposal: { id: proposalId, status: 'rejected' } }
}

export async function tokenizeChild(
  childId: string,
  ticker: string,
  devBuySol = 0,
  opts: TokenizeOptions = {}
): Promise<{ child: ChildAgent; signature?: string; note?: string }> {
  const payload: any = {
    ticker,
    devBuySol: devBuySol > 0 ? devBuySol : undefined,
    imageUrl: opts.imageUrl || undefined,
    twitter: opts.twitter || undefined,
    telegram: opts.telegram || undefined,
    website: opts.website || undefined,
  }

  try {
    const res = await fetch(apiPath(`/agents/children/${childId}/tokenize`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const data = await res.json()
      return { child: data.child, signature: data.signature, note: data.note }
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
  return { child }
}

export async function setLaunchWallet(privateKey: string): Promise<{ pubkey: string }> {
  try {
    const res = await fetch(apiPath('/agents/fee-wallet'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ privateKey }),
    })
    if (res.ok) {
      return await res.json()
    }
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to save launch wallet')
  } catch (e) {
    // dev fallback: just pretend we saved (no real launches in pure dev without api)
    const pubkey = 'DevWallet' + Math.random().toString(36).slice(2, 10)
    const state = devAuthState()
    if (state.genesis) {
      ;(state.genesis as any).launchWalletPubkey = pubkey
      saveDevState(state)
    }
    return { pubkey }
  }
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