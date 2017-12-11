// @format

import SessionApi from './session'

describe('login', () => {
  it('returns object with user ID of type integer if login is successful', () => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({ data: { logged_in: true, user_id: '2' }, status: 200 })
        })
      },
    }
    return SessionApi.login(
      { username: 'hoge', password: 'hoge' },
      config
    ).then(response => {
      expect(response).toEqual({ userId: 2 })
    })
  })

  it('throws an error if login is NOT successful', done => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({ data: { logged_in: false }, status: 200 })
        })
      },
    }
    return SessionApi.login(
      { username: 'hoge', password: 'hoge' },
      config
    ).catch(err => {
      done()
    })
  })
})

describe('logout', () => {
  it('throws error when logged_in=true after logout is called', done => {
    const config = {
      adapter: config => {
        return new Promise(resolve => {
          resolve({ data: { logged_in: true }, status: 200 })
        })
      },
    }
    return SessionApi.logout(config).catch(err => {
      done()
    })
  })
})
