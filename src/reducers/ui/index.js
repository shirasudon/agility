import { combineReducers } from 'redux-immutable'

import { createGroup } from './createGroup'


export const ui = combineReducers({
    createGroup,
})
