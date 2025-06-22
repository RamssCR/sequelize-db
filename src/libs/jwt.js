import jwt from 'jsonwebtoken'

/**
 * Creates a JWT token with the given payload and secret.
 * @param {string | Buffer<ArrayBufferLike> | object} payload 
 * @returns {Promise<string>} A promise that resolves to the generated token.
 * @throws {JsonWebTokenError} If there is an error while signing the token.
 */
export const createToken = (payload) => {
  const JWT_SECRET = /** @type {string} */(process.env.JWT_SECRET)

  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1D" })
      resolve(token)
    } catch (error) {
      reject(error)
    }
  })
}