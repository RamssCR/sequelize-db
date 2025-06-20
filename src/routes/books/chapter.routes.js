import { Router } from 'express'
import {
  getBookChaptersBySlug,
  getBookChapterByNumber
} from '#controllers/chapter.controller.js'
import { validateToken } from '#middlewares/validateToken.js'

export const chapterRouter = Router()

chapterRouter.get('/:slug', validateToken, getBookChaptersBySlug)
chapterRouter.get('/:slug/:number', validateToken, getBookChapterByNumber)