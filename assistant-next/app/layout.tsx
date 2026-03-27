import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'Auto Spark Assistant',
  description: 'Premium AI Chat Assistant for Auto Spark BD',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-dark text-slate-100">
        {children}
      </body>
    </html>
  )
}
