import zod from 'zod'

export const bookSchema = zod.object({
    title: zod.string().min(1).max(100),
    subtitle: zod.string().max(100).optional(),
    synopsis: zod.string().max(1000).optional(),
    content: zod.string().optional(),
    cover: zod.string().url().max(1000).optional(),
    category: zod.string().max(100),
    genre: zod.string().max(100),
    author: zod.string().max(100),
    pages: zod.number().min(1),
    chapters: zod.number().min(1),
})