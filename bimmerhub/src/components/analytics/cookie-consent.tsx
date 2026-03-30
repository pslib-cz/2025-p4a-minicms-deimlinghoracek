'use client'

import { useEffect, useState } from 'react'

const storageKey = 'bimmerhub-analytics-consent'

function getStoredDecision() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(storageKey)
}

export function CookieConsent() {
  const [hydrated, setHydrated] = useState(false)
  const [decision, setDecision] = useState<string | null>(null)

  useEffect(() => {
    setDecision(getStoredDecision())
    setHydrated(true)
  }, [])

  function saveDecision(value: 'granted' | 'denied') {
    window.localStorage.setItem(storageKey, value)
    document.cookie = `analytics_consent=${value}; path=/; max-age=31536000; SameSite=Lax`
    setDecision(value)
    window.dispatchEvent(new Event('bimmerhub-consent-changed'))
  }

  if (!hydrated || decision) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-2xl shadow-slate-300/40 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Souhlas s analytickými cookies
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            BimmerHub může po souhlasu zapnout Google Analytics pro zaznamenání pageview.
            Když sledování odmítneš, aplikace zůstane plně funkční a nic se nebude načítat.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => saveDecision('denied')}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Odmítnout
          </button>
          <button
            type="button"
            onClick={() => saveDecision('granted')}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--bmw-blue)]"
          >
            Povolit
          </button>
        </div>
      </div>
    </div>
  )
}
