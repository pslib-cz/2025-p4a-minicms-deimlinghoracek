# BimmerHub

BimmerHub je vlastni mini CMS postaveny na Next.js App Routeru. Aplikace kombinuje verejnou magazinovou cast o BMW, interni dashboard pro spravu vlastnich clanku a vlastni API nad Prisma ORM.

## Tema aplikace

Obsah je zamereny na BMW:

- recenze modelu a generaci
- servisni navody
- kupni pruvodce
- editorial a galerie

Kazdy prihlaseny uzivatel vidi a spravuje pouze svuj obsah.

## Pouzite technologie

- Next.js 16 (App Router)
- React 19
- Prisma ORM bez Rust engine (`engineType = "client"`)
- PostgreSQL
- Auth.js / NextAuth credentials provider
- NextUI pro dashboard
- TipTap jako WYSIWYG editor
- Zod pro validaci

## Datovy model

### Povinne entity

- `User`
- `Article`
- `Series`
- `Tag`

### Povinne vztahy

- `User -> Article` jako `1:N`
- `Series -> Article` jako `1:N`
- `Article <-> Tag` jako `N:M`

### Article pole

- `title`
- `slug`
- `description`
- `content`
- `createdAt`
- `updatedAt`
- `publishDate`
- `status`
- `seoTitle`
- `seoDescription`
- `imageUrl`

## Funkce aplikace

### Verejna cast

- homepage se zverejnenym BMW obsahem
- seznam publikovanych clanku
- detail clanku na dynamicke route `/articles/[slug]`
- vyhledavani podle titulku, perexu a obsahu
- filtrovani podle modelove rady a tagu
- strankovani
- `generateMetadata` pro listing i detail
- OpenGraph metadata
- canonical URL
- `sitemap.xml`
- `robots.txt`
- `next/image`

### Dashboard

- pristup jen pro prihlasene uzivatele
- dashboard postaveny na Client Components
- nacitani i mutace pres vlastni Route Handlers
- seznam vlastnich clanku se strankovanim
- vytvoreni clanku
- editace clanku
- smazani clanku
- prepinani `DRAFT / PUBLISHED`
- prace s tagy a modelovymi radami
- WYSIWYG editor
- formulare s validaci

### API

- `GET /api/dashboard/articles`
- `POST /api/dashboard/articles`
- `GET /api/dashboard/articles/[id]`
- `PATCH /api/dashboard/articles/[id]`
- `DELETE /api/dashboard/articles/[id]`
- `GET /api/dashboard/meta`

API overuje:

- aktivni session
- vlastnictvi dat
- validitu vstupu pres Zod

### Analytika a cookies

- priprava pro Google Analytics 4 pres `NEXT_PUBLIC_GA_ID`
- cookie consent banner
- pri odmitnuti se analytics skript nespousti a aplikace funguje dal

## Spusteni lokalne

Projekt je ted pripraven primarne pro PostgreSQL, stejne jako produkcni nasazeni na Vercel.

1. Nainstaluj zavislosti:

```bash
npm install
```

2. Vytvor `.env` podle `.env.example`

3. Proved migrace:

```bash
npx prisma migrate deploy
```

4. Napln demo data:

```bash
npx prisma db seed
```

5. Spust aplikaci:

```bash
npm run dev
```

## Demo prihlaseni

- e-mail: `admin@bimmerhub.local`
- heslo: `password123`

## Vercel deployment

Projekt je pripraven pro Vercel s PostgreSQL a Prisma bez Rust engine, takze je vhodny i pro ARM notebooky.

### Co udelat na Vercelu

1. Pushni repozitar na GitHub.
2. Ve Vercelu zvol `Add New Project`.
3. Importuj repozitar `bimmerhub`.
4. V casti Storage pripoj PostgreSQL databazi z Marketplace.
5. V Project Settings -> Environment Variables nastav:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST=true`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GA_ID` volitelne

6. V Build & Development Settings nastav Build Command na:

```bash
npm run vercel-build
```

7. Deployni projekt.

### Co se stane pri buildu

- `postinstall` spusti `prisma generate`
- `vercel-build` spusti `prisma migrate deploy`
- nasledne probehne `next build`

### Po prvnim deployi

Pokud chces do produkce demo obsah, pust seed jednorazove proti produkcni databazi:

```bash
npx prisma db seed
```

To je lepsi delat rucne, ne pri kazdem buildu.

## Poznamka k ARM notebookum

Projekt pouziva Prisma bez Rust engine podle oficialni dokumentace Prisma, coz obchazi problem s nativnimi `query_engine` binarkami na Windows ARM. Pro PostgreSQL se pouziva `@prisma/adapter-pg`.

Zdroj:

- [No Rust engine](https://docs.prisma.io/docs/v6/orm/prisma-client/setup-and-configuration/no-rust-engine)
- [Deploy to Vercel](https://docs.prisma.io/docs/v6/orm/prisma-client/deployment/serverless/deploy-to-vercel)
- [Vercel Marketplace Postgres](https://vercel.com/docs/postgres)

## Lighthouse poznamky

Poznamky k SEO a performance auditu jsou v souboru `LIGHTHOUSE_NOTES.md`.
