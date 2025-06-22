import { beforeAll, vi } from 'vitest'

beforeAll(() => {
  vi.stubEnv('NODE_ENV', 'test')
  vi.stubEnv('DB_HOST', 'localhost')
  vi.stubEnv('DB_PORT', '5432')
  vi.stubEnv('DB_NAME', 'test_db')
  vi.stubEnv('DB_USER', 'test_user')
  vi.stubEnv('DB_PASSWORD', 'test_password')
  vi.stubEnv('JWT_SECRET', 'test_secret_that_is_very_long_and_secure_at_least_32_characters')
  vi.stubEnv('ALLOWED_ORIGINS', 'https://dummy-web-origin.com')
})