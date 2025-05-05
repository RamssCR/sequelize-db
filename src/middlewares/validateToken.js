import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '#configs/env.config.js'

/**
 * Validates the JWT token in the request headers.
 * If the token is valid, it adds the decoded user information to the request object.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the token is validated.
 */
export const validateToken = (req, res, next) => {
  const { token } = req.cookies

  if (!token) return res.status(401).json({ message: 'Unauthorized access to this account' })

  verify(token, JWT_SECRET, (error, decoded) => {
    if (error) return res.status(400).json({ message: 'The token provided is invalid' })

    req.user = decoded
    next()
  })
}