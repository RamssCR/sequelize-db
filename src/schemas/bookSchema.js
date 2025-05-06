import zod from 'zod'

const bookSchema = zod.object({
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

/**
 * Validates the book object using zod schema.
 * It checks if the object has the required properties
 * and if they are of the correct type.
 * @typedef {object} Book
 * @property {string} title - The title of the book
 * @property {string} subtitle - The subtitle of the book
 * @property {string} synopsis - The synopsis of the book
 * @property {string} content - The content of the book
 * @property {string} cover - The cover of the book
 * @property {string} category - The category of the book
 * @property {string} genre - The genre of the book
 * @property {string} author - The author of the book
 * @property {number} pages - The number of pages in the book
 * @property {number} chapters - The number of chapters in the book
 * @param {Book} object - The book object to validate
 * @returns {import('zod').SafeParseReturnType<Book, Book>} The result of the validation
 */
export const validateBook = (object) => bookSchema.safeParse(object)

/**
 * Partially validates the book object using zod schema.
 * It checks if the object has the required properties
 * and if they are of the correct type.
 * @typedef {object} Book
 * @property {string} title - The title of the book
 * @property {string} subtitle - The subtitle of the book
 * @property {string} synopsis - The synopsis of the book
 * @property {string} content - The content of the book
 * @property {string} cover - The cover of the book
 * @property {string} category - The category of the book
 * @property {string} genre - The genre of the book
 * @property {string} author - The author of the book
 * @property {number} pages - The number of pages in the book
 * @property {number} chapters - The number of chapters in the book
 * @param {Book} object - The book object to validate
 * @returns {import('zod').SafeParseReturnType<Book, Book>} The result of the validation
 */
export const partiallyValidateBook = (object) => bookSchema.partial().safeParse(object)