import ReconnectingWebSocket from 'reconnecting-websocket'

import { 
    SEND_CHAT_MESSAGE, 
    SEND_MESSAGE_READ
} from '../actions/actionTypes'
import { chatActionCreator } from '../actions'
import startMockServer from '../mock/mockServer'


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

// returns a function to be called when receiving a message through websocket
export const createOnMessage = store => event => {
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

export const createOnClose = store => event => {
    console.error("Websocket connection is lost trying to reconnect.")
}

export const createWebSocketMiddleware = (endpoint, WebSocketClass = ReconnectingWebSocket) => {

    return store => {

        const options = {
            reconnectionWebSocketFactory: 2,
        }
        const connection = new WebSocketClass(endpoint, [], options)
        connection.onmessage = createOnMessage(store)
        connection.onclose = createOnClose(store)

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
