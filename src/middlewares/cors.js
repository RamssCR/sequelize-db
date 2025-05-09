import { ALLOWED_ORIGINS, NODE_ENV } from '#configs/env.config.js'

/**
 * Allows cross-origin requests to the server.
 * This middleware is used to enable CORS (Cross-Origin 
 * Resource Sharing) for all routes in the application.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @param {import("express").NextFunction} next - The next middleware function
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void} - The middleware function
 */
export const cors = () => {
  const origins = ALLOWED_ORIGINS?.split(',') ?? []

  return (req, res, next) => {
    const origin = req.headers?.origin
    if (!origin) return next()

    if (NODE_ENV === 'development' || NODE_ENV === 'test') {
      res.header('Access-Control-Allow-Origin', '*')
    }

    if (origins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin)
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
  }
}