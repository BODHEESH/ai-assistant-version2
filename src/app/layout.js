import './globals.css'

export const metadata = {
  title: 'AI Assistant App',
  description: 'An AI-powered assistant application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-600 text-white">{children}</body>
    </html>
  )
}