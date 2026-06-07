import { Hono } from 'hono'
import { db } from '../db.js'
import { requireAuth } from '../middleware/session.js'
import { launchOnPumpFun, getPubkeyFromPrivateKey, prepareClientLaunch } from '../pump.js'

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

agents.post('/children/:id/propose-tokenize', async (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)
  if (genesis.status !== 'active') return c.json({ error: 'Genesis not active' }, 403)

  const child = db.getChild(c.req.param('id'))
  if (!child || child.genesisId !== genesis.id) return c.json({ error: 'Not found' }, 404)
  if (child.token) return c.json({ error: 'Already tokenized' }, 409)

  const body = await c.req.json<{
    ticker?: string
    devBuySol?: number
    twitter?: string
    telegram?: string
    website?: string
    imageUrl?: string
  }>()

  const ticker = body.ticker?.trim().toUpperCase()
  if (!ticker || ticker.length < 2 || ticker.length > 10) {
    return c.json({ error: 'ticker must be 2-10 characters' }, 400)
  }

  const proposal = db.createProposal(genesis.id, child.id, ticker, {
    devBuySol: typeof body.devBuySol === 'number' ? body.devBuySol : undefined,
    twitter: body.twitter?.trim(),
    telegram: body.telegram?.trim(),
    website: body.website?.trim(),
    imageUrl: body.imageUrl?.trim(),
  })

  return c.json({ proposal })
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

  const body = await c.req.json<{
    ticker?: string
    devBuySol?: number
    twitter?: string
    telegram?: string
    website?: string
    imageUrl?: string
  }>()

  const ticker = body.ticker?.trim().toUpperCase()
  if (!ticker || ticker.length < 2 || ticker.length > 10) {
    return c.json({ error: 'ticker must be 2-10 characters' }, 400)
  }
  const devBuySol = typeof body.devBuySol === 'number' ? body.devBuySol : 0

  const twitter = body.twitter?.trim()
  const telegram = body.telegram?.trim()
  const website = body.website?.trim()
  const imageUrl = body.imageUrl?.trim()

  // Build a good description
  const description = [
    `${child.name} — ${child.purpose}`,
    '',
    'Launched via Genesis — the agent launchpad where only AI launches AI.',
  ].join('\n')

  // Real launch if a launch wallet private key is configured for this genesis
  if (genesis.launchPrivateKey) {
    try {
      const result = await launchOnPumpFun({
        name: child.name,
        symbol: ticker,
        description,
        privateKey: genesis.launchPrivateKey,
        devBuySol,
        twitter,
        telegram,
        website,
        imageUrl,
      })
      const updated = db.tokenizeChild(child.id, ticker, result.mintAddress, result.pumpFunUrl)
      return c.json({ child: updated, signature: result.signature })
    } catch (err: any) {
      console.error('[pump] launch failed:', err?.message || err)
      return c.json({ error: `Launch failed: ${err?.message || 'unknown error'}` }, 500)
    }
  }

  // Fallback (no launch wallet configured): simulate (original behavior)
  const mintAddress = `${ticker}${randomMintSuffix()}`
  const pumpFunUrl = `https://pump.fun/coin/${mintAddress}`

  const updated = db.tokenizeChild(child.id, ticker, mintAddress, pumpFunUrl)
  return c.json({
    child: updated,
    note: 'Simulated launch (configure launch wallet in dashboard for real pump.fun creates)',
  })
})

agents.post('/fee-wallet', async (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)

  const body = await c.req.json<{ privateKey?: string }>()
  const privateKey = body.privateKey?.trim()
  if (!privateKey) {
    return c.json({ error: 'privateKey (base58) is required' }, 400)
  }

  try {
    const { pubkey } = db.setLaunchWallet(genesis.id, privateKey)
    // Also validate we can use it
    getPubkeyFromPrivateKey(privateKey) // will throw if bad
    return c.json({ pubkey, message: 'Launch wallet saved. Real pump.fun tokenization is now enabled for your children.' })
  } catch (e: any) {
    return c.json({ error: 'Invalid Solana private key (must be base58 secret key for a dedicated wallet)' }, 400)
  }
})

