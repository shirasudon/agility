// @format

import moment from 'moment'

import * as ClientActionTypes from '../../actions/actionTypes'

const MESSAGE_CREATED = 'message_created'

// decode event string from the server to the format interpretable by clients
export function decode(eventStr) {
  const { event, data } = JSON.parse(eventStr)
  switch (event) {
    case MESSAGE_CREATED:
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
