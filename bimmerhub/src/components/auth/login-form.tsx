'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { signIn } from 'next-auth/react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('admin@bimmerhub.local')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (result?.error) {
      setError('Nepodarilo se prihlasit. Zkontroluj e-mail a heslo.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <Card className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white/90 p-4 shadow-xl shadow-slate-200/60">
        <CardHeader className="flex flex-col items-start gap-3 px-6 pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Prihlaseni
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Vstup do dashboardu
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Pouzij demo ucet nebo vlastni prihlasovaci udaje. Dashboard i API jsou pristupne
            pouze po overeni session.
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="E-mail"
              type="email"
              value={email}
              onValueChange={setEmail}
              isRequired
              variant="bordered"
            />
            <Input
              label="Heslo"
              type="password"
              value={password}
              onValueChange={setPassword}
              isRequired
              variant="bordered"
            />
            {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
            <Button color="primary" type="submit" isLoading={loading} className="w-full">
              Prihlasit se
            </Button>
            <p className="text-xs text-slate-500">
              Demo ucet: <strong>admin@bimmerhub.local</strong> / <strong>password123</strong>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
