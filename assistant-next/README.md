# Auto Spark Assistant (Next.js)

This is a premium frontend scaffold for an AI Chat Assistant built with Next.js (App Router), Tailwind CSS, Framer Motion, and Lucide React.

Features implemented:
- Glassmorphism 2.0 floating chat widget (draggable, expandable)
- Dark-mode-first, accessible UI with CMD+K toggle
- Streaming skeleton text that mimics incoming tokens
- Visual Car Card rendering for structured vehicle data
- Quick Action chips and thumb-friendly layout
- Persistence with localStorage
- Reconnect toast (offline detection)

How to run (dev):

1. cd into the project folder:

```zsh
cd assistant-next
```

2. Install dependencies and run dev server:

```zsh
# using npm
npm install
npm run dev
```

Where to integrate Vercel AI SDK:
- Replace `simulateStream` in `hooks/useChatState.tsx` with the streaming logic from the Vercel `useChat` hook.
- On each incoming token, append to the assistant message content and update state to enable the SkeletonText -> real streaming UI.

Accessibility notes:
- Widget can be toggled with CMD+K and has ARIA labels.
- Color choices aim for high contrast; add a high-contrast toggle as needed.

Next steps (suggested):
- Wire real streaming via `useChat` (Vercel AI SDK)
- Add tests for key components
- Add server-side rate limiting, opt-in analytics, and logging
