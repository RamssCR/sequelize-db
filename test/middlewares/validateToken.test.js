// @ts-nocheck
import { beforeEach, describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'

describe('Token validation middleware', () => {
  let validateToken
  let mockToken = jwt.sign({ userId: '12345' }, 'test_secret_that_is_very_long_and_secure_at_least_32_characters')

  beforeEach(async () => {
    vi.resetModules()
    await vi.doMock('jsonwebtoken', async (importOriginal) => {
      const mod = await importOriginal()
      return {
        ...mod,
        verify: vi.fn((token, secret, callback) => {
          if (token === mockToken) {
            callback(null, { userId: '12345' })
          } else {
            callback(new Error('Invalid token'), null)
          }
        })
      }
    })

    const mod = await import('#middlewares/validateToken.js')
    validateToken = mod.validateToken
  })

  test('should validate the token and call next', async () => {
    /** @type {import('express').Request} */
    const req = {
      cookies: {
        token: mockToken
      }
    }

    /** @type {import('express').Response} */
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    /** @type {import('express').NextFunction} */
    const next = vi.fn()

    validateToken(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  test('should return 401 if token is missing', async () => {
    /** @type {import('express').Request} */
    const req = {
      cookies: {}
    }

    /** @type {import('express').Response} */
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    /** @type {import('express').NextFunction} */
    const next = vi.fn()

    validateToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Unauthorized access to this account'
    })
  })

  test('should return 401 if token is invalid', async () => {
    /** @type {import('express').Request} */
    const req = {
      cookies: {
        token: 'invalid-token'
      }
    }

    /** @type {import('express').Response} */
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    /** @type {import('express').NextFunction} */
    const next = vi.fn()

    validateToken(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
  })
})