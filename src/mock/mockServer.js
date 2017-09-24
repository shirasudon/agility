import { Server } from 'mock-socket'

let mockServer;

export default function startMockServer(url) {
    mockServer = new Server(url);
    mockServer.on('connection', server => {
        mockServer.send('test message 1');
        mockServer.send('test message 2');
    });

    mockServer.on("message", data => {
        const message = JSON.parse(data)
        console.log(message);
        mockServer.send({
            "id": 1,
            "roomId": 1,
            "userId": 3,
            "text": "echoing " + message.data.body,
            "postDate": "2017/08/05"
        });
    });
}
