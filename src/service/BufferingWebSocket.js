// @format

import ReconnectingWebSocket from 'reconnecting-websocket'
import { NATIVE_EVENTS } from '../constants/websocket'

export class BufferingWebSocket {
  constructor(endpoint, options = {}, WebSocketClass = ReconnectingWebSocket) {
    this.ws = null
    this.endpoint = endpoint
    this.events = {}
    this.options = options
    this.buffer = [] // buffer the messages to be sent on successful connection
    this.wsClass = WebSocketClass
  }

  connect() {
    this.ws = new this.wsClass(this.endpoint, [], this.options)
    this.ws.onopen = event => {
      while (true) {
        const data = this.buffer.shift()
        if (!data) {
          break
        }
        this.send(data, true)
      }
      if (this.events[NATIVE_EVENTS.onopen]) {
        this.events[NATIVE_EVENTS.onopen](event)
      }
    }
    this.ws.onclose = this.events[NATIVE_EVENTS.onclose] || (() => {})
    this.ws.onmessage = this.events[NATIVE_EVENTS.onmessage] || (() => {})
    this.ws.onerror = this.events[NATIVE_EVENTS.onerror] || (() => {})
  }

  registerEvent(event, func) {
    if (Object.values(NATIVE_EVENTS).includes(event)) {
      this.events[event] = func
      return
    }
    throw new Error(`Event type ${event} is not supported`)
  }

  send(data, enableBuffer = false) {
    try {
      if (this.ws.readyState !== 1) {
        throw new Error('Socket not opened')
      }
      this.ws.send(JSON.stringify(data))
    } catch (err) {
      if (enableBuffer) {
        this.buffer.push(data)
      }
    }
  }
}
