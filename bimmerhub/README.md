# BimmerHub

Mini CMS postaveny na Next.js 16 (App Router). Aplikace kombinuje verejnou magazinovou cast o BMW, interni dashboard pro spravu vlastnich clanku a vlastni API nad Prisma ORM.

## Pouzite technologie

- **Next.js 16** (App Router, Server Components, Route Handlers)
- **React 19**
- **Prisma ORM** s PostgreSQL
- **Auth.js / NextAuth** (credentials provider, JWT session)
- **NextUI** (dashboard UI komponenty)
- **TipTap** (WYSIWYG editor)
- **Zod** (validace vstupu)
- **Tailwind CSS 3**

## Datovy model

### Entity

- **User** — uzivatele s autentizaci
- **Article** — hlavni obsah (title, slug, description, content, status, publishDate, SEO pole)
- **Series** — modelove rady BMW (1:N s Article)
- **Tag** — stitky pro kategorizaci (N:M s Article)

### Vztahy

- `User -> Article` — 1:N (kazdy uzivatel spravuje vlastni clanky)
- `Series -> Article` — 1:N (clanek patri do jedne modelove rady)
- `Article <-> Tag` — N:M (clanek muze mit vice tagu)

## Funkce aplikace

### Verejna cast (Server Components)

- Homepage s featured a nejnovejsimi clanky
- Seznam publikovanych clanku s vyhledavanim, filtrovanim (serie, tagy) a strankovanim
- Detail clanku na dynamicke route `/articles/[slug]`
- Stranka modelovych rad `/series`
- SEO: `generateMetadata`, OpenGraph, canonical URL, `sitemap.xml`, `robots.txt`
- Optimalizace obrazku pres `next/image`

### Dashboard (Client Components + Route Handlers)

- Pristup pouze pro prihlasene uzivatele
- Seznam vlastnich clanku se strankovanim a filtrem statusu
- Vytvoreni, editace a smazani clanku
- Prepinani DRAFT / PUBLISHED
- WYSIWYG editor (TipTap)
- Prace s tagy a modelovymi radami
- Formularova validace

### API (Route Handlers)

- `GET /api/dashboard/articles` — seznam clanku uzivatele
- `POST /api/dashboard/articles` — vytvoreni clanku
- `GET /api/dashboard/articles/[id]` — detail clanku
- `PATCH /api/dashboard/articles/[id]` — editace clanku
- `DELETE /api/dashboard/articles/[id]` — smazani clanku
- `GET /api/dashboard/meta` — metadata (serie, tagy)

Vsechna API overuji session, vlastnictvi dat a validuji vstupy pres Zod.

### Analytika

- Google Analytics 4 (pres `NEXT_PUBLIC_GA_ID`)
- Cookie consent banner — pri odmitnuti se GA skript nenacita
- Aplikace funguje plne i bez souhlasu

## Demo prihlaseni

- E-mail: `admin@bimmerhub.local`
- Heslo: `password123`

---

## Lokalni spusteni

### Pozadavky

- Node.js 18+
- PostgreSQL databaze (lokalni nebo vzdalena)

### Postup

```bash
cd bimmerhub
npm install
```

Vytvor `.env` podle `.env.example`:

```bash
cp .env.example .env
```

Uprav `DATABASE_URL` v `.env` na svou PostgreSQL databazi.

Proved migrace a naplneni demo daty:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Spust dev server:

```bash
npm run dev
```

