import { Router } from 'express'
import { getAllGenres } from '#controllers/genre.controller.js'
import { validateToken } from '#middlewares/validateToken.js'

export const genreRouter = Router()

// Route to get all genres
genreRouter.get('/', validateToken, getAllGenres)