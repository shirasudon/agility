import {combineReducers} from 'redux';

import {
    RECEIVE_FRIENDS, 
    RECEIVE_ROOMS,
    RECEIVE_ROOM_INFO, 
    REQUEST_CREATE_ROOM,
    RECEIVE_MESSAGE, 
    CHANGE_ROOM,
} from '../actions/actionTypes';

export function currentRoomId(state = null, action) {
    switch (action.type) {
        case CHANGE_ROOM:
            return action.roomId;
        default:
            return state;
    }
}

function friends(state = {byUsername: {}, all: []}, action){
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

function room(state = {id: null, name: null, members: [], initialFetch: false}, action){
    switch(action.type){
        case RECEIVE_ROOM_INFO:
            return Object.assign({}, state, {
                members: action.members,
                initialFetch: true,
            });

        case RECEIVE_ROOMS:
            return Object.assign({}, state, {
                id: action.id,
                name: action.name,
                initialFetch: false,
            });

        default:
            return state;
    }
}


function rooms(state = {byId: {}, all: []}, action){
    switch(action.type){
        case RECEIVE_ROOMS: {
            let newState = {byId: {}, all: []};
            action.rooms.forEach((r, index) => {
                newState.byId[r.id] = room(state.byId[action.id], {type: action.type, ...r});
                newState.all.push(r.id);
            });
            return newState;
        }

        case RECEIVE_ROOM_INFO: {
            let newState = Object.assign(
                {},
                state
            );

            newState.byId[action.id] = room(state.byId[action.id], action);
            return newState;
        }
        default:
            return state;
    }
}

function addMessage(currentMessages = [], message) {
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
            const {id, roomId, } = action.message;
            let newState = Object.assign({}, state);
            newState.all.push(id);
            newState.byRoomId[roomId] = addMessage(newState.byRoomId[roomId], action.message);
            newState.byId[id] = action.message;
            return newState;
        default:
            return state;
    }
}

export function ui(state = {isRequesting: false,}, action) {
    switch (action.type) {
        case REQUEST_CREATE_ROOM:
            return Object.assign(
                {},
                state,
                {isRequesting: true}
            );
        default:
            return state;
    }
}

export const entities = combineReducers({
    friends,
    rooms,
    messages
});

