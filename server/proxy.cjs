const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const SSLCommerzPayment = require('sslcommerz-lts')
const app = express()
const PORT = process.env.PORT || 8787

app.use(bodyParser.json())

// Basic CORS for local dev (frontend on 5173, backend on 8787)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

// Point to the agent's chat completions path per the OpenAPI spec
const AGENT_URL = 'https://epbmkschwzip4c6atjl2tgbu.agents.do-ai.run/api/v1/chat/completions'

// Payment API URL - legacy proxy target (no longer used for new SSLCommerz flow)
const PAYMENT_API_URL = process.env.PAYMENT_API_URL || 'https://autospark-one.vercel.app'

// SSLCommerz credentials (use env vars in real deployments)
const SSLCZ_STORE_ID = process.env.SSLCZ_STORE_ID || 'autos69cccc023b067'
const SSLCZ_STORE_PASSWD = process.env.SSLCZ_STORE_PASSWD || 'autos69cccc023b067@ssl'
const SSLCZ_IS_LIVE = process.env.SSLCZ_IS_LIVE === 'true' // default sandbox

// Base URL of this backend for callback URLs (update in production)
const BASE_URL = process.env.BASE_URL || 'http://localhost:' + PORT

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

// New SSLCommerz payment API routes (direct integration using sslcommerz-lts)

// Initialize a transaction: called from React frontend
app.post('/api/payment/init', async (req, res) => {
  try {
    const {
      total_amount,
      currency = 'BDT',
      tran_id,
      customer_name,
      mobile,
      address,
      thana,
      district,
      cart,
    } = req.body || {}

    if (!total_amount || !customer_name || !mobile) {
      return res.status(400).json({ error: 'Missing required payment fields' })
    }

    const uniqueTranId = tran_id || 'AS-' + Date.now()

    const data = {
      total_amount: Number(total_amount),
      currency,
      tran_id: uniqueTranId,
      success_url: BASE_URL + '/api/payment/success',
      fail_url: BASE_URL + '/api/payment/fail',
      cancel_url: BASE_URL + '/api/payment/cancel',
      ipn_url: BASE_URL + '/api/payment/ipn',
      shipping_method: 'Courier',
      product_name: 'AutoSpark Order',
      product_category: 'Automotive',
      product_profile: 'general',
      cus_name: customer_name,
      cus_email: 'customer@example.com',
      cus_add1: address,
      cus_add2: thana,
      cus_city: district,
      cus_state: district,
      cus_postcode: '0000',
      cus_country: 'Bangladesh',
      cus_phone: mobile,
      cus_fax: mobile,
      ship_name: customer_name,
      ship_add1: address,
      ship_add2: thana,
      ship_city: district,
      ship_state: district,
      ship_postcode: '0000',
      ship_country: 'Bangladesh',
      emi_option: 0,
      value_a: JSON.stringify({ cart: cart || [], mobile }),
    }

    const sslcz = new SSLCommerzPayment(SSLCZ_STORE_ID, SSLCZ_STORE_PASSWD, SSLCZ_IS_LIVE)
    const apiResponse = await sslcz.init(data)

    if (!apiResponse || !apiResponse.GatewayPageURL) {
      console.error('[sslcommerz] invalid init response', apiResponse)
      return res.status(500).json({ error: 'Failed to initialize payment', details: apiResponse })
    }

    console.log('[sslcommerz] redirecting to:', apiResponse.GatewayPageURL)

    // Frontend expects a JSON with redirectUrl
    return res.json({
      redirectUrl: apiResponse.GatewayPageURL,
      GatewayPageURL: apiResponse.GatewayPageURL,
      status: apiResponse.status,
      tran_id: uniqueTranId,
    })
  } catch (err) {
    console.error('[sslcommerz] /api/payment/init error', err)
    return res.status(500).json({ error: 'Payment initiation failed', details: err.message })
  }
})

// SSLCommerz success callback
app.post('/api/payment/success', (req, res) => {
  console.log('[sslcommerz] payment success', req.body)
  // For now, just redirect to a static success page on the frontend
  res.redirect(302, '/payment-success')
})

// SSLCommerz fail callback
app.post('/api/payment/fail', (req, res) => {
  console.log('[sslcommerz] payment fail', req.body)
  res.redirect(302, '/payment-failed')
})

// SSLCommerz cancel callback
app.post('/api/payment/cancel', (req, res) => {
  console.log('[sslcommerz] payment cancel', req.body)
  res.redirect(302, '/payment-cancelled')
})

// Optional IPN handler
app.post('/api/payment/ipn', (req, res) => {
  console.log('[sslcommerz] IPN', req.body)
  res.json({ received: true })
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
