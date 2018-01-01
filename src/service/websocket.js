// @format

import { NATIVE_EVENTS } from '../constants/websocket'
import * as transformer from './transformer'
import { BufferingWebSocket } from './BufferingWebSocket'
import startMockServer from '../mock/mockServer'

let connection = null

export const setConnection = newConnection => {
  connection = newConnection
}

export const initWebsocketService = (
  store,
  endpoint,
  wsService = BufferingWebSocket
) => {
  if (process.env.MOCK) {
    startMockServer(endpoint)
  }
  const options = {
    reconnectionDelayGrowFactor: 2,
  }
  setConnection(new wsService(endpoint, options))
  for (let type of Object.keys(NATIVE_EVENTS)) {
    connection.registerEvent(type, payload => {
      store.dispatch({ type, payload })
    })
  }
  connection.connect()
}

export const emit = (type, payload, buffer = false) => {
  if (connection == null) {
    throw new Error('connection is not yet initialized')
  }
  const data = transformer.encode(type, payload)
  connection.send(data, buffer)
}
