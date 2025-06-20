import { Chapter } from '#models/chapter.model.js'
import { Book } from '#models/book.model.js'
import { flattenNestedObject } from '#utils/flattenNestedObject.js'

/**
 * Gets all chapters of a book by its slug.
 * @param {import('express').Request} req - The request object containing the book ID in the parameters. 
 * @param {import('express').Response} res - The response object to send the chapters data.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Returns a promise that resolves when the chapters are successfully retrieved and sent in the response.
 */
export const getBookChaptersBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const chapters = await Chapter.findAll({ 
      where: { slug },
      include: [{
        model: Book,
        attributes: ['title', 'slug']
      }],
    })
    res.json({
      status: 'success',
      message: 'Chapters retrieved successfully',
      data: chapters.map(chapter => {
        const plainChapter = chapter.get({ plain: true })
        return flattenNestedObject(plainChapter, ['Book'], ['title'])
      }),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Gets a specific chapter of a book by its slug and chapter number.
 * This function retrieves a chapter based on the book's slug and the chapter number.
 * It includes the book's title and slug in the response.
 * @param {import('express').Request} req - The request object containing the book slug and chapter number in the parameters.
 * @param {import('express').Response} res - The response object to send the chapter data.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>} Returns a promise that resolves when the chapter is successfully retrieved and sent in the response.
 * @throws {Error} If the chapter is not found or if there is an error during the database query.
 */
export const getBookChapterByNumber = async (req, res, next) => {
  try {
    const { slug, number } = req.params
    const chapter = await Chapter.findOne({
      where: { slug, chapterNumber: number },
      include: [{
        model: Book,
        attributes: ['title', 'slug', 'chapters']
      }],
    })
    if (!chapter) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid chapter number or slug',
      })
      return
    }

    const plainChapter = chapter.get({ plain: true })
    const flattenedChapter = flattenNestedObject(plainChapter, ['Book'], ['title'])

    const chapters = Number(plainChapter.Book.chapters)
    const currentChapter = Number(flattenedChapter.chapterNumber)

    res.json({
      status: 'success',
      message: 'Chapter retrieved successfully',
      data: {
        ...flattenedChapter,
        panel: {
          next: currentChapter < chapters ? currentChapter + 1 : currentChapter,
          previous: currentChapter > 1 ? currentChapter - 1 : currentChapter,
        }
      },
    })
  } catch (error) {
    next(error)
  }
}