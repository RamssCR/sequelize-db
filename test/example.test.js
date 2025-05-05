import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

describe('example test suite', () => {
  test('should correctly add two numbers', () => {
    const result = 2 + 2
    assert.equal(result, 4)
  })

  test('should properly handle string concatenation', () => {
    const str1 = 'Hello'
    const str2 = 'World'
    assert.equal(str1 + ' ' + str2, 'Hello World')
  })

  test('should verify array operations', () => {
    const arr = [1, 2, 3]
    arr.push(4)
    assert.equal(arr.length, 4)
    assert.deepEqual(arr, [1, 2, 3, 4])
  })

  test('should check object properties', () => {
    const obj = { name: 'Test', value: 42 }
    assert.equal(obj.name, 'Test')
    assert.equal(obj.value, 42)
  })

  test('should handle async operations', async () => {
    const promise = Promise.resolve('success')
    const result = await promise
    assert.equal(result, 'success')
  })

  test('should validate error handling', () => {
    assert.throws(
      () => {
        throw new Error('Test error')
      },
      {
        name: 'Error',
        message: 'Test error'
      }
    )
  })
})