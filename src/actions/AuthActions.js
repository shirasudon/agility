// @format
// import SessionApiStub from '../api/sessionStub'
import SessionApi from '../api/session'
import { USER_LOGOUT, USER_AUTH } from '../actions/actionTypes'

let sessionApi = SessionApi

export const setSessionApi = api => {
  sessionApi = api
}

export const userAuth = userId => ({
  type: USER_AUTH,
  payload: {
    userId,
  },
})

export const login = user => {
  return dispatch => {
    return sessionApi
      .login(user)
      .then(response => {
        dispatch(userAuth(response.userId))
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
        dispatch(userLogout())
      })
      .catch(err => {
        throw err
      })
  }
}
