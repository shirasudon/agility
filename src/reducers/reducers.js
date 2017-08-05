import {RECEIVE_FRIENDS, RECEIVE_ROOMS, RECEIVE_ROOM_INFO} from '../actions/chat';

const initialFriends = [
    {
        username: "hitochan",
        lastName: "Hitoshi",
        firstName: "Otsuki"
    },
    {
        username: "tasaki",
        lastName: "Tsukuru",
        firstName: "Tasaki"
    },
    {
        username: "furugura",
        lastName: "Calbee",
        firstName: "Fruit"
    },
];

export function friends(state = initialFriends, action){
    switch(action.type){
        case RECEIVE_FRIENDS:
            return state;
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
