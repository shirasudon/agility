import { initializeWebSocket, createWebSocketMiddleware } from './websocket'

const create = () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn(),
    };
    const setupFunc = jest.fn()
    const connection = {
        send: jest.fn(),
    }

    const next = jest.fn()

    return { store, setupFunc, connection, next, }
}


const endpoint = "ws://endpoint.com"

describe("createWebSocketMiddleware", () => {
    describe("store handler", () => {

        it("calls setup function with endpoint and store if connection is null", () => {
            const { store, setupFunc } = create();
            const storeHandler = createWebSocketMiddleware(endpoint, {setupConnection: setupFunc})

            storeHandler(store)
            expect(setupFunc).toHaveBeenCalledWith(endpoint, store)
        })

        it("does NOT call setup function if connection is NOT null", () => {
            const { connection, setupFunc } = create();
            const storeHandler = createWebSocketMiddleware(endpoint, {connection: connection, setupConnection: setupFunc})
            expect(setupFunc).not.toHaveBeenCalled()
        })

    })

    describe("action handler", () => {

        it("calls next with action as its first argument and does not call connection.send", () => {
            const { connection, setupFunc, next, store} = create();
            const nextHandler = createWebSocketMiddleware(endpoint, {connection: connection, setupConnection: setupFunc})(store)
            const action = {
                type: "NON_EXISTENT_TYPE",
            }
            nextHandler(next)(action)
            expect(next).toHaveBeenCalledWith(action)
            expect(connection.send).not.toHaveBeenCalled()
        }) 

        it("calls next with action as its first argument and calls connection.send", () => {
            const { connection, setupFunc, next, store} = create();
            const nextHandler = createWebSocketMiddleware(endpoint, {connection: connection, setupConnection: setupFunc})(store)
            const action = {
                type: "SEND_CHAT_MESSAGE",
                data: "this is data"
            }
            nextHandler(next)(action)
            expect(next).toHaveBeenCalledWith(action)
            expect(connection.send).toHaveBeenCalledWith(JSON.stringify(action))
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

