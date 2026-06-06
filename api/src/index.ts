import dotenv from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../../.env') })
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './routes/auth.js'
import { agents } from './routes/agents.js'

const app = new Hono()

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/genesis\/?$/, ''),
].filter((v): v is string => Boolean(v))

app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      if (!origin) return allowedOrigins[0]
      if (allowedOrigins.includes(origin)) return origin
      if (origin.endsWith('.github.io')) return origin
      return allowedOrigins[0]
    },
    credentials: true,
  }),
)

app.get('/api/health', (c) => c.json({ status: 'ok', service: 'genesis-api' }))

app.route('/api/auth', auth)
app.route('/api/agents', agents)

const port = Number(process.env.API_PORT ?? 3001)

serve({ fetch: app.fetch, port, hostname: '127.0.0.1' }, () => {
  console.log(`Genesis API → http://127.0.0.1:${port}`)
  if (process.env.DEV_MOCK_AUTH === 'true') {
    console.log('Dev mock auth enabled — Login with X works without credentials')
  }
})