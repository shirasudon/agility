// @format

import { getWebSocketURIFromPageURI } from './uri'

describe('getWebSocketURIFromPageURI', () => {
  it('handles http URI', () => {
    const loc = {
      protocol: 'http:',
      host: 'hoge.com:8080',
    }
    const path = '/chat/ws'
    const expected = 'ws://hoge.com:8080/chat/ws'
    expect(getWebSocketURIFromPageURI(loc, path)).toBe(expected)
  })

  it('handles https', () => {
    const loc = {
      protocol: 'https:',
      host: 'hoge.com:8080',
    }
    const path = '/chat/ws'
    const expected = 'wss://hoge.com:8080/chat/ws'
    expect(getWebSocketURIFromPageURI(loc, path)).toBe(expected)
  })
})
