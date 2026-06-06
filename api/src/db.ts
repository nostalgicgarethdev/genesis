import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

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

interface Store {
  users: Record<string, XUser & { accessToken: string; refreshToken?: string }>
  sessions: Record<string, string>
  genesis: Record<string, GenesisAgent>
  children: Record<string, ChildAgent>
}

function load(): Store {
  if (!existsSync(DB_PATH)) {
    return { users: {}, sessions: {}, genesis: {}, children: {} }
  }
  const raw = JSON.parse(readFileSync(DB_PATH, 'utf-8'))
  return { children: {}, ...raw, children: raw.children ?? {} }
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
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}