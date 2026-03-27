const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 8787

app.use(bodyParser.json())

// Point to the agent's chat completions path per the OpenAPI spec
const AGENT_URL = 'https://epbmkschwzip4c6atjl2tgbu.agents.do-ai.run/api/v1/chat/completions'

// Simple file-backed conversation store (development). For production use
// a real DB (Supabase/Postgres). Conversations are stored in ./data/conversations.json
const DATA_DIR = path.resolve(__dirname, '../data')
const CONV_FILE = path.join(DATA_DIR, 'conversations.json')
try{ if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }) } catch(e) { console.warn('could not create data dir', e) }

function readConversations(){
  try{
    if (!fs.existsSync(CONV_FILE)) return []
    const raw = fs.readFileSync(CONV_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  }catch(e){ console.error('readConversations err', e); return [] }
}

function writeConversations(list){
  try{ fs.writeFileSync(CONV_FILE, JSON.stringify(list, null, 2), 'utf8') }catch(e){ console.error('writeConversations err', e) }
}

// Conversations API (dev)
app.post('/api/conversations', (req, res)=>{
  try{
    const conv = req.body || {}
    const list = readConversations()
    const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2,9)
    const entry = { id, ts: Date.now(), conversation: conv }
    list.push(entry)
    writeConversations(list)
    res.json({ ok: true, id })
  }catch(e){ console.error(e); res.status(500).json({ ok:false }) }
})

app.get('/api/conversations', (req, res)=>{
  try{ res.json(readConversations()) }catch(e){ res.status(500).json([]) }
})

app.get('/api/conversations/:id', (req, res)=>{
  try{
    const id = req.params.id
    const found = readConversations().find(c => c.id === id)
    if (!found) return res.status(404).json({ error: 'not found' })
    res.json(found)
  }catch(e){ res.status(500).json({ error: 'err' }) }
})

// Single handler for GET/POST/OPTIONS so we reliably accept both POST JSON
// and GET/SSE fallback patterns.
app.all('/api/agent', async (req, res) => {
  // If the client requested a mock stream (dev-only), serve a deterministic
  // SSE stream locally so the UI can be exercised without a real key.
  const useMock = (req.query && (req.query.mock === '1' || req.query.mock === 'true')) || req.headers['x-use-mock'] === '1'
  if (useMock) {
    try {
      const prompt = (req.method === 'GET') ? (req.query.prompt || 'hello') : (req.body && req.body.prompt) || 'hello'
      // SSE headers
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.flushHeaders()

      // Simple chunking: split the prompt into words to simulate streaming tokens
      const words = (`Assistant response for: ${prompt}`).split(/\s+/)
      let i = 0
      const iv = setInterval(() => {
        if (i >= words.length) {
          // signal end of stream
          res.write('data: [DONE]\n\n')
          clearInterval(iv)
          try { res.end() } catch (e) {}
          return
        }
        const chunk = words[i++] + (i < words.length ? ' ' : '')
        // send as JSON payload with text field so the client parser appends it
        res.write('data: ' + JSON.stringify({ text: chunk }) + '\n\n')
      }, 120)

      // If client closes connection, stop interval
      req.on('close', () => { clearInterval(iv) })
      return
    } catch (err) {
      console.error('mock stream error', err)
      try { res.status(500).json({ error: 'mock stream error' }) } catch(e){}
      return
    }
  }
  // Handle CORS preflight quickly
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.sendStatus(204)
  }

  try {
    const apiKey = process.env.AGENT_API_KEY
    const headers = {}
    // forward content-type if present
    if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type']
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

  // Log incoming request for debugging (include a small preview of body)
  try{ console.log(`[proxy] ${req.method} ${req.originalUrl} -> ${AGENT_URL} body-preview=${JSON.stringify(req.body).slice(0,200)}`) }catch(e){}

    // Build upstream URL: for GET fallback preserve querystring
    const upstreamUrl = (req.method === 'GET' && (req.originalUrl.includes('?') || req.url.includes('?')))
      ? AGENT_URL + (req.originalUrl.includes('?') ? ('?' + req.originalUrl.split('?').slice(1).join('?')) : ('?' + req.url.split('?').slice(1).join('?')))
      : AGENT_URL

    // Construct upstream body. If the client sent { prompt } we transform to the
    // expected OpenAPI body: { messages: [{ role: 'user', content: prompt }], stream: true }
    let upstreamBody
    if (!['GET','HEAD'].includes(req.method)) {
      if (req.body && typeof req.body === 'object' && req.body.prompt) {
        upstreamBody = JSON.stringify({ messages: [{ role: 'user', content: req.body.prompt }], stream: true })
      } else {
        upstreamBody = JSON.stringify(req.body || {})
      }
    }

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body: upstreamBody,
    })

    // Log upstream status for easier debugging
    console.log(`[proxy] upstream status ${upstream.status} for ${req.method} ${upstreamUrl}`)
    res.status(upstream.status)
    upstream.headers.forEach((v, k) => {
      if (['transfer-encoding', 'content-encoding', 'content-length', 'connection'].includes(k.toLowerCase())) return
      res.setHeader(k, v)
    })

    // Ensure CORS for browser clients
    res.setHeader('Access-Control-Allow-Origin', '*')

    if (!upstream.body) {
      const text = await upstream.text()
      console.log('[proxy] upstream body preview:', String(text).slice(0,500))
      res.send(text)
      return
    }

    // Stream upstream body to client
    const reader = upstream.body.getReader()
    const decoder = new TextDecoder()
    res.flushHeaders()

    // Stream and also capture a small preview for logs
    let previewBuffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      try{ if (previewBuffer.length < 1000) previewBuffer += chunk }catch(e){}
      res.write(chunk)
    }
    if (previewBuffer.length) console.log('[proxy] upstream stream preview:', previewBuffer.slice(0,1000))
    res.end()
  } catch (err) {
    console.error('proxy error', err)
    try { res.status(500).json({ error: 'proxy error' }) } catch(e){}
  }
})

app.listen(PORT, ()=> console.log('Proxy running on port', PORT))
