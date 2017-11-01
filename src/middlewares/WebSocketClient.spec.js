import { WebSocketClient } from './WebSocketClient' 
import { WebSocket, Server } from 'mock-socket'

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

