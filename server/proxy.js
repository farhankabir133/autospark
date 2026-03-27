/* Simple proxy to forward requests to the DigitalOcean agent.
   Usage: AGENT_API_KEY=xxx node server/proxy.js
*/

const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 8787

app.use(bodyParser.json())

const AGENT_URL = 'https://epbmkschwzip4c6atjl2tgbu.agents.do-ai.run'

app.post('/api/agent', async (req, res) => {
  try {
    const apiKey = process.env.AGENT_API_KEY
    const headers = { 'Content-Type': 'application/json' }
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

    const resp = await fetch(AGENT_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    })

    // Forward status and headers
    res.status(resp.status)
    resp.headers.forEach((v, k) => {
      // Don't forward hop-by-hop headers that may break streaming
      if (['transfer-encoding', 'content-encoding', 'content-length', 'connection'].includes(k.toLowerCase())) return
      res.setHeader(k, v)
    })

    // Stream response body back to client
    if (!resp.body) {
      const text = await resp.text()
      res.send(text)
      return
    }

    const reader = resp.body.getReader()
    const decoder = new TextDecoder()
    res.flushHeaders()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      res.write(chunk)
    }
    res.end()
  } catch (err) {
    console.error('proxy error', err)
    res.status(500).json({ error: 'proxy error' })
  }
})

app.listen(PORT, ()=> console.log('Proxy running on port', PORT))
