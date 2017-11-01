import { WebSocketClient } from './WebSocketClient' 
import { WebSocket, Server } from 'mock-socket'

jest.useFakeTimers()

it("should throw error when onOpen is not overridden", () => {
    const wsc = new WebSocketClient(WebSocket)
    expect( () => {wsc.onOpen()} ).toThrowError()
})

it("should throw error when onClose is not overridden", () => {
    const wsc = new WebSocketClient(WebSocket)
    expect( () => {wsc.onClose()} ).toThrowError()
})

it("should throw error when onMessage is not overridden", () => {
    const wsc = new WebSocketClient(WebSocket)
    expect( () => {wsc.onMessage()} ).toThrowError()
})

it("should throw error when onError is not overridden", () => {
    const wsc = new WebSocketClient(WebSocket)
    expect( () => {wsc.onError()} ).toThrowError()
})

describe("_onopen", () => {
    it("should not call reconnect when gracefully disconnected", () => {
        const wsc = new WebSocketClient(WebSocket)
        const reconnect = wsc.reconnect = jest.fn()
        const onClose = wsc.onClose = jest.fn()  
        wsc._onclose(1000)
        expect(reconnect).not.toHaveBeenCalled()
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("should call reconnect when disgracefully disconnected", () => {
        const wsc = new WebSocketClient(WebSocket)
        const reconnect = wsc.reconnect = jest.fn()
        const onClose = wsc.onClose = jest.fn()  
        wsc._onclose(1001)
        expect(reconnect).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledTimes(1)
    })
})

describe("_onerror", () => {
    it("should not call reconnect when not connected for unexpected reason", () => {
        const wsc = new WebSocketClient(WebSocket)
        const reconnect = wsc.reconnect = jest.fn()
        const onError = wsc.onError = jest.fn()  
        const e = {code: "UNEXPECTED_ERROR"}
        wsc._onerror(e)
        expect(reconnect).not.toHaveBeenCalled()
        expect(onError).toHaveBeenCalledWith(e)
    })

    it("should call reconnect and when connection refused", () => {
        const wsc = new WebSocketClient(WebSocket)
        const reconnect = wsc.reconnect = jest.fn()
        const onError = wsc.onError = jest.fn()
        const e = { code: "ECONNREFUSED"}
        wsc._onerror(e)
        expect(reconnect).toHaveBeenCalledWith(e)
        expect(onError).toHaveBeenCalledWith(e)
    })
})

describe("reconnect", () => {

    it("should call open after specific time", () => {
        const wsc = new WebSocketClient(WebSocket)
        const open = wsc.open = jest.fn()
        wsc.autoReconnectInterval = 10000
        const url = wsc.url = "URL"
        wsc.reconnect(url)
        jest.runAllTimers()
        expect(open).toHaveBeenCalledWith(url)
    })

})

describe("send", () => {

    it("should call socket send with data and option", () => {
        const wsc = new WebSocketClient(WebSocket)
        wsc.socket = {}
        const send = wsc.socket.send = jest.fn()
        wsc.send("hello", {hoge: 2})
        expect(send).toHaveBeenCalledWith("hello", {hoge: 2})
    })

    it("should call socket send with data and option", () => {
        const wsc = new WebSocketClient(WebSocket)
        wsc.socket = {}
        const send = wsc.socket.send = () => { throw new Error("error")}
        const emit = wsc.socket.emit = jest.fn()
        wsc.send("hello", {hoge: 2})
        expect(emit).toHaveBeenCalledWith("error", new Error("error"))
    })

})

