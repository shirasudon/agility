// @format
import { sessionService as SessionService } from 'redux-react-session'
import SessionApiStub from '../api/sessionStub'
import { USER_LOGOUT } from '../actions/actionTypes'

let sessionApi = SessionApiStub
let sessionService = SessionService

export const setSessionApi = api => {
  sessionApi = api
}

export const setSessionService = ss => {
  sessionService = ss
}

export const login = user => {
  return dispatch => {
    let responseData
    return sessionApi
      .login(user)
      .then(response => {
        if (response.ok) {
          responseData = response.data
          return sessionService.saveSession(response.token)
        } else {
          throw new Error('authentication failed')
        }
      })
      .then(() => {
        return sessionService.saveUser(responseData)
      })
      .then(() => {
        return Promise.resolve(true)
      })
      .catch(err => {
        return Promise.resolve(false)
      })
  }
}

export const userLogout = () => ({
  type: USER_LOGOUT,
})

export const logout = () => {
  return dispatch => {
    return sessionApi
      .logout()
      .then(() => {
        sessionService.deleteSession()
        sessionService.deleteUser()
        dispatch(userLogout())
      })
      .catch(err => {
        throw err
      })
  }
}
