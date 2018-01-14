// @format

import moment from 'moment'

import {
  fetchUser,
  fetchRooms,
  fetchFriendIds,
  fetchRoomInfo,
  messageMapper,
  fetchUnreadMessages,
  fetchMessagesByRoomId,
  createRoom,
  deleteRoom,
  sendMessageRead,
} from './chat'

describe('fetchUser', () => {
  it('throws an error when user_id in response body is different from userId', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              user_id: 10,
              user_name: 'hitochan',
              first_name: 'hito',
              last_name: 'chan',
            },
            status: 200,
          })
        })
      },
    }
    return fetchUser(2, config).catch(err => {
      expect(err.message).toBe('response user_id does not equal userId')
    })
  })

  it('returns object with user_id, user_name, first_name, last_name', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              user_id: 2,
              user_name: 'hitochan',
              first_name: 'hito',
              last_name: 'chan',
            },
            status: 200,
          })
        })
      },
    }
    return fetchUser(2, config).then(user => {
      expect(user).toEqual({
        id: 2,
        username: 'hitochan',
        firstName: 'hito',
        lastName: 'chan',
      })
    })
  })
})

describe('fetchRooms', () => {
  it('throws an error when user_id in response body is different from userId', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              user_id: 10,
              rooms: [
                { room_id: 2, room_name: 'room2' },
                { room_id: 3, room_name: 'room3' },
              ],
            },
            status: 200,
          })
        })
      },
    }
    return fetchRooms(2, config).catch(err => {
      expect(err.message).toBe('response user_id does not equal userId')
    })
  })

  it('returns object with id, name', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              user_id: 5,
              rooms: [
                { room_id: 2, room_name: 'room2' },
                { room_id: 3, room_name: 'room3' },
              ],
            },
            status: 200,
          })
        })
      },
    }
    return fetchRooms(5, config).then(user => {
      expect(user).toEqual([
        {
          id: 2,
          name: 'room2',
        },
        {
          id: 3,
          name: 'room3',
        },
      ])
    })
  })
})

describe('fetchFriendIds', () => {
  it('throws an error when user_id in response body is different from userId', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              user_id: 10,
              user_name: 'hitochan',
              first_name: 'hito',
              last_name: 'chan',
            },
            status: 200,
          })
        })
      },
    }
    return fetchFriendIds(2, config).catch(err => {
      expect(err.message).toBe('response user_id does not equal userId')
    })
  })

  it('returns an array of friend IDs', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              user_id: 2,
              user_name: 'hitochan',
              first_name: 'hito',
              last_name: 'chan',
              friends: [
                {
                  user_id: 3,
                },
                {
                  user_id: 5,
                },
              ],
            },
            status: 200,
          })
        })
      },
    }
    return fetchFriendIds(2, config).then(user => {
      expect(user).toEqual([3, 5])
    })
  })
})

describe('fetchRoomInfo', () => {
  it('returns id, name, members, createdBy, hasUnreadMessage', () => {
    const expected = {
      id: 2,
      name: 'room name',
      members: new Map([
        [3, new Map([['readAt', -1]])],
        [5, new Map([['readAt', moment('2018-01-15T00:18:54Z').valueOf()]])],
        [7, new Map([['readAt', -1]])],
      ]),
      createdBy: 7,
      hasUnreadMessage: false,
    }
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              room_id: 2,
              room_name: 'room name',
              room_members: [
                { user_id: 3 },
                { user_id: 5, message_read_at: '2018-01-15T00:18:54Z' },
                { user_id: 7 },
              ],
              room_creator_id: 7,
            },
            status: 200,
          })
        })
      },
    }
    return fetchRoomInfo(2, config).then(user => {
      expect(user).toEqual(expected)
    })
  })
})

describe('messageMapper', () => {
  it('convert message object from the server to the format used on the client side', () => {
    const responseFromServer = {
      message_id: 2,
      user_id: 3,
      content: 'hello world',
      created_at: '2017-12-23T16:30:37.700848724+09:00',
    }
    const roomId = 10
    expect(messageMapper(responseFromServer, roomId)).toEqual({
      id: 2,
      roomId: 10,
      userId: 3,
      text: 'hello world',
      createdAt: 1514014237700,
    })
  })
})

describe('fetchMessagesByRoomId', () => {
  it('throws an error when atLeast is negative', () => {
    expect(() => {
      fetchMessagesByRoomId(2, null, -1)
    }).toThrowError()
  })
})

describe('fetchUnreadMessages', () => {
  it('throws an error when room_id in response body is different from roomId', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              room_id: 4,
            },
            status: 200,
          })
        })
      },
    }

    return fetchUnreadMessages(2, config)
      .then(() => {
        fail()
      })
      .catch(() => {})
  })

  it('returns unread messages', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              room_id: 2,
              messages: [
                {
                  message_id: 5,
                  user_id: 5,
                  content: 'message 5',
                  created_at: '2017-12-23T16:30:37.700848724+09:00',
                },
                {
                  message_id: 4,
                  user_id: 2,
                  content: 'message 4',
                  created_at: '2017-12-22T16:30:37.700848724+09:00',
                },
              ],
            },
            status: 200,
          })
        })
      },
    } // end of config
    return fetchUnreadMessages(2, config).then(messages => {
      expect(messages).toEqual([
        {
          createdAt: 1514014237700,
          id: 5,
          roomId: 2,
          text: 'message 5',
          userId: 5,
        },
        {
          createdAt: 1513927837700,
          id: 4,
          roomId: 2,
          text: 'message 4',
          userId: 2,
        },
      ])
    })
  })
})

