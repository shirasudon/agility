import {
    RECEIVE_USER,
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
    REQUEST_DELETE_ROOM,
    RECEIVE_DELETE_ROOM,
    RECEIVE_FRIEND_IDS,
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
                dispatch(this.receiveRoomInfo(room))
                return room
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
                dispatch(this.fetchRoomInfo(roomId)).then( (room) => {
                    return Promise.all(
                        room.members.map( (member) => {
                            return dispatch(this.fetchUser(member))
                        })
                    )
                }).then( () => {
                    resolve()
                })
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

    fetchRooms(userId) {
        return (dispatch) => {
            dispatch(this.requestRooms());
            return this.chatApi.fetchRooms(userId).then((rooms) => {
                dispatch(this.receiveRooms(rooms));
            });
        };
    }

    receiveUser(user = {}){
        return {
            type: RECEIVE_USER,
            user
        };
    }

    fetchUser(userId) {
        return (dispatch) => {
            return this.chatApi.fetchUser(userId).then( user => {
                dispatch(this.receiveUser(user))
            })
        }
    }

    requestFriends() {
        return {
            type: REQUEST_FRIENDS,
        }
    }

    receiveFriendIds(friendIds) {
         return {
            type: RECEIVE_FRIEND_IDS,
            ids: friendIds,
        }
    }

    fetchFriends(userId) {
        return (dispatch) => {
            dispatch(this.requestFriends())
            return this.chatApi.fetchFriendIds(userId).then( friendIds => {
                dispatch(this.receiveFriendIds(friendIds))
                return Promise.all(friendIds.map( friendId => {dispatch(this.fetchUser(friendId)) }))
            })
        }
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

    createRoom(createdBy, memberIds, name) {
        const r = {
            createdBy,
            memberIds,
            name,
        }

        return (dispatch) => {
            dispatch(this.requestCreateRoom());
            return this.chatApi.createRoom(r).then( room => {
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

    deleteRoom(roomId) {
        return (dispatch) => {
            dispatch(this.requestDeleteRoom())
            return this.chatApi.deleteRoom(roomId).then( ok => {
                if (ok) {
                    dispatch(this.receiveDeleteRoom(roomId));
                }
            })
        }
    }

    requestDeleteRoom(roomId) {
        return {
            type: REQUEST_DELETE_ROOM 
        }
    }

    receiveDeleteRoom(roomId) {
        return {
            type: RECEIVE_DELETE_ROOM,
            roomId,
        }
    }

}

