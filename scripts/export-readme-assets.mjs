import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assets = join(root, 'docs', 'assets')

const COLORS = {
  void: [9, 9, 11, 255],
  surface2: [24, 24, 27, 255],
  accent: [196, 165, 116, 255],
  accentBright: [232, 212, 176, 255],
  accentDim: [154, 123, 79, 255],
  muted: [161, 161, 170, 255],
}

function setPixel(png, x, y, [r, g, b, a = 255]) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return
  const i = (png.width * y + x) << 2
  png.data[i] = r
  png.data[i + 1] = g
  png.data[i + 2] = b
  png.data[i + 3] = a
}

function fill(png, color) {
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) setPixel(png, x, y, color)
  }
}

function fillRoundRect(png, x, y, w, h, r, color) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      const inRect = px >= x + r && px < x + w - r
      const inRectY = py >= y + r && py < y + h - r
      const cx = px < x + r ? x + r : px >= x + w - r ? x + w - r - 1 : px
      const cy = py < y + r ? y + r : py >= y + h - r ? y + h - r - 1 : py
      const dx = px - cx
      const dy = py - cy
      if (inRect || inRectY || dx * dx + dy * dy <= r * r) setPixel(png, px, py, color)
    }
  }
}

function fillCircle(png, cx, cy, radius, color) {
  const r2 = radius * radius
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx
      const dy = y - cy
      if (dx * dx + dy * dy <= r2) setPixel(png, x, y, color)
    }
  }
}

function drawLine(png, x0, y0, x1, y1, width, color) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1)
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    fillCircle(png, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, width / 2, color)
  }
}

function drawMark(png, ox, oy, scale) {
  const s = scale
  fillRoundRect(png, ox, oy, 104 * s, 104 * s, 24 * s, COLORS.surface2)
  const cx = ox + 52 * s
  const cy = oy + 60 * s
  fillCircle(png, cx, cy, 9.5 * s, COLORS.accent)
  drawLine(png, cx, cy - 9.5 * s, ox + 31 * s, oy + 43 * s, 4 * s, COLORS.accent)
  drawLine(png, cx, cy - 9.5 * s, ox + 73 * s, oy + 43 * s, 4 * s, COLORS.accentBright)
  drawLine(png, cx, cy + 9.5 * s, cx, oy + 87 * s, 4 * s, COLORS.accentDim)
  fillCircle(png, ox + 31 * s, oy + 43 * s, 5.5 * s, COLORS.accentDim)
  fillCircle(png, ox + 73 * s, oy + 43 * s, 5.5 * s, COLORS.accentBright)
  fillCircle(png, cx, oy + 87 * s, 4.5 * s, COLORS.muted)
}

async function exportWithResvg() {
  const { Resvg } = await import('@resvg/resvg-js')
  const jobs = [
    { input: 'logo.svg', output: 'logo.png', width: 512 },
    { input: 'readme-banner.svg', output: 'readme-banner.png', width: 1840 },
  ]
  for (const job of jobs) {
    const svg = readFileSync(join(assets, job.input), 'utf8')
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: job.width },
      background: '#09090b',
    })
    writeFileSync(join(assets, job.output), resvg.render().asPng())
    console.log(`wrote ${job.output} (resvg)`)
  }
  return true
}

function exportWithPngjs() {
  const logo = new PNG({ width: 512, height: 512 })
  fill(logo, COLORS.surface2)
  drawMark(logo, (512 - 416) / 2, (512 - 416) / 2, 4)
  writeFileSync(join(assets, 'logo.png'), PNG.sync.write(logo))
  console.log('wrote logo.png (pngjs)')

  const banner = new PNG({ width: 1840, height: 440 })
  fill(banner, COLORS.void)
  for (let y = 0; y < 180; y++) {
    const t = 1 - y / 180
    for (let x = 640; x < 1200; x++) {
      const dx = (x - 920) / 360
      const dy = y / 120
      if (dx * dx + dy * dy <= 1) {
        const [r, g, b] = COLORS.accent
        setPixel(banner, x, y, [r, g, b, Math.floor(36 * t)])
      }
    }
  }
  drawMark(banner, 72, 58, 1)
  writeFileSync(join(assets, 'readme-banner.png'), PNG.sync.write(banner))
  console.log('wrote readme-banner.png (pngjs, mark only — use resvg for full banner text)')
}

try {
  await exportWithResvg()
} catch {
  exportWithPngjs()
}