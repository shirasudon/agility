
const users = [
    {
        "id": 1,
        "username": "hitochan",
        "lastName": "Hitoshi",
        "firstName": "Otsuki",
        "password": "user1"
    },
    {
        "id": 2,
        "username": "tasaki",
        "lastName": "Tsukuru",
        "firstName": "Tasaki",
        "password": "user2"
    },
    {
        "id": 3,
        "username": "furugura",
        "lastName": "Calbee",
        "firstName": "Fruit",
        "password": "user3"
    },
    {
        "id": 4,
        "username": "senjo",
        "lastName": "Senjogahara",
        "firstName": "Misaki",
        "password": "user4"
    },
    {
        "id": 5,
        "username": "shinjo",
        "lastName": "Shinjo",
        "firstName": "Tsuyoshi",
        "password": "user5"
    },
    {
        "id": 6,
        "username": "pokemon",
        "lastName": "Pokemon",
        "firstName": "Go",
        "password": "user6"
    },
    {
        "id": 7,
        "username": "aka",
        "lastName": "Akagi",
        "firstName": "Taro",
        "password": "user7"
    },
    {
        "id": 8,
        "username": "mike",
        "lastName": "Michael",
        "firstName": "Jackson",
        "password": "user8"
    },
    {
        "id": 9,
        "username": "aeron",
        "lastName": "Aeron",
        "firstName": "Davichi",
        "password": "user9"
    }
]

const rooms = [
    {
        "id": 1,
        "name": "吉野家",
        "members": [3, 4, 8]
    },
    {
        "id": 2,
        "name": "テニス部",
        "members": [1, 3, 7]
    },
    {
        "id": 3,
        "name": "React",
        "members": [1, 3, 7]
    }

];

const messages = [
    {
        "id": 1,
        "roomId": 1,
        "userId": 1,
        "text": "こんにちは！",
        "postDate": "2017/08/05"
    },
    {
        "id": 2,
        "roomId": 1,
        "userId": 2,
        "text": "はじめまして！",
        "postDate": "2017/08/05"
    },
    {
        "id": 3,
        "roomId": 2,
        "userId": 3,
        "text": "hey",
        "postDate": "2017/08/05"
    },
    {
        "id": "4",
        "roomId": 2,
        "userId": 1,
        "text": "hello",
        "postDate": "2017/08/05"
    }
]

const friendGraph = {
    "1": [3, 4],
    "2": [1, 3],
    "3": [5, 6, 7],
    "4": [1, 6, 8],
    "5": [],
    "6": [9],
    "7": [8, 9],
    "8": [1, 2, 3, 4, 5, 6, 7, 9],
    "9": [4, 7, 8],
}


export class UserTable {

    static getUserById(id){
        const user = users.find(user => user.id === id);
        if (user === undefined) {
            return null;
        }
        return user;
    }

    static getUserByUserName(username){
        const user = users.find(user => user.username === username);
        if (user === undefined) {
            return null;
        }
        return user;
    }

    static getAllFriendIdsOfUserById(id) {
        return friendGraph[id]
    }

    static getAllUsers(){
        return users.slice();
    }
}


export class RoomTable {

    static getRoomById(id){
        const room = rooms.find(room => room.id === id);
        if (room === undefined) {
            return null;
        }
        return room;
    }

    static getAllRooms(){
        return rooms.slice();
    }

    static getAllRoomsByUserId(userId){
        return rooms.filter( room => room.members.includes(userId))
    }

    static addRoom(room) {
        const ids = rooms.map( room => room.id);
        const nextId = Math.max(...ids) + 1;
        const newRoom = {
            id: nextId,
            ...room,
        }
        rooms.push(newRoom);
        return newRoom;
    }

}


export class MessageTable {

    static getMessagesByRoomId(roomId) {
        const filteredMessages = messages.filter(message => message.roomId === roomId);
        return filteredMessages;
    }

}

