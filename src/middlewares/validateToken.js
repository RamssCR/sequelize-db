import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '#configs/env.config.js'

/**
 * Validates the JWT token in the request headers.
 * If the token is valid, it adds the decoded user information to the request object.
 * @type {import('express').RequestHandler} 
 */
export const validateToken = (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized access to this account'
    })
    return
  }

  /**
   * @param {import('jsonwebtoken').VerifyErrors | null} error
   * @param {import('jsonwebtoken').JwtPayload | string | undefined} decoded
   */
  const jwtCallback = (error, decoded) => {
    if (error) {
      return res.status(401).json({
        status: 'fail',
        message: 'The token provided is invalid'
      })
    }

    // @ts-expect-error: extended via declaration merging
    req.user = decoded
    next()
  }

  jwt.verify(token, JWT_SECRET, jwtCallback)
}