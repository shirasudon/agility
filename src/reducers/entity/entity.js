// @format

import Immutable, { Map as IMap } from 'immutable'

import {
  RECEIVE_USER,
  RECEIVE_ROOM,
  RECEIVE_ROOM_INFO,
  RECEIVE_MESSAGE,
  RECEIVE_CREATE_ROOM,
  RECEIVE_DELETE_ROOM,
  RECEIVE_MESSAGE_READ,
  UNREAD_MESSAGES,
} from '../../constants/chat'
import { insertOrdered } from '../../utility/array'

export function users(
  state = Immutable.fromJS({
    byId: {},
    byUsername: {},
    all: [],
  }),
  action
) {
  switch (action.type) {
    case RECEIVE_USER: {
      const u = action.payload
      if (!state.get('all').includes(u.id)) {
        state = state.setIn(['byId', u.id], u)
        state = state.setIn(['byUsername', u.username], u)
        state = state.update('all', all => all.push(u.id))
      }
      return state
    }

    default:
      return state
  }
}

const roomInitialState = Immutable.fromJS({
  id: null,
  name: null,
  members: {},
  createdBy: null,
  initialFetch: false,
  hasUnreadMessage: false,
  oldestMessageTimestamp: Number.MAX_SAFE_INTEGER,
})

export function room(state = roomInitialState, action) {
  const data = action.payload
  switch (action.type) {
    case RECEIVE_ROOM_INFO:
      return state.merge({
        members: IMap(data.members),
        createdBy: data.createdBy,
        initialFetch: true,
      })

    case RECEIVE_ROOM:
      return state.merge({
        id: data.id,
        name: data.name,
        initialFetch: false,
        hasUnreadMessage: data.hasUnreadMessage,
      })

    case RECEIVE_CREATE_ROOM:
      return state.merge({
        id: data.id,
        name: data.name,
        initialFetch: false,
      })

    case UNREAD_MESSAGES:
      return state.merge({
        hasUnreadMessage: data.exist,
      })

    case RECEIVE_MESSAGE:
      const { createdAt } = data
      return state.merge({
        oldestMessageTimestamp: Math.min(
          createdAt,
          state.get('oldestMessageTimestamp')
        ),
      })

    case RECEIVE_MESSAGE_READ:
      const { userId, readAt } = action.payload
      const key = ['members', userId, 'readAt']
      return state.setIn(key, Math.max(readAt, state.getIn(key)))

    default:
      return state
  }
}

export function rooms(
  state = Immutable.fromJS({
    byId: {},
    all: [],
  }),
  action
) {
  const data = action.payload
  switch (action.type) {
    case RECEIVE_ROOM: {
      if (!state.get('all').includes(data.id)) {
        state = state.setIn(
          ['byId', data.id],
          room(state.getIn(['byId', data.id]), action)
        )
        state = state.update('all', all => all.push(data.id))
      }
      return state
    }

    case RECEIVE_ROOM_INFO: {
      return state.setIn(
        ['byId', data.id],
        room(state.getIn(['byId', data.id]), action)
      )
    }

    case RECEIVE_CREATE_ROOM: {
      if (!state.get('all').includes(data.id)) {
        // TODO: make `all` a set
        state = state.setIn(
          ['byId', data.id],
          room(state.getIn(['byId', data.id]), action)
        )
        state = state.update('all', all => all.push(data.id))
      }
      return state
    }

    case RECEIVE_DELETE_ROOM: {
      const { roomId } = data
      const index = state.get('all').indexOf(roomId)

      // If the room is found, delete from array "all"
      if (index > -1) {
        state = state.update('all', all => all.delete(index))
        state = state.update('byId', byId => byId.delete(roomId))
      }
      return state
    }

    case RECEIVE_MESSAGE_READ:
    case RECEIVE_MESSAGE:
    case UNREAD_MESSAGES: {
      const { roomId } = data
      return state.setIn(
        ['byId', roomId],
        room(state.getIn(['byId', roomId]), action)
      )
    }

    default:
      return state
  }
}

export function messages(
  state = Immutable.fromJS({
    byId: {},
    byRoomId: {},
    all: [],
  }),
  action
) {
  const data = action.payload
  switch (action.type) {
    case RECEIVE_MESSAGE: {
      const { id, roomId } = data
      if (!state.get('all').includes(id)) {
        // sorting id based on it is on the premise that larger id is guaranteed to be the id of newer message
        state = state.update('all', all =>
          Immutable.fromJS(insertOrdered(all.toJS(), id))
        )
        state = state.updateIn(
          ['byRoomId', roomId],
          Immutable.List(),
          messages => Immutable.fromJS(insertOrdered(messages.toJS(), id))
        )
        state = state.setIn(['byId', id], Immutable.fromJS(data))
      }

      return state
    }

    case RECEIVE_MESSAGE_READ: {
      const { userId, roomId, readAt } = data
      const roomMessages = state.getIn(['byRoomId', roomId])
      if (!roomMessages) {
        return state
      }
      for (let messageId of state.getIn(['byRoomId', roomId]).reverse()) {
        // from the new messages
        const msg = state.getIn(['byId', messageId, 'readBy'])
        if (!msg || msg.includes(userId)) {
          break
        }
        if (state.getIn(['byId', messageId, 'createdAt']) <= readAt) {
          state = state.updateIn(['byId', messageId, 'readBy'], readBy =>
            readBy.push(userId)
          )
        }
      }
      return state
    }

    default:
      return state
  }
}
