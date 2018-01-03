// @format

import Immutable from 'immutable'

import {
  CHANGE_ROOM,
  RECEIVE_FRIEND_IDS,
  RECEIVE_DELETE_ROOM,
  USER_AUTH,
} from '../../constants/chat'

export function currentRoomId(state = null, action) {
  switch (action.type) {
    case CHANGE_ROOM:
      return action.payload.roomId
    case RECEIVE_DELETE_ROOM:
      return null
    default:
      return state
  }
}

export function friendIds(state = [], action) {
  switch (action.type) {
    case RECEIVE_FRIEND_IDS:
      const newState = state.slice()
      action.payload.ids.forEach(id => {
        if (!newState.includes(id)) {
          newState.push(id)
        }
      })
      return newState
    default:
      return state
  }
}

export function auth(state = Immutable.fromJS({ myId: null }), action) {
  switch (action.type) {
    case USER_AUTH:
      return state.set('myId', action.payload.userId)
    default:
      return state
  }
}
