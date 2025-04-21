import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'Page not found',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
        <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    </div>
  )
}

