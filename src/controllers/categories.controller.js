import { Category } from '#models/category.model.js'

/**
 * Retrieves all categories from the database.
 * It fetches all categories and returns them in the response.
 * @route GET /categories
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<import('express').Response<any, Record<string, any>> | undefined>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query.
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll()
    return res.status(200).json({
      status: 'success',
      message: 'Categories retrieved successfully',
      data: categories.map((category) => category.dataValues),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a category by its ID from the database.
 * It fetches a category based on the provided ID and 
 * returns it in the response.
 * @route GET /categories/:id
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<import('express').Response<any, Record<string, any>> | undefined>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query or if the category is not found.
 */
export const getCategoryById = async (req, res, next) => {
  const { id } = req.params
  try {
    const category = await Category.findByPk(id)
    if (!category) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid category'
      })
    }
    return res.json({
      status: 'success',
      message: 'Category retrieved successfully',
      data: category.dataValues,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Creates a new category in the database.
 * It validates the request body, creates a new category, 
 * and returns it in the response.
 * @route POST /categories
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<import('express').Response<any, Record<string, any>> | undefined>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query or if the request body is invalid.
 */
export const createCategory = async (req, res, next) => {
  const { name } = req.body
  try {
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name is required'
      })
    }
    const category = await Category.create({ name })
    return res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: category.dataValues,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Updates a category by its ID in the database.
 * It validates the request body, updates the category, 
 * and returns it in the response.
 * @route PUT /categories/:id
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<import('express').Response<any, Record<string, any>> | undefined>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query or if the request body is invalid.
 */
export const updateCategory = async (req, res, next) => {
  const { id } = req.params
  const { name } = req.body

  try {
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name is required'
      })
    }
    const category = await Category.findByPk(id)
    if (!category) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid category'
      })
    }
    await category.update({ name })
    return res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      data: category.dataValues,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Deletes a category by its ID from the database.
 * It deletes the category based on the provided ID and 
 * returns a success message in the response.
 * @route DELETE /categories/:id
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<import('express').Response<any, Record<string, any>> | undefined>} A promise that resolves when the response is sent.
 * @throws {Error} Throws an error if there is an issue with the database query or if the category is not found.
 */
export const deleteCategory = async (req, res, next) => {
  const { id } = req.params
  try {
    const category = await Category.findByPk(id)
    if (!category) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid category'
      })
    }
    await category.destroy()
    return res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}