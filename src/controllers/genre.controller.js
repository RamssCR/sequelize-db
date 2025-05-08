import { Genre } from '#models/genre.model.js'

/**
 * Retrieves all genres from the database.
 * It fetches all genres and returns them in the response.
 * @route GET /genres
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query.
 */
export const getAllGenres = async (req, res, next) => {
  try {
    const genres = await Genre.findAll()
    return res.status(200).json({
      status: 'success',
      message: 'Genres retrieved successfully',
      data: genres.map((genre) => genre.dataValues),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a genre by its ID from the database.
 * It fetches a genre based on the provided ID and 
 * returns it in the response.
 * @route GET /genres/:id
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query or if the genre is not found.
 */
export const getGenreById = async (req, res, next) => {
  const { id } = req.params
  try {
    const genre = await Genre.findByPk(id)
    if (!genre) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid genre'
      })
    }
    return res.json({
      status: 'success',
      message: 'Genre retrieved successfully',
      data: genre.dataValues,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Creates a new genre in the database.
 * It validates the request body, creates a new genre, 
 * and returns it in the response.
 * @route POST /genres
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 * @throws {Error} hrows an error if there is an issue with the database query or if the request body is invalid.
 */
export const createGenre = async (req, res, next) => {
  const { name } = req.body
  try {
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name is required'
      })
    }
    const genre = await Genre.create({ name })
    return res.status(201).json({
      status: 'success',
      message: 'Genre created successfully',
      data: genre.dataValues,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Updates an existing genre in the database.
 * It validates the request body, updates the genre based on the provided ID,
 * and returns the updated genre in the response.
 * @route PATCH /genres/:id
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query or if the genre is not found.
 */
export const updateGenre = async (req, res, next) => {
  const { id } = req.params
  const { name } = req.body

  try {
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name is required'
      })
    }
    const genre = await Genre.findByPk(id)
    if (!genre) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid genre'
      })
    }
    await genre.update({ name })
    return res.json({
      status: 'success',
      message: 'Genre updated successfully',
      data: genre.dataValues,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Deletes a genre from the database.
 * It deletes the genre based on the provided ID and 
 * returns a success message in the response.
 * @route DELETE /genres/:id
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query or if the genre is not found.
 */
export const deleteGenre = async (req, res, next) => {
  const { id } = req.params
  try {
    const genre = await Genre.findByPk(id)
    if (!genre) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid genre'
      })
    }
    await genre.destroy()
    return res.json({
      status: 'success',
      message: 'Genre deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}