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

export function room(state = {}, action){
    switch(action.type){
        case RECEIVE_ROOM_INFO:
            return Object.assign({}, state, {
                messages: action.messages,
                members: action.members,
                initialFetch: true,
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
            action.rooms.forEach((room, index) => {
                newState[room.id] = {
                    id: room.id,
                    name: room.name,
                    initialFetch: false,
                };
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
