// @format

import Immutable from 'immutable'

import {
  onMessage,
  onOpen,
  onClose,
  onError,
  setChatActionCreator,
} from './websocket'
import { SEND_CHAT_MESSAGE, SEND_MESSAGE_READ } from '../constants/chat'
import { MESSAGE_CREATED } from '../constants/websocket'
import * as transformer from '../service/transformer'

const createChatActionCreator = () => {
  const fetchRooms = jest.fn(() => 'fetchRooms')
  const fetchFriends = jest.fn(() => 'fetchFriends')
  const fetchUser = jest.fn(() => 'fetchUser')
  const unreadMessages = jest.fn(() => 'unreadMessages')
  const receiveMessage = jest.fn(() => 'receiveMessage')
  const init = jest.fn(() => 'init')
  return {
    fetchRooms,
    fetchFriends,
    fetchUser,
    unreadMessages,
    receiveMessage,
    init,
  }
}

describe('onMessage', () => {
  it('dispatches receiveMessage when initial fetch is already done', () => {
    const chatActionCreator = createChatActionCreator()
    setChatActionCreator(chatActionCreator)
    const dispatch = jest.fn()
    const getState = jest.fn(() =>
      Immutable.fromJS({})
        .set('currentRoomId', 3)
        .setIn(['entities', 'rooms', 'byId', 3, 'initialFetch'], true)
        .setIn(
          ['entities', 'rooms', 'byId', 3, 'members'],
          Immutable.List.of(1, 2, 3)
        )
    )

    const data = {
      event: MESSAGE_CREATED,
      data: {
        message_id: 2,
        room_id: 3,
        content: 'hello',
        created_by: 4,
        created_at: '2018-01-03T16:30:37.700848724+09:00',
      },
    }
    const rawData = JSON.stringify(data)
    onMessage(rawData)(dispatch, getState)
    expect(chatActionCreator.receiveMessage).toHaveBeenCalledWith(
      transformer.decode(rawData)['payload']
    )
    expect(dispatch).toHaveBeenCalledWith('receiveMessage')
  })

  it(`dispatches unreadMessages when current room is not the same as the received messages'room`, () => {
    const chatActionCreator = createChatActionCreator()
    setChatActionCreator(chatActionCreator)
    const dispatch = jest.fn()
    const getState = jest.fn(() =>
      Immutable.fromJS({})
        .set('currentRoomId', 3)
        .setIn(['entities', 'rooms', 'byId', 3, 'initialFetch'], true)
        .setIn(
          ['entities', 'rooms', 'byId', 3, 'members'],
          Immutable.List.of(1, 2, 3)
        )
    )

    const data = {
      event: MESSAGE_CREATED,
      data: {
        message_id: 2,
        room_id: 4,
        content: 'hello',
        created_by: 4,
        created_at: '2018-01-03T16:30:37.700848724+09:00',
      },
    }
    const rawData = JSON.stringify(data)
    onMessage(rawData)(dispatch, getState)
    expect(chatActionCreator.unreadMessages).toHaveBeenCalledWith(4, true)
    expect(dispatch).toHaveBeenCalledWith('unreadMessages')
  })
})

describe('onOpen', () => {
  it('does initial fetch if logged in', () => {
    const dispatch = jest.fn()
    const getState = jest.fn(() =>
      Immutable.fromJS({
        auth: {
          myId: 2,
        },
      })
    )
    onOpen()(dispatch, getState)
    expect(dispatch.mock.calls[0]).toEqual(['init'])
    expect(dispatch.mock.calls[1]).toEqual(['fetchUser'])
    expect(dispatch.mock.calls[2]).toEqual(['fetchRooms'])
    expect(dispatch.mock.calls[3]).toEqual(['fetchFriends'])
  })

  it('does not do initial fetch if not logged in', () => {
    const dispatch = jest.fn()
    const getState = jest.fn(() =>
      Immutable.fromJS({
        auth: {
          myId: null,
        },
      })
    )
    onOpen()(dispatch, getState)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toEqual(['init'])
  })
})

describe('onClose', () => {
  it('does nothing so far', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    onClose()(dispatch, getState)
    expect(dispatch).not.toHaveBeenCalled()
    expect(getState).not.toHaveBeenCalled()
  })
})
describe('onError', () => {
  it('does nothing so far', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    onError()(dispatch, getState)
    expect(dispatch).not.toHaveBeenCalled()
    expect(getState).not.toHaveBeenCalled()
  })
})
