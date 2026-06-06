import { randomHex } from './crypto.js'

const TTL_MS = 5 * 60 * 1000
const codes = new Map<string, { sessionId: string; expires: number }>()

export function createAuthCode(sessionId: string): string {
  const code = randomHex(24)
  codes.set(code, { sessionId, expires: Date.now() + TTL_MS })
  return code
}

export function consumeAuthCode(code: string): string | null {
  const entry = codes.get(code)
  if (!entry || entry.expires < Date.now()) {
    codes.delete(code)
    return null
  }
  codes.delete(code)
  return entry.sessionId
}