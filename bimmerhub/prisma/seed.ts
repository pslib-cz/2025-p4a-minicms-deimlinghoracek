import bcrypt from 'bcryptjs'

import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Seeding database...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bimmerhub.local' },
    update: {},
    create: {
      email: 'admin@bimmerhub.local',
      name: 'Bimmer Admin',
      password: hashedPassword,
    },
  })

  const seriesData = [
    {
      slug: '3-series',
      name: '3 Series',
      description: 'Sportovni sedan a kombi, od E30 po soucasny G20.',
      coverImage:
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: '5-series',
      name: '5 Series',
      description: 'Executive segment BMW s durazem na komfort, techniku a dlouhe trasy.',
      coverImage:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'm-models',
      name: 'M Models',
      description: 'Vrcholne verze BMW M divize pro okruh i emocni svezeni.',
      coverImage:
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'x-series',
      name: 'X Series',
      description: 'SUV a crossovery BMW od mestskeho X1 po velke rodinne X5.',
      coverImage:
        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80',
    },
  ]

  for (const series of seriesData) {
    await prisma.series.upsert({
      where: { slug: series.slug },
      update: series,
      create: series,
    })
  }

  const tagData = [
    { slug: 'review', name: 'Review', description: 'Jizdni dojmy a redakcni hodnoceni.' },
    { slug: 'servis', name: 'Servis', description: 'Servisni a udrzbove postupy.' },
    { slug: 'buyers-guide', name: 'Buyers Guide', description: 'Tipy pri vyberu ojetiny.' },
    { slug: 'e46', name: 'E46', description: 'Generace E46 a jeji typicke vlastnosti.' },
    { slug: 'xdrive', name: 'xDrive', description: 'Clanky zamerene na pohon vsech kol.' },
    { slug: 'm-performance', name: 'M Performance', description: 'M divize a ostrejsi verze.' },
  ]

  for (const tag of tagData) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    })
  }

  const allSeries = await prisma.series.findMany()
  const allTags = await prisma.tag.findMany()

  function seriesId(slug: string) {
    const series = allSeries.find((item) => item.slug === slug)

    if (!series) {
      throw new Error(`Missing series ${slug}`)
    }

    return series.id
  }

  function tagIds(slugs: string[]) {
    return slugs.map((slug) => {
      const tag = allTags.find((item) => item.slug === slug)

      if (!tag) {
        throw new Error(`Missing tag ${slug}`)
      }

      return { id: tag.id }
    })
  }

  const articles = [
    {
      slug: 'bmw-e46-m3-ikona-analogove-radosti',
      title: 'BMW E46 M3: ikona analogove radosti z rizeni',
      description:
        'Proc je E46 M3 porad meritem pro ridice, kteri chteji atmosfericky sestivalec, presne rizeni a mechanicky cit.',
      content:
        '<h2>Proc tenhle clanek vznikl</h2><p>E46 M3 je jedno z tech aut, ktere se v diskuzich o nejlepsich sportovnich BMW vraci porad dokola. Neni to jen vykonem, ale i tim, jak komunikuje s ridicem.</p><h2>Motor S54</h2><p>Atmosfericky radovy sestivalec se ochotne toci do vysokych otacek a dava autu charakter, ktery dnes uz hledame cim dal hur.</p><h2>Na co si dat pozor</h2><ul><li>Kontrola udrzby VANOSu</li><li>Stav zadni napravy a podlahy</li><li>Historie servisu a chladici soustavy</li></ul>',
      imageUrl:
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
      status: 'PUBLISHED' as const,
      publishDate: new Date('2026-03-20T09:00:00.000Z'),
      seoTitle: 'BMW E46 M3 recenze a kupni tipy',
      seoDescription: 'Recenze BMW E46 M3, charakter motoru S54 a hlavni body pri koupi.',
      seriesId: seriesId('m-models'),
      tags: tagIds(['review', 'e46', 'm-performance']),
    },
    {
      slug: 'g20-330i-jako-idealni-daily-driver',
      title: 'Je G20 330i idealni daily driver?',
      description:
        'Moderni trojka s motorem B48 umi byt rychla, komfortni i usporna. Podivali jsme se na ni jako na kazdodenni auto.',
      content:
        '<h2>Kazdy den bez kompromisu</h2><p>G20 330i ukazuje, proc je rada 3 tak dulezita. V beznem provozu funguje kultivovane, ale kdyz potrebujes, umi byt prekvapive svizna.</p><h2>Technika a interier</h2><p>B48 patri mezi nejprijemnejsi moderni ctyrvalce BMW. Auto navic nabizi vybornou ergonomii a dospely podvozek.</p><h2>Komu bude sedet</h2><p>Ridici, kteri chteji jedno auto na dalnice, okresky i kazdodenni provoz.</p>',
      imageUrl:
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80',
      status: 'PUBLISHED' as const,
      publishDate: new Date('2026-03-22T08:30:00.000Z'),
      seoTitle: 'BMW G20 330i jako daily driver',
      seoDescription: 'Prakticka recenze BMW G20 330i xDrive pro kazdodenni pouziti.',
      seriesId: seriesId('3-series'),
      tags: tagIds(['review', 'xdrive']),
    },
    {
      slug: 'na-co-se-divat-pri-koupi-bmw-f10-530d',
      title: 'Na co se divat pri koupi BMW F10 530d',
      description:
        'Kupni pruvodce pro F10 530d se seznamem castych slabin, servisnich bodu a rozumnych ocekavani.',
      content:
        '<h2>Proc prave F10 530d</h2><p>Petkova rada generace F10 umi byt vyborna na dlouhe trasy a stale pusobi hodnotne. Pri koupi je ale potreba hlidat technicky stav a historii.</p><h2>Kontrolni seznam</h2><ol><li>Historie olejovych intervalu</li><li>Stav automaticke prevodovky</li><li>Podvozek a pneumaticky komfortni prvky</li></ol><p>Dobre vybrane auto se umi odvdeci komfortem i nizkou spotrebou na dalnici.</p>',
      imageUrl:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      status: 'PUBLISHED' as const,
      publishDate: new Date('2026-03-24T10:00:00.000Z'),
      seoTitle: 'BMW F10 530d: kupni pruvodce',
      seoDescription: 'Kontrolni seznam a rady pri vyberu BMW F10 530d.',
      seriesId: seriesId('5-series'),
      tags: tagIds(['buyers-guide', 'servis']),
    },
    {
      slug: 'jak-na-vymenu-kotoucu-u-bmw-g30',
      title: 'Jak na vymenu prednich kotoucu u BMW G30',
      description:
        'Servisni navod krok za krokem pro vymenu prednich brzdovych kotoucu a desticek u BMW rady 5.',
      content:
        '<h2>Priprava</h2><p>Pred zacatkem si priprav spravne momenty dotazeni, nove srouby a zakladni diagnostiku. Bezpecnost a cistota prace jsou zaklad.</p><h2>Postup</h2><ol><li>Zvednout vuz a sundat kola</li><li>Demontovat trmen a drzak</li><li>Ocistit dosedaci plochu naboje</li><li>Namontovat nove kotouce i desticky</li></ol><p>Po vymene nezapomen na zabeh a kontrolu brzdove kapaliny.</p>',
      imageUrl:
        'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1400&q=80',
      status: 'DRAFT' as const,
      publishDate: new Date('2026-03-28T07:00:00.000Z'),
      seoTitle: 'Vymena prednich kotoucu u BMW G30',
      seoDescription: 'Prakticky servisni navod pro vymenu prednich brzd na BMW G30.',
      seriesId: seriesId('5-series'),
      tags: tagIds(['servis']),
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        description: article.description,
        content: article.content,
        imageUrl: article.imageUrl,
        status: article.status,
        publishDate: article.publishDate,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        seriesId: article.seriesId,
        authorId: admin.id,
        tags: {
          set: [],
          connect: article.tags,
        },
      },
      create: {
        title: article.title,
        slug: article.slug,
        description: article.description,
        content: article.content,
        imageUrl: article.imageUrl,
        status: article.status,
        publishDate: article.publishDate,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        seriesId: article.seriesId,
        authorId: admin.id,
        tags: {
          connect: article.tags,
        },
      },
    })
  }

  console.log(
    'Seed finished successfully. Demo login: admin@bimmerhub.local / password123',
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
