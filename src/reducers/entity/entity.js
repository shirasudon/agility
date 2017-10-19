import {
    RECEIVE_FRIENDS,
    RECEIVE_ROOMS,
    RECEIVE_ROOM_INFO,
    RECEIVE_MESSAGE,
    CHANGE_ROOM, 
    RECEIVE_CREATE_ROOM,
} from '../../actions/actionTypes';


export function friends(state = {byUsername: {}, all: []}, action){
    switch(action.type){
        case RECEIVE_FRIENDS:
            let newState = {byUsername: {}, all: []};
            action.friends.forEach((f, index) => {
                newState.byUsername[f.username] = Object.assign({}, f);
                newState.all.push(f.username);
            });
            return newState;
        default:
            return state;
    }
}

export function room(state = {id: null, name: null, members: [], initialFetch: false}, action){
    switch(action.type){
        case RECEIVE_ROOM_INFO:
            return Object.assign({}, state, {
                members: action.members,
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
                newState.byId[r.id] = room(state.byId[r.id], {type: action.type, ...r});
                newState.all.push(r.id);
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
            newState.byId[r.id] = room(state.byId[r.id], {type: action.type, ...r} );
            newState.all.push(r.id);
            return newState;
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
        case RECEIVE_MESSAGE:
            const { id, roomId, } = action.message;
            let newState = Object.assign({}, state);
            newState.all.push(id);
            newState.byRoomId[roomId] = addMessage(newState.byRoomId[roomId], action.message.id);
            newState.byId[id] = action.message;
            return newState;
        default:
            return state;
    }
}
