// @format
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
  SEND_MESSAGE_READ,
  UNREAD_MESSAGES,
} from '../constants/chat'

export default class ChatActionCreator {
  constructor(chatApi) {
    this.setChatApi(chatApi)
  }

  setChatApi(newApi) {
    this.chatApi = newApi
  }

  requestRoomInfo() {
    return { type: REQUEST_ROOM_INFO }
  }

  receiveRoomInfo(room) {
    return {
      type: RECEIVE_ROOM_INFO,
      payload: {
        ...room,
      },
    }
  }

  fetchRoomInfo(roomId) {
    return dispatch => {
      dispatch(this.requestRoomInfo())
      return this.chatApi.fetchRoomInfo(roomId).then(room => {
        dispatch(this.receiveRoomInfo(room))
        return room
      })
    }
  }

  changeRoom(roomId) {
    return {
      type: CHANGE_ROOM,
      payload: {
        roomId,
      },
    }
  }

  enterRoom(roomId, initialFetch = false, lastMessageId = []) {
    return dispatch => {
      const roomFetchPromise = new Promise((resolve, reject) => {
        if (!initialFetch) {
          return resolve()
        }
        dispatch(this.fetchRoomInfo(roomId))
          .then(room => {
            return Promise.all(
              room.members.map(member => {
                return dispatch(this.fetchUser(member))
              })
            )
          })
          .then(() => {
            resolve()
          })
      })

      const messageFetchPromise = new Promise((resolve, reject) => {
        if (!initialFetch) {
          return resolve()
        }
        dispatch(this.fetchMessagesByRoomId(roomId)).then(() => {
          resolve()
        })
      })

      return Promise.all([roomFetchPromise, messageFetchPromise]).then(() => {
        dispatch(this.changeRoom(roomId))
        dispatch(this.unreadMessages(roomId, false))
      })
    }
  }

  requestRooms() {
    return { type: REQUEST_ROOMS }
  }

  receiveRoom(room) {
    return {
      type: RECEIVE_ROOM,
      payload: {
        ...room,
      },
    }
  }

  fetchRooms(userId) {
    return dispatch => {
      dispatch(this.requestRooms())
      return this.chatApi.fetchRooms(userId).then(rooms => {
        rooms.forEach(room => {
          dispatch(this.receiveRoom(room))
        })
      })
    }
  }

  receiveUser(user = {}) {
    return {
      type: RECEIVE_USER,
      payload: {
        ...user,
      },
    }
  }

  fetchUser(userId) {
    return dispatch => {
      return this.chatApi.fetchUser(userId).then(user => {
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
      payload: {
        ids: friendIds,
      },
    }
  }

  fetchFriends(userId) {
    return dispatch => {
      dispatch(this.requestFriends())
      return this.chatApi.fetchFriendIds(userId).then(friendIds => {
        dispatch(this.receiveFriendIds(friendIds))
        return Promise.all(
          friendIds.map(friendId => {
            return dispatch(this.fetchUser(friendId))
          })
        )
      })
    }
  }

  requestCreateRoom() {
    return {
      type: REQUEST_CREATE_ROOM,
    }
  }

  receiveCreateRoom(id, name) {
    return {
      type: RECEIVE_CREATE_ROOM,
      payload: {
        id,
        name,
      },
    }
  }

  requestMessages() {
    return {
      type: REQUEST_MESSAGES,
    }
  }

  receiveMessage(message) {
    return {
      type: RECEIVE_MESSAGE,
      payload: {
        ...message,
      },
    }
  }

  /* fetch messages of the room with `roomId`
   @param {Number} roomId - room ID
   @param {Number} before -
     undefined: it fetches the all unread messages, as well as some read messages.
     otherwise: it fetches some messages posted before `before`
   @param {Number} atLeast - fetch at least `atLeast` messages if exists
  */

  fetchMessagesByRoomId(roomId, before, atLeast) {
    return dispatch => {
      dispatch(this.requestMessages())
      return this.chatApi
        .fetchMessagesByRoomId(roomId, before)
        .then(messages => {
          messages.forEach(message => {
            dispatch(this.receiveMessage(message))
          })
        })
    }
  }

  createRoom(createdBy, members, name) {
    const r = {
      createdBy,
      members,
      name,
    }

    return dispatch => {
      dispatch(this.requestCreateRoom())
      return this.chatApi.createRoom(r)
    }
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
    return (dispatch, getState, { emit }) => {
      emit(SEND_CHAT_MESSAGE, {
        ...message,
      })
    }
  }

  deleteRoom(roomId) {
    return dispatch => {
      dispatch(this.requestDeleteRoom())
      return this.chatApi.deleteRoom(roomId)
    }
  }

  requestDeleteRoom(roomId) {
    return {
      type: REQUEST_DELETE_ROOM,
    }
  }

  receiveDeleteRoom(roomId) {
    return {
      type: RECEIVE_DELETE_ROOM,
      payload: {
        roomId,
      },
    }
  }

  receiveMessageRead(messageId, userId) {
    return {
      type: RECEIVE_MESSAGE_READ,
      payload: {
        messageId,
        userId,
      },
    }
  }

  sendMessageRead(messageIds, userId) {
    return (dispatch, getState, { emit }) => {
      emit({
        type: SEND_MESSAGE_READ,
        payload: {
          messageIds,
          userId,
        },
      })
    }
  }

  unreadMessages(roomId, exist) {
    return {
      type: UNREAD_MESSAGES,
      payload: {
        exist,
        roomId,
      },
    }
  }
}
