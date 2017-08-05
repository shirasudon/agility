import {RECEIVE_FRIENDS, RECEIVE_ROOMS, RECEIVE_ROOM_INFO} from '../actions/chat';

const initialFriend = {
    username: "",
    lastName: "",
    firstName: ""
};

export function friend(state = initialFriend, action) {
    switch(action.type) {
        case RECEIVE_FRIENDS:
             return Object.assign({}, state, {
                 username: action.username,
                 lastName: action.lastName,
                 firstName: action.firstName,
            }); 
        default:
            return state;
    }
}

export function friends(state = [], action){
    switch(action.type){
        case RECEIVE_FRIENDS:
            return action.friends.map((f, index) => 
                friend(undefined, {type: action.type, ...f})
            );
        default:
            return state;
    }
}

export function room(state = {id: null, name: null, initialFetch: false, messages: [], members: []}, action){
    switch(action.type){
        case RECEIVE_ROOM_INFO:
            return Object.assign({}, state, {
                messages: action.messages,
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

const initialRooms = {};

export function rooms(state = initialRooms, action){
    switch(action.type){
        case RECEIVE_ROOMS:
            let newState = {};
            action.rooms.forEach((r, index) => {
                newState[r.id] = room(state[action.id], {type: action.type, ...r});
            });
            return newState;

        case RECEIVE_ROOM_INFO:
            return Object.assign(
                {}, 
                state,
                {
                    [action.id]: room(state[action.id], action)
                }
            );
        default:
            return state;
    }
}
