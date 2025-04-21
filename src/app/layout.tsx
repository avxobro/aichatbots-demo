import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Chat Bot',
  description: 'Your AI chat bot application',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-900">
        {children}
      </body>
    </html>
  )
}


