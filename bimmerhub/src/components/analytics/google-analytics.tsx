'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const storageKey = 'bimmerhub-analytics-consent'

function isAnalyticsEnabled() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(storageKey) === 'granted'
}

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(isAnalyticsEnabled())
  }, [])

  useEffect(() => {
    function handleStorage() {
      setEnabled(isAnalyticsEnabled())
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('bimmerhub-consent-changed', handleStorage as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('bimmerhub-consent-changed', handleStorage as EventListener)
    }
  }, [])

  useEffect(() => {
    if (!enabled || !measurementId || !window.gtag) {
      return
    }

    const search = searchParams.toString()
    const pagePath = search ? `${pathname}?${search}` : pathname

    window.gtag('config', measurementId, {
      page_path: pagePath,
    })
  }, [enabled, measurementId, pathname, searchParams])

  if (!enabled || !measurementId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  )
}
