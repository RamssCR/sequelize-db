import { Book } from '#models/book.model.js'
import { Author } from '#models/author.model.js'
import { Category } from '#models/category.model.js'
import { Genre } from '#models/genre.model.js'
import { buildQuery } from '#utils/buildQuery.js';

/**
 * Retrieves all books from the database.
 * It also retrieves books by filtering by author, category, or genre.
 * If no filters are provided, it retrieves all books.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<import('express').Response<any, Record<string, any>> | undefined>} The response object with the list of books or an error message.
 * @throws {Error} If an error occurs while retrieving books from the database.
 */
export const getAllBooks = async (req, res, next) => {
  const { category, genre } = req.query

  let include = [
    buildQuery(Author),
    buildQuery(Category, category),
    buildQuery(Genre, genre),
  ]

  try {
    const books = await Book.scope('cleanQuery').findAll({ include })
    return res.json({
      status: 'success',
      message: 'Books retrieved successfully',
      data: books,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a book by its slug.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<import('express').Response<any, Record<string, any>> | undefined>} The response object with the book data or an error message.
 * @throws {Error} If an error occurs while retrieving the book from the database.
 */
export const getBookBySlug = async (req, res, next) => {
  const { slug } = req.params

  const include = [
    buildQuery(Author),
    buildQuery(Category),
    buildQuery(Genre),
  ]

  try {
    const book = await Book.scope('cleanQuery').findOne({
      where: { slug },
      include,
    })

    if (!book) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid book slug',
      })
    }

    return res.json({
      status: 'success',
      message: 'Book retrieved successfully',
      data: book,
    })
  } catch (error) {
    next(error)
  }
}