import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IdeaSpark — AI YouTube Idea Generator',
  description: 'Generate 30 viral YouTube ideas for your niche in 10 seconds using AI. Powered by Claude AI.',
  keywords: 'YouTube ideas, AI content generator, YouTube niche, video ideas',
  openGraph: {
    title: 'IdeaSpark — Generate Viral YouTube Ideas with AI',
    description: 'Stop guessing what to make. Generate 30 YouTube ideas in 10 seconds.',
    type: 'website'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] antialiased">
        {children}
      </body>
    </html>
  )
}
