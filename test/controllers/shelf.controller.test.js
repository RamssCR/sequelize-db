// @ts-nocheck
import { describe, expect, test, vi } from 'vitest'
import {
  addBookToShelf,
  getAllShelfBooks,
  getShelfBookBySlug,
  removeBookFromShelf,
  getShelfBooksIds,
} from '#controllers/shelf.controller.js'
import {
  Shelf,
  Book,
} from '#models/book.model.js'

describe('Shelf Controller - Add a Book to Shelf', () => {
  test('should add a book to the shelf', async () => {
    const mockBook = { id: 1, title: 'Test Book', slug: 'test-book' }
    const req = {
      body: { bookId: 1 },
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue({ dataValues: mockBook })

    vi.spyOn(Shelf, 'create').mockResolvedValue(mockBook)
    await addBookToShelf(req, res, next)

    expect(Shelf.create).toHaveBeenCalledWith({
      UserId: 1,
      BookId: 1
    })
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Book added to shelf successfully',
      data: mockBook
    })
  })

  test('should handle errors when adding a book to the shelf', async () => {
    const req = {
      body: { bookId: 1 },
      user: { id: 1 }
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Shelf, 'create').mockRejectedValue(new Error('Database error'))
    await addBookToShelf(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('returns an empty object when retrieving a book from the book model', async () => {
    const req = {
      body: { slug: 1 },
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue(null)
    vi.spyOn(Shelf, 'create').mockResolvedValue({})

    await addBookToShelf(req, res, next)

    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Book not found in the books collection'
    })
  })
})

describe('Shelf Controller - Get All Shelf Books', () => {
  test('should retrieve all books from the shelf', async () => {
    const req = {
      query: { page: 1, limit: 10 },
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Shelf, 'findAndCountAll').mockResolvedValue({
      count: 2,
      rows: [
        { get: () => ({ Book: { title: 'Libro 1', Author: { name: 'Autor' }, Genre: { name: 'Género' }, status: 'READING' } }) },
        { get: () => ({ Book: { title: 'Libro 2', Author: { name: 'Autor' }, Genre: { name: 'Género' }, status: 'FINISHED' } }) },
      ]
    })

    await getAllShelfBooks(req, res, next)

    expect(res.json).toHaveBeenCalled()
  })

  test('retrieves all books with pagination parameters as undefined', async () => {
    const req = {
      query: {},
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Shelf, 'findAndCountAll').mockResolvedValue({
      count: 2,
      rows: [
        { get: () => ({ Book: { title: 'Libro 1', Author: { name: 'Autor' }, Genre: { name: 'Género' }, status: 'READING' } }) },
        { get: () => ({ Book: { title: 'Libro 2', Author: { name: 'Autor' }, Genre: { name: 'Género' }, status: 'FINISHED' } }) },
      ]
    })

    await getAllShelfBooks(req, res, next)

    expect(res.json).toHaveBeenCalled()
  })

  test('should handle errors when retrieving all shelf books', async () => {
    const req = {
      query: { page: 1, limit: 10 },
      user: { id: 1 }
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Shelf, 'findAll').mockRejectedValue(new Error('Database error'))

    await getAllShelfBooks(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('Shelf Controller - Get Shelf Book by Slug', () => {
  test('should retrieve a book from the shelf by slug', async () => {
    const req = {
      params: { slug: 'test-book' },
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockResolvedValue({
      get: () => ({
        id: 1,
        title: 'Test Book',
        slug: 'test-book',
        Author: { id: '', name: '' },
        Genre: { id: '', name: '' }
      })
    })

    vi.spyOn(Shelf, 'findOne').mockResolvedValue({
      get: () => ({
        Book: {
          id: 1,
          title: 'Test Book',
          slug: 'test-book',
          Author: { id: '', name: '' },
          Genre: { id: '', name: '' },
        },
        status: 'reading'
      })
    })

    await getShelfBookBySlug(req, res, next)

    expect(res.json).toHaveBeenCalled()
  })

  test('returns 404 when book is not found in the shelf', async () => {
    const req = {
      params: { slug: 'non-existent-book' },
      user: { id: 1 }
    }

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }

    const next = vi.fn()

    vi.spyOn(Shelf, 'findOne').mockResolvedValue(null)
    await getShelfBookBySlug(req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Book not found in user shelf'
    })
  })

  test('should handle errors when retrieving a book by slug', async () => {
    const req = {
      params: { slug: 'test-book' },
      user: { id: 1 }
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Book, 'findOne').mockRejectedValue(new Error('Database error'))

    await getShelfBookBySlug(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('Shelf Controller - Remove Book from Shelf', () => {
  test('should remove a book from the shelf', async () => {
    const req = {
      params: { slug: 'test-book' },
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    const next = vi.fn()

    vi.spyOn(Shelf, 'findOne').mockResolvedValue({
      destroy: vi.fn(),
      dataValues: { id: 1, title: 'Test Book', slug: 'test-book' }
    })

    await removeBookFromShelf(req, res, next)
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Book removed from shelf successfully'
    })
  })

  test('should handle errors when removing a book from the shelf', async () => {
    const req = {
      params: { slug: 'test-book' },
      user: { id: 1 }
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Shelf, 'findOne').mockRejectedValue(new Error('Database error'))

    await removeBookFromShelf(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('returns 404 when book is not found in the shelf', async () => {
    const req = {
      params: { slug: 'non-existent-book' },
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    const next = vi.fn()
    vi.spyOn(Shelf, 'findOne').mockResolvedValue(null)
    await removeBookFromShelf(req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Book not found in user shelf'
    })
  })
})

describe('Shelf Controller - Get Shelf Books IDs', () => {
  test('should retrieve all shelf book IDs', async () => {
    const req = {
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()
    vi.spyOn(Shelf, 'findAll').mockResolvedValue([
        { dataValues: { BookId: 1 } },
        { dataValues: { BookId: 2 } }
      ])
    await getShelfBooksIds(req, res, next)
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Book IDs retrieved successfully',
      data: [1, 2]
    })
  })

  test('should handle errors when retrieving shelf book IDs', async () => {
    const req = {
      user: { id: 1 }
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Shelf, 'findAll').mockRejectedValue(new Error('Database error'))

    await getShelfBooksIds(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('returns an empty array when no books are found in the shelf', async () => {
    const req = {
      user: { id: 1 }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()
    vi.spyOn(Shelf, 'findAll').mockResolvedValue([])
    await getShelfBooksIds(req, res, next)
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'No books found in user shelf',
      data: []
    })
  })
})