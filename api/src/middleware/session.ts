import { getCookie } from 'hono/cookie'
import type { Context } from 'hono'
import { db } from '../db.js'

export function getSessionUser(c: Context) {
  const sessionId = getCookie(c, 'genesis_session')
  if (!sessionId) return null
  return db.getSession(sessionId) ?? null
}

export function requireAuth(c: Context) {
  const user = getSessionUser(c)
  if (!user) return null
  return user
}