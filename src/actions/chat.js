import * as chat from "../api/chatApiStub";

export const RECEIVE_FRIENDS = "RECEIVE_FRIENDS";
export const REQUEST_FRIENDS = "REQUEST_FRIENDS";
export const REQUEST_ROOM_INFO = "REQUEST_ROOM_INFO";
export const RECEIVE_ROOM_INFO = "RECEIVE_ROOM_INFO";
export const RECEIVE_ROOMS = "RECEIVE_ROOMS";
export const REQUEST_ROOMS = "REQUEST_ROOMS";

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
        ...info
    };
}

export function fetchRoomInfo(roomId){
    return (dispatch) => {
        dispatch(requestRoomInfo());
        return chatApi.fetchRoomInfo(roomId).then((info) => {
            console.log(info);
            dispatch(receiveRoomInfo(info));
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
