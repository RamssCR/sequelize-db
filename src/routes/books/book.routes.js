// @ts-nocheck
import { Router } from 'express'
import { validateToken } from '#middlewares/validateToken.js'
import { validateSchema } from '#middlewares/validateSchema.js'
import { bookSchema } from '#schemas/bookSchema.js'

export const bookRouter = Router()

// Get all books
bookRouter.get('/', validateToken)

// Get a book by ID
bookRouter.get('/:id', validateToken)

// Create a new book
bookRouter.post('/', validateSchema(bookSchema), validateToken)

// Update a book by ID
bookRouter.patch('/:id', validateSchema(bookSchema, "partial"), validateToken)

// Delete a book by ID
bookRouter.delete('/:id', validateToken)