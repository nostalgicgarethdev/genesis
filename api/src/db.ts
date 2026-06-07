import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '../data/store.json')

export interface XUser {
  id: string
  username: string
  name: string
  profileImageUrl?: string
}

export interface GenesisAgent {
  id: string
  xUserId: string
  name: string
  status: 'pending_verification' | 'active'
  verificationCode: string
  createdAt: number
  // Launch wallet (for pump.fun creator fees + paying for create tx + optional dev buy)
  // The private key is stored server-side only (use a dedicated low-value wallet!).
  launchPrivateKey?: string
  launchWalletPubkey?: string
}

export type ChildStatus = 'spawning' | 'active' | 'paused' | 'tokenized'

export interface ChildAgent {
  id: string
  genesisId: string
  name: string
  purpose: string
  status: ChildStatus
  feesEarned: number
  token?: {
    ticker: string
    mintAddress: string
    pumpFunUrl: string
    createdAt: number
  }
  createdAt: number
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

interface Store {
  users: Record<string, XUser & { accessToken: string; refreshToken?: string }>
  sessions: Record<string, string>
  genesis: Record<string, GenesisAgent>
  children: Record<string, ChildAgent>
  proposals: Record<string, TokenizationProposal>
  oauthPending: Record<string, { codeVerifier: string; expires: number }>
  authCodes: Record<string, { sessionId: string; expires: number }>
}

function load(): Store {
  if (!existsSync(DB_PATH)) {
    return { users: {}, sessions: {}, genesis: {}, children: {}, proposals: {}, oauthPending: {}, authCodes: {} }
  }
  const raw = JSON.parse(readFileSync(DB_PATH, 'utf-8')) as Partial<Store>
  return {
    users: raw.users ?? {},
    sessions: raw.sessions ?? {},
    genesis: raw.genesis ?? {},
    children: raw.children ?? {},
    proposals: raw.proposals ?? {},
    oauthPending: raw.oauthPending ?? {},
    authCodes: raw.authCodes ?? {},
  }
}

function save(store: Store): void {
  mkdirSync(dirname(DB_PATH), { recursive: true })
  writeFileSync(DB_PATH, JSON.stringify(store, null, 2))
}

export const db = {
  getUser(xUserId: string) {
    return load().users[xUserId]
  },

  saveUser(user: XUser & { accessToken: string; refreshToken?: string }) {
    const store = load()
    store.users[user.id] = user
    save(store)
  },

  createSession(sessionId: string, xUserId: string) {
    const store = load()
    store.sessions[sessionId] = xUserId
    save(store)
  },

  getSession(sessionId: string) {
    const store = load()
    const xUserId = store.sessions[sessionId]
    return xUserId ? store.users[xUserId] : undefined
  },

  deleteSession(sessionId: string) {
    const store = load()
    delete store.sessions[sessionId]
    save(store)
  },

  getGenesisByXUser(xUserId: string): GenesisAgent | undefined {
    const store = load()
    return Object.values(store.genesis).find((g) => g.xUserId === xUserId)
  },

  getGenesisById(genesisId: string): GenesisAgent | undefined {
    return load().genesis[genesisId]
  },

  createGenesis(xUserId: string, name: string): GenesisAgent {
    const store = load()
    const existing = Object.values(store.genesis).find((g) => g.xUserId === xUserId)
    if (existing) throw new Error('GENESIS_EXISTS')

    const agent: GenesisAgent = {
      id: `gen_${randomId()}`,
      xUserId,
      name,
      status: 'pending_verification',
      verificationCode: `GEN-${randomCode()}`,
      createdAt: Date.now(),
    }
    store.genesis[agent.id] = agent
    save(store)
    return agent
  },

  verifyGenesis(genesisId: string): GenesisAgent | undefined {
    const store = load()
    const agent = store.genesis[genesisId]
    if (!agent) return undefined
    agent.status = 'active'
    save(store)
    return agent
  },

  setLaunchWallet(genesisId: string, privateKey: string): { pubkey: string } {
    const trimmed = privateKey.trim()
    if (!trimmed) throw new Error('INVALID_PRIVATE_KEY')

    let pubkey: string
    try {
      const kp = Keypair.fromSecretKey(bs58.decode(trimmed))
      pubkey = kp.publicKey.toBase58()
    } catch {
      throw new Error('INVALID_PRIVATE_KEY')
    }

    const store = load()
    const agent = store.genesis[genesisId]
    if (!agent) throw new Error('GENESIS_NOT_FOUND')

    agent.launchPrivateKey = trimmed
    agent.launchWalletPubkey = pubkey
    save(store)
    return { pubkey }
  },

  listChildren(genesisId: string): ChildAgent[] {
    const store = load()
    return Object.values(store.children)
      .filter((c) => c.genesisId === genesisId)
      .sort((a, b) => b.createdAt - a.createdAt)
  },

  getChild(childId: string): ChildAgent | undefined {
    return load().children[childId]
  },

  createChild(genesisId: string, name: string, purpose: string): ChildAgent {
    const store = load()
    const child: ChildAgent = {
      id: `child_${randomId()}`,
      genesisId,
      name,
      purpose,
      status: 'active',
      feesEarned: 0,
      createdAt: Date.now(),
    }
    store.children[child.id] = child
    save(store)
    return child
  },

  updateChildStatus(childId: string, status: ChildStatus): ChildAgent | undefined {
    const store = load()
    const child = store.children[childId]
    if (!child) return undefined
    child.status = status
    save(store)
    return child
  },

  tokenizeChild(
    childId: string,
    ticker: string,
    mintAddress: string,
    pumpFunUrl: string,
  ): ChildAgent | undefined {
    const store = load()
    const child = store.children[childId]
    if (!child) return undefined
    child.status = 'tokenized'
    child.token = { ticker, mintAddress, pumpFunUrl, createdAt: Date.now() }
    save(store)
    return child
  },

  createProposal(
    genesisId: string,
    childId: string,
    ticker: string,
    opts: { devBuySol?: number; twitter?: string; telegram?: string; website?: string; imageUrl?: string }
  ): TokenizationProposal {
    const store = load()
    const proposal: TokenizationProposal = {
      id: `prop_${randomId()}`,
      childId,
      genesisId,
      ticker,
      devBuySol: opts.devBuySol,
      twitter: opts.twitter,
      telegram: opts.telegram,
      website: opts.website,
      imageUrl: opts.imageUrl,
      status: 'pending',
      createdAt: Date.now(),
    }
    store.proposals[proposal.id] = proposal
    save(store)
    return proposal
  },

  listProposals(genesisId: string): TokenizationProposal[] {
    const store = load()
    return Object.values(store.proposals)
      .filter((p) => p.genesisId === genesisId)
      .sort((a, b) => b.createdAt - a.createdAt)
  },

  getProposal(proposalId: string): TokenizationProposal | undefined {
    return load().proposals[proposalId]
  },

  approveProposal(proposalId: string): TokenizationProposal | undefined {
    const store = load()
    const proposal = store.proposals[proposalId]
    if (!proposal || proposal.status !== 'pending') return undefined
    proposal.status = 'approved'
    proposal.approvedAt = Date.now()
    save(store)
    return proposal
  },

  rejectProposal(proposalId: string): TokenizationProposal | undefined {
    const store = load()
    const proposal = store.proposals[proposalId]
    if (!proposal || proposal.status !== 'pending') return undefined
    proposal.status = 'rejected'
    save(store)
    return proposal
  },

  saveOAuthPending(state: string, codeVerifier: string, ttlMs = 10 * 60 * 1000) {
    const store = load()
    store.oauthPending[state] = { codeVerifier, expires: Date.now() + ttlMs }
    save(store)
  },

  consumeOAuthPending(state: string): string | null {
    const store = load()
    const entry = store.oauthPending[state]
    delete store.oauthPending[state]
    save(store)
    if (!entry || entry.expires < Date.now()) return null
    return entry.codeVerifier
  },

  createAuthCode(sessionId: string, ttlMs = 5 * 60 * 1000): string {
    const store = load()
    const code = randomId() + randomId()
    store.authCodes[code] = { sessionId, expires: Date.now() + ttlMs }
    save(store)
    return code
  },

  consumeAuthCode(code: string): string | null {
    const store = load()
    const entry = store.authCodes[code]
    delete store.authCodes[code]
    save(store)
    if (!entry || entry.expires < Date.now()) return null
    return entry.sessionId
  },
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}