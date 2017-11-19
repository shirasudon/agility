import {
    RECEIVE_USER,
    RECEIVE_ROOM,
    RECEIVE_ROOM_INFO,
    RECEIVE_MESSAGE,
    RECEIVE_CREATE_ROOM,
    RECEIVE_DELETE_ROOM,
    RECEIVE_MESSAGE_READ,
    EXIST_UNREAD_MESSAGE,
    NO_UNREAD_MESSAGE,
} from '../../actions/actionTypes'


export function users(state = {byId: {}, byUsername: {}, all: []}, action){
    switch(action.type){
        case RECEIVE_USER:
            let newState = Object.assign({}, state)
            const u = action.user
            if (!newState.all.includes(u.id)) {
                newState.byId[u.id] = Object.assign({}, u);
                newState.byUsername[u.username] = Object.assign({}, u);
                newState.all.push(u.id);
            }
            return newState;
        default:
            return state;
    }
}

const roomInitialState = {
    id: null, 
    name: null,
    members: [], 
    createdBy: null, 
    initialFetch: false,
    hasUnreadMessage: false,
    oldestMessageTimestamp: null,
}

export function room(state = roomInitialState, action){
    switch(action.type){
        case RECEIVE_ROOM_INFO:
            return Object.assign({}, state, {
                members: action.members,
                createdBy: action.createdBy,
                initialFetch: true,
            })

        case RECEIVE_ROOM:
            return Object.assign({}, state, {
                id: action.id,
                name: action.name,
                initialFetch: false,
                hasUnreadMessage: action.hasUnreadMessage,
            })

        case RECEIVE_CREATE_ROOM:
            return Object.assign({}, state, {
                id: action.id,
                name: action.name,
                initialFetch: false,
            })

        case EXIST_UNREAD_MESSAGE:
            return Object.assign({}, state, {
                hasUnreadMessage: true,
            })

        case NO_UNREAD_MESSAGE:
            return Object.assign({}, state, {
                hasUnreadMessage: false,
            })

        case RECEIVE_MESSAGE:
            const { createdAt } = action.message
            return Object.assign({}, state, {
                oldestMessageTimestamp: Math.min(createdAt, state.oldestMessageTimestamp),
            })

        default:
            return state
    }
}


export function rooms(state = {byId: {}, all: []}, action){
    switch(action.type){
        case RECEIVE_ROOM: {
            let newState = Object.assign({}, state)
            if ( !newState.all.includes(action.id) ) { // TODO: make `all` a set
                newState.byId[action.id] = room(state.byId[action.id], action)
                newState.all.push(action.id)
            }
            return newState;
        }

        case RECEIVE_ROOM_INFO: {
            let newState = Object.assign({},state)
            newState.byId[action.id] = room(state.byId[action.id], action)
            return newState
        }

        case RECEIVE_CREATE_ROOM: {
            let newState = Object.assign({}, state)
            if ( !newState.all.includes(action.id) ) { // TODO: make `all` a set
                newState.byId[action.id] = room(state.byId[action.id], action)
                newState.all.push(action.id)
            }
            return newState
        }

        case RECEIVE_DELETE_ROOM: {
            let newState = Object.assign({}, state)
            const { roomId } = action
            const index = newState.all.indexOf(roomId)

            // If the room is found, delete from array "all"
            if (index > -1) {
                newState.all.splice(index, 1)
            }
            delete newState.byId[roomId]
            return newState
        }

        case EXIST_UNREAD_MESSAGE:
        case NO_UNREAD_MESSAGE: {
            let newState = Object.assign({}, state)
            newState.byId[action.roomId] = room(state.byId[action.roomId], action)
            return newState
        }

        case RECEIVE_MESSAGE: {
            const { roomId } = action.message
            let newState = Object.assign({}, state)
            newState.byId[roomId] = room(state.byId[roomId], action)
            return newState
        }

        default:
            return state
    }
}

export function addMessage(currentMessages = [], message) {
    let newMessages = currentMessages.slice();
    newMessages.push(message)
    return newMessages
}

export function messages(
    state = {
        byId: {},
        byRoomId: {},
        all: [],
    },
    action
) {
    switch (action.type) {
        case RECEIVE_MESSAGE: {
            const { id, roomId, } = action.message
            let newState = Object.assign({}, state)
            if (!newState.all.includes(id)) {
                newState.all.push(id)
                newState.byRoomId[roomId] = addMessage(newState.byRoomId[roomId], action.message.id)
                newState.byId[id] = action.message
            }
            return newState
        }

        case RECEIVE_MESSAGE_READ: {
            const { messageId, userId } = action
            let newState = Object.assign({}, state)
            if (!newState.byId[messageId].readBy.includes(userId)) {
                newState.byId[messageId].readBy.push(userId)
            }
            return newState
        }

        default:
            return state
    }
}
