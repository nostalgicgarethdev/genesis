import { useState } from 'react'
import type { ChildAgent } from '../../lib/auth'
import { pauseChild, resumeChild, tokenizeChild } from '../../lib/auth'
import { apiPath } from '../../lib/paths'
import { useWallet } from '@solana/wallet-adapter-react'
import { Keypair, VersionedTransaction, Connection } from '@solana/web3.js'
import bs58 from 'bs58'

export function ChildCard({ child, onUpdate }: { child: ChildAgent; onUpdate: () => void }) {
  const [ticker, setTicker] = useState(child.name.slice(0, 6).toUpperCase())
  const [devBuy, setDevBuy] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [twitter, setTwitter] = useState('')
  const [telegram, setTelegram] = useState('')
  const [website, setWebsite] = useState('')

  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastSignature, setLastSignature] = useState<string | null>(null)

  const { publicKey, signTransaction, connected } = useWallet()
  const rpcEndpoint = 'https://api.mainnet-beta.solana.com'
  const connection = new Connection(rpcEndpoint, 'confirmed')

  const statusColor = {
    spawning: 'text-yellow-500',
    active: 'text-sage',
    paused: 'text-muted',
    tokenized: 'text-accent-bright',
  }[child.status]

  const handleInitiateTokenize = () => {
    setError('')
    setConfirming(true)
  }

  const handleCancelConfirm = () => {
    setConfirming(false)
  }

  const handleConfirmTokenize = async () => {
    setLoading(true)
    setError('')
    try {
      if (connected && publicKey) {
        // Client-side launch (preferred - no privkey on server)
        await performClientSideLaunch()
      } else {
        // Server-side using stored launch wallet
        const result = await tokenizeChild(child.id, ticker, devBuy, {
          imageUrl: imageUrl.trim() || undefined,
          twitter: twitter.trim() || undefined,
          telegram: telegram.trim() || undefined,
          website: website.trim() || undefined,
        })
        if (result.signature) {
          setLastSignature(result.signature)
        }
      }
      setConfirming(false)
      setImageUrl('')
      setTwitter('')
      setTelegram('')
      setWebsite('')
      onUpdate()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const performClientSideLaunch = async () => {
    // 1. Call prepare on server (server generates mint + metadata + unsigned tx)
    const prepareRes = await fetch(apiPath(`/agents/children/${child.id}/prepare-launch`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker,
        devBuySol: devBuy > 0 ? devBuy : undefined,
        imageUrl: imageUrl.trim() || undefined,
        twitter: twitter.trim() || undefined,
        telegram: telegram.trim() || undefined,
        website: website.trim() || undefined,
        creatorPubkey: publicKey!.toBase58(),
      }),
    })
    if (!prepareRes.ok) {
      const err = await prepareRes.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to prepare launch')
    }
    const prepared = await prepareRes.json() as {
      mint: string
      mintSecret: string
      serializedTx: string
      pumpFunUrl: string
    }

    // 2. Deserialize tx on client
    const txBytes = Uint8Array.from(atob(prepared.serializedTx), c => c.charCodeAt(0))
    const tx = VersionedTransaction.deserialize(txBytes)

    // 3. Create mint keypair from secret returned by server
    const mintKeypair = Keypair.fromSecretKey(bs58.decode(prepared.mintSecret))

    // 4. Sign with both mint and user's connected wallet
    // Note: signTransaction from wallet adapter for the user part
    tx.sign([mintKeypair])
    const signedTx = await signTransaction!(tx)

    // 5. Send the transaction
    const signature = await connection.sendTransaction(signedTx)
    await connection.confirmTransaction(signature, 'confirmed')

    setLastSignature(signature)

    // 6. Record the token in backend so it appears in UI / DB
    const recordRes = await fetch(apiPath(`/agents/children/${child.id}/record-token`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker,
        mintAddress: prepared.mint,
        pumpFunUrl: prepared.pumpFunUrl,
      }),
    })
    if (!recordRes.ok) {
      console.warn('Token recorded on chain but failed to persist in Genesis DB')
    }
  }

  const handleTogglePause = async () => {
    setLoading(true)
    try {
      if (child.status === 'paused') await resumeChild(child.id)
      else await pauseChild(child.id)
      onUpdate()
    } finally { setLoading(false) }
  }

  return (
    <div className="panel panel-hover rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display font-semibold">{child.name}</h4>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{child.purpose}</p>
        </div>
        <span className={`shrink-0 text-xs font-medium uppercase tracking-wide ${statusColor}`}>
          {child.status}
        </span>
      </div>

      {child.token ? (
        <div className="mt-4 rounded-lg border border-line bg-void px-3 py-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-sage">${child.token.ticker}</span>
            <a href={child.token.pumpFunUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
              pump.fun →
            </a>
          </div>
          {lastSignature && (
            <a
              href={`https://solscan.io/tx/${lastSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[10px] text-muted hover:text-accent"
            >
              View create tx on Solscan →
            </a>
          )}
        </div>
      ) : child.status !== 'paused' ? (
        confirming ? (
          // Confirmation step (safety)
          <div className="mt-4 rounded-lg border border-accent/40 bg-void p-3 text-sm">
            <div className="font-semibold text-accent">Confirm pump.fun launch</div>
            <div className="mt-2 space-y-1 text-xs">
              <div><span className="text-muted">Name:</span> {child.name}</div>
              <div><span className="text-muted">Ticker:</span> ${ticker}</div>
              <div><span className="text-muted">Dev buy:</span> {devBuy} SOL {devBuy > 0 ? '(from launch wallet)' : '(no initial buy)'}</div>
              {(twitter || telegram || website || imageUrl) && (
                <div className="text-muted">Socials/image will be included in metadata</div>
              )}
            </div>
            <div className="mt-3 text-[10px] text-red-400">
              {connected && publicKey 
                ? 'This will create a real token on pump.fun. Your connected wallet will sign the transaction (client-side). No private key is sent to the server.'
                : 'This will create a real token on pump.fun using your configured launch wallet. It will spend SOL for the transaction (and dev buy if set).'}
              This action cannot be undone.
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCancelConfirm}
                disabled={loading}
                className="rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTokenize}
                disabled={loading}
                className="btn-primary rounded-lg px-3 py-1.5 text-xs disabled:opacity-50"
              >
                {loading ? 'Launching on pump.fun...' : 'Confirm & Launch'}
              </button>
            </div>
          </div>
        ) : (
          // Normal input form + metadata options
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <input
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                maxLength={10}
                placeholder="TICKER"
                className="flex-1 rounded-lg border border-line bg-void px-3 py-2 font-mono text-xs outline-none focus:border-accent-dim"
              />
              <div className="flex items-center gap-1 rounded-lg border border-line bg-void px-2 text-xs">
                <span className="text-muted">dev buy</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={devBuy}
                  onChange={(e) => setDevBuy(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 bg-transparent font-mono text-xs outline-none"
                />
                <span className="text-muted">SOL</span>
              </div>
              <button
                type="button"
                onClick={handleInitiateTokenize}
                disabled={loading}
                className="btn-primary shrink-0 rounded-lg px-3 py-2 text-xs disabled:opacity-50"
              >
                Tokenize
              </button>
            </div>

            {/* Optional metadata fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL (https, optional)"
                className="rounded-lg border border-line bg-void px-3 py-1.5 font-mono text-xs outline-none focus:border-accent-dim"
              />
              <input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="rounded-lg border border-line bg-void px-3 py-1.5 font-mono text-xs outline-none focus:border-accent-dim"
              />
              <input
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="https://t.me/..."
                className="rounded-lg border border-line bg-void px-3 py-1.5 font-mono text-xs outline-none focus:border-accent-dim"
              />
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="rounded-lg border border-line bg-void px-3 py-1.5 font-mono text-xs outline-none focus:border-accent-dim"
              />
            </div>
            <p className="text-[10px] text-muted">
              0 dev buy = pure create. Add socials/image for better pump.fun presentation. Uses your launch wallet.
            </p>
          </div>
        )
      ) : null}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="font-mono text-xs text-muted">{child.feesEarned.toFixed(1)} SOL earned</span>
        {child.status !== 'tokenized' && (
          <button type="button" onClick={handleTogglePause} disabled={loading} className="text-xs text-muted hover:text-text">
            {child.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  )
}