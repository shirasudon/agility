import { combineReducers } from 'redux'
import {
    CHANGE_ROOM,
    RECEIVE_FRIEND_IDS,
    RECEIVE_DELETE_ROOM,
} from '../../actions/actionTypes'


export function currentRoomId(state = null, action) {
    switch (action.type) {
        case CHANGE_ROOM:
            return action.roomId;
        case RECEIVE_DELETE_ROOM:
            return null
        default:
            return state;
    }
}

export function friendIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_FRIEND_IDS:
            const newState = state.slice()
            newState.push(...action.ids)
            return newState
        default:
            return state
    }
}

export { rooms } from './rooms'

