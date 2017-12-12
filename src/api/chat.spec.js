// @format

import { fetchUser } from './chat'

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
        userId: 2,
        username: 'hitochan',
        firstName: 'hito',
        lastName: 'chan',
      })
    })
  })
})
