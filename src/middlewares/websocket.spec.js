import { setupConnection, initializeWebSocket, createWebSocketMiddleware } from './websocket'
import { Server as MockServer } from 'mock-socket';

const create = () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn(),
    };
    const send = jest.fn()
    const ws = function() {
        this.send = send 
    }

    const next = jest.fn()

    return { store, next, ws, send}
}

const endpoint = "ws://endpoint.com"

describe("createWebSocketMiddleware", () => {

    describe("action handler", () => {

        it("calls next with action as its first argument and does not call connection.send", () => {
            const { ws, next, store, send } = create()
            const nextHandler = createWebSocketMiddleware(endpoint, ws)(store)
            const action = {
                type: "NON_EXISTENT_TYPE",
            }
            nextHandler(next)(action)
            expect(next).toHaveBeenCalledWith(action)
            expect(send).not.toHaveBeenCalled()
        }) 

        it("calls next with action as its first argument and calls connection.send", () => {
            const { ws, next, store, send } = create()
            const nextHandler = createWebSocketMiddleware(endpoint, ws)(store)
            const action = {
                type: "SEND_CHAT_MESSAGE",
                data: "this is data"
            }
            nextHandler(next)(action)
            expect(next).toHaveBeenCalledWith(action)
            expect(send).toHaveBeenCalledWith(JSON.stringify(action))
        }) 

    })

})

describe("initializeWebSocket", () => {
    it("returns ws://localhost:8080/chat/ws and starts mock server when development mode", (done) => {
        const socketURI = "ws://localhost:8080/chat/ws"
        expect(initializeWebSocket("development")).toBe(socketURI)
        const chatSocket = new WebSocket(socketURI);
        chatSocket.onopen = (event) => {
            done()
        };
    })

    it("raise exception when non-development mode", () => {
        expect(() => { initializeWebSocket("test") }).toThrowError(Error)
        expect(() => { initializeWebSocket("production") }).toThrowError(Error)
        expect(() => { initializeWebSocket("non existent mode") }).toThrowError(Error)
    })
})
