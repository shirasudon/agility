import { SEND_CHAT_MESSAGE } from '../actions/actionTypes'
import { chatActionCreator } from '../actions'
import { WebSocketClient } from './WebSocketClient'
import startMockServer from '../mock/mockServer'

function setupConnection(endpoint, store) {
    const connection = new WebSocketClient(WebSocket)
    connection.onMessage = (event) => {
        store.dispatch(chatActionCreator.receiveMessage(event.data));
        console.log("Received:", event.data);
    }
    connection.onClose = () => { }
    connection.onOpen = () => { } 

    connection.open(endpoint)
    return connection
}

export function initializeWebSocket() {
    switch (process.env.NODE_ENV) {
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

export const createWebSocketMiddleware = endpoint => {
    let connection = null;
    return store => {
        if (connection == null) {
            connection = setupConnection(endpoint, store)    
        }
        return next => action => {
            if(action.type === SEND_CHAT_MESSAGE) {
                connection.send(JSON.stringify({
                    type: SEND_CHAT_MESSAGE,
                    data: action.data
                }))
            }

            next(action)
        }
    }
}

export default createWebSocketMiddleware