agents.post('/children/:id/prepare-launch', async (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)
  if (genesis.status !== 'active') return c.json({ error: 'Genesis not active' }, 403)

  const child = db.getChild(c.req.param('id'))
  if (!child || child.genesisId !== genesis.id) return c.json({ error: 'Not found' }, 404)
  if (child.token) return c.json({ error: 'Already tokenized' }, 409)

  const body = await c.req.json<{
    ticker?: string
    devBuySol?: number
    twitter?: string
    telegram?: string
    website?: string
    imageUrl?: string
    creatorPubkey?: string
  }>()

  const ticker = body.ticker?.trim().toUpperCase()
  if (!ticker || ticker.length < 2 || ticker.length > 10) {
    return c.json({ error: 'ticker must be 2-10 characters' }, 400)
  }
  if (!body.creatorPubkey) {
    return c.json({ error: 'creatorPubkey is required for client-side launch' }, 400)
  }

  const devBuySol = typeof body.devBuySol === 'number' ? body.devBuySol : 0
  const description = [
    `${child.name} — ${child.purpose}`,
    '',
    'Launched via Genesis — the agent launchpad where only AI launches AI.',
  ].join('\n')

  try {
    const prepared = await prepareClientLaunch({
      name: child.name,
      symbol: ticker,
      description,
      creatorPubkey: body.creatorPubkey,
      devBuySol,
      twitter: body.twitter?.trim(),
      telegram: body.telegram?.trim(),
      website: body.website?.trim(),
      imageUrl: body.imageUrl?.trim(),
    })
    return c.json(prepared)
  } catch (err: any) {
    console.error('[pump] prepare-client launch failed:', err?.message || err)
    return c.json({ error: `Prepare failed: ${err?.message || 'unknown error'}` }, 500)
  }
})

agents.post('/children/:id/record-token', async (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)

  const child = db.getChild(c.req.param('id'))
  if (!child || child.genesisId !== genesis.id) return c.json({ error: 'Not found' }, 404)
  if (child.token) return c.json({ error: 'Already tokenized' }, 409)

  const body = await c.req.json<{ ticker?: string; mintAddress?: string; pumpFunUrl?: string }>()
  const ticker = body.ticker?.trim().toUpperCase()
  const mintAddress = body.mintAddress?.trim()
  const pumpFunUrl = body.pumpFunUrl?.trim()

  if (!ticker || !mintAddress || !pumpFunUrl) {
    return c.json({ error: 'ticker, mintAddress and pumpFunUrl required' }, 400)
  }

  const updated = db.tokenizeChild(child.id, ticker, mintAddress, pumpFunUrl)
  return c.json({ child: updated })
})

agents.get('/proposals', (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)
  if (genesis.status !== 'active') return c.json({ error: 'Genesis not active' }, 403)

  return c.json({ proposals: db.listProposals(genesis.id) })
})

agents.post('/proposals/:id/approve', async (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)
  if (genesis.status !== 'active') return c.json({ error: 'Genesis not active' }, 403)

  const proposal = db.getProposal(c.req.param('id'))
  if (!proposal || proposal.genesisId !== genesis.id || proposal.status !== 'pending') {
    return c.json({ error: 'Proposal not found or not pending' }, 404)
  }

  const child = db.getChild(proposal.childId)
  if (!child || child.token) return c.json({ error: 'Child already tokenized or invalid' }, 409)

  if (genesis.launchPrivateKey) {
    // Auto-launch using server key on approval
    try {
      const result = await launchOnPumpFun({
        name: child.name,
        symbol: proposal.ticker,
        description: `${child.name} — ${child.purpose}\n\nTokenized via Genesis agent on pump.fun`,
        privateKey: genesis.launchPrivateKey,
        devBuySol: proposal.devBuySol,
        twitter: proposal.twitter,
        telegram: proposal.telegram,
        website: proposal.website,
        imageUrl: proposal.imageUrl,
      })
      const updated = db.tokenizeChild(child.id, proposal.ticker, result.mintAddress, result.pumpFunUrl)
      db.approveProposal(proposal.id)
      return c.json({ child: updated, signature: result.signature, proposal })
    } catch (err: any) {
      console.error('[pump] launch on approve failed:', err?.message || err)
      return c.json({ error: `Launch failed: ${err?.message || 'unknown error'}` }, 500)
    }
  } else {
    // Just approve, human can launch client-side from UI
    const approved = db.approveProposal(proposal.id)
    return c.json({ proposal: approved, note: 'Proposal approved. Use connected wallet to launch or configure a launch key for auto-launch.' })
  }
})

agents.post('/proposals/:id/reject', (c) => {
  const user = requireAuth(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const genesis = db.getGenesisByXUser(user.id)
  if (!genesis) return c.json({ error: 'No genesis agent' }, 404)

  const proposal = db.getProposal(c.req.param('id'))
  if (!proposal || proposal.genesisId !== genesis.id) return c.json({ error: 'Not found' }, 404)

  const rejected = db.rejectProposal(proposal.id)
  return c.json({ proposal: rejected })
})

function randomMintSuffix(): string {
  return Math.random().toString(36).slice(2, 14).toUpperCase()
}