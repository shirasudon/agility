import { combineReducers } from 'redux'
import { users, rooms, messages } from './entity'


export const entities = combineReducers({
    users,
    rooms,
    messages
})

