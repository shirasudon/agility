import { Server } from 'mock-socket'

let mockServer;


export default function startMockServer(url) {
    mockServer = new Server(url);
    mockServer.on('connection', server => {
        // mockServer.send('test message 1');
        // mockServer.send('test message 2');
    });

    mockServer.on("message", data => {
        const message = JSON.parse(data)
        console.log(message);
        mockServer.send({
            "id": Math.floor((Math.random() * 100) + 1),
            "roomId": message.data.roomId,
            "userId": message.data.userId,
            "text": message.data.body,
            "createdAt": Date.now(),
        });

        mockServer.send({
            "id": Math.floor((Math.random() * 100) + 1),
            "roomId": message.data.roomId,
            "userId": message.data.userId + Math.floor((Math.random() * 10) + 1),
            "text": `echoing "${message.data.body}"`,
            "createdAt": Date.now(),
        });
    });
}
