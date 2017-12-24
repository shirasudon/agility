// @format

import { insertOrdered } from './array'

describe('insertOrdered', () => {
  it('returned sorted array when inserted a new element to the front', () => {
    const input = [4, 5, 6]
    const expected = [2, 4, 5, 6]
    expect(insertOrdered(input, 2)).toEqual(expected)
  })

  it('returned sorted array when inserted a new element to the last', () => {
    const input = [4, 5, 6]
    const expected = [4, 5, 6, 7]
    expect(insertOrdered(input, 7)).toEqual(expected)
  })

  it('returned sorted array when inserted a new element to which there is already the same element', () => {
    const input = [2, 4, 6, 7, 8, 10]
    const expected = [2, 4, 6, 7, 7, 8, 10]
    expect(insertOrdered(input, 7)).toEqual(expected)
  })
})
