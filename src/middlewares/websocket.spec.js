import { setupConnection, initializeWebSocket, createWebSocketMiddleware } from './websocket'
import { Server as MockServer } from 'mock-socket';

const create = () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn(),
    };
    const mockSend = jest.fn()
    const mockConnect = jest.fn()
    const mockRegisterEvent = jest.fn()
    const next = jest.fn()
    class WebSocketService {
        send(...args) {
            mockSend(...args) 
        } 

        registerEvent(event, func) {
            mockRegisterEvent(event) 
        }

        connect() {
            mockConnect()
        }
    }

    return { store, next, connect: mockConnect, send: mockSend, registerEvent: mockRegisterEvent, WebSocketService }
}

const endpoint = "ws://endpoint.com"

describe("createWebSocketMiddleware", () => {

    describe("action handler", () => {
        it("initialzes the connection", () => {
            const { next, store, send, connect, registerEvent, WebSocketService } = create()
            const nextHandler = createWebSocketMiddleware(endpoint, WebSocketService)(store)
            const action = {
                type: "NON_EXISTENT_TYPE",
            }
            nextHandler(next)(action)
            expect(registerEvent).toHaveBeenCalledWith("onopen")
            expect(registerEvent).toHaveBeenCalledWith("onerror")
            expect(registerEvent).toHaveBeenCalledWith("onclose")
            expect(registerEvent).toHaveBeenCalledWith("onmessage")
            expect(connect).toHaveBeenCalled()
        })

        it("calls next with action as its first argument and does not call connection.send", () => {
            const { next, store, send, connect, registerEvent, WebSocketService } = create()
            const nextHandler = createWebSocketMiddleware(endpoint, WebSocketService)(store)
            const action = {
                type: "NON_EXISTENT_TYPE",
            }
            nextHandler(next)(action)
            expect(next).toHaveBeenCalledWith(action)
            expect(send).not.toHaveBeenCalled()
        }) 

        it("calls next with action as its first argument and calls connection.send", () => {
            const { next, store, send, connect, WebSocketService, registerEvent } = create()
            const nextHandler = createWebSocketMiddleware(endpoint, WebSocketService)(store)
            const action = {
                type: "SEND_CHAT_MESSAGE",
                data: "this is data"
            }
            nextHandler(next)(action)
            expect(next).toHaveBeenCalledWith(action)
            expect(send).toHaveBeenCalledWith(action, true)
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
