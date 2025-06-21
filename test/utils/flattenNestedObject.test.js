import { describe, expect, test } from 'vitest'
import { flattenNestedObject } from '#utils/flattenNestedObject.js'

describe('flattenNestedObject', () => {
  test('should flatten a nested object', () => {
    const nestedObject = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    }
    const expected = {
      'a': 1,
      'b': {
        'c': 2,
        'd': {
          'e': 3,
        },
      },
    }
    expect(flattenNestedObject(nestedObject)).toEqual(expected)
  })

  test('should handle objects with no nested properties', () => {
    const nestedObject = { a: 1, b: 2 }
    const expected = { a: 1, b: 2 }
    expect(flattenNestedObject(nestedObject)).toEqual(expected)
  })

  test('should flatten nested properties when specified', () => {
    const nestedObject = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    }
    const expected = {
      'a': 1,
    }
    expect(flattenNestedObject(nestedObject, ['b'])).toEqual(expected)
  })

  test('returns the passed property as a third parameter', () => {
    const nestedObject = {
      a: 1,
      B: {
        c: 2,
        d: 3
      },
    }
    const expected = {
      'a': 1,
      'b': 3,
    }
    expect(flattenNestedObject(nestedObject, ['B'], ['c', 'd'])).toEqual(expected)
  })
})