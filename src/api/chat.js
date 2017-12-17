// @format
import axios from 'axios'

export function fetchRooms(userId, config: {}) {
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
//
// export function fetchRoomInfo(roomId) {
//   const room = RoomTable.getRoomById(roomId);
//   if(room == null){
//       return Promise.reject();
//   }
//   else {
//       return Promise.resolve(room);
//   }
// }
//
export function fetchUser(userId, config: {}) {
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

export function fetchFriendIds(userId, config: {}) {
  return axios.get(`/chat/users/${userId}`, config).then(response => {
    const body = response.data
    if (Number(body.user_id) !== userId) {
      throw new Error('response user_id does not equal userId')
    }
    return body.friends.map(friend => friend.user_id)
  })
}

// export function fetchMessagesByRoomId(roomId) {
//   const messages = MessageTable.getMessagesByRoomId(roomId);
//   return Promise.resolve(messages);
// }
//
// export function createRoom(room) {
//   const newRoom = RoomTable.addRoom(room);
//   return new Promise( resolve => {
//       setTimeout(
//           () => { resolve(newRoom) }
//           , 1500
//       ) // return after 1.5 second
//   });
// }
//
// export function deleteRoom(roomId) {
//   console.log(`chatApiStub deleted room {roomId}`)
//   return Promise.resolve(true)
// }
