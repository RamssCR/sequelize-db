import { z } from "zod"

/**
 * Validates a request body against a given zod schema.
 * If the validation fails, it sends a 400 response with the error message.
 * If the validation succeeds, it calls the next middleware.
 * @param {Record<string, unknown>} object - The object to validate.
 * @param {z.ZodSchema} schema - The zod schema to validate against.
 * @param {'full' | 'partial'} type - The type of validation to perform ('full' or 'partial').
 * @returns {string} - A list of error messages if validation fails, otherwise an empty array.
 */
const parseSchema = (object, schema, type = "full") => {
  let result

  if (type === "partial" && schema instanceof z.ZodObject) {
    result = schema.partial().safeParse(object)
  } else {
    result = schema.safeParse(object)
  }

  if (result.error) {
    const error = result.error?.errors[0].message ?? ""
    return error
  }

  return ""
}

/**
 * Middleware to validate the request body against a zod schema.
 * If the validation fails, it sends a 400 response with the error message.
 * If the validation succeeds, it calls the next middleware.
 * @param {z.ZodSchema} schema - The zod schema to validate against.
 * @param {'full' | 'partial'} [type] - The type of validation to perform ('full' or 'partial').
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void} - The middleware function.
 */
export const validateSchema = (schema, type = "full") => {
  return (req, res, next) => {
    const error = parseSchema(req.body, schema, type)

    if (error !== '') return res.status(400).json({ 
      status: 'error',
      code: 400,
      message: error,
    })
    next()
  }
}