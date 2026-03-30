import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { registerPayloadSchema } from '@/lib/validation'

function isUniqueConstraintError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false
  }

  return (
    'code' in error &&
    typeof error.code === 'string' &&
    error.code === 'P2002'
  )
}

export async function POST(request: NextRequest) {
  let requestBody: unknown

  try {
    requestBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const payload = registerPayloadSchema.safeParse(requestBody)

  if (!payload.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: payload.error.flatten(),
      },
      { status: 400 },
    )
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.data.email },
  })

  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(payload.data.password, 12)

  try {
    const user = await prisma.user.create({
      data: {
        name: payload.data.name,
        email: payload.data.email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Unable to create user' }, { status: 500 })
  }
}
