// @format
import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { setSessionApi, login, logout } from './AuthActions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

let SessionApiStub

beforeEach(() => {
  SessionApiStub = {
    login: user => {
      if (user.username === 'john' && user.password === 'pass') {
        return Promise.resolve({ userId: 3 })
      } else {
        return Promise.resolve(false)
      }
    },
    logout: () => {
      return Promise.resolve()
    },
  }

  setSessionApi(SessionApiStub)
})

describe('login', () => {
  it('login successfully with existing username and correct password', done => {
    const dispatch = jest.fn()
    login({ username: 'john', password: 'pass' })(dispatch).then(success => {
      expect(success).toBe(true)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'USER_AUTH',
        userId: 3,
      })
      done()
    })
  })

  it('login fail with existing username and incorrect password', done => {
    login({ username: 'john', password: 'wrongpassword' })().then(success => {
      expect(success).toBe(false)
      done()
    })
  })

  it('login fail with non-existing username and random password', done => {
    login({
      username: 'non-existing-username',
      password: 'randompassword',
    })().then(success => {
      expect(success).toBe(false)
      done()
    })
  })
})

describe('logout', () => {
  it('delete session and initialize redux store on logout', () => {
    const expectedActions = [{ type: 'USER_LOGOUT' }]
    const store = mockStore({})

    return store.dispatch(logout()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
