import { User } from '#models/user.model.js'
import { createToken } from '#libs/jwt.js'
import { hash } from 'bcryptjs'

/**
 * Register a new user when filling the required fields.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the user is registered.
 * @throws {Error} If the user is already registered or if there is an error during registration.
 */
export const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const hashedPassword = await hash(password, 10)
    const isExistingUser = await User.findOne({ where: { email } })

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
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
      error: error.message
    })
  }
}

/**
 * Login a user with the provided credentials.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the user is logged in.
 * @throws {Error} If the credentials are invalid or if there is an error during login.
 */
export const login = async (req, res) => { }

/**
 * Get the profile of the logged-in user.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the profile is retrieved.
 * @throws {Error} If there is an error during profile retrieval.
 */
export const profile = async (req, res) => { }

/**
 * Logout the user by clearing the session or token.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the user is logged out.
 * @throws {Error} If there is an error during logout.
 */
export const logout = async (req, res) => { }