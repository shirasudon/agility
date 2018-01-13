// @format

import axios from 'axios'
import moment from 'moment'
import { SERVER_TIME_FORMAT } from '../constants/time'

export function fetchRooms(userId, config = {}) {
  return axios.get(`/chat/users/${userId}`, config).then(response => {
    const body = response.data
    if (Number(body.user_id) !== userId) {
      throw new Error('response user_id does not equal userId')
    }
    return body.rooms.map(room => ({
      id: room.room_id,
      name: room.room_name,
    }))
  })
}

export function fetchRoomInfo(roomId, config = {}) {
  return axios.get(`/chat/rooms/${roomId}`, config).then(response => {
    const body = response.data

    // TODO: follow the server side spec when it is ready
    let members = []
    for (let member of body.room_members) {
      members.push([member.user_id, { readAt: member.read_at || -1 }])
    }

    return {
      id: body.room_id,
      name: body.room_name,
      members,
      createdBy: Number(body.room_creator_id),
      hasUnreadMessage: false, // TODO: correctly fetches the info
    }
  })
}

export function fetchUser(userId, config = {}) {
  return axios.get(`/chat/users/${userId}`, config).then(response => {
    const body = response.data
    if (Number(body.user_id) !== userId) {
      throw new Error('response user_id does not equal userId')
    }
    return {
      id: userId,
      username: body.user_name,
      lastName: body.last_name,
      firstName: body.first_name,
    }
  })
}

export function fetchFriendIds(userId, config = {}) {
  return axios.get(`/chat/users/${userId}`, config).then(response => {
    const body = response.data
    if (Number(body.user_id) !== userId) {
      throw new Error('response user_id does not equal userId')
    }
    return body.friends.map(friend => friend.user_id)
  })
}

export const messageMapper = (message, roomId) => ({
  id: message.message_id,
  roomId,
  userId: message.user_id,
  text: message.content,
  createdAt: moment(message.created_at).valueOf(),
})

export function fetchUnreadMessages(roomId, config) {
  return axios
    .get(`/chat/rooms/${roomId}/messages/unread`, config)
    .then(response => {
      const body = response.data
      if (Number(body.room_id) !== roomId) {
        throw new Error('response room_id does not equal roomId')
      }
      return body.messages.map(message => messageMapper(message, roomId))
    })
}

// fetches all unread messages and extra read messages
// @param {Number} roomId  - room ID whose messages you want to fetch
// @param {Number} before  - target messages that were posted before `before`
//                           If this parameter is undefined, it will try to fetch all unread messages with additional read messages to make # of received messages >= `atLeast`
// @param {Number} atLeast - fetches at least the number of messages specified by this parameter, //                           only when # of messages in the room is >= `atLeast`. If # of unread
//                           messages is < `atLeast`, the messages are appended with appended
//                           with the latest read messages to make the number `atLeast`
export function fetchMessagesByRoomId(
  roomId,
  before,
  atLeast = 10,
  config = {}
) {
  if (atLeast <= 0) {
    throw new Error('atLeast should be an positive integer')
  }
  let messages = []
  let limit = atLeast
  let unreadPromise = null
  if (before) {
    unreadPromise = Promise.resolve()
  } else {
    unreadPromise = fetchUnreadMessages(roomId, config).then(msgs => {
      messages = msgs
      limit = Math.max(atLeast - msgs.length, 0)
      if (msgs.length > 0) {
        // this if statement is probably unnecessary, because when the array is empty Math.min returns Infinity and it still can get latest messages
        before = Math.min(...msgs.map(msg => msg.createdAt))
      }
    })
  }

  return unreadPromise
    .then(() => {
      if (limit <= 0) {
        // do not make any unnecessary connection
        return null
      }
      let url = `/chat/rooms/${roomId}/messages`
      let params = {
        limit,
      }
      if (before) {
        params = {
          ...params,
          before: moment(before).format(SERVER_TIME_FORMAT),
        }
        console.log('before:', before)
      }
      return axios.get(url, Object.assign(config, { params }))
    })
    .then(response => {
      if (response) {
        const body = response.data
        if (Number(body.room_id) !== roomId) {
          throw new Error('response room_id does not equal roomId')
        }
        const readMessages = body.messages.map(message =>
          messageMapper(message, roomId)
        )
        messages = messages.concat(readMessages)
      }
      return messages
    })
}

export function createRoom(room, config = {}) {
  // TODO: better to migrate this transformation to transformer.js?
  const data = {
    sender_id: room.createdBy,
    room_name: room.name,
    room_member_ids: room.members,
  }
  return axios.post('/chat/rooms', data, config).then(response => {
    const body = response.data
    return {
      id: body.room_id,
      name: room.name,
    }
  })
}

export function deleteRoom(roomId, config = {}) {
  return axios.delete(`/chat/rooms/${roomId}`, config)
}

export function sendMessageRead(roomId, readAt, config = {}) {
  return axios.post(
    `/chat/rooms/${roomId}/messages/read`,
    { room_id: roomId, read_at: moment(readAt).format(SERVER_TIME_FORMAT) },
    config
  )
}