describe('fetchMessagesByRoomId', () => {
  it('returns a list of unread and read messages when # of unread messages does not exceed `atLeast`', () => {
    const expected = {}
    const config = {
      adapter: config => {
        const unreadMessages = [
          {
            message_id: 5,
            user_id: 5,
            content: 'message 5',
            created_at: '2017-12-23T16:30:37.700848724+09:00',
          },
        ]
        const readMessages = [
          {
            message_id: 3,
            user_id: 3,
            content: 'message 3',
            created_at: '2017-11-30T16:30:37.700848724+09:00',
          },
        ]

        return new Promise(resolve => {
          const url = config.url
          if (url.startsWith('/chat/rooms/2/messages/unread')) {
            resolve({
              data: {
                room_id: 2,
                messages: unreadMessages,
              },
              status: 200,
            })
          } else if (url.startsWith('/chat/rooms/2/messages')) {
            resolve({
              data: {
                room_id: 2,
                messages: readMessages,
              },
              status: 200,
            })
          }
        })
      },
    } // end of config

    return fetchMessagesByRoomId(2, undefined, 10, config).then(messages => {
      expect(messages).toEqual([
        {
          createdAt: 1514014237700,
          id: 5,
          roomId: 2,
          text: 'message 5',
          userId: 5,
        },
        {
          createdAt: 1512027037700,
          id: 3,
          roomId: 2,
          text: 'message 3',
          userId: 3,
        },
      ])
    })
  })

  it('returns a list of only unread messages when # of unread messages exceeds `atLeast`', () => {
    const expected = {}
    const config = {
      adapter: config => {
        const unreadMessages = [
          {
            message_id: 5,
            user_id: 5,
            content: 'message 5',
            created_at: '2017-12-23T16:30:37.700848724+09:00',
          },
          {
            message_id: 4,
            user_id: 5,
            content: 'message 4',
            created_at: '2017-12-23T16:30:37.700848724+09:00',
          },
          {
            message_id: 3,
            user_id: 5,
            content: 'message 3',
            created_at: '2017-12-23T16:30:37.700848724+09:00',
          },
        ]

        const readMessages = [
          {
            message_id: 2,
            user_id: 3,
            content: 'message 2',
            created_at: '2017-11-30T16:30:37.700848724+09:00',
          },
        ]

        return new Promise(resolve => {
          const url = config.url
          if (url.startsWith('/chat/rooms/2/messages/unread')) {
            resolve({
              data: {
                room_id: 2,
                messages: unreadMessages,
              },
              status: 200,
            })
          } else if (url.startsWith('/chat/rooms/2/messages')) {
            resolve({
              data: {
                room_id: 2,
                messages: readMessages,
              },
              status: 200,
            })
          }
        })
      },
    } // end of config

    return fetchMessagesByRoomId(2, undefined, 2, config).then(messages => {
      expect(messages).toEqual([
        {
          createdAt: 1514014237700,
          id: 5,
          roomId: 2,
          text: 'message 5',
          userId: 5,
        },
        {
          createdAt: 1514014237700,
          id: 4,
          roomId: 2,
          text: 'message 4',
          userId: 5,
        },
        {
          createdAt: 1514014237700,
          id: 3,
          roomId: 2,
          text: 'message 3',
          userId: 5,
        },
      ])
    })
  })
})

describe('createRoom', () => {
  it('returns room id and room name on successful creation of a room', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({
            data: {
              room_id: 4,
              ok: true,
            },
            status: 200,
          })
        })
      },
    }
    const room = {
      name: 'tennis club',
      createdBy: 2,
      members: [2, 3, 4],
    }
    return createRoom(room, config).then(response => {
      expect(response).toEqual({
        id: 4,
        name: room.name,
      })
    })
  })
})

describe('deleteRoom', () => {
  it('sends a request DELETE to chat/rooms/{roomId}', () => {
    const roomId = 2
    const config = {
      adapter: config => {
        expect(config.url).toBe(`/chat/rooms/${roomId}`)
        return new Promise(resolve => {
          resolve({
            data: {},
            status: 200,
          })
        })
      },
    }
    return deleteRoom(roomId, config)
  })
})

describe('sendMessageRead', () => {
  it('sends a POST request to chat/rooms/{roomId}/messages/read', () => {
    const roomId = 2
    const readAt = moment('2018-01-13T18:01:50+09:00').valueOf()
    const config = {
      adapter: config => {
        expect(config.url).toBe(`/chat/rooms/${roomId}/messages/read`)
        expect(config.data).toEqual(
          `{\"room_id\":2,\"read_at\":\"2018-01-13T09:01:50.000000000+00:00\"}`
        )
        return new Promise(resolve => {
          resolve({
            data: {},
            status: 200,
          })
        })
      },
    }
    return sendMessageRead(roomId, readAt, config)
  })
})
