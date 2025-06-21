import { describe, expect, test } from 'vitest'
import { chapterQuerySchema } from '#schemas/chapterQuerySchema.js'

describe('chapterQuerySchema', () => {
  test('should validate a valid chapter query object', () => {
    const validQuery = {
      slug: 'some-chapter-slug',
      number: '1'
    }

    expect(() => chapterQuerySchema.parse(validQuery)).not.toThrow()
  })

  test('should throw an error for missing slug', () => {
    const invalidQuery = {
      number: '1'
    }

    expect(() => chapterQuerySchema.parse(invalidQuery)).toThrow('Slug is required')
  })

  test('should throw an error for missing chapter number', () => {
    const invalidQuery = {
      slug: 'some-chapter-slug'
    }

    expect(() => chapterQuerySchema.parse(invalidQuery)).toThrow('Chapter number is required')
  })
})