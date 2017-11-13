import { combineReducers } from 'redux';

import * as ui from './ui'
import { sessionReducer as session } from 'redux-react-session'
import * as entity from './entity'
import * as domain from './domain'
import { USER_LOGOUT } from '../actions/actionTypes'

export const appReducer = combineReducers({
    session,
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
