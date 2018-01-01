// @format
import { Server } from 'mock-socket'

import { SEND_CHAT_MESSAGE, SEND_MESSAGE_READ } from '../constants/chat'

let mockServer

const chatMessageFactory = (roomId, userId, text) => {
  const action = {
    type: SEND_CHAT_MESSAGE,
    payload: {
      id: Math.floor(Math.random() * 100 + 1),
      roomId,
      userId,
      text,
      createdAt: Date.now(),
      readBy: [],
    },
  }
  return action
}

export default function startMockServer(url) {
  mockServer = new Server(url)
  mockServer.on('connection', server => {
    // mockServer.send('test message 1');
    // mockServer.send('test message 2');
  })

  mockServer.on('message', payload => {
    const message = JSON.parse(payload)
    switch (message.type) {
      case SEND_CHAT_MESSAGE:
        mockServer.send(
          chatMessageFactory(
            message.payload.roomId,
            message.payload.userId,
            message.payload.body
          )
        )
        mockServer.send(
          chatMessageFactory(
            message.payload.roomId,
            message.payload.userId + Math.floor(Math.random() * 10 + 1),
            `echoing "${message.payload.body}"`
          )
        )
        break

      case SEND_MESSAGE_READ:
        // TODO
        break
      default:
        break
    }
  })
}
