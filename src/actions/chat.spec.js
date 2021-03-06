// @format
import React from 'react'
import ReactDOM from 'react-dom'
import ChatActionCreator from './chat'
import thunk from 'redux-thunk'
import moment from 'moment'
import { Map as IMap, List as IList } from 'immutable'

import configureMockStore from 'redux-mock-store'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('returns INIT type', () => {
  const cac = new ChatActionCreator({})
  expect(cac.init()).toEqual({
    type: 'INIT',
  })
})

it('returns request room info', () => {
  const cac = new ChatActionCreator({})
  expect(cac.requestRoomInfo()).toEqual({
    type: 'REQUEST_ROOM_INFO',
  })
})

it('returns receive room info', () => {
  const cac = new ChatActionCreator({})
  const room = { a: 1, b: 2 }
  expect(cac.receiveRoomInfo(room)).toEqual({
    type: 'RECEIVE_ROOM_INFO',
    payload: {
      ...room,
    },
  })
})

it('returns fetch room info', () => {
  const mockApi = {
    fetchRoomInfo: roomId => {
      return Promise.resolve({
        id: 2,
        name: 'room name!',
        members: [2, 5, 8],
      })
    },
  }
  const cac = new ChatActionCreator(mockApi)

  const roomId = 3
  const expectedActions = [
    { type: 'REQUEST_ROOM_INFO' },
    {
      type: 'RECEIVE_ROOM_INFO',
      payload: {
        id: 2,
        name: 'room name!',
        members: [2, 5, 8],
      },
    },
  ]

  const store = mockStore({})

  return store.dispatch(cac.fetchRoomInfo()).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('returns change room', () => {
  const cac = new ChatActionCreator({})
  const roomId = 1
  expect(cac.changeRoom(roomId)).toEqual({
    type: 'CHANGE_ROOM',
    payload: {
      roomId,
    },
  })
})

it('dispatch enter room', () => {
  const messages = [
    {
      id: 1,
      roomId: 1,
      userId: 1,
      text: 'こんにちは！',
      createdAt: moment('2017-11-03 13:00:00').valueOf(),
    },
    {
      id: 2,
      roomId: 1,
      userId: 2,
      text: 'はじめまして！',
      createdAt: moment('2017-11-03 13:00:00').valueOf(),
    },
  ]
  const roomInfo = {
    id: 2,
    name: 'room name!',
    members: [[1, { readAt: -1 }], [2, { readAt: -1 }], [3, { readAt: -1 }]],
  }

  const users = {
    '1': {
      id: 1,
      username: 'hajime',
    },
    '2': {
      id: 2,
      username: 'mai',
    },
    '3': {
      id: 3,
      username: 'takeru',
    },
  }

  const mockApi = {
    fetchRooms: () => {},
    fetchRoomInfo: roomId => {
      return Promise.resolve(roomInfo)
    },
    fetchMessagesByRoomId: roomId => {
      return Promise.resolve(messages)
    },
    fetchUser: userId => {
      return Promise.resolve(users[userId])
    },
    createRoom: () => {},
  }
  const cac = new ChatActionCreator(mockApi)
  cac.getReadBy = () => [1, 2, 3]

  const roomId = 3
  const expectedActions = [
    { type: 'REQUEST_ROOM_INFO' },
    { type: 'REQUEST_MESSAGES' },
    { type: 'RECEIVE_ROOM_INFO', payload: { ...roomInfo } },
    { type: 'RECEIVE_MESSAGE', payload: { ...messages[0], readBy: [1, 2, 3] } },
    { type: 'RECEIVE_MESSAGE', payload: { ...messages[1], readBy: [1, 2, 3] } },
    { type: 'RECEIVE_USER', payload: users[1] },
    { type: 'RECEIVE_USER', payload: users[2] },
    { type: 'RECEIVE_USER', payload: users[3] },
    { type: 'CHANGE_ROOM', payload: { roomId } },
    { type: 'UNREAD_MESSAGES', payload: { roomId, exist: false } },
  ] // TODO: this test might fail depending on the execution order
  const store = mockStore({})
  const initialFetch = true

  return store.dispatch(cac.enterRoom(roomId, initialFetch)).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('dispatches REQUEST_ROOMS', () => {
  const cac = new ChatActionCreator({})
  expect(cac.requestRooms()).toEqual({ type: 'REQUEST_ROOMS' })
})

it('fetches rooms', () => {
  const rooms = [
    {
      id: 1,
      name: 'room1',
    },
    {
      id: 3,
      name: 'room3',
    },
  ]
  const mockApi = {
    fetchRooms: () => {
      return Promise.resolve(rooms)
    },
  }
  const cac = new ChatActionCreator(mockApi)
  const roomId = 3
  const expectedActions = [
    { type: 'REQUEST_ROOMS' },
    { type: 'RECEIVE_ROOM', payload: { ...rooms[0] } },
    { type: 'RECEIVE_ROOM', payload: { ...rooms[1] } },
  ] // TODO: this test might fail depending on the execution order
  const store = mockStore({})

  return store.dispatch(cac.fetchRooms()).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('dispatch REQUEST_FRIENDS', () => {
  const cac = new ChatActionCreator({})
  expect(cac.requestFriends()).toEqual({ type: 'REQUEST_FRIENDS' })
})

it('dispatch RECEIVE_USER', () => {
  const user = {
    id: 1,
    username: 'hitochan',
    lastName: 'Hitoshi',
    firstName: 'Otsuki',
  }

  const cac = new ChatActionCreator({})
  expect(cac.receiveUser(user)).toEqual({
    type: 'RECEIVE_USER',
    payload: { ...user },
  })
})

it('fetches friends', () => {
  const friendIds = [1, 2, 3]
  const users = {
    '1': {
      id: 1,
      username: 'user1',
      lastName: 'last1',
      firstName: 'first1',
    },
    '2': {
      id: 2,
      username: 'user2',
      lastName: 'last2',
      firstName: 'first2',
    },
    '3': {
      id: 3,
      username: 'user3',
      lastName: 'last3',
      firstName: 'first3',
    },
  }
  const mockApi = {
    fetchFriendIds: () => {
      return Promise.resolve(friendIds)
    },
    fetchUser: id => {
      return Promise.resolve(users[id])
    },
  }
  const cac = new ChatActionCreator(mockApi)
  const expectedActions = [
    { type: 'REQUEST_FRIENDS' },
    { type: 'RECEIVE_FRIEND_IDS', payload: { ids: [1, 2, 3] } },
    { type: 'RECEIVE_USER', payload: users[1] },
    { type: 'RECEIVE_USER', payload: users[2] },
    { type: 'RECEIVE_USER', payload: users[3] },
  ] // TODO: this test might fail depending on the execution order
  const store = mockStore({})

  return store.dispatch(cac.fetchFriends()).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('dispatches REQUEST_CREATE_ROOM', () => {
  const cac = new ChatActionCreator({})
  expect(cac.requestCreateRoom()).toEqual({ type: 'REQUEST_CREATE_ROOM' })
})

it('dispatches RECEIVE_CREATE_ROOM', () => {
  const room = { id: 1, name: 'hoge' }
  const cac = new ChatActionCreator({})
  expect(cac.receiveCreateRoom(room.id, room.name)).toEqual({
    type: 'RECEIVE_CREATE_ROOM',
    payload: { ...room },
  })
})

it('dispatches REQUEST_MESSAGES', () => {
  const cac = new ChatActionCreator({})
  expect(cac.requestMessages()).toEqual({ type: 'REQUEST_MESSAGES' })
})

it('dispatches RECEIVE_MESSAGE after attaching readBy field to the payload', () => {
  const message = {
    id: 1,
    roomId: 1,
    userId: 1,
    text: 'こんにちは！',
    createdAt: moment('2017-11-03 13:00:00').valueOf(),
  }
  const cac = new ChatActionCreator({})
  cac.getReadBy = jest.fn(() => [1, 2, 3])
  const dispatch = jest.fn()
  const getState = jest.fn()
  cac.receiveMessage(message)(dispatch, getState)
  expect(dispatch).toHaveBeenCalledWith({
    type: 'RECEIVE_MESSAGE',
    payload: { ...message, readBy: [1, 2, 3] },
  })
  expect(getState).toHaveBeenCalledTimes(1)
})

it('fetches messages by room ID', () => {
  const messages = [
    {
      id: 1,
      roomId: 1,
      userId: 1,
      text: 'こんにちは！',
      createdAt: moment('2017-11-03 13:00:00').valueOf(),
    },
    {
      id: 2,
      roomId: 1,
      userId: 2,
      text: 'はじめまして！',
      createdAt: moment('2017-11-03 13:00:00').valueOf(),
    },
  ]
  const roomId = 2 //whatever is fine!

  const mockApi = {
    fetchMessagesByRoomId: roomId => {
      return Promise.resolve(messages)
    },
  }
  const cac = new ChatActionCreator(mockApi)
  cac.requestMessages = jest.fn(() => 'requestMessages')
  cac.receiveMessage = jest.fn(() => 'receiveMessage')

  const dispatch = jest.fn()

  return cac
    .fetchMessagesByRoomId(roomId)(dispatch)
    .then(() => {
      expect(cac.requestMessages).toHaveBeenCalled()
      expect(cac.receiveMessage.mock.calls[0]).toEqual([messages[0]])
      expect(cac.receiveMessage.mock.calls[1]).toEqual([messages[1]])
      expect(dispatch.mock.calls[0]).toEqual(['requestMessages'])
      expect(dispatch.mock.calls[1]).toEqual(['receiveMessage'])
    })
})

it('send a request to create a room', () => {
  const mockApi = {
    createRoom: room => {
      room.id = '2'
      return Promise.resolve(room)
    },
  }

  const cac = new ChatActionCreator(mockApi)
  const members = [1, 5]
  const createdBy = 1
  const roomName = 'room!'

  const expectedActions = [{ type: 'REQUEST_CREATE_ROOM' }]
  const store = mockStore({})

  return store
    .dispatch(cac.createRoom(createdBy, members, roomName))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
})

it('create action SEND_CHAT_MESSAGE', () => {
  const message = {
    id: 1,
    roomId: 1,
    userId: 1,
    text: 'こんにちは！',
    createdAt: moment('2017-11-03 13:00:00').valueOf(),
  }
  const cac = new ChatActionCreator({})

  const dispatch = jest.fn()
  const getState = jest.fn()
  const emit = jest.fn()

  cac.sendMessage(message)(dispatch, getState, { emit })
  expect(dispatch).not.toHaveBeenCalled()
  expect(getState).not.toHaveBeenCalled()
  expect(emit).toHaveBeenCalledWith('SEND_CHAT_MESSAGE', { ...message })
})

it('send a request to delete a room', () => {
  const mockApi = {
    deleteRoom: room => {
      return Promise.resolve(true)
    },
  }

  const cac = new ChatActionCreator(mockApi)

  const roomId = 2
  const expectedActions = [{ type: 'REQUEST_DELETE_ROOM' }]
  const store = mockStore({})

  return store.dispatch(cac.deleteRoom(roomId)).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('create action REQUEST_DELETE_ROOM', () => {
  const cac = new ChatActionCreator({})
  expect(cac.requestDeleteRoom()).toEqual({ type: 'REQUEST_DELETE_ROOM' })
})

it('create action RECEIVE_DELETE_ROOM', () => {
  const roomId = 3
  const cac = new ChatActionCreator({})
  expect(cac.receiveDeleteRoom(roomId)).toEqual({
    type: 'RECEIVE_DELETE_ROOM',
    payload: { roomId },
  })
})

describe('getReadBy', () => {
  it('returns list of userId from redux state', () => {
    const cac = new ChatActionCreator({})
    const roomId = 1
    const createdAt = moment('2018-01-13T15:01:10+09:00').valueOf()
    const state = IMap([
      [
        'entities',
        IMap([
          [
            'rooms',
            IMap([
              [
                'byId',
                IMap([
                  [
                    roomId,
                    IMap([
                      [
                        'members',
                        IMap([
                          [
                            1,
                            IMap([
                              [
                                'readAt',
                                moment('2018-01-13T14:59:00+09:00').valueOf(),
                              ],
                            ]),
                          ],
                          [
                            2,
                            IMap([
                              [
                                'readAt',
                                moment('2018-01-13T15:59:00+09:00').valueOf(),
                              ],
                            ]),
                          ],
                          [
                            3,
                            IMap([
                              [
                                'readAt',
                                moment('2018-01-13T15:01:10+09:00').valueOf(),
                              ],
                            ]),
                          ],
                        ]),
                      ],
                    ]),
                  ],
                ]),
              ],
            ]),
          ],
        ]),
      ],
    ])
    expect(cac.getReadBy(state, roomId, createdAt)).toEqual([2, 3])
  })
})

describe('receiveMessageRead', () => {
  it('returns a action of type RECEIVE_MESSAGE_READ', () => {
    const cac = new ChatActionCreator({})
    const userId = 2
    const roomId = 3
    const readAt = moment('2018-01-13T15:19:05+09:00').valueOf()
    expect(cac.receiveMessageRead(userId, roomId, readAt)).toEqual({
      type: 'RECEIVE_MESSAGE_READ',
      payload: {
        userId,
        roomId,
        readAt,
      },
    })
  })
})

describe('sendMessageRead', () => {
  it('returns a action of type RECEIVE_MESSAGE_READ', () => {
    const sendMessageRead = jest.fn()
    const dispatch = () => {}
    const cac = new ChatActionCreator({
      sendMessageRead,
    })
    const userId = 2
    const roomId = 3
    const readAt = moment('2018-01-13T15:19:05+09:00').valueOf()
    cac.sendMessageRead(roomId, readAt)(dispatch)
    expect(sendMessageRead).toHaveBeenCalledWith(roomId, readAt)
  })
})
