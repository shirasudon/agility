import { 
    SEND_CHAT_MESSAGE, 
    SEND_MESSAGE_READ
} from '../actions/actionTypes'
import { chatActionCreator } from '../actions'
import { WebSocketClient } from './WebSocketClient'
import startMockServer from '../mock/mockServer'

// returns a function to be called when receiving a message through websocket
const onMessage = store => event => {
    console.log("Received:", event.data)
    const { type, data } = event.data 
    switch (type) {
        case SEND_CHAT_MESSAGE:
            store.dispatch(chatActionCreator.receiveMessage(data))
            break
        case SEND_MESSAGE_READ:
            store.dispatch(chatActionCreator.receiveMessageRead(data))
            break
        default:
            break
    }
}

export function setupConnection(endpoint, store, socketClass = WebSocket) {
    const connection = new WebSocketClient(socketClass)
    connection.onMessage = onMessage(store)
    connection.onClose = () => { }
    connection.onOpen = () => { } 

    connection.open(endpoint)
    return connection
}

export function initializeWebSocket(mode) {
    switch (mode) {
        case "development":
            const socketURI = "ws://localhost:8080/chat/ws"
            startMockServer(socketURI)
            return socketURI 

        case "production":
            //TODO: implement
            throw new Error("Run mode " + process.env.NODE_ENV + " not implemented")

        case "test":
            //TODO: implement
            throw new Error("Run mode " + process.env.NODE_ENV + " not implemented")

        default:
            throw new Error("Run mode " + process.env.NODE_ENV + " is invalid")

    }
}

export const createWebSocketMiddleware = (endpoint, options = { connection: null, setupConnection: setupConnection } ) => {
    let connection = options.connection || null
    const setup = options.setupConnection
    return store => {
        if (connection == null) {
            connection = setup(endpoint, store)
        }
        return next => action => {
            switch (action.type) {
                case SEND_CHAT_MESSAGE:
                    connection.send(JSON.stringify({
                        type: SEND_CHAT_MESSAGE,
                        data: action.data
                    }))
                    break
                case SEND_MESSAGE_READ:
                    connection.send(JSON.stringify({
                        type: SEND_MESSAGE_READ,
                        data: action.data,
                    }))
                    break
                default:
                    break
            }
            next(action)
        }
    }
}

export default createWebSocketMiddleware
