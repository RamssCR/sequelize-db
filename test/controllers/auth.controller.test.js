// @ts-nocheck
import { describe, expect, test, vi } from 'vitest'
import {
  login,
  logout,
  profile,
  register,
} from '#controllers/auth.controller.js'
import { User } from '#models/user.model.js'
import bcryptjs from 'bcryptjs'

describe('Auth Controller - Register', () => {
  test('should register a new user', async () => {
    const mockUser = { username: 'testuser', email: 'example@example.com', id: 1 }
    const req = {
      body: {
        username: mockUser.username,
        email: mockUser.email,
        password: 'password123',
      },
    }
    const res = {
      json: vi.fn(),
      cookie: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockResolvedValue(null)
    vi.spyOn(User, 'create').mockResolvedValue({ dataValues: mockUser })

    await register(req, res, next)

    expect(User.findOne).toHaveBeenCalled()
    expect(User.create).toHaveBeenCalledWith({
      username: mockUser.username,
      email: mockUser.email,
      password: expect.any(String),
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String))
  })

  test('should return error if user already exists', async () => {
    const mockUser = { username: 'testuser', email: 'example@example.com', id: 1 }
    const req = {
      body: {
        username: mockUser.username,
        email: mockUser.email,
        password: 'password123',
      },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockResolvedValue({ dataValues: mockUser })

    await register(req, res, next)
    expect(User.findOne).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('should handle errors during registration', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'example@example.com',
        password: 'password123',
      },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'))

    await register(req, res, next)
    expect(User.findOne).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('Auth Controller - Login', () => {
  test('should log in a user with valid credentials', async () => {
    const mockUser = { id: 1, email: 'example@example.com', password: '$2a$12$zzFZYGYjrUXLBeiJle1li.kFcxBT65N.fIwEzuVcTAV2Y3h8ZAQhG' }
    const req = {
      body: {
        email: mockUser.email,
        password: 'hashedpassword',
      },
    }
    const res = {
      json: vi.fn(),
      cookie: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockResolvedValue({ dataValues: mockUser })
    vi.spyOn(bcryptjs, 'compare').mockResolvedValue(true)

    await login(req, res, next)
    expect(User.findOne).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test('should return error for invalid credentials', async () => {
    const req = {
      body: {
        email: 'example@example.com',
        password: 'wrongpassword',
      },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockResolvedValue({ dataValues: { email: 'example@example.com', password: 'hashedpassword' } })
    vi.spyOn(bcryptjs, 'compare').mockResolvedValue(false)

    await login(req, res, next)
    expect(User.findOne).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Incorrect email or password',
    })
  })

  test('should handle errors during login', async () => {
    const req = {
      body: {
        email: 'example@example.com',
        password: 'password123',
      },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'))
    await login(req, res, next)
    expect(User.findOne).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('returns error if user does not exist', async () => {
    const req = {
      body: {
        email: 'example@example.com',
        password: 'password123',
      },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockResolvedValue(null)
    await login(req, res, next)

    expect(User.findOne).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Incorrect email or password',
    })
  })
})

describe('Auth Controller - Profile', () => {
  test('should return user profile', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'example@example.com' }
    const req = {
      user: { id: mockUser.id },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockResolvedValue({ dataValues: mockUser })

    await profile(req, res, next)
    expect(User.findOne).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
  })

  test('should handle errors during profile retrieval', async () => {
    const req = {
      user: { id: 1 },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'))

    await profile(req, res, next)
    expect(User.findOne).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('should return error if user does not exist', async () => {
    const req = {
      user: { id: 1 },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()
    vi.spyOn(User, 'findOne').mockResolvedValue(null)

    await profile(req, res, next)
    expect(User.findOne).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalled()
  })
})

describe('Auth Controller - Logout', () => {
  test('should log out user and clear cookie', async () => {
    const req = {}
    const res = {
      sendStatus: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()

    await logout(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith('token', '', { expires: new Date(0) })
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  test('should handle errors during logout', async () => {
    const req = {}
    const res = {
      json: vi.fn(),
      sendStatus: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()

    await logout(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})