import { Router } from 'express'
import { validateToken } from '#middlewares/validateToken.js'
import { validateSchema } from '#middlewares/validateSchema.js'
import { bookSchema } from '#schemas/bookSchema.js'
import { 
    getAllBooks,
    getBookBySlug,
    createBook,
    updateBook,
    deleteBook,
} from '#controllers/book.controller.js'

export const bookRouter = Router()

// Get all books
bookRouter.get('/', validateToken, getAllBooks)

// Get a book by slug
bookRouter.get('/:slug', validateToken, getBookBySlug)

// Create a new book
bookRouter.post('/', validateToken, validateSchema(bookSchema), createBook)

// Update a book by ID
bookRouter.patch('/:slug', validateToken, validateSchema(bookSchema, "partial"), updateBook)

// Delete a book by ID
bookRouter.delete('/:slug', validateToken, deleteBook)