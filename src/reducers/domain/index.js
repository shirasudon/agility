// @format

import Immutable from 'immutable'

import {
  CHANGE_ROOM,
  RECEIVE_FRIEND_IDS,
  RECEIVE_DELETE_ROOM,
  USER_LOGIN,
} from '../../actions/actionTypes'

// TODO: use immutable.js
export function currentRoomId(state = null, action) {
  switch (action.type) {
    case CHANGE_ROOM:
      return action.roomId
    case RECEIVE_DELETE_ROOM:
      return null
    default:
      return state
  }
}

// TODO: use immutable.js
export function friendIds(state = [], action) {
  switch (action.type) {
    case RECEIVE_FRIEND_IDS:
      const newState = state.slice()
      action.ids.forEach(id => {
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
    case USER_LOGIN:
      return state.set('myId', action.userId)
    default:
      return state
  }
}
