import { ArticleStatus } from '@prisma/client'
import { z } from 'zod'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const articlePayloadSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z.string().trim().min(3).max(140).regex(slugPattern),
  description: z.string().trim().min(20).max(220),
  content: z.string().trim().min(50),
  imageUrl: z
    .string()
    .trim()
    .url()
    .or(z.literal(''))
    .transform((value) => value || null),
  status: z.nativeEnum(ArticleStatus),
  publishDate: z.string().datetime(),
  seriesId: z.string().cuid(),
  seoTitle: z
    .string()
    .trim()
    .max(70)
    .or(z.literal(''))
    .transform((value) => value || null),
  seoDescription: z
    .string()
    .trim()
    .max(160)
    .or(z.literal(''))
    .transform((value) => value || null),
  tags: z.array(z.string().trim().min(1).max(32)).min(1).max(8),
})

export type ArticlePayload = z.infer<typeof articlePayloadSchema>

export const registerPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .optional()
    .transform((value) => value || null),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
})

export type RegisterPayload = z.infer<typeof registerPayloadSchema>
