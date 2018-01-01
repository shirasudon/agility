// @format

import { SEND_CHAT_MESSAGE } from '../../constants/chat'

export const CHAT_MESSAGE = 'CHAT_MESSAGE'

export function encode(action) {
  const { type, payload } = action
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
