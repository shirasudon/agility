// @format

import { SEND_CHAT_MESSAGE } from '../../actions/actionTypes'

const CHAT_MESSAGE = 'CHAT_MESSAGE'

export function encode(action) {
  const { type, payload } = action
  console.log(action)
  switch (type) {
    case SEND_CHAT_MESSAGE:
      return {
        action: CHAT_MESSAGE,
        data: {
          room_id: payload.roomId,
          sender_id: payload.userId,
          content: payload.body,
        },
      }
    default:
      return action
  }
}
