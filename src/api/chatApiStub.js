const rooms = {
    "1": {
        id: "1",
        name: "吉野家",
        messages: [
            {
                sender_id: "23",
                text: "こんにちは！",
                postDate: "2017/08/05",
            },
            {
                sender_id: "25",
                text: "はじめまして！",
                postDate: "2017/08/05",
            }
        ],
        members: [
            "23", "25", "28"
        ]
    }, 
    "2": {
        id: "2",
        name: "テニス部",
        messages: [
            {
                sender_id: "232",
                text: "hey",
                postDate: "2017/08/05",
            },
            {
                sender_id: "123",
                text: "hello",
                postDate: "2017/08/05",
            }
        ],
        members: [
            "232", "123"
        ]
    }
};

export function fetchRooms(){
    return Promise.resolve(
        [{id: "1", name: "吉野家"}, {id: "2", name: "テニス部"}]     
    ); 
}

export function fetchRoomInfo(roomId){
    if(roomId in rooms){
        return Promise.resolve(rooms[roomId]);
    }
    else {
        return Promise.reject();
    }
}

export function fetchFriends(){
    return Promise.resolve(
        [
            {
                username: "hitochan",
                lastName: "Hitoshi",
                firstName: "Otsuki"
            },
            {
                username: "tasaki",
                lastName: "Tsukuru",
                firstName: "Tasaki"
            },
            {
                username: "furugura",
                lastName: "Calbee",
                firstName: "Fruit"
            },
        ]     
    );
}
