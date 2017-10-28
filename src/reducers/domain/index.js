import {
    CHANGE_ROOM,
    RECEIVE_FRIEND_IDS,
} from '../../actions/actionTypes';

export function currentRoomId(state = null, action) {
    switch (action.type) {
        case CHANGE_ROOM:
            return action.roomId;
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

