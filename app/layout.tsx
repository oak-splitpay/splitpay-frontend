import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Splitpay - Split Bills on Stellar',
  description: 'Split bills with friends using the Stellar blockchain',
  icons: {
    icon: '💸',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-stellar via-stellar-light to-blue-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
