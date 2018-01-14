// @format

import WebSocketService from './websocket'
import { NATIVE_EVENTS } from '../constants/websocket'

beforeEach(() => {
  WebSocketService.clear()
})

describe('initWebsocketService', () => {
  const createMockWebSocketClass = () => {
    const mockFunc = {
      registerEvent: jest.fn(),
      connect: jest.fn(),
    }
    class MockWebSocketClass {
      registerEvent(...args) {
        mockFunc.registerEvent(...args)
      }

      connect() {
        mockFunc.connect()
      }
    }
    return { mockFunc, MockWebSocketClass }
  }

  const createMockStore = () => ({
    dispatch: jest.fn(),
  })

  const endpoint = 'ws://localhost/dummy'

  it('registers listeners for websocket native events and calls connect', () => {
    const { mockFunc, MockWebSocketClass } = createMockWebSocketClass()
    const { mockStore: store } = createMockStore()

    WebSocketService.init(store, endpoint, MockWebSocketClass)

    const resultArgs = mockFunc.registerEvent.mock.calls.map(args => args[0])
    expect(resultArgs.length).toBe(Object.keys(NATIVE_EVENTS).length)
    expect(Object.values(NATIVE_EVENTS)).toEqual(
      expect.arrayContaining(resultArgs)
    )
  })
})

describe('emit', () => {
  it('throws an error when service is not initialized', () => {
    expect(() => {
      WebSocketService.emit()
    }).toThrowError()
  })

  it('sends data when connection is initialized', () => {
    const instance = {
      connection: {
        send: jest.fn(),
      },
    }
    WebSocketService.setInstance(instance)
    const type = 'TYPE'
    const payload = { a: 1, b: 2 }
    WebSocketService.emit(type, payload, true)
    expect(instance.connection.send).toHaveBeenCalledTimes(1)
    expect(instance.connection.send).toHaveBeenCalledWith(
      { type, payload },
      true
    )
  })
})
