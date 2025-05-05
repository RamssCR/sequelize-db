import { sign, JsonWebTokenError } from 'jsonwebtoken'
import { JWT_SECRET } from '#configs/env.config.js'

/**
 * Creates a JWT token with the given payload and secret.
 * @param {string | Buffer<ArrayBufferLike> | object} payload 
 * @returns {Promise<string>} A promise that resolves to the generated token.
 * @throws {JsonWebTokenError} If there is an error while signing the token.
 */
export const createToken = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      const token = sign(payload, JWT_SECRET, { expiresIn: '1h' })
      resolve(token)
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        reject({
          stack: error.stack,
          message: error.message,
          name: error.name
        })
      }
    }
  })
}