// @format
import { combineReducers } from 'redux-immutable'

import * as ui from './ui'
import * as entity from './entity'
import * as domain from './domain'
import { USER_LOGOUT } from '../constants/chat'

export const appReducer = combineReducers({
  ...entity,
  ...domain,
  ...ui,
})

export const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
