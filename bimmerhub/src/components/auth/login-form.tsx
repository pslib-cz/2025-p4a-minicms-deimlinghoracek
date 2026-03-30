'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { signIn } from 'next-auth/react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'register') {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (!response.ok) {
        setLoading(false)

        if (response.status === 409) {
          setError('Účet s tímto e-mailem už existuje.')
          return
        }

        if (response.status === 400) {
          setError('Zkontroluj zadané údaje. Heslo musí mít alespoň 8 znaků.')
          return
        }

        setError('Registraci se nepodařilo dokončit. Zkus to prosím znovu.')
        return
      }
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (result?.error) {
      setError('Nepodařilo se přihlásit. Zkontroluj e-mail a heslo.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <Card className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white/90 p-4 shadow-xl shadow-slate-200/60">
        <CardHeader className="flex flex-col items-start gap-3 px-6 pt-6">
          <div className="flex gap-2 rounded-full border border-slate-200 bg-slate-100 p-1">
            <Button
              size="sm"
              radius="full"
              color={mode === 'login' ? 'primary' : 'default'}
              variant={mode === 'login' ? 'solid' : 'light'}
              onPress={() => {
                setMode('login')
                setError('')
              }}
            >
              Přihlášení
            </Button>
            <Button
              size="sm"
              radius="full"
              color={mode === 'register' ? 'primary' : 'default'}
              variant={mode === 'register' ? 'solid' : 'light'}
              onPress={() => {
                setMode('register')
                setError('')
              }}
            >
              Registrace
            </Button>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            {mode === 'login' ? 'Vstup do dashboardu' : 'Vytvoření účtu'}
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            {mode === 'login'
              ? 'Zadej své přihlašovací údaje. Dashboard i API jsou přístupné pouze po ověření session.'
              : 'Založ si účet a po registraci budeš automaticky přihlášen do dashboardu.'}
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === 'register' ? (
              <Input
                label="Jméno"
                value={name}
                onValueChange={setName}
                variant="bordered"
                description="Volitelné, můžeš vyplnit i později."
              />
            ) : null}
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
              {mode === 'login' ? 'Přihlásit se' : 'Registrovat se'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
