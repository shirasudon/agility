// @format
import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { setSessionApi, setSessionService, login, logout } from './AuthActions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

let SessionApiStub
let sessionService

beforeEach(() => {
  SessionApiStub = {
    login: user => {
      if (user.username === 'john' && user.password === 'pass') {
        return Promise.resolve({
          ok: true,
          data: 'data',
          token: 'token!',
        })
      } else {
        return Promise.resolve({
          ok: false,
        })
      }
    },
    logout: () => {
      return Promise.resolve()
    },
  }

  sessionService = {
    saveSession: jest.fn(),
    saveUser: jest.fn(),
    deleteSession: jest.fn(),
    deleteUser: jest.fn(),
  }

  setSessionApi(SessionApiStub)
  setSessionService(sessionService)
})

describe('login', () => {
  it('login successfully with existing username and correct password', done => {
    login({ username: 'john', password: 'pass' })().then(success => {
      expect(success).toBe(true)
      expect(sessionService.saveSession).toHaveBeenCalledWith('token!')
      expect(sessionService.saveUser).toHaveBeenCalledWith('data')
      done()
    })
  })

  it('login fail with existing username and incorrect password', done => {
    login({ username: 'john', password: 'wrongpassword' })().then(success => {
      expect(success).toBe(false)
      expect(sessionService.saveSession).not.toHaveBeenCalled()
      expect(sessionService.saveUser).not.toHaveBeenCalled()
      done()
    })
  })

  it('login fail with non-existing username and random password', done => {
    login({
      username: 'non-existing-username',
      password: 'randompassword',
    })().then(success => {
      expect(success).toBe(false)
      expect(sessionService.saveSession).not.toHaveBeenCalled()
      expect(sessionService.saveUser).not.toHaveBeenCalled()
      done()
    })
  })
})

describe('logout', () => {
  it('delete session and initialize redux store on logout', () => {
    const expectedActions = [{ type: 'USER_LOGOUT' }]
    const store = mockStore({})

    return store.dispatch(logout()).then(() => {
      expect(sessionService.deleteSession).toHaveBeenCalled()
      expect(sessionService.deleteUser).toHaveBeenCalled()
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
