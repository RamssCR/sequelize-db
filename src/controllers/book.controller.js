import slug from 'slug'
import { Book } from '#models/book.model.js'
import { Author } from '#models/author.model.js'
import { Genre } from '#models/genre.model.js'
import { buildQuery } from '#utils/buildQuery.js'
import { flattenNestedObject } from '#utils/flattenNestedObject.js'

/**
 * Retrieves all books from the database.
 * It also retrieves books by filtering by author, category, or genre.
 * If no filters are provided, it retrieves all books.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @throws {Error} If an error occurs while retrieving books from the database.
 */
export const getAllBooks = async (req, res, next) => {
  const { genre, page, limit } = req.query
  const pageNumber = Number(page) || 1
  const limitNumber = Number(limit) || 10
  const offset = (pageNumber - 1) * limitNumber

  let include = [
    buildQuery(Author),
    buildQuery(Genre, genre),
  ]

  try {
    const { count, rows: books } = await Book
      .findAndCountAll({ 
        include,
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
          return flattenNestedObject(plainBook, ['Author', 'Genre'], ['name'])
        })
      },
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
 * @returns {Promise<void>} - A promise that resolves when the book is retrieved.
 * @throws {Error} If an error occurs while retrieving the book from the database.
 */
export const getBookBySlug = async (req, res, next) => {
  const { slug } = req.params

  const include = [
    buildQuery(Author),
    buildQuery(Genre),
  ]

  try {
    const book = await Book.findOne({
      where: { slug },
      include,
    })

    if (!book) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid book slug',
      })
      return
    }

    const plainBook = book.get({ plain: true })
    const flattenedBook = flattenNestedObject(plainBook, ['Author', 'Genre'], ['name'])

    res.json({
      status: 'success',
      message: 'Book retrieved successfully',
      data: flattenedBook,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Creates a new book in the database.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the book is created.
 * @throws {Error} If an error occurs while creating the book in the database.
 */
export const createBook = async (req, res, next) => {
  const newBook = {
    ...req.body,
    slug: slug(req.body.title, { lower: true }),
  }
  
  try {
    const book = await Book.create(newBook)
    res.status(201).json({
      status: 'success',
      message: 'Book created successfully',
      data: book,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Updates a book in the database.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the book is updated.
 * @throws {Error} If an error occurs while updating the book in the database.
 */
export const updateBook = async (req, res, next) => {
  const { slug:bookSlug } = req.params
  const { title } = req.body

  try {
    const book = await Book.findOne({ where: { slug: bookSlug } })
    if (!book) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid book slug',
      })
      return
    }

    const updatedBook = await book.update({
      ...req.body,
      slug: slug(title || book.dataValues.title, { lower: true }),
    })
    res.json({
      status: 'success',
      message: 'Book updated successfully',
      data: () => {
        const plainBook = updatedBook.get({ plain: true })
        return flattenNestedObject(plainBook, ['Author', 'Genre'], ['name'])
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Deletes a book from the database.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the book is deleted.
 * @throws {Error} If an error occurs while deleting the book from the database.
 */
export const deleteBook = async (req, res, next) => {
  const { slug } = req.params

  try {
    const book = await Book.findOne({ where: { slug } })
    if (!book) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid book slug',
      })
      return
    }
    
    await book.destroy()
    res.json({
      status: 'success',
      message: 'Book deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}