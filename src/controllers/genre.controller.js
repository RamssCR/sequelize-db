import { Genre } from '#models/genre.model.js'

/**
 * Retrieves all genres from the database.
 * It orders the genres by name in ascending order.
 * This function is used to get a list of all available genres.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the genres are retrieved.
 * @throws {Error} If an error occurs while retrieving genres from the database.
 */
export const getAllGenres = async (req, res, next) => {
  try {
    const genres = await Genre.findAll({
      order: [['name', 'ASC']],
    })
    res.json({
      status: 'success',
      message: 'Genres retrieved successfully',
      data: genres,
    })
  } catch (error) {
    next(error)
  }
}