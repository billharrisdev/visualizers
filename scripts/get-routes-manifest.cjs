#!/usr/bin/env node
/**
 * Robust accessor for Next.js routes-manifest in export mode.
 * Usage: node scripts/get-routes-manifest.cjs [--json]
 * Prints the JSON to stdout (or just the path if --path only).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const exportDir = path.join(root, 'dist');
const nextDir = path.join(root, '.next');

const exportCandidate = path.join(exportDir, 'routes-manifest.json');
const nextCandidate = path.join(nextDir, 'routes-manifest.json');

let manifestPath = null;
if (fs.existsSync(exportCandidate)) {
  manifestPath = exportCandidate;
} else if (fs.existsSync(nextCandidate)) {
  manifestPath = nextCandidate;
} else {
  console.error('routes-manifest.json not found in dist/ or .next/');
  process.exit(1);
}

if (process.argv.includes('--path')) {
  process.stdout.write(manifestPath + '\n');
  process.exit(0);
}

try {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  if (process.argv.includes('--json')) {
    process.stdout.write(raw);
  } else {
    const parsed = JSON.parse(raw);
    const routes = (parsed.staticRoutes || []).map(r => r.page);
    process.stdout.write(routes.join('\n') + '\n');
  }
} catch (e) {
  console.error('Failed reading routes-manifest:', e.message);
  process.exit(1);
}
