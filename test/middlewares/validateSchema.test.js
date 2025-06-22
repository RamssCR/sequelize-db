// @ts-nocheck
import { describe, expect, test, vi } from 'vitest'
import { validateSchema } from '#middlewares/validateSchema.js'
import { bookSchema } from '#schemas/bookSchema'

describe('validateSchema middleware', () => {
  test('should validate request body against bookSchema', () => {
    const req = {
      body: {
        title: 'Test Book',
        pages: 100,
        chapters: 10,
        AuthorId: '123e4567-e89b-12d3-a456-426614174000',
        CategoryId: '123e4567-e89b-12d3-a456-426614174001',
        GenreId: '123e4567-e89b-12d3-a456-426614174002'
      }
    }
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    const next = vi.fn()

    const middleware = validateSchema(bookSchema, 'body', 'full')
    middleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  test('should return 400 if validation fails', () => {
    const req = {
      body: {
        title: '',
        pages: -1,
        chapters: 0,
        AuthorId: 'invalid-uuid',
        CategoryId: 'invalid-uuid',
        GenreId: 'invalid-uuid'
      }
    }
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    const next = vi.fn()

    const middleware = validateSchema(bookSchema, 'body', 'full')
    middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 400,
      message: expect.any(String)
    })
  })

  test('performs a partial schema validation', () => {
    const req = {
      body: {
        title: 'Partial Test Book',
        pages: 50
      }
    }
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    const next = vi.fn()

    const middleware = validateSchema(bookSchema, 'body', 'partial')
    middleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})