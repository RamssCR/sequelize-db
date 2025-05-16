/**
 * Handles errors in the application.
 * This middleware function is used to catch errors that occur during the request-response cycle.
 * It logs the error and sends a response to the client with the appropriate status code and message.
 * @param {unknown} error - The error object that was thrown.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
export const errorHandler = (error, req, res, next) => {
  if (error instanceof Error) {
    console.error(error.stack)
    res.status(500).json({
      status: 'error',
      code: 500,
      message: error.message,
    })
  }
}