
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
];
 
const rooms = [
    {
        "id": 1,
        "name": "吉野家",
        "users": [3, 4, 8]
    },
    {
        "id": 2,
        "name": "テニス部",
        "users": [1, 3, 7]
    }
];

const messages = [
    {
        "id": 1,
        "room_id": 1,
        "user_id": 23,
        "text": "こんにちは！",
        "postDate": "2017/08/05"
    },
    {
        "id": 2,
        "room_id": 1,
        "user_id": 25,
        "text": "はじめまして！",
        "postDate": "2017/08/05"
    },
    {
        "id": 3,
        "room_id": 2,
        "user_id": 232,
        "text": "hey",
        "postDate": "2017/08/05"
    },
    {
        "id": "4",
        "room_id": 2,
        "user_id": 12,
        "text": "hello",
        "postDate": "2017/08/05"
    }
];


export class UserTable {

    static getUserById(id){
        const user = users.find(user => user.id === id);
        if (user == undefined) {
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

    static getAllUsers(){
        return users.slice();
    }
}


export class RoomTable {

    static getRoomById(id){
        const room = rooms.find(room => room.id === id);
        if (room == undefined) {
            return null;
        }
        return room;
    }

    static getAllRooms(){
        return rooms.slice();
    }

}

