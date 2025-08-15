#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Import TS source via simple parsing (avoid transpile) by regex extracting href values.
const dataPath = path.join(__dirname, '..', 'src', 'lib', 'data.ts');
const outPathPublic = path.join(__dirname, '..', 'public', 'visualizers.txt');

function extractHrefs(source) {
  const hrefRegex = /href:\s*"([^"]+)"/g;
  const set = new Set();
  let m; while ((m = hrefRegex.exec(source))) set.add(m[1]);
  return Array.from(set).sort();
}

const tsSource = fs.readFileSync(dataPath, 'utf8');
const hrefs = extractHrefs(tsSource);

// Add root + docs or other static pages you want listed
const staticExtras = ['/', '/docs/audio-credits', '/more-algorithms'];
for (const e of staticExtras) if (!hrefs.includes(e)) hrefs.unshift(e);

const header = [
  '# Auto-generated route index',
  `# Generated: ${new Date().toISOString()}`,
  '# Do not edit manually; run: npm run generate:visualizers',
  ''
].join('\n');

const body = hrefs.join('\n') + '\n';
fs.writeFileSync(outPathPublic, header + body, 'utf8');
console.log(`Wrote ${outPathPublic} with ${hrefs.length} routes.`);
