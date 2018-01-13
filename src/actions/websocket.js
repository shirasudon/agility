// @format

import { NATIVE_EVENTS } from '../constants/websocket'
import {
  SEND_CHAT_MESSAGE,
  RECEIVE_MESSAGE_READ,
  RECEIVE_CREATE_ROOM,
  RECEIVE_DELETE_ROOM,
} from '../constants/chat'
import { chatActionCreator } from '../actions'
import * as transformer from '../service/transformer'

let cac = chatActionCreator

export const setChatActionCreator = newChatActionCreator => {
  cac = newChatActionCreator
}

// returns a function to be called when receiving a message through websocket
export const onMessage = rawData => (dispatch, getState) => {
  let type, payload
  try {
    const data = transformer.decode(rawData)
    type = data.type
    payload = data.payload
  } catch (err) {
    console.error(err)
    return
  }
  switch (type) {
    case SEND_CHAT_MESSAGE:
      const state = getState()
      const entities = state.get('entities')
      const currentRoomId = state.get('currentRoomId')
      if (entities.getIn(['rooms', 'byId', payload.roomId, 'initialFetch'])) {
        dispatch(cac.receiveMessage(payload))
      }
      if (currentRoomId !== payload.roomId) {
        dispatch(cac.unreadMessages(payload.roomId, true))
      }
      break
    case RECEIVE_MESSAGE_READ:
      dispatch(
        cac.receiveMessageRead(payload.userId, payload.roomId, payload.readAt)
      )
      break
    case RECEIVE_CREATE_ROOM:
      dispatch(cac.receiveCreateRoom(payload.id, payload.name))
      break
    case RECEIVE_DELETE_ROOM:
      dispatch(cac.receiveDeleteRoom(payload.id))
      break
    default:
      break
  }
}

export const onClose = () => (dispatch, getState) => {}

export const onOpen = () => (dispatch, getState) => {
  // TODO: initialize all entity data
  const state = getState()
  const myId = state.getIn(['auth', 'myId'])

  if (myId) {
    dispatch(cac.fetchRooms(myId))
    dispatch(cac.fetchFriends(myId))
  }
}

export const onError = () => (dispatch, getState) => {}

export const router = (type, event) => dispatch => {
  switch (type) {
    case NATIVE_EVENTS.onopen:
      dispatch(onOpen(event))
      break
    case NATIVE_EVENTS.onmessage:
      dispatch(onMessage(event))
      break
    case NATIVE_EVENTS.onclose:
      dispatch(onClose(event))
      break
    case NATIVE_EVENTS.onerror:
      dispatch(onError(event))
      break
    default:
      throw new Error(`Unsupported socket event ${type}`)
  }
}
