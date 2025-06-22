// @ts-nocheck
import { describe, expect, test } from 'vitest'
import { errorHandler } from '#middlewares/errorHandler'

describe('Error Handler Middleware', () => {
  test('should handle errors and respond with status 500', () => {
    /** @type {import('express').Request} */
    const req = {}

    /** @type {import('express').Response} */
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    /** @type {import('express').NextFunction} */
    const next = vi.fn()

    const error = new Error('Test error')

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      code: 500,
      status: 'error',
      message: 'Test error'
    })
  })
})