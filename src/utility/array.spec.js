// @format

import { insertOrdered } from './array'

describe('insertOrdered', () => {
  it('returned sorted array when inserted a new element', () => {
    const input = [2, 4, 6, 8, 10]
    const expected = [2, 4, 6, 7, 8, 10]
    expect(insertOrdered(input, 7)).toEqual(expected)
  })

  it('returned sorted array when inserted a new element to which there is already the same element', () => {
    const input = [2, 4, 6, 7, 8, 10]
    const expected = [2, 4, 6, 7, 7, 8, 10]
    expect(insertOrdered(input, 7)).toEqual(expected)
  })
})
