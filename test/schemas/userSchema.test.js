import { describe, expect, test } from 'vitest'
import { userSchema } from '#schemas/userSchema.js'

describe('userSchema', () => {
  test('should validate a valid user object', () => {
    const validUser = {
      username: 'testuser',
      email: 'user@example.com',
      password: 'securepassword123'
    }
    expect(() => userSchema.parse(validUser)).not.toThrow()
  })
})