Aplikace bezi na [http://localhost:3000](http://localhost:3000).

---

## Nasazeni na Vercel — krok za krokem

### 1. Priprav repozitar

Ujisti se, ze mas kod pushnuty na GitHub (nebo GitLab/Bitbucket).

### 2. Vytvor projekt na Vercelu

1. Jdi na [vercel.com](https://vercel.com) a prihlas se (pres GitHub ucet je nejsnazsi).
2. Klikni **Add New... → Project**.
3. Vyber svuj repozitar s BimmerHub.
4. **DULEZITE:** Vercel nabidne Root Directory. Nastav ji na `bimmerhub` (protoze kod je v podadresari).

### 3. Pripoj PostgreSQL databazi

1. V Vercel dashboardu jdi do **Storage** (leva navigace).
2. Klikni **Create Database** a zvol **Neon Postgres** (zdarma v Hobby planu).
3. Pojmenuj databazi (napr. `bimmerhub-db`).
4. Po vytvoreni klikni **Connect to Project** a vyber svuj BimmerHub projekt.
5. Vercel automaticky nastavi `DATABASE_URL` a dalsi promenne.

### 4. Nastav environment variables

V **Project Settings → Environment Variables** pridej:

| Promenna | Hodnota | Poznamka |
|---|---|---|
| `DATABASE_URL` | *(automaticky z kroku 3)* | Uz nastavena |
| `AUTH_SECRET` | `openssl rand -base64 32` | Vygeneruj nahodny retezec |
| `AUTH_TRUST_HOST` | `true` | Nutne pro Vercel |
| `NEXT_PUBLIC_APP_URL` | `https://tvoje-domena.vercel.app` | Uprav po prvnim deployi |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Volitelne — Google Analytics |

### 5. Nastav Build Command

V **Project Settings → General → Build & Development Settings**:

- **Build Command:** `npm run vercel-build`
- **Output Directory:** ponech prazdne (Next.js default)
- **Install Command:** ponech prazdne (npm install default)

### 6. Deployni

Klikni **Deploy**. Vercel:

1. Nainstaluje zavislosti (`npm install` → spusti `postinstall` → `prisma generate`)
2. Spusti `vercel-build` → `prisma generate && prisma migrate deploy && next build`
3. Migrace vytvori tabulky v PostgreSQL
4. Next.js build zkompiluje aplikaci

### 7. Naplneni demo daty (jednorazove)

Po prvnim deployi muzes naplnit databazi demo daty. Mas dve moznosti:

**Moznost A: Pres Vercel CLI (doporuceno)**

```bash
npm i -g vercel
cd bimmerhub
vercel link          # propoj s projektem
vercel env pull      # stahne .env.local s produkci DATABASE_URL
npx prisma db seed   # spusti seed proti produkcni DB
```

**Moznost B: Pres Vercel dashboard**

V Storage → tvoje databaze → Query tab muzes spustit SQL primo.

### 8. Over nasazeni

1. Otevri URL projektu (napr. `https://bimmerhub-xxx.vercel.app`)
2. Prihlaseni: `admin@bimmerhub.local` / `password123`
3. Dashboard: vytvor, uprav, smazej clanek
4. Verejna cast: over clanky, vyhledavani, filtry, strankovani

---

## Po nasazeni

### Google Search Console

1. Jdi na [search.google.com/search-console](https://search.google.com/search-console)
2. Pridej property s URL tvoji Vercel aplikace
3. Overeni: pouzij HTML tag metodu nebo DNS (pokud mas vlastni domenu)
4. Odesli sitemap: `https://tvoje-domena.vercel.app/sitemap.xml`

### Bing Webmaster Tools

1. Jdi na [bing.com/webmasters](https://www.bing.com/webmasters)
2. Pridej site s URL aplikace
3. Odesli sitemap

### Google Analytics

1. Vytvor GA4 property na [analytics.google.com](https://analytics.google.com)
2. Zkopiruj Measurement ID (format `G-XXXXXXXXXX`)
3. Pridej do Vercel environment variables jako `NEXT_PUBLIC_GA_ID`
4. Redeployni aplikaci (Settings → Deployments → Redeploy)

---

## Pouzite Next.js funkce

- `next/image` — optimalizace obrazku
- `generateMetadata` — dynamicka metadata z obsahu
- Dynamic routes — `/articles/[slug]`, `/dashboard/articles/[id]/edit`
- `revalidatePath` — invalidace cache po mutacich
- `sitemap.xml` a `robots.txt` — generovane z dat
