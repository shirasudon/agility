// @format

import { combineReducers } from 'redux-immutable'
import { Map as IMap } from 'immutable'

import * as ui from './ui'
import * as entity from './entity'
import * as domain from './domain'
import { USER_LOGOUT, INIT } from '../constants/chat'

export const appReducer = combineReducers({
  ...entity,
  ...domain,
  ...ui,
})

export const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined
  } else if (action.type === INIT) {
    const idPath = ['auth', 'myId']
    const userId = state.getIn(idPath)
    const currentRoomId = state.getIn('currentRoomId')
    state = IMap()
      .setIn(idPath, userId)
      .set('currentRoomId', currentRoomId)
  }

  return appReducer(state, action)
}

export default rootReducer
