import {
    RECEIVE_MESSAGE,
} from '../../actions/actionTypes'

/*
 * create a domain state about a room.
 * All the messages between msgStartIndex and msgEndIndex (inclusive) should already been received.
 * Initially both indices are -1, meaning no message is received so far.
 * @param {integer} msgStartIndex - the smallest id of all messages received so far
 * @param {integer} msgEndIndex - the biggest id of all messages received so far
 */
export function room(state = { msgStartIndex: -1, msgEndIndex: -1 }, action) {
    switch (action.type) {
        case RECEIVE_MESSAGE:
            const { id, roomId } = action.message
            let { msgStartIndex, msgEndIndex } = state
            if (msgStartIndex === -1 && msgEndIndex === -1) {
                msgStartIndex = msgEndIndex = id
            } 
            else if (id === msgStartIndex - 1) {
                msgStartIndex -= 1 
            }
            else if (id === msgEndIndex + 1) {
                msgEndIndex += 1 
            }
            else if (msgStartIndex <= id && id <= msgEndIndex) {
                console.log("Seems like you got a dupulicate message") 
            }
            else {
                throw new Error(`Got invalid message id ${id}`)
            }
            return Object.assign({}, state, {
                msgStartIndex,
                msgEndIndex,
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

