// @ts-nocheck
import { describe, expect, test, vi } from 'vitest'
import { cors } from '#middlewares/cors.js'

describe('CORS Middleware', () => {
  test('should allow cross-origin requests in development and test environments', () => {
    /** @type {import('express').Request} */
    const req = { headers: { origin: 'http://dummy-web-origin.com' } }

    /** @type {import('express').Response} */
    const res = { header: (key, value) => res.headers[key] = value, headers: {} }

    /** @type {import('express').NextFunction} */
    const next = () => {}

    const middleware = cors()
    middleware(req, res, next)

    expect(res.headers['Access-Control-Allow-Origin']).toBe('*')
    expect(res.headers['Access-Control-Allow-Methods']).toBe('GET, POST, PUT, DELETE, OPTIONS')
    expect(res.headers['Access-Control-Allow-Headers']).toBe('Origin, X-Requested-With, Content-Type, Accept')
    expect(res.headers['Access-Control-Allow-Credentials']).toBe('true')
  })
  
  test('should allow specific origin in production environment', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOWED_ORIGINS', 'http://allowed-origin.com')

    /** @type {import('express').Request} */
    const req = { headers: { origin: 'http://allowed-origin.com' } }

    /** @type {import('express').Response} */
    const res = { header: (key, value) => res.headers[key] = value, headers: {} }

    /** @type {import('express').NextFunction} */
    const next = () => {}

    const middleware = cors()
    middleware(req, res, next)

    expect(res.headers['Access-Control-Allow-Origin']).toBe('http://allowed-origin.com')
  })

  test('sends no origin header when no origin is present in the request', () => {
    vi.stubEnv('ALLOWED_ORIGINS', undefined)
    /** @type {import('express').Request} */
    const req = { headers: {} }

    /** @type {import('express').Response} */
    const res = { header: (key, value) => res.headers[key] = value, headers: {} }

    /** @type {import('express').NextFunction} */
    const next = () => {}

    const middleware = cors()
    middleware(req, res, next)

    expect(res.headers['Access-Control-Allow-Origin']).toBeUndefined()
  })

  test('should handle OPTIONS requests', () => {
    /** @type {import('express').Request} */
    const req = { method: 'OPTIONS', headers: { origin: 'http://dummy-web-origin.com' } }

    /** @type {import('express').Response} */
    const res = { header: (key, value) => res.headers[key] = value, headers: {}, sendStatus: (status) => res.status = status }

    /** @type {import('express').NextFunction} */
    const next = () => {}

    const middleware = cors()
    middleware(req, res, next)

    expect(res.status).toBe(204)
  })
})