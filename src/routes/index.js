import { Router } from 'express'
import { authRouter } from './authentication/auth.routes.js'
import { bookRouter } from './books/book.routes.js'

export const router = Router()

router
  .use('/auth', authRouter)
  .use('/books', bookRouter)