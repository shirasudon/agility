import {
    RECEIVE_USER,
    REQUEST_FRIENDS,
    REQUEST_ROOM_INFO,
    RECEIVE_ROOM_INFO,
    RECEIVE_ROOM,
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
    RECEIVE_MESSAGE_READ,
    EXIST_UNREAD_MESSAGE,
    NO_UNREAD_MESSAGE,
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
            ...room
        }
    }

    fetchRoomInfo(roomId){
        return (dispatch) => {
            dispatch(this.requestRoomInfo());
            return this.chatApi.fetchRoomInfo(roomId).then((room) => {
                dispatch(this.receiveRoomInfo(room))
                return room
            })
        }
    }

    changeRoom(roomId) {
        return {
            type: CHANGE_ROOM,
            roomId,
        }
    }

    enterRoom(roomId, initialFetch=false, lastMessageId = []) {
        return (dispatch) => {
            const roomFetchPromise = new Promise((resolve, reject) => {
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

            const messageFetchPromise = new Promise((resolve, reject) => {
                if (!initialFetch) {
                    return resolve();
                }
                dispatch(this.fetchMessagesByRoomId(roomId)).then( () => {
                    resolve();
                })
            })

            return Promise.all([roomFetchPromise, messageFetchPromise]).then( () => {
                dispatch(this.changeRoom(roomId))
                dispatch(this.noUnreadMessage(roomId))
            })
        }
    }

    requestRooms(){
        return {type: REQUEST_ROOMS};
    }

    receiveRoom(room){
        return {
            type: RECEIVE_ROOM,
            ...room,
        }
    }

    fetchRooms(userId) {
        return (dispatch) => {
            dispatch(this.requestRooms())
            return this.chatApi.fetchRooms(userId).then((rooms) => {
                rooms.forEach( room => {
                    dispatch(this.receiveRoom(room))
                })
            })
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
                return Promise.all(friendIds.map( friendId => { return dispatch(this.fetchUser(friendId)) }))
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
            ...room,
        }
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

    // fetch messages of the room with `roomId`
    // When `timestamp` is 
    //   undefined: it fetches the all unread messages, as well as some read messages.
    //   otherwise: it fetches some messages posted before `timestamp`
    fetchMessagesByRoomId(roomId, timestamp) {
        return (dispatch) => {
            dispatch(this.requestMessages())
            return this.chatApi.fetchMessagesByRoomId(roomId, timestamp).then((messages) => {
                messages.forEach( message => {
                    dispatch(this.receiveMessage(message))
                })
            })
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
                else {
                    // TODO: error handling
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

    receiveMessageRead(messageId, userId) {
        return {
            type: RECEIVE_MESSAGE_READ,
            messageId,
            userId,
        }
    }

    sendMessageRead(messageIds, userId) {
        return (dispatch) => {
            return this.chatApi.messageRead(messageIds, userId).then( ok => {
                if (ok) {
                    dispatch(this.receiveMessageRead(messageIds, userId))
                }
                else {
                    // TODO: error handling
                }
            })
        }
    }

    existUnreadMessage(roomId) {
        return {
            type: EXIST_UNREAD_MESSAGE,
            roomId,
        }
    }

    noUnreadMessage(roomId) {
        return {
            type: NO_UNREAD_MESSAGE,
            roomId,
        }
    }

}

