import { Hono } from 'hono'
import { db } from '../db.js'
import { requireAuth } from '../middleware/session.js'

export const agents = new Hono()

agents.get('/children', (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)
  if (genesis.status !== 'active') return c.json({ error: 'Genesis not active' }, 403)

  return c.json({ children: db.listChildren(genesis.id) })
})

agents.post('/children', async (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)
  if (genesis.status !== 'active') return c.json({ error: 'Genesis not active' }, 403)

  const body = await c.req.json<{ name?: string; purpose?: string }>()
  const name = body.name?.trim()
  const purpose = body.purpose?.trim()

  if (!name || !purpose) {
    return c.json({ error: 'name and purpose are required' }, 400)
  }

  const child = db.createChild(genesis.id, name, purpose)
  return c.json({ child }, 201)
})

agents.post('/children/:id/pause', (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)

  const child = db.getChild(c.req.param('id'))
  if (!child || child.genesisId !== genesis.id) return c.json({ error: 'Not found' }, 404)

  const updated = db.updateChildStatus(child.id, 'paused')
  return c.json({ child: updated })
})

agents.post('/children/:id/resume', (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)

  const child = db.getChild(c.req.param('id'))
  if (!child || child.genesisId !== genesis.id) return c.json({ error: 'Not found' }, 404)

  const updated = db.updateChildStatus(child.id, 'active')
  return c.json({ child: updated })
})

agents.post('/children/:id/tokenize', async (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)
  if (genesis.status !== 'active') return c.json({ error: 'Genesis not active' }, 403)

  const child = db.getChild(c.req.param('id'))
  if (!child || child.genesisId !== genesis.id) return c.json({ error: 'Not found' }, 404)
  if (child.token) return c.json({ error: 'Already tokenized' }, 409)

  const body = await c.req.json<{ ticker?: string }>()
  const ticker = body.ticker?.trim().toUpperCase()
  if (!ticker || ticker.length < 2 || ticker.length > 10) {
    return c.json({ error: 'ticker must be 2-10 characters' }, 400)
  }

  // pump.fun integration placeholder — real API call in Phase 3
  const mintAddress = `${ticker}${randomMintSuffix()}`
  const pumpFunUrl = `https://pump.fun/coin/${mintAddress}`

  const updated = db.tokenizeChild(child.id, ticker, mintAddress, pumpFunUrl)
  return c.json({ child: updated, note: 'Simulated launch — pump.fun API ships Phase 3' })
})

function randomMintSuffix(): string {
  return Math.random().toString(36).slice(2, 14).toUpperCase()
}