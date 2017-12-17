// @format

import { fetchUser, fetchRooms, fetchFriendIds } from './chat'

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
