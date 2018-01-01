// @format

import { encode, CHAT_MESSAGE } from './encode'
import { SEND_CHAT_MESSAGE } from '../../constants/chat'

it('encodes SEND_CHAT_MESSAGE', () => {
  const input = {
    type: SEND_CHAT_MESSAGE,
    payload: {
      roomId: 2,
      userId: 3,
      body: 'hello',
    },
  }

  const expected = {
    action: CHAT_MESSAGE,
    data: {
      room_id: 2,
      sender_id: 3,
      content: 'hello',
    },
  }

  expect(encode(input)).toEqual(expected)
})

it('returns original input when type is unknown', () => {
  const input = {
    type: 'NON_EXISTING_TYPE',
    payload: {
      roomId: 2,
      userId: 3,
      body: 'hello',
    },
  }

  expect(encode(input)).toEqual(input)
})
