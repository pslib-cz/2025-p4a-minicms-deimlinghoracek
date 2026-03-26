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
      description: 'Sportovní sedan a kombi, od E30 po současný G20.',
      coverImage:
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: '5-series',
      name: '5 Series',
      description: 'Executive segment BMW s důrazem na komfort, techniku a dlouhé trasy.',
      coverImage:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'm-models',
      name: 'M Models',
      description: 'Vrcholné verze BMW M divize pro okruh i emoční svezení.',
      coverImage:
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'x-series',
      name: 'X Series',
      description: 'SUV a crossovery BMW od městského X1 po velké rodinné X5.',
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
    { slug: 'review', name: 'Review', description: 'Jízdní dojmy a redakční hodnocení.' },
    { slug: 'servis', name: 'Servis', description: 'Servisní a údržbové postupy.' },
    { slug: 'buyers-guide', name: 'Buyers Guide', description: 'Tipy při výběru ojetiny.' },
    { slug: 'e46', name: 'E46', description: 'Generace E46 a její typické vlastnosti.' },
    { slug: 'xdrive', name: 'xDrive', description: 'Články zaměřené na pohon všech kol.' },
    { slug: 'm-performance', name: 'M Performance', description: 'M divize a ostřejší verze.' },
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
      title: 'BMW E46 M3: ikona analogové radosti z řízení',
      description:
        'Proč je E46 M3 pořád měřítkem pro řidiče, kteří chtějí atmosférický šestiválec, přesné řízení a mechanický cit.',
      content:
        '<h2>Proč tenhle článek vznikl</h2><p>E46 M3 je jedno z těch aut, které se v diskuzích o nejlepších sportovních BMW vrací pořád dokola. Není to jen výkonem, ale i tím, jak komunikuje s řidičem.</p><h2>Motor S54</h2><p>Atmosférický řadový šestiválec se ochotně točí do vysokých otáček a dává autu charakter, který dnes už hledáme čím dál hůř.</p><h2>Na co si dát pozor</h2><ul><li>Kontrola údržby VANOSu</li><li>Stav zadní nápravy a podlahy</li><li>Historie servisu a chladicí soustavy</li></ul>',
      imageUrl:
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
      status: 'PUBLISHED' as const,
      publishDate: new Date('2026-03-20T09:00:00.000Z'),
      seoTitle: 'BMW E46 M3 recenze a kupní tipy',
      seoDescription: 'Recenze BMW E46 M3, charakter motoru S54 a hlavní body při koupi.',
      seriesId: seriesId('m-models'),
      tags: tagIds(['review', 'e46', 'm-performance']),
    },
    {
      slug: 'g20-330i-jako-idealni-daily-driver',
      title: 'Je G20 330i ideální daily driver?',
      description:
        'Moderní trojka s motorem B48 umí být rychlá, komfortní i úsporná. Podívali jsme se na ni jako na každodenní auto.',
      content:
        '<h2>Každý den bez kompromisů</h2><p>G20 330i ukazuje, proč je řada 3 tak důležitá. V běžném provozu funguje kultivovaně, ale když potřebuješ, umí být překvapivě svižná.</p><h2>Technika a interiér</h2><p>B48 patří mezi nejpříjemnější moderní čtyřválce BMW. Auto navíc nabízí výbornou ergonomii a dospělý podvozek.</p><h2>Komu bude sedět</h2><p>Řidičům, kteří chtějí jedno auto na dálnice, okresky i každodenní provoz.</p>',
      imageUrl:
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80',
      status: 'PUBLISHED' as const,
      publishDate: new Date('2026-03-22T08:30:00.000Z'),
      seoTitle: 'BMW G20 330i jako daily driver',
      seoDescription: 'Praktická recenze BMW G20 330i xDrive pro každodenní použití.',
      seriesId: seriesId('3-series'),
      tags: tagIds(['review', 'xdrive']),
    },
    {
      slug: 'na-co-se-divat-pri-koupi-bmw-f10-530d',
      title: 'Na co se dívat při koupi BMW F10 530d',
      description:
        'Kupní průvodce pro F10 530d se seznamem častých slabin, servisních bodů a rozumných očekávání.',
      content:
        '<h2>Proč právě F10 530d</h2><p>Pětková řada generace F10 umí být výborná na dlouhé trasy a stále působí hodnotně. Při koupi je ale potřeba hlídat technický stav a historii.</p><h2>Kontrolní seznam</h2><ol><li>Historie olejových intervalů</li><li>Stav automatické převodovky</li><li>Podvozek a pneumatické komfortní prvky</li></ol><p>Dobře vybrané auto se umí odvděčit komfortem i nízkou spotřebou na dálnici.</p>',
      imageUrl:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      status: 'PUBLISHED' as const,
      publishDate: new Date('2026-03-24T10:00:00.000Z'),
      seoTitle: 'BMW F10 530d: kupní průvodce',
      seoDescription: 'Kontrolní seznam a rady při výběru BMW F10 530d.',
      seriesId: seriesId('5-series'),
      tags: tagIds(['buyers-guide', 'servis']),
    },
    {
      slug: 'jak-na-vymenu-kotoucu-u-bmw-g30',
      title: 'Jak na výměnu předních kotoučů u BMW G30',
      description:
        'Servisní návod krok za krokem pro výměnu předních brzdových kotoučů a destiček u BMW řady 5.',
      content:
        '<h2>Příprava</h2><p>Před začátkem si připrav správné momenty dotažení, nové šrouby a základní diagnostiku. Bezpečnost a čistota práce jsou základ.</p><h2>Postup</h2><ol><li>Zvednout vůz a sundat kola</li><li>Demontovat třmen a držák</li><li>Očistit dosedací plochu náboje</li><li>Namontovat nové kotouče i destičky</li></ol><p>Po výměně nezapomeň na záběh a kontrolu brzdové kapaliny.</p>',
      imageUrl:
        'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1400&q=80',
      status: 'DRAFT' as const,
      publishDate: new Date('2026-03-28T07:00:00.000Z'),
      seoTitle: 'Výměna předních kotoučů u BMW G30',
      seoDescription: 'Praktický servisní návod pro výměnu předních brzd na BMW G30.',
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
