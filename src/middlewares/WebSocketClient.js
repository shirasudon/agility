const INIT_AUTO_RECONNECT_INTERVAL = 5 * 1000; // 5 sec

/**
 * Wrapper class for Websocket that enables auto reconnection.
 * The interval of auto reconnection is double every time the connection fails. When the connection is successful, the interval is reset to te initial value.
 *
 * Reference: https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect 
 */ 
export class WebSocketClient {
    constructor(socketClass: WebSocket){
        this.init()
        this.socketClass = socketClass
    } 

    init() {
        this.autoReconnectInterval = INIT_AUTO_RECONNECT_INTERVAL;
    }

    _onclose(e) {
        switch(e) {
            case 1000:
                break;
            default:
                this.reconnect(e)
                this.autoReconnectInterval *= 2
        }
        this.onClose(e)
    }

    _onerror(e) {
        switch(e.code){
            case "ECONNREFUSED":
                this.reconnect(e)
                this.autoReconnectInterval *= 2
                break
            default:
                break
        }
        this.onError(e)
    }

    _onopen(e) {
        this.init()
        this.onOpen(e)
    }

    open(url) {
        this.url = url;
        this.socket = new this.socketClass(this.url);
        this.socket.onopen = this._onopen.bind(this)
        this.socket.onmessage = this.onMessage
        this.socket.onclose = this._onclose.bind(this)
        this.socket.onerror = this._onerror.bind(this)
    }

    // to be overriden
    onMessage(e) {
        throw new Error("onMessage should be overwritten") 
    }

    // to be overriden
    onOpen(e) {
        throw new Error("onOpen should be overwritten") 
    }

    // to be overriden
    onClose(e) {
        throw new Error("onClose should be overwritten") 
    }

    // to be overriden
    onError(e) {
        throw new Error("onError should be overwritten")     
    }

    reconnect(e) {
        console.log(`reconnecting in ${this.autoReconnectInterval / 1000} seconds...`)
        setTimeout(()=>{
            this.open(this.url)
        }, this.autoReconnectInterval)
    }

    send(data, option) {
        try {
            this.socket.send(data, option)
        } catch (e){
            this.socket.emit('error', e)
        }
    }
}

export default WebSocketClient
