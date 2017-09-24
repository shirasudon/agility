import { UserTable, RoomTable, MessageTable }from "./repositoryStub";


export function fetchRooms(){
    return Promise.resolve(RoomTable.getAllRooms());
}

export function fetchRoomInfo(roomId){
    const room = RoomTable.getRoomById(roomId);
    if(room == null){
        return Promise.reject();
    }
    else {
        return Promise.resolve(room);
    }
}

export function fetchFriends(){
    return Promise.resolve(UserTable.getAllUsers());
}

export function fetchMessagesByRoomId(roomId) {
    const messages = MessageTable.getMessagesByRoomId(roomId);
    return Promise.resolve(messages);
}

export function createRoom(room) {
    const newRoom = RoomTable.addRoom(room);
    return new Promise( resolve => {
        setTimeout(
            () => { resolve(newRoom) }
            , 1500
        ) // return after 1.5 second
    });
}

export function sendMessage(message) {
     
}
