// @ts-nocheck
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '#configs/env.config.js'

/**
 * Validates the JWT token in the request headers.
 * If the token is valid, it adds the decoded user information to the request object.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {import('express').Response<any, Record<string, any>> | undefined} A promise that resolves when the token is validated.
 */
export const validateToken = (req, res, next) => {
  const { token } = req.cookies

  if (!token) return res.status(401).json({ 
    status: 'fail',
    message: 'Unauthorized access to this account' 
  })

  /**
   * Replaces the jwt.verify function to handle the token verification.
   * @param {Error} error - The error object if the token is invalid.
   * @param {object} decoded - The decoded token object if the token is valid.
   * @returns {import('express').Response<any, Record<string, any>> | undefined} A promise that resolves when the token is validated.
   * @throws {Error} Throws an error if the token is invalid.
   */
  const jwtCallback = (error, decoded) => {
    if (error && error instanceof Error) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'The token provided is invalid' 
      })
    }

    req.user = decoded
    next()
  }

  jwt.verify(token, JWT_SECRET, jwtCallback)
}