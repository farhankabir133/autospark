// Post-build step: generate dist/404.html as a byte-identical copy of dist/index.html.
//
// Why: on GitHub Pages (custom domain, root path) any deep URL such as
// /product/123 matches no static file, so GitHub serves 404.html. The old
// 404.html contained the `?/`-redirect SPA hack hardcoded to the `/autospark`
// subpath, which does not exist on the custom domain — the redirect target
// 404'd again and the script re-appended the query on every cycle, producing
// the infinite `?/&/&/&...` reload loop.
//
// Serving the SPA shell directly means unknown paths boot React at the REAL
// URL: BrowserRouter renders the route (or the in-app 404 page). There are no
// redirects left anywhere, so this class of loop is impossible by construction.
//
// Fail-closed: any failure exits non-zero so a build without a valid 404.html
// can never be published.
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const indexFile = path.join(dist, 'index.html');
const notFoundFile = path.join(dist, '404.html');

try {
  if (!fs.existsSync(indexFile)) {
    throw new Error('dist/index.html not found — run `vite build` first');
  }
  fs.copyFileSync(indexFile, notFoundFile);

  // Sanity check: the generated 404 must boot the app, never redirect.
  const html = fs.readFileSync(notFoundFile, 'utf8');
  if (!/src\/main|assets\/js\/index-/.test(html)) {
    throw new Error('generated 404.html does not look like the app shell');
  }
  if (/location\.replace|http-equiv="refresh"|pathSegmentsToKeep/.test(html)) {
    throw new Error('generated 404.html contains redirect logic — refusing to publish');
  }
  console.log('[copy-index-404] dist/404.html generated from dist/index.html');
} catch (err) {
  console.error('[copy-index-404] FAILED:', err && err.message ? err.message : err);
  process.exit(1);
}
