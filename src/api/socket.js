const INIT_AUTO_RECONNECT_INTERVAL = 5 * 1000; // 5 sec

/**
 * Wrapper class for Websocket that enables auto reconnection.
 * The interval of auto reconnection is double every time the connection fails. When the connection is successful, the interval is reset to te initial value.
 *
 * Reference: https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect 
 */ 
class WebSocketClient {
    constructor(){
        this.init();
    } 

    init() {
        this.autoReconnectInterval = INIT_AUTO_RECONNECT_INTERVAL;
    }

    open(url) {
        this.url = url;
        this.socket = new WebSocket(this.url);
        this.socket.onopen = (e) => {
            this.init();
            this.onOpen(e);
        }
        this.socket.onmessage = this.onMessage;

        this.socket.onclose = (e) => {
            switch(e) {
                case 1000:
                    break;
                default:
                    this.reconnect(e);
                    this.autoReconnectInterval *= 2;
            }
            this.onClose(e);
        }

        this.socket.onerror = (e) => {
            switch(e.code){
                case "ECONNREFUSED":
                    this.reconnect(e);
                    this.autoReconnectInterval *= 2;
                    break;
                default:
                    this.onError(e);
                    break;
            }
        }
    }

    // to be overriden
    onOpen(e) {}

    // to be overriden
    onClose(e) {}

    // to be overriden
    onError(e) {}

    reconnect(e) {
        console.log(`reconnecting in ${this.autoReconnectInterval / 1000} seconds...`);
        setTimeout(()=>{
            this.open(this.url);
        }, this.autoReconnectInterval);
    }
}

const socket = new WebSocketClient();
socket.open("ws://localhost:8080");

export default socket;
