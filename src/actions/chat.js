import {
    RECEIVE_FRIENDS,
    REQUEST_FRIENDS,
    REQUEST_ROOM_INFO,
    RECEIVE_ROOM_INFO,
    RECEIVE_ROOMS,
    REQUEST_ROOMS,
    REQUEST_CREATE_ROOM,
    RECEIVE_CREATE_ROOM,
    REQUEST_MESSAGES,
    RECEIVE_MESSAGE,
    CHANGE_ROOM,
    OPEN_CREATE_GROUP_MODAL,
    CLOSE_CREATE_GROUP_MODAL,
    SEND_CHAT_MESSAGE,
} from './actionTypes'


export default class ChatActionCreator {
    constructor(chatApi) {
        this.setChatApi(chatApi);
    }

    setChatApi(newApi) {
        this.chatApi = newApi;
    }

    requestRoomInfo(){
        return {type: REQUEST_ROOM_INFO};
    }

    receiveRoomInfo(room){
        return {
            type: RECEIVE_ROOM_INFO,
            room,
        };
    }

    fetchRoomInfo(roomId){
        return (dispatch) => {
            dispatch(this.requestRoomInfo());
            return this.chatApi.fetchRoomInfo(roomId).then((room) => {
                dispatch(this.receiveRoomInfo(room));
            });
        }
    }

    changeRoom(roomId) {
        return {
            type: CHANGE_ROOM,
            roomId,
        };
    }

    enterRoom(roomId, initialFetch=false) {
        return (dispatch) => {
            const p1 = new Promise((resolve, reject) => {
                if (!initialFetch) {
                   return resolve();
                }
                dispatch(this.fetchRoomInfo(roomId)).then( () => {
                    resolve();
                });
            });

            const p2 = new Promise((resolve, reject) => {
                if (!initialFetch) {
                    return resolve();
                }
                dispatch(this.fetchMessagesByRoomId(roomId)).then( () => {
                    resolve();
                })
            });

            return Promise.all([p1, p2]).then( () => {
                dispatch(this.changeRoom(roomId));
            });
        }
    }

    requestRooms(){
        return {type: REQUEST_ROOMS};
    }

    receiveRooms(rooms = {}){
        return {
            type: RECEIVE_ROOMS,
            rooms 
        };
    }

    fetchRooms() {
        return (dispatch) => {
            dispatch(this.requestRooms());
            return this.chatApi.fetchRooms().then((rooms) => {
                dispatch(this.receiveRooms(rooms));
            });
        };
    }

    requestFriends(){
        return {type: REQUEST_FRIENDS};
    }

    receiveFriends(friends = {}){
        return {
            type: RECEIVE_FRIENDS,
            friends
        };
    }

    fetchFriends() {
        return (dispatch) => {
            dispatch(this.requestFriends());
            return this.chatApi.fetchFriends().then((friends) => {
                dispatch(this.receiveFriends(friends));
            });
        };
    }

    requestCreateRoom() {
        return {
            type: REQUEST_CREATE_ROOM,
        };
    }

    receiveCreateRoom(room) {
        return {
            type: RECEIVE_CREATE_ROOM,
            room,
        };
    }

    requestMessages() {
        return {
            type: REQUEST_MESSAGES,
        };
    }

    receiveMessage(message) {
        return {
            type: RECEIVE_MESSAGE,
            message,
        };
    }

    fetchMessagesByRoomId(roomId) {
        return (dispatch) => {
            dispatch(this.requestMessages());
            return this.chatApi.fetchMessagesByRoomId(roomId).then((messages) => {
                messages.forEach( message => {
                    dispatch(this.receiveMessage(message));
                });
            });
        };
    }

    createRoom(room) {
        return (dispatch) => {
            dispatch(this.requestCreateRoom());
            return this.chatApi.createRoom(room).then( room => {
                dispatch(this.receiveCreateRoom(room));
            });
        };
    }

    openCreateGroupModal() {
        return {
            type: OPEN_CREATE_GROUP_MODAL,
        }
    }

    closeCreateGroupModal() {
        return {
            type: CLOSE_CREATE_GROUP_MODAL,
        }
    }

    sendMessage(message) {
        return {
            type: SEND_CHAT_MESSAGE,
            data: message,
        }
    }
}

