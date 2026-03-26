'use client'

import Link from 'next/link'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'
import { signOut, useSession } from 'next-auth/react'

export function Navigation() {
  const { data: session } = useSession()

  return (
    <Navbar
      maxWidth="xl"
      className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl"
      isBordered
    >
      <NavbarBrand>
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
            <div className="flex h-5 w-5 overflow-hidden rounded-full border border-slate-200">
              <span className="h-full flex-1 bg-slate-100" />
              <span className="h-full flex-1 bg-[var(--bmw-blue)]" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              BMW CMS
            </div>
            <div className="text-lg font-black tracking-tight text-slate-950">
              BimmerHub
            </div>
          </div>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden gap-2 sm:flex" justify="center">
        <NavbarItem>
          <Link
            href="/articles"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Články
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/series"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Modelové řady
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {!session?.user ? (
          <NavbarItem>
            <Button as={Link} color="primary" href="/login" radius="full">
              Přihlásit se
            </Button>
          </NavbarItem>
        ) : (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={session.user.name || session.user.email || 'U'}
                size="sm"
                src={session.user.image || undefined}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profil">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold text-slate-500">Přihlášen jako</p>
                <p className="font-semibold text-slate-950">{session.user.email}</p>
              </DropdownItem>
              <DropdownItem key="dashboard" as={Link} href="/dashboard">
                Dashboard
              </DropdownItem>
              <DropdownItem key="new_article" as={Link} href="/dashboard/articles/new">
                Nový článek
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => signOut({ callbackUrl: '/' })}
              >
                Odhlásit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  )
}
