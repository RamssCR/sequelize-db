import { z } from 'zod'

export const chapterQuerySchema = z.object({
  slug: z
    .string({
      required_error: 'Slug is required',
      invalid_type_error: 'Slug must be a string'
    })
    .refine(val => val !== 'undefined', { message: 'Slug cannot be undefined' }),
  number: z
    .string({
      required_error: 'Chapter number is required',
      invalid_type_error: 'Chapter number must be a string'
    })
    .refine(val => val !== 'undefined', { message: 'Chapter number cannot be undefined' }),
})