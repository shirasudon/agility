import {
    RECEIVE_USER,
    RECEIVE_ROOMS,
    RECEIVE_ROOM_INFO,
    RECEIVE_MESSAGE,
    RECEIVE_CREATE_ROOM,
    RECEIVE_DELETE_ROOM,
    RECEIVE_MESSAGE_READ,
} from '../../actions/actionTypes';


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

export function room(state = {id: null, name: null, members: [], createdBy: null, initialFetch: false}, action){
    switch(action.type){
        case RECEIVE_ROOM_INFO:
            return Object.assign({}, state, {
                members: action.members,
                createdBy: action.createdBy,
                initialFetch: true,
            });

        case RECEIVE_ROOMS:
        case RECEIVE_CREATE_ROOM:
            return Object.assign({}, state, {
                id: action.id,
                name: action.name,
                initialFetch: false,
            });

        default:
            return state;
    }
}


export function rooms(state = {byId: {}, all: []}, action){
    switch(action.type){
        case RECEIVE_ROOMS: {
            let newState = Object.assign({}, state)
            action.rooms.forEach( r => {
                if ( !newState.all.includes(r.id) ) { // TODO: make `all` a set
                    newState.byId[r.id] = room(state.byId[r.id], {type: action.type, ...r});
                    newState.all.push(r.id)
                }
            });
            return newState;
        }

        case RECEIVE_ROOM_INFO: {
            const r = action.room;
            let newState = Object.assign(
                {},
                state
            );
            newState.byId[r.id] = room(state.byId[r.id], { type: action.type, ...r } );
            return newState;
        }

        case RECEIVE_CREATE_ROOM: {
            const r = action.room;
            let newState = Object.assign({}, state);
            if ( !newState.all.includes(r.id) ) { // TODO: make `all` a set
                newState.byId[r.id] = room(state.byId[r.id], {type: action.type, ...r} );
                newState.all.push(r.id);
            }
            return newState;
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

        default:
            return state;
    }
}

export function addMessage(currentMessages = [], message) {
    let newMessages = currentMessages.slice();
    newMessages.push(message);
    return newMessages;
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
