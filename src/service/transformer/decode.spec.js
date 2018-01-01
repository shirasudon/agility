// @format

import moment from 'moment'

import { decode } from './decode'
import { MESSAGE_CREATED } from '../../constants/websocket'
import { SEND_CHAT_MESSAGE } from '../../constants/chat'

it('decodes message_created JSON string', () => {
  const responseStr = JSON.stringify({
    event: MESSAGE_CREATED,
    data: {
      message_id: 1,
      room_id: 2,
      content: 'hello there',
      created_by: 3,
      created_at: '2017-12-26T00:07:03.004699564+09:00',
    },
  })

  const expected = {
    type: SEND_CHAT_MESSAGE,
    payload: {
      id: 1,
      roomId: 2,
      text: 'hello there',
      userId: 3,
      createdAt: moment('2017-12-26T00:07:03.004699564+09:00').valueOf(),
      readBy: [],
    },
  }

  expect(decode(responseStr)).toEqual(expected)
})

it('decodes unidentified event string to an obect with type and payload', () => {
  const responseStr = JSON.stringify({
    event: 'NONEXISTING_EVENT',
    data: {
      hello: 'there',
    },
  })

  const expected = {
    type: 'NONEXISTING_EVENT',
    payload: {
      hello: 'there',
    },
  }

  expect(decode(responseStr)).toEqual(expected)
})
