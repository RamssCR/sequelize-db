import { Router } from 'express'
import { validateToken } from '#middlewares/validateToken.js'

export const bookRouter = Router()

// Get all books
bookRouter.get('/', validateToken)

// Get a book by ID
bookRouter.get('/:id', validateToken)

// Create a new book
bookRouter.post('/', validateToken)

// Update a book by ID
bookRouter.patch('/:id', validateToken)

// Delete a book by ID
bookRouter.delete('/:id', validateToken)