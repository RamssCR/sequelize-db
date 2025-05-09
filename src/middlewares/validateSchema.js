/**
 * Validates a request body against a given zod schema.
 * If the validation fails, it sends a 400 response with the error message.
 * If the validation succeeds, it calls the next middleware.
 * @param {object} object - The object to validate.
 * @param {import('zod').ZodSchema} schema - The zod schema to validate against.
 * @param {'full' | 'partial'} type - The type of validation to perform ('full' or 'partial').
 * @returns {string[]} - A list of error messages if validation fails, otherwise an empty array.
 */
const parseSchema = (object, schema, type) => {
  let result

  if (type === "full") {
    result = schema.safeParse(object)
  } else {
    result = schema.partial().safeParse(object)
  }

  if (result.error) {
    const errors = result.error.errors.map((error) => error.message)
    return errors
  }

  return []
}

/**
 * Middleware to validate the request body against a zod schema.
 * If the validation fails, it sends a 400 response with the error message.
 * If the validation succeeds, it calls the next middleware.
 * @param {import('zod').ZodSchema} schema - The zod schema to validate against.
 * @param {'full' | 'partial'} [type] - The type of validation to perform ('full' or 'partial').
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void} - The middleware function.
 */
export const validateSchema = (schema, type) => {
  return (req, res, next) => {
    const errors = parseSchema(req.body, schema, type)

    if (errors.length > 0) return res.status(400).json({ errors })
    next()
  }
}