// @format

import { WebSocketService } from '../service/WebSocketService'

import { SEND_CHAT_MESSAGE, SEND_MESSAGE_READ } from '../actions/actionTypes'
import { chatActionCreator } from '../actions'
import startMockServer from '../mock/mockServer'

export function initializeWebSocket() {
  const socketURI = 'ws://localhost:8080/chat/ws'
  if (process.env.MOCK) {
    startMockServer(socketURI)
  }
  return socketURI
}

// returns a function to be called when receiving a message through websocket
export const createOnMessage = store => event => {
  console.log(event)
  const { type, data } = event.data
  switch (type) {
    case SEND_CHAT_MESSAGE:
      const state = store.getState()
      const entities = state.get('entities')
      const currentRoomId = state.get('currentRoomId')
      if (entities.getIn(['rooms', 'byId', data.roomId, 'initialFetch'])) {
        store.dispatch(chatActionCreator.receiveMessage(data))
      }
      if (currentRoomId !== data.roomId) {
        store.dispatch(chatActionCreator.existUnreadMessage(data.roomId))
      }
      break
    case SEND_MESSAGE_READ:
      store.dispatch(
        chatActionCreator.receiveMessageRead(data.messageId, data.userId)
      )
      break
    default:
      break
  }
}

export const createOnClose = store => event => {}

export const createOnOpen = store => event => {
  // TODO: initialize all entity data
  const { dispatch } = store
  const state = store.getState()
  const myId = state.getIn(['auth', 'myId'])

  if (myId) {
    dispatch(chatActionCreator.fetchRooms(myId))
    dispatch(chatActionCreator.fetchFriends(myId))
  }
}

export const createOnError = store => event => {}

export const createWebSocketMiddleware = (
  endpoint,
  wsService = WebSocketService
) => store => {
  const options = {
    reconnectionDelayGrowFactor: 2,
  }
  const connection = new wsService(endpoint, options)
  connection.registerEvent('onopen', createOnOpen(store))
  connection.registerEvent('onmessage', createOnMessage(store))
  connection.registerEvent('onclose', createOnClose(store))
  connection.registerEvent('onerror', createOnError(store))
  connection.connect()

  return next => action => {
    switch (action.type) {
      case SEND_CHAT_MESSAGE:
        connection.send(action, true)
        break
      case SEND_MESSAGE_READ:
        connection.send(action, true)
        break
      default:
        break
    }
    next(action)
  }
}

export default createWebSocketMiddleware
