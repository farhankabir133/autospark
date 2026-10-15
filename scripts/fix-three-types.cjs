const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', 'node_modules', '@types', 'three', 'package.json'),
];

let patched = 0;

for (const file of targets) {
  if (!fs.existsSync(file)) continue;

  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  const next = JSON.parse(JSON.stringify(pkg));

  if (next.exports && next.exports['.']) {
    next.exports['.'] = { types: './index.d.ts', default: './index.d.ts' };
  } else {
    next.exports = { '.': { types: './index.d.ts', default: './index.d.ts' } };
    if (next.types) delete next.types;
  }

  if (JSON.stringify(next) !== JSON.stringify(pkg)) {
    fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
    patched += 1;
  }
}

if (patched > 0) {
  process.stdout.write(`[patch-three-types] patched ${patched} package(s)\n`);
}
