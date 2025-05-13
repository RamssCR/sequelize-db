// @ts-nocheck
import { Router } from 'express'
import { validateToken } from '#middlewares/validateToken.js'
import { validateSchema } from '#middlewares/validateSchema.js'
import { bookSchema } from '#schemas/bookSchema.js'
import { 
    getAllBooks,
    getBookBySlug,
} from '#controllers/book.controller.js'

export const bookRouter = Router()

// Get all books
bookRouter.get('/', validateToken, getAllBooks)

// Get a book by slug
bookRouter.get('/:slug', validateToken, getBookBySlug)

// Create a new book
bookRouter.post('/', validateSchema(bookSchema), validateToken)

// Update a book by ID
bookRouter.patch('/:id', validateSchema(bookSchema, "partial"), validateToken)

// Delete a book by ID
bookRouter.delete('/:id', validateToken)