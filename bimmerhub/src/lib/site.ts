export const siteConfig = {
  name: 'BimmerHub',
  title: 'BimmerHub | BMW magazín a mini CMS',
  description:
    'Publikační platforma zaměřená na recenze BMW, servisní návody, kupní průvodce a galerie modelových řad.',
  locale: 'cs_CZ',
}

export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'

export const publicArticlesPageSize = 6
export const dashboardArticlesPageSize = 8

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
