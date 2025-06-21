import { Router } from 'express'
import { authRouter } from './authentication/auth.routes.js'
import { bookRouter } from './books/book.routes.js'
import { chapterRouter } from './books/chapter.routes.js'
import { genreRouter } from './books/genre.routes.js'
import { shelfRouter } from './shelves/shelf.routes.js'

export const router = Router()

router
  .use('/auth', authRouter)
  .use('/books', bookRouter)
  .use('/shelves', shelfRouter)
  .use('/genres', genreRouter)
  .use('/chapters', chapterRouter)