// @ts-nocheck
import { describe, expect, test, vi } from 'vitest'
import {
  createBook,
  getAllBooks,
  getBookBySlug,
  updateBook,
  deleteBook,
} from '#controllers/book.controller.js'
import { Book } from '#models/book.model.js'

describe('Book Controller - Create a Book', () => {
  test('should create a book', async () => {
    const mockBook = { id: 1, title: 'Test Book', slug: 'test-book' }
    const req = {
      body: { title: 'Test Book', authorId: 1, genreId: 1 },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'create').mockResolvedValue(mockBook)
    await createBook(req, res, next)

    expect(Book.create).toHaveBeenCalledWith({
      title: 'Test Book',
      slug: 'test-book',
      authorId: 1,
      genreId: 1,
    })
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Book created successfully',
      data: mockBook,
    })
  })

  test('should handle errors when creating a book', async () => {
    const req = {
      body: { title: 'Test Book', authorId: 1, genreId: 1 },
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Book, 'create').mockRejectedValue(new Error('Database error'))
    await createBook(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('Book Controller - Get All Books', () => {
  test('should retrieve all books', async () => {
    const mockBooks = [{ get: vi.fn(() => ({ id: 1, title: 'Test Book', slug: 'test-book' })) }]
    const req = {
      query: {},
      genre: 'all',
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findAndCountAll').mockResolvedValue({
      rows: mockBooks,
      count: mockBooks.length,
    })
    await getAllBooks(req, res, next)

    expect(Book.findAndCountAll).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
  })

  test('should handle errors when retrieving all books', async () => {
    const req = {
      query: {},
      genre: 'all',
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Book, 'findAll').mockRejectedValue(new Error('Database error'))
    await getAllBooks(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('Book Controller - Get Book by Slug', () => {
  test('should retrieve a book by slug', async () => {
    const mockBook = { get: vi.fn(() => ({ id: 1, title: 'Test Book', slug: 'test-book' })) }
    const req = {
      params: { slug: 'test-book' },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue(mockBook)
    await getBookBySlug(req, res, next)

    expect(Book.findOne).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
  })

  test('should handle errors when retrieving a book by slug', async () => {
    const req = {
      params: { slug: 'test-book' },
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockRejectedValue(new Error('Database error'))
    await getBookBySlug(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('should return 404 if book not found', async () => {
    const req = {
      params: { slug: 'non-existent-book' },
    }
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue(null)
    await getBookBySlug(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid book slug',
    })
  })
})

describe('Book Controller - Update a Book', () => {
  test('should update a book', async () => {
    const mockBook = { id: 1, title: 'Updated Book', slug: 'updated-book' }
    const req = {
      params: { slug: 'test-book' },
      body: { title: 'Updated Book', authorId: 1, genreId: 1 },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue({
      ...mockBook,
      save: vi.fn().mockResolvedValue({ get: vi.fn(() => mockBook) }),
      update: vi.fn().mockResolvedValue({ get: vi.fn(() => mockBook) }),
    })
    await updateBook(req, res, next)

    expect(Book.findOne).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
  })

  test('should handle errors when updating a book', async () => {
    const req = {
      params: { slug: 'test-book' },
      body: { title: 'Updated Book', authorId: 1, genreId: 1 },
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockRejectedValue(new Error('Database error'))
    await updateBook(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('returns 400 if book slug is invalid', async () => {
    const req = {
      params: { slug: 'invalid-book-slug' },
      body: { title: 'Updated Book', authorId: 1, genreId: 1 },
    }
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue(null)
    await updateBook(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid book slug',
    })
  })
})

describe('Book Controller - Delete a Book', () => {
  test('deletes a book successfully', async () => {
    const mockBook = { id: 1, title: 'Test Book', slug: 'test-book' }
    const req = {
      params: { slug: 'test-book' },
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue({
      destroy: vi.fn(),
      dataValues: mockBook,
      get: vi.fn(() => mockBook),
    })
    await deleteBook(req, res, next)

    expect(Book.findOne).toHaveBeenCalledWith({ where: { slug: 'test-book' } })
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Book deleted successfully',
    })
  })

  test('should handle errors when deleting a book', async () => {
    const req = {
      params: { slug: 'test-book' },
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockRejectedValue(new Error('Database error'))
    await deleteBook(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('returns 400 if book slug is invalid', async () => {
    const req = {
      params: { slug: 'invalid-book-slug' },
    }
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue(null)
    await deleteBook(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid book slug',
    })
  })
})