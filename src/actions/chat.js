import * as chat from "../api/chatApiStub";

import {
    RECEIVE_FRIENDS,
    REQUEST_FRIENDS,
    REQUEST_ROOM_INFO,
    RECEIVE_ROOM_INFO,
    RECEIVE_ROOMS,
    REQUEST_ROOMS,
    REQUEST_ROOM,
    REQUEST_CREATE_ROOM,
    RECEIVE_CREATE_ROOM,
    REQUEST_MESSAGES,
    RECEIVE_MESSAGE,
} from './actionTypes'

let chatApi = chat;

export function setChatApi(api) {
    chatApi = api; 
}

export function requestRoomInfo(){
    return {type: REQUEST_ROOM_INFO};
}

export function receiveRoomInfo(room){
    return {
        type: RECEIVE_ROOM_INFO,
        room,
    };
}

export function fetchRoomInfo(roomId){
    return (dispatch) => {
        chatApi.fetchRoomInfo(roomId).then((room) => {
            dispatch(receiveRoomInfo(room));
        });
    }
}

export function enterRoom(roomId) {
    return (dispatch) => {
        const roomPromise = new Promise((resolve, reject) => {
            dispatch(requestRoomInfo());
            dispatch(fetchRoomInfo(roomId));
        });
        const messagePromise = new Promise((resolve, reject) => {
            dispatch(requestMessages());
            dispatch(fetchMessagesByRoomId(roomId));
        });
        Promise.all([roomPromise, messagePromise]).then( () => {
            console.log("Enter room done");
        });
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

export function requestCreateRoom() {
    return {
        type: REQUEST_CREATE_ROOM,
    };
}

export function receiveCreateRoom(room = {}) {
    return {
        type: RECEIVE_CREATE_ROOM,
        room,
    };
}

export function requestMessages() {
    return {
        type: REQUEST_MESSAGES,
    };
}

export function receiveMessage(message) {
    return {
        type: RECEIVE_MESSAGE,
        message,
    };
}

export function fetchMessagesByRoomId(roomId) {
    return (dispatch) => {
        dispatch(requestMessages());
        return chatApi.fetchMessagesByRoomId(roomId).then((messages) => {
            messages.forEach( message => {
                dispatch(receiveMessage(message));
            });
        });
    };
}

export function createRoom(room) {
    return (dispatch) => {
        dispatch(requestCreateRoom());
        chatApi.createRoom(room);
    };
}
