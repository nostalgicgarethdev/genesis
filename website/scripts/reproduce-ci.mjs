#!/usr/bin/env node
/**
 * Reproduce GitHub Actions CI build locally.
 * Usage: node scripts/reproduce-ci.mjs
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(websiteDir, '..');
const logPath = path.join(websiteDir, 'ci-repro.log');

const log = [];
function writeln(msg = '') {
  const line = typeof msg === 'string' ? msg : String(msg);
  log.push(line);
  process.stdout.write(line + '\n');
}

function run(cmd, opts = {}) {
  writeln(`\n$ ${cmd}`);
  try {
    const out = execSync(cmd, {
      cwd: opts.cwd ?? websiteDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...(opts.env ?? {}) },
    });
    if (out) writeln(out.trimEnd());
    return { ok: true, out };
  } catch (err) {
    const stdout = err.stdout?.toString?.() ?? '';
    const stderr = err.stderr?.toString?.() ?? '';
    if (stdout) writeln(stdout.trimEnd());
    if (stderr) writeln(stderr.trimEnd());
    return { ok: false, code: err.status, stdout, stderr };
  }
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

writeln('=== Genesis website CI reproduction ===');
writeln(`website: ${websiteDir}`);
writeln(`root: ${rootDir}`);

const moved = [];
const rootPkg = path.join(rootDir, 'package.json');
const rootLock = path.join(rootDir, 'package-lock.json');
const wsPkg = path.join(rootDir, '_package.json.workspace');
const wsLock = path.join(rootDir, '_package-lock.json.workspace');

if (exists(rootPkg)) {
  fs.renameSync(rootPkg, wsPkg);
  moved.push(['pkg', rootPkg, wsPkg]);
  writeln('Moved ../package.json -> ../_package.json.workspace');
}
if (exists(rootLock)) {
  fs.renameSync(rootLock, wsLock);
  moved.push(['lock', rootLock, wsLock]);
  writeln('Moved ../package-lock.json -> ../_package-lock.json.workspace');
}

const nm = path.join(websiteDir, 'node_modules');
const lock = path.join(websiteDir, 'package-lock.json');
if (exists(nm)) {
  fs.rmSync(nm, { recursive: true, force: true });
  writeln('Removed node_modules');
}
if (exists(lock)) {
  fs.unlinkSync(lock);
  writeln('Removed package-lock.json');
}

const install = run('npm install');
writeln(`\n--- npm install: ${install.ok ? 'SUCCESS' : 'FAILED'} ---`);

let viteAssert = null;
let viteVersion = null;
const vitePkg = path.join(websiteDir, 'node_modules/vite/package.json');
if (exists(vitePkg)) {
  viteVersion = JSON.parse(fs.readFileSync(vitePkg, 'utf8')).version;
  writeln(`vite version: ${viteVersion}`);
  viteAssert = viteVersion === '6.3.5';
  writeln(`vite version assert: ${viteAssert ? 'PASSED' : 'FAILED'}`);
} else {
  writeln('vite version assert: FAILED (vite not installed)');
  viteAssert = false;
}

const build = run('npm run build', { env: { GITHUB_PAGES: 'true' } });
writeln(`\n--- npm run build: ${build.ok ? 'SUCCESS' : 'FAILED'} ---`);

// restore workspace files
for (const [, from, to] of moved.reverse()) {
  if (exists(from)) {
    fs.renameSync(from, to);
    writeln(`Restored ${path.basename(to)}`);
  }
}

const rolldownDir = path.join(websiteDir, 'node_modules/rolldown');
const rolldownExists = exists(rolldownDir);
writeln(`\nrolldown in node_modules: ${rolldownExists ? 'YES' : 'NO'}`);
if (rolldownExists) {
  const rdPkg = JSON.parse(fs.readFileSync(path.join(rolldownDir, 'package.json'), 'utf8'));
  writeln(`rolldown version: ${rdPkg.version}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(websiteDir, 'package.json'), 'utf8'));
writeln(`\nbuild script: ${JSON.stringify(pkg.scripts.build)}`);

writeln('\n=== SUMMARY ===');
writeln(`npm install: ${install.ok ? 'OK' : 'FAIL'}`);
writeln(`vite assert (6.3.5): ${viteAssert ? 'OK' : 'FAIL'} (${viteVersion ?? 'missing'})`);
writeln(`build: ${build.ok ? 'OK' : 'FAIL'}`);
writeln(`rolldown present: ${rolldownExists}`);

if (!build.ok) {
  writeln('\n=== BUILD ERROR (stderr) ===');
  writeln(build.stderr?.trimEnd() || build.stdout?.trimEnd() || '(no output)');
}

fs.writeFileSync(logPath, log.join('\n') + '\n');
writeln(`\nFull log written to ${logPath}`);
process.exit(install.ok && viteAssert && build.ok ? 0 : 1);