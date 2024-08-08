import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@code-hike/mdx/styles'
import 'config/code-hike.scss'
import '../../styles/new-docs.scss'
import '../../styles/prism-okaidia.scss'
import '../../styles/main.scss'

export const metadata: Metadata = {
  title: 'Supabase | Docs Internal Tooling',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ToolingRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="w-screen h-screen">{children}</body>
    </html>
  )
}
