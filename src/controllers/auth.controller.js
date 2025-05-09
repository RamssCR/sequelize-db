import { User } from '#models/user.model.js'
import { createToken } from '#libs/jwt.js'
import { hash, compare } from 'bcryptjs'

/**
 * Register a new user when filling the required fields.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the user is registered.
 * @throws {Error} If the user is already registered or if there is an error during registration.
 */
export const register = async (req, res, next) => {
  const { username, email, password } = req.body

  try {
    const hashedPassword = await hash(password, 10)
    const isExistingUser = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'username']
    })

    if (isExistingUser) return res.status(400).json({
      status: 'fail',
      message: 'user already registered'
    })

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    const token = await createToken({ id: user.dataValues.id })
    return res.status(201).cookie('token', token).json({
      status: 'success',
      message: 'user registered successfully',
      data: {
        user: {
          id: user.dataValues.id,
          username: user.dataValues.username,
          email: user.dataValues.email
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Login a user with the provided credentials.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the user is logged in.
 * @throws {Error} If the credentials are invalid or if there is an error during login.
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(400).json({
      status: 'fail',
      message: 'Incorrect email or password'
    })

    const isPasswordValid = await compare(password, user.dataValues.password)
    if (!isPasswordValid) return res.status(400).json({
      status: 'fail',
      message: 'Incorrect email or password'
    })

    const token = await createToken({ id: user.dataValues.id })
    return res.status(200).cookie('token', token).json({
      status: 'success',
      message: 'user logged in successfully',
      data: {
        user: {
          id: user.dataValues.id,
          username: user.dataValues.username,
          email: user.dataValues.email
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get the profile of the logged-in user.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the profile is retrieved.
 * @throws {Error} If there is an error during profile retrieval.
 */
export const profile = async (req, res, next) => {
  const { id } = req.user

  try {
    const user = await User.findOne({
      where: { id },
      attributes: ['id', 'username', 'email']
    })

    if (!user) return res
      .cookie('token', '', { expires: new Date(0) })
      .status(401).json({
        status: 'fail',
        message: 'Invalid session'
      })

    return res.status(200).json({
      status: 'success',
      message: 'user profile retrieved successfully',
      data: {
        user: {
          id: user.dataValues.id,
          username: user.dataValues.username,
          email: user.dataValues.email
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Logout the user by clearing the session or token.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the user is logged out.
 * @throws {Error} If there is an error during logout.
 */
export const logout = async (req, res, next) => {
  try {
    return res
      .cookie('token', '', { expires: new Date(0) })
      .sendStatus(204)
  } catch (error) {
    next(error)
  }
}