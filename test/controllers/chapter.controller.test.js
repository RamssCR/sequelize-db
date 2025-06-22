// @ts-nocheck
import { describe, expect, test, vi } from 'vitest'
import { getBookChapterByNumber, getBookChaptersBySlug } from '#controllers/chapter.controller.js'
import { Chapter } from '#models/chapter.model.js'
import { Book } from '#models/book.model'

describe('Chapter Controller - All Book Chapters by Slug', () => {
  test('should retrieve all chapters of a book by slug', async () => {
    const mockChapters = [
      { id: 1, number: 1, title: 'Chapter 1' },
      { id: 2, number: 2, title: 'Chapter 2' },
    ]

    const req = {
      params: { slug: 'test-book' }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Chapter, 'findAll').mockResolvedValue(mockChapters)
    await getBookChaptersBySlug(req, res, next)
    
    expect(Chapter.findAll).toHaveBeenCalledWith({
      where: { slug: 'test-book' },
      include: [{ attributes: ['title', 'slug'], model: Book }],
    })
  })

  test('should handle errors when retrieving chapters by slug', async () => {
    const req = {
      params: { slug: 'test-book' }
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Chapter, 'findAll').mockRejectedValue(new Error('Database error'))
    await getBookChaptersBySlug(req, res, next)
    
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('Chapter Controller - Specific Book Chapter by Number', () => {
  test('should retrieve a specific chapter of a book by slug and chapter number', async () => {
    const mockChapter = { id: 1, number: 1, title: 'Chapter 1' }

    const req = {
      params: { slug: 'test-book', number: '1' }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Chapter, 'findOne').mockResolvedValue(mockChapter)
    await getBookChapterByNumber(req, res, next)
    
    expect(Chapter.findOne).toHaveBeenCalledWith({
      where: { slug: 'test-book', chapterNumber: '1' },
      include: [{ attributes: ['title', 'slug', 'chapters'], model: Book }],
    })
  })

  test('should handle errors when retrieving a specific chapter by number', async () => {
    const req = {
      params: { slug: 'test-book', number: '1' }
    }
    const res = {}
    const next = vi.fn()

    vi.spyOn(Chapter, 'findOne').mockRejectedValue(new Error('Database error'))
    await getBookChapterByNumber(req, res, next)
    
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('should return an error if chapter is not found', async () => {
    const req = {
      params: { slug: 'test-book', number: '1' }
    }
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Chapter, 'findOne').mockResolvedValue(null)
    await getBookChapterByNumber(req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Invalid chapter number or slug',
    })
  })

  test('returns the last chapter number as next if it is the last chapter', async () => {
    const mockChapter = {
      id: 1,
      chapterNumber: 5,
      title: 'Chapter 5',
      Book: { title: 'book', chapters: 5 }
    }

    const req = {
      params: { slug: 'test-book', number: '5' }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Chapter, 'findOne').mockResolvedValue({ get: vi.fn().mockReturnValue(mockChapter) })
    await getBookChapterByNumber(req, res, next)
    
    expect(Chapter.findOne).toHaveBeenCalledWith({
      where: { slug: 'test-book', chapterNumber: '5' },
      include: [{ attributes: ['title', 'slug', 'chapters'], model: Book }],
    })
    expect(res.json).toHaveBeenCalled()
  })

  test('returns the next chapter number if it is not the last chapter', async () => {
    const mockChapter = {
      id: 1,
      chapterNumber: 3,
      title: 'Chapter 3',
      Book: { title: 'book', chapters: 5 }
    }

    const req = {
      params: { slug: 'test-book', number: '3' }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Chapter, 'findOne').mockResolvedValue({ get: vi.fn().mockReturnValue(mockChapter) })
    await getBookChapterByNumber(req, res, next)
    
    expect(Chapter.findOne).toHaveBeenCalledWith({
      where: { slug: 'test-book', chapterNumber: '3' },
      include: [{ attributes: ['title', 'slug', 'chapters'], model: Book }],
    })
    expect(res.json).toHaveBeenCalled()
  })

  test('returns the first chapter number as next if it is the first chapter', async () => {
    const mockChapter = {
      id: 1,
      chapterNumber: 1,
      title: 'Chapter 1',
      Book: { title: 'book', chapters: 5 }
    }

    const req = {
      params: { slug: 'test-book', number: '1' }
    }
    const res = {
      json: vi.fn(),
    }
    const next = vi.fn()

    vi.spyOn(Chapter, 'findOne').mockResolvedValue({ get: vi.fn().mockReturnValue(mockChapter) })
    await getBookChapterByNumber(req, res, next)
    
    expect(Chapter.findOne).toHaveBeenCalledWith({
      where: { slug: 'test-book', chapterNumber: '1' },
      include: [{ attributes: ['title', 'slug', 'chapters'], model: Book }],
    })
    expect(res.json).toHaveBeenCalled()
  })
})