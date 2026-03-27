const { chromium } = require('playwright');

(async ()=>{
  const ports = [5173, 5174, 3000];
  let browser;
  try{
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    let connected = false;
    let urlUsed = null;
    for (const p of ports) {
      const url = `http://localhost:${p}`;
      try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 3000 });
        if (resp && resp.status() < 400) { connected = true; urlUsed = url; break }
      } catch(e) {
        // continue
      }
    }
    if (!connected) {
      console.error(JSON.stringify({ ok: false, error: 'could not connect to dev server on tried ports', tried: ports }));
      process.exit(2);
    }

    // Wait a bit for scripts to load and widget to inject
    await page.waitForTimeout(2500);

    // Heuristic: find any element containing the starting message text
    const STARTING_TEXT = 'Hello! How can I help you today?';

    const result = await page.evaluate((STARTING_TEXT) => {
      function findCandidate() {
        const els = Array.from(document.querySelectorAll('body *'));
        for (const el of els) {
          try {
            const txt = (el.innerText || '').trim();
            if (!txt) continue;
            if (txt.includes(STARTING_TEXT)) return el;
            const role = el.getAttribute && el.getAttribute('role');
            if (role === 'dialog') return el;
            // data-chatbot-id or similar
            const attrs = ['data-chatbot-id','data-agent-id','data-name'];
            for (const a of attrs) if (el.hasAttribute && el.hasAttribute(a)) return el;
          } catch(e){}
        }
        return null;
      }

      const candidate = findCandidate();
      if (!candidate) return { ok: false, reason: 'no widget element found' };
      const cs = window.getComputedStyle(candidate);
      const rect = candidate.getBoundingClientRect();
      return {
        ok: true,
        tag: candidate.tagName,
        textSnippet: (candidate.innerText||'').slice(0,120),
        computed: { left: cs.left, right: cs.right, position: cs.position, bottom: cs.bottom, top: cs.top },
        rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
      };
    }, STARTING_TEXT);

    console.log(JSON.stringify({ ok: true, url: urlUsed, result }, null, 2));
    await browser.close();
    process.exit(0);
  } catch (err) {
    if (browser) try{ await browser.close() }catch(e){}
    console.error(JSON.stringify({ ok: false, error: String(err) }));
    process.exit(3);
  }
})();
