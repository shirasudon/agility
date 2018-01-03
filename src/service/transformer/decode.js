// @format

import moment from 'moment'

import * as ClientActionTypes from '../../constants/chat'
import * as ServerActionTypes from '../../constants/websocket'

// decode event string from the server to the format interpretable by clients
export function decode(eventStr) {
  const { event, data } = JSON.parse(eventStr)
  switch (event) {
    case ServerActionTypes.MESSAGE_CREATED:
      return {
        type: ClientActionTypes.SEND_CHAT_MESSAGE,
        payload: {
          id: Number(data.message_id),
          roomId: Number(data.room_id),
          text: data.content,
          userId: Number(data.created_by),
          createdAt: moment(data.created_at).valueOf(),
          readBy: [],
        },
      }
    default:
      return {
        type: event,
        payload: data,
      }
  }
}
