import { combineReducers } from 'redux'
import { friends, rooms, messages } from './entity'


export const entities = combineReducers({
    friends,
    rooms,
    messages
});
