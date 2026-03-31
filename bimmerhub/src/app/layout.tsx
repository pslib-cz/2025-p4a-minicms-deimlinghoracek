import type { Metadata } from 'next'
import { Suspense } from 'react'

import './globals.css'

import { CookieConsent } from '@/components/analytics/cookie-consent'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { Navigation } from '@/components/navigation'
import { Providers } from '@/components/providers'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body>
        <Providers>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <div className="min-h-screen overflow-x-hidden bg-shell text-slate-950">
            <Navigation />
            <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <CookieConsent />
          </div>
        </Providers>
      </body>
    </html>
  )
}
