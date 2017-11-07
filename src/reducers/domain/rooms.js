import {
    RECEIVE_MESSAGE,
} from '../../actions/actionTypes'

/*
 * create a domain state about a room.
 * All the messages between msgStartIndex and msgEndIndex (inclusive) should already been received.
 * Initially both indices are -1, meaning no message is received so far.
 * @param {integer} oldestMessageTimestamp - the unix style timestamp of the oldest message received so far.
 */
export function room(state = { oldestMessageTimestamp: null }, action) {
    switch (action.type) {
        case RECEIVE_MESSAGE:
            const { createdAt } = action.message
            return Object.assign({}, state, {
                oldestMessageTimestamp: Math.min(createdAt, state.oldestMessageTimestamp)
            })
        default:
            return state
    }
}

export function rooms(state={}, action) {
    switch (action.type) {
        case RECEIVE_MESSAGE:
            return Object.assign({}, state, {
                [action.message.roomId]: room(state[action.message.roomId], action)
            })
        default:
            return state
    }
}

