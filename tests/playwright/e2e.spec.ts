import { test, expect } from '@playwright/test'

// E2E: streaming parser, unread badge and settings persistence
// The test injects a fetch mock that returns a ReadableStream emitting chunks over time

test('streaming response, unread badge, and settings persistence', async ({ page }) => {
  // Inject a fetch mock before any script runs so the app's fetch calls are intercepted
  await page.addInitScript(() => {
    (window as any).__mockAgent = true
    const realFetch = window.fetch.bind(window)
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : String((input as URL).pathname || input)
      if (url.includes('/api/agent')) {
        // Return a Response with a ReadableStream that emits chunks
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          start(controller) {
            const chunks = [ 'Hello', ' streaming', ' world', '\n', JSON.stringify({ type: 'car', data: { brand: 'Playwright', model: 'E2E', price: 9999 } }) ]
            let i = 0
            function pushNext(){
              if (i >= chunks.length) { controller.close(); return }
              const chunk = chunks[i++]
              controller.enqueue(encoder.encode(chunk))
              setTimeout(pushNext, 60)
            }
            setTimeout(pushNext, 50)
          }
        })
        return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
      }
      return realFetch(input, init)
    }
  })

  await page.goto('/')

  // Wait for bubble and open
  await page.locator('.chat-bubble').waitFor({ state: 'visible' })
  await page.locator('.chat-bubble').click()

  // Ensure input is present
  const input = page.getByLabel('Message input')
  await expect(input).toBeVisible()

  // Send a message and immediately close so streaming continues while closed
  await input.fill('Tell me about test')
  await page.getByRole('button', { name: 'Send' }).click()
  // close quickly
  await page.getByLabel('close-chat').click()

  // Wait for unread badge to appear on bubble
  const badge = page.locator('.chat-bubble >> text=1')
  await expect(badge).toBeVisible({ timeout: 5000 })

  // Re-open and verify that streaming content reached UI (partial or full)
  await page.locator('.chat-bubble').click()
  // Wait for a message that contains 'Hello'
  await expect(page.locator('.prose-markdown')).toContainText('Hello', { timeout: 5000 })

  // Open settings, toggle auto-open on focus, reload, and verify persistence
  await page.getByTitle('Settings').click()
  const checkbox = page.locator('input[type=checkbox]')
  await checkbox.check()
  // reload
  await page.reload()
  // open widget and settings again
  await page.locator('.chat-bubble').click()
  await page.getByTitle('Settings').click()
  await expect(page.locator('input[type=checkbox]')).toBeChecked()
})
