import { describe, expect, test } from 'vitest'
import { createToken } from '#libs/jwt.js'

describe('JWT Token Creation', () => {
  test('should create a valid JWT token', async () => {
    const payload = { userId: '12345' }
    const token = await createToken(payload)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  test('should throw an error if JWT_SECRET is not defined', async () => {
    const originalSecret = process.env.JWT_SECRET
    delete process.env.JWT_SECRET

    await expect(createToken({ userId: '12345' })).rejects.toThrow()

    process.env.JWT_SECRET = originalSecret
  })
})