import { combineReducers } from 'redux-immutable'
import { users, rooms, messages } from './entity'


export const entities = combineReducers({
    users,
    rooms,
    messages
})

