// @format

import { BufferingWebSocket } from './BufferingWebSocket'
import { NATIVE_EVENTS } from '../constants/websocket'

it('send data if the connection is open', () => {
  const mockFn = {
    send: jest.fn(),
  }
  const mockSend = jest.fn()
  class WebSocketKlass {
    constructor(endpoint, protocols, options) {
      this.readyState = 1
    }
    send(...args) {
      mockFn.send(...args)
    }
  }

  const conn = new BufferingWebSocket('ws://dummy', {}, WebSocketKlass)
  conn.connect()
  const data = { a: 1, b: 2 }
  conn.send(data)
  expect(mockFn.send).toHaveBeenCalledWith(JSON.stringify(data))
})

it('buffers data if the connection is not open', () => {
  const mockFn = {
    send: jest.fn(),
  }
  class WebSocketKlass {
    constructor(endpoint, protocols, options) {
      this.readyState = 2 // not open
    }
    send(...args) {
      mockFn.send(...args)
    }
  }

  const conn = new BufferingWebSocket('ws://dummy', {}, WebSocketKlass)
  conn.connect()
  const data = { a: 1, b: 2 }
  conn.send(data, true) // buffer if enableBuffer is true
  conn.send(data, false) // Does not buffer if enableBuffer is false
  conn.send(data) // Does not buffer by default
  expect(mockFn.send).not.toHaveBeenCalled()
  expect(conn.buffer).toHaveLength(1)
})

it('only accepts onopen, onerror, onclose, onmessae for event listers', () => {
  const mockFn = {
    onopen: jest.fn(),
    onclose: jest.fn(),
    onerror: jest.fn(),
    onmessage: jest.fn(),
  }

  const conn = new BufferingWebSocket('ws://dummy', {})
  conn.registerEvent(NATIVE_EVENTS.onopen, mockFn.onopen)
  conn.registerEvent(NATIVE_EVENTS.onclose, mockFn.onclose)
  conn.registerEvent(NATIVE_EVENTS.onerror, mockFn.onerror)
  conn.registerEvent(NATIVE_EVENTS.onmessage, mockFn.onmessage)
  expect(() => {
    conn.registerEvent('hoge')
  }).toThrowError()
})

it('initializes event listers properly', () => {
  const mockFn = {
    onopen: jest.fn(),
    onclose: jest.fn(),
    onerror: jest.fn(),
    onmessage: jest.fn(),
    send: jest.fn(),
  }

  class WebSocketKlass {
    constructor(endpoint, protocols, options) {
      this.readyState = 2 // not open
    }
    send(...args) {
      mockFn.send(...args)
    }
  }

  const conn = new BufferingWebSocket('ws://dummy', {}, WebSocketKlass)
  conn.registerEvent(NATIVE_EVENTS.onopen, mockFn.onopen)
  conn.registerEvent(NATIVE_EVENTS.onclose, mockFn.onclose)
  conn.registerEvent(NATIVE_EVENTS.onerror, mockFn.onerror)
  conn.registerEvent(NATIVE_EVENTS.onmessage, mockFn.onmessage)
  conn.connect()

  const data = [{ a: 1, b: 2 }, { c: 3, d: 4 }]

  data.forEach(obj => {
    conn.send(obj, true)
  })

  const event = {
    desc: 'some random event',
  }

  expect(conn.buffer).toHaveLength(2)
  conn.ws.readyState = 1
  conn.ws.onopen(event)
  expect(conn.buffer).toHaveLength(0) // buffered data sent on successful reconnection?

  conn.ws.onclose(event)
  expect(mockFn.onclose).toHaveBeenCalledWith(event)

  conn.ws.onmessage(event)
  expect(mockFn.onmessage).toHaveBeenCalledWith(event)

  conn.ws.onerror(event)
  expect(mockFn.onerror).toHaveBeenCalledWith(event)
})
