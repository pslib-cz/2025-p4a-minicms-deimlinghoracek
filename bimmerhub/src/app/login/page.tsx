import { Suspense } from 'react'

import { LoginForm } from '@/components/auth/login-form'

function LoginPageFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white/90 p-10 shadow-xl shadow-slate-200/60">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Přihlášení
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
          Vstup do dashboardu
        </h1>
        <p className="mt-4 text-sm text-slate-600">Načítání přihlašovacího formuláře...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginForm />
    </Suspense>
  )
}
