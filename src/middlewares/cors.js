/**
 * Allows cross-origin requests to the server.
 * This middleware is used to enable CORS (Cross-Origin 
 * Resource Sharing) for all routes in the application.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @param {import("express").NextFunction} next - The next middleware function
 * @returns {void}
 */
export const cors = (_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
}