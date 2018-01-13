// @format

import {
  initWebsocketService,
  emit,
  setConnection,
  setStore,
} from './websocket'
import { NATIVE_EVENTS } from '../constants/websocket'

describe('initWebsocketService', () => {
  const createMockWebSocketService = () => {
    const mockFunc = {
      registerEvent: jest.fn(),
      connect: jest.fn(),
    }
    class MockWebSocketService {
      registerEvent(...args) {
        mockFunc.registerEvent(...args)
      }

      connect() {
        mockFunc.connect()
      }
    }
    return { mockFunc, MockWebSocketService }
  }

  const createMockStore = () => ({
    dispatch: jest.fn(),
  })

  const endpoint = 'ws://localhost/dummy'

  it('registers listeners for websocket native events and calls connect', () => {
    const { mockFunc, MockWebSocketService } = createMockWebSocketService()
    const { mockStore } = createMockStore()
    setStore(mockStore)
    initWebsocketService(endpoint, MockWebSocketService)
    const resultArgs = mockFunc.registerEvent.mock.calls.map(args => args[0])
    expect(resultArgs.length).toBe(Object.keys(NATIVE_EVENTS).length)
    expect(Object.values(NATIVE_EVENTS)).toEqual(
      expect.arrayContaining(resultArgs)
    )
    expect(mockFunc.connect).toHaveBeenCalledTimes(1)
  })
})

describe('emit', () => {
  it('throws an error when connection is not initialized', () => {
    setConnection(null)
    expect(() => {
      emit()
    }).toThrowError()
  })

  it('sends data when connection is initialized', () => {
    const connection = {
      send: jest.fn(),
    }
    setConnection(connection)
    const type = 'TYPE'
    const payload = { a: 1, b: 2 }
    emit(type, payload, true)
    expect(connection.send).toHaveBeenCalledTimes(1)
    expect(connection.send).toHaveBeenCalledWith({ type, payload }, true)
  })
})
