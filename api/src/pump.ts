import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js'
import bs58 from 'bs58'

const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com'

export interface LaunchParams {
  name: string
  symbol: string
  description: string
  privateKey: string // base58 of the launch/creator wallet (funds tx + optional dev buy)
  devBuySol?: number // 0 or positive; if >0 a buy is included in the create bundle
  imageUrl?: string // optional custom image (https). Falls back to placeholder
  twitter?: string
  telegram?: string
  website?: string
}

export interface LaunchResult {
  mintAddress: string
  pumpFunUrl: string
  signature: string
}

export interface PreparedLaunch {
  mint: string
  mintSecret: string // base58 - client must sign the tx with this + their wallet
  serializedTx: string // base64 encoded VersionedTransaction
  pumpFunUrl: string
}

export function getPubkeyFromPrivateKey(privateKey: string): string {
  const kp = Keypair.fromSecretKey(bs58.decode(privateKey.trim()))
  return kp.publicKey.toBase58()
}

export async function launchOnPumpFun(params: LaunchParams): Promise<LaunchResult> {
  const rpcUrl = process.env.SOLANA_RPC_URL || DEFAULT_RPC
  const connection = new Connection(rpcUrl, 'confirmed')

  const signer = Keypair.fromSecretKey(bs58.decode(params.privateKey.trim()))
  const mint = Keypair.generate()

  // 1. Prepare metadata via pump.fun/ipfs (widely used by launchers; zero-config)
  let imageToUse = params.imageUrl

  if (!imageToUse) {
    // Fallback to a nice deterministic placeholder
    const seed = params.symbol + params.name
    imageToUse = `https://picsum.photos/seed/${encodeURIComponent(seed)}/512/512`
  }

  const imgRes = await fetch(imageToUse)
  if (!imgRes.ok) {
    throw new Error(`Failed to fetch image for metadata (${imgRes.status}) from ${imageToUse}`)
  }
  const imgBuf = Buffer.from(await imgRes.arrayBuffer())
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg'

  const form = new FormData()
  form.append('file', new Blob([imgBuf], { type: contentType }), 'image')
  form.append('name', params.name)
  form.append('symbol', params.symbol)
  form.append('description', params.description.slice(0, 2000))
  form.append('showName', 'true')

  if (params.twitter) form.append('twitter', params.twitter)
  if (params.telegram) form.append('telegram', params.telegram)
  if (params.website) form.append('website', params.website)

  const ipfsRes = await fetch('https://pump.fun/api/ipfs', {
    method: 'POST',
    body: form,
  })
  if (!ipfsRes.ok) {
    const txt = await ipfsRes.text().catch(() => '')
    throw new Error(`pump.fun ipfs metadata upload failed: ${ipfsRes.status} ${txt}`)
  }
  const ipfsJson = (await ipfsRes.json()) as { metadataUri?: string; uri?: string }
  const metadataUri = ipfsJson.metadataUri || ipfsJson.uri
  if (!metadataUri) throw new Error('No metadataUri returned from ipfs endpoint')

  // 2. Ask pumpportal for the unsigned create transaction (local mode = we sign & send)
  const devBuy = Math.max(0, params.devBuySol ?? 0)
  const payload = {
    publicKey: signer.publicKey.toBase58(),
    action: 'create',
    tokenMetadata: {
      name: params.name,
      symbol: params.symbol,
      uri: metadataUri,
    },
    mint: mint.publicKey.toBase58(),
    denominatedInSol: 'true',
    amount: devBuy, // 0 = create only, no initial buy
    slippage: 15,
    priorityFee: 0.00005,
    pool: 'pump',
  }

  const tradeRes = await fetch('https://pumpportal.fun/api/trade-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!tradeRes.ok) {
    const txt = await tradeRes.text().catch(() => '')
    throw new Error(`pumpportal trade-local failed: ${tradeRes.status} ${txt}`)
  }

  const txBytes = new Uint8Array(await tradeRes.arrayBuffer())
  const tx = VersionedTransaction.deserialize(txBytes)

  // create tx must be signed by BOTH the new mint keypair and the payer/creator
  tx.sign([mint, signer])

  // 3. Send and confirm
  const signature = await connection.sendTransaction(tx, {
    skipPreflight: false,
  })
  await connection.confirmTransaction(signature, 'confirmed').catch(() => {
    /* best effort */
  })

  const mintAddress = mint.publicKey.toBase58()
  const pumpFunUrl = `https://pump.fun/coin/${mintAddress}`

  return {
    mintAddress,
    pumpFunUrl,
    signature,
  }
}

export async function prepareClientLaunch(params: {
  name: string
  symbol: string
  description: string
  creatorPubkey: string
  devBuySol?: number
  imageUrl?: string
  twitter?: string
  telegram?: string
  website?: string
}): Promise<PreparedLaunch> {
  const rpcUrl = process.env.SOLANA_RPC_URL || DEFAULT_RPC
  // We don't need connection here for prepare, just for reference

  const mint = Keypair.generate()
  const creator = params.creatorPubkey

  // Metadata upload (reuse logic)
  let imageToUse = params.imageUrl
  if (!imageToUse) {
    const seed = params.symbol + params.name
    imageToUse = `https://picsum.photos/seed/${encodeURIComponent(seed)}/512/512`
  }

  const imgRes = await fetch(imageToUse)
  if (!imgRes.ok) {
    throw new Error(`Failed to fetch image for metadata (${imgRes.status})`)
  }
  const imgBuf = Buffer.from(await imgRes.arrayBuffer())
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg'

  const form = new FormData()
  form.append('file', new Blob([imgBuf], { type: contentType }), 'image')
  form.append('name', params.name)
  form.append('symbol', params.symbol)
  form.append('description', params.description.slice(0, 2000))
  form.append('showName', 'true')

  if (params.twitter) form.append('twitter', params.twitter)
  if (params.telegram) form.append('telegram', params.telegram)
  if (params.website) form.append('website', params.website)

  const ipfsRes = await fetch('https://pump.fun/api/ipfs', {
    method: 'POST',
    body: form,
  })
  if (!ipfsRes.ok) {
    const txt = await ipfsRes.text().catch(() => '')
    throw new Error(`pump.fun ipfs metadata upload failed: ${ipfsRes.status} ${txt}`)
  }
  const ipfsJson = (await ipfsRes.json()) as { metadataUri?: string; uri?: string }
  const metadataUri = ipfsJson.metadataUri || ipfsJson.uri
  if (!metadataUri) throw new Error('No metadataUri returned')

  const devBuy = Math.max(0, params.devBuySol ?? 0)

  const payload = {
    publicKey: creator,
    action: 'create',
    tokenMetadata: {
      name: params.name,
      symbol: params.symbol,
      uri: metadataUri,
    },
    mint: mint.publicKey.toBase58(),
    denominatedInSol: 'true',
    amount: devBuy,
    slippage: 15,
    priorityFee: 0.00005,
    pool: 'pump',
  }

  const tradeRes = await fetch('https://pumpportal.fun/api/trade-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!tradeRes.ok) {
    const txt = await tradeRes.text().catch(() => '')
    throw new Error(`pumpportal trade-local failed: ${tradeRes.status} ${txt}`)
  }

  const txBytes = new Uint8Array(await tradeRes.arrayBuffer())
  const serializedTx = Buffer.from(txBytes).toString('base64')

  const mintSecret = bs58.encode(mint.secretKey)
  const pumpFunUrl = `https://pump.fun/coin/${mint.publicKey.toBase58()}`

  return {
    mint: mint.publicKey.toBase58(),
    mintSecret,
    serializedTx,
    pumpFunUrl,
  }
}
