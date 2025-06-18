import { Router } from 'express'
import { validateToken } from '#middlewares/validateToken.js'
import {
  addBookToShelf,
  getAllShelfBooks,
  getShelfBooksIds,
  getShelfBookBySlug,
  removeBookFromShelf
} from '#controllers/shelf.controller.js'

export const shelfRouter = Router()

// Get all books from the user's shelf
shelfRouter.get('/', validateToken, getAllShelfBooks)

// Get all book IDs from the user's shelf
shelfRouter.get('/ids', validateToken, getShelfBooksIds)

// Get a book by slug from the user's shelf
shelfRouter.get('/:slug', validateToken, getShelfBookBySlug)

// Add a book to the user's shelf
shelfRouter.post('/', validateToken, addBookToShelf)

// Remove a book from the user's shelf
shelfRouter.delete('/:slug', validateToken, removeBookFromShelf)