// @format

import RefsStore from './RefsStore'

it('stores a value on specified key', () => {
  const rs = new RefsStore()
  rs.store('hello', 'world')
  expect(rs.hello).toBe('world')
})
