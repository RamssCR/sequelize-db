import { describe, expect, test } from 'vitest'
import { bookSchema } from '#schemas/bookSchema.js'

describe('bookSchema', () => {
  test('should validate a valid book object', () => {
    const validBook = {
      title: 'The Great Gatsby',
      subtitle: 'A Novel',
      synopsis: 'A story about the American dream.',
      content: 'This is the content of the book.',
      cover: 'https://example.com/cover.jpg',
      pages: 180,
      chapters: 10,
      AuthorId: '123e4567-e89b-12d3-a456-426614174000',
      CategoryId: '123e4567-e89b-12d3-a456-426614174001',
      GenreId: '123e4567-e89b-12d3-a456-426614174002',
    }

    expect(() => bookSchema.parse(validBook)).not.toThrow()
  })
})