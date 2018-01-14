// @format

import { NATIVE_EVENTS } from '../constants/websocket'
import * as transformer from './transformer'
import { BufferingWebSocket } from './BufferingWebSocket'
import { router } from '../actions/websocket'
import startMockServer from '../mock/mockServer'

let instance = null

export default class WebSocketService {
  constructor(store, endpoint, wsClass = BufferingWebSocket) {
    this.store = store
    this.endpoint = endpoint
    this.wsClass = wsClass
    this.connection = null
  }

  static clear() {
    instance = null
  }

  // this method should only be used during test
  static setInstance(newInstance) {
    instance = newInstance
  }

  static init(store, endpoint, wsClass = BufferingWebSocket) {
    instance = new WebSocketService(store, endpoint, wsClass)

    if (process.env.MOCK) {
      startMockServer(instance.endpoint)
    }
    const options = {
      reconnectionDelayGrowFactor: 2,
    }
    instance.connection = new wsClass(instance.endpoint, options)
    const eventHandler = type => messageEvent => {
      instance.store.dispatch(router(type, messageEvent.data))
    }
    for (let type of Object.values(NATIVE_EVENTS)) {
      instance.connection.registerEvent(type, eventHandler(type))
    }
  }

  static connect() {
    instance.connection.connect()
  }

  static emit(type, payload, buffer = false) {
    if (!instance) {
      throw new Error('You need to initialize the service first')
    }
    const data = transformer.encode({ type, payload })
    instance.connection.send(data, buffer)
  }
}
