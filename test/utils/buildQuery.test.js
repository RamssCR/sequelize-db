import { describe, expect, test, vi } from 'vitest'
import { buildQuery } from '#utils/buildQuery.js'
import { Author } from '#models/author.model.js'

vi.mock('#models/author.model.js', () => ({
  Author: {
    attributes: ['id', 'name'],
  },
}))

describe('buildQuery', () => {
  test('should return a query object with the model and attributes', () => {
    const query = buildQuery(Author)
    expect(query).toEqual({
      model: Author,
      attributes: ['id', 'name'],
    })
  })

  test('should return a query object with where clause when slug is provided', () => {
    const slug = 'test-slug'
    const query = buildQuery(Author, slug)
    expect(query).toEqual({
      model: Author,
      attributes: ['id', 'name'],
      where: { slug },
      required: true,
    })
  })

  test('should return a query object without where clause when slug is not provided', () => {
    const query = buildQuery(Author, undefined)
    expect(query).toEqual({
      model: Author,
      attributes: ['id', 'name'],
    })
  })
})