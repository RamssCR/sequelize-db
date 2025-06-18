import { Book, Shelf } from '#models/book.model.js'
import { Author } from '#models/author.model.js'
import { Genre } from '#models/genre.model.js'
import { buildQuery } from '#utils/buildQuery.js'
import { flattenNestedObject } from '#utils/flattenNestedObject.js'

/**
 * Retrieves all books from the user's shelf from the database.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @throws {Error} If an error occurs while retrieving books from the database.
 */
export const getAllShelfBooks = async (req, res, next) => {
  const { page, limit } = req.query
  const userId = req.user?.id
  const pageNumber = Number(page) || 1
  const limitNumber = Number(limit) || 10
  const offset = (pageNumber - 1) * limitNumber

  let include = [
    buildQuery(Author),
    buildQuery(Genre)
  ]

  try {
    const { count, rows: books } = await Shelf
      .findAndCountAll({
        where: { UserId: userId },
        include: [{ model: Book, include }],
        limit: limitNumber,
        offset,
        order: [['createdAt', 'DESC']],
      })
    res.json({
      status: 'success',
      message: 'Books retrieved successfully',
      data: {
        total: count,
        page: pageNumber,
        size: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
        books: books.map(book => {
          const plainBook = book.get({ plain: true })
          const flattenedBook = flattenNestedObject(plainBook.Book, ['Author', 'Genre'], ['name'])
          return {
            ...flattenedBook,
            status: plainBook.status,
          }
        }),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves all book IDs from the user's shelf.
 * This function fetches all books associated with the user's shelf and returns their IDs.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @return {Promise<void>} A promise that resolves when the book IDs are successfully retrieved and sent in the response.
 * @throws {Error} If an error occurs while retrieving book IDs from the user's shelf.
 */
export const getShelfBooksIds = async (req, res, next) => {
  const userId = req.user?.id

  try {
    const books = await Shelf
      .findAll({
        where: { UserId: userId },
        attributes: ['BookId']
      })

    res.json({
      status: 'success',
      message: books.length > 0 ? 'Book IDs retrieved successfully' : 'No books found in user shelf',
      data: books.map(book => book.dataValues.BookId)
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a book by its slug from the user's shelf.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @throws {Error} If an error occurs while adding the book to the shelf.
 */
export const getShelfBookBySlug = async (req, res, next) => {
  const { slug } = req.params
  const userId = req.user?.id

  let include = [
    buildQuery(Author),
    buildQuery(Genre)
  ]

  try {
    const book = await Shelf
      .findOne({
        where: { UserId: userId },
        include: [{ model: Book, where: { slug }, include }]
      })

    if (!book) {
      res.status(404).json({
        status: 'fail',
        message: 'Book not found in user shelf'
      })
      return
    }

    const plainBook = book.get({ plain: true })
    const flattenedBook = flattenNestedObject(plainBook.Book, ['Author', 'Genre'], ['name'])

    res.json({
      status: 'success',
      message: 'Book retrieved successfully',
      data: {
        ...flattenedBook,
        status: plainBook.status,
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Adds a book to the user's shelf.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @throws {Error} If an error occurs while adding the book to the shelf.
 */
export const addBookToShelf = async (req, res, next) => {
  const { slug } = req.body
  const userId = req.user?.id

  try {
    const book = await Book.findOne({ where: { slug } })

    if (!book) {
      res.status(404).json({
        status: 'fail',
        message: 'Book not found in user shelf'
      })
      return
    }

    const shelf = await Shelf.create({
      UserId: userId,
      BookId: book.dataValues.id
    })

    res.json({
      status: 'success',
      message: 'Book added to shelf successfully',
      data: shelf
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Removes a book from the user's shelf.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @throws {Error} If an error occurs while removing the book from the shelf.
 */
export const removeBookFromShelf = async (req, res, next) => {
  const { slug } = req.params
  const userId = req.user?.id

  try {
    const book = await Shelf
      .findOne({
        where: { UserId: userId },
        include: [{ model: Book, where: { slug } }]
      })
    if (!book) {
      res.status(404).json({
        status: 'fail',
        message: 'Book not found in user shelf'
      })
      return
    }

    await book.destroy()
    res.json({
      status: 'success',
      message: 'Book removed from shelf successfully'
    })
  } catch (error) {
    next(error)
  }
}