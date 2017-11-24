import ReconnectingWebSocket from 'reconnecting-websocket'

const ONOPEN = 'onopen'
const ONCLOSE = 'onclose'
const ONMESSAGE = 'onmessage'
const ONERROR = 'onerror'

const ALLOWED_EVENT_TYPES = [ONERROR, ONMESSAGE, ONCLOSE, ONOPEN]

export class WebSocketService {
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
      if (this.events[ONOPEN]) {
        this.events[ONOPEN](event)
      }
    }
    this.ws.onclose = this.events[ONCLOSE] || (() => {})
    this.ws.onmessage = this.events[ONMESSAGE] || (() => {})
    this.ws.onerror = this.events[ONERROR] || (() => {})
  }

  registerEvent(event, func) {
    if (ALLOWED_EVENT_TYPES.includes(event)) {
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
        console.log('Buffered: ' + JSON.stringify(data))
      }
    }
  }
}
