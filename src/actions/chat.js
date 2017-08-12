import * as chat from "../api/chatApiStub";

export const RECEIVE_FRIENDS = "RECEIVE_FRIENDS";
export const REQUEST_FRIENDS = "REQUEST_FRIENDS";
export const REQUEST_ROOM_INFO = "ENTER_ROOM";
export const RECEIVE_ROOM_INFO = "RECEIVE_ROOM_INFO";
export const RECEIVE_ROOMS = "RECEIVE_ROOMS";
export const REQUEST_ROOMS = "REQUEST_ROOMS";
export const REQUEST_ROOM = "REQUEST_ROOM";

let chatApi = chat;

export function setChatApi(api) {
    chatApi = api; 
}

export function requestRoomInfo(){
    return {type: REQUEST_ROOM_INFO};
}

export function receiveRoomInfo(info){
    return {
        type: RECEIVE_ROOM_INFO,
        room: info
    };
}

export function fetchRoomInfo(roomId){
    return (dispatch) => {
        return chatApi.fetchRoomInfo(roomId).then((info) => {
            dispatch(receiveRoomInfo(info));
        });
    }
}

export function enterRoom(roomId, shouldFetch) {
    return (dispatch) => {
        dispatch(requestRoomInfo());
        if(shouldFetch){
            dispatch(fetchRoomInfo(roomId));
        }
    }
}

export function requestRooms(){
    return {type: REQUEST_ROOMS};
}

export function receiveRooms(rooms = {}){
    return {
        type: RECEIVE_ROOMS,
        rooms 
    };
}

export function fetchRooms() {
    return (dispatch) => {
        dispatch(requestRooms());
        return chatApi.fetchRooms().then((rooms) => {
            dispatch(receiveRooms(rooms));
        });
    };
}

export function requestFriends(){
    return {type: REQUEST_FRIENDS};
}

export function receiveFriends(friends = {}){
    return {
        type: RECEIVE_FRIENDS,
        friends
    };
}


export function fetchFriends() {
    return (dispatch) => {
        dispatch(requestFriends());
        return chatApi.fetchFriends().then((friends) => {
            dispatch(receiveFriends(friends));
        });
    };
}
