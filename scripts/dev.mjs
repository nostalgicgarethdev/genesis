import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Free stuck ports before starting
for (const port of [5173, 3001]) {
  spawnSync('sh', ['-c', `lsof -ti:${port} | xargs kill -9 2>/dev/null || true`])
}

if (
  !existsSync(join(root, 'node_modules', 'hono')) ||
  !existsSync(join(root, 'website', 'node_modules', 'vite'))
) {
  console.log('\n  Installing dependencies...\n')
  const install = spawnSync('npm', ['install'], { cwd: root, stdio: 'inherit' })
  if (install.status !== 0) process.exit(1)
}

const children = []

function run(command, args, cwd, label) {
  console.log(`  Starting ${label}...`)
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, DEV_MOCK_AUTH: process.env.DEV_MOCK_AUTH ?? 'true', FORCE_COLOR: '1' },
  })
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`\n  ✗ ${label} crashed (exit ${code})\n`)
      if (label === 'website') {
        console.error('  Try manually: cd website && npm run dev\n')
      }
    }
  })
  children.push(child)
  return child
}

console.log('\n  ╔══════════════════════════════════════╗')
console.log('  ║   Genesis — keep this terminal open    ║')
console.log('  ╚══════════════════════════════════════╝\n')

// Start website FIRST so you see the Vite URL
run('npm', ['run', 'dev'], join(root, 'website'), 'website')

// Small delay so Vite binds before API logs
setTimeout(() => {
  run('npm', ['run', 'dev'], join(root, 'api'), 'api')
}, 1500)

function shutdown() {
  children.forEach((c) => c.kill('SIGTERM'))
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)