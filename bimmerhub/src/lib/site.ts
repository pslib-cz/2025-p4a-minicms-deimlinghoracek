export const siteConfig = {
  name: 'BimmerHub',
  title: 'BimmerHub | BMW magazin a mini CMS',
  description:
    'Publikacni platforma zamerena na recenze BMW, servisni navody, kupni pruvodce a galerie modelovych rad.',
  locale: 'cs_CZ',
}

export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'

export const publicArticlesPageSize = 6
export const dashboardArticlesPageSize = 8

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
