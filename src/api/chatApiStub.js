import { Server } from 'mock-socket';
import { UserTable, RoomTable }from "./repositoryStub";


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

export function createRoom(room){
    /*const mockServer = new Server('ws://localhost:8080');
    mockServer.on('connection', server => {
        mockServer.send(room);
    });*/
    console.log("createRoom is called");
    console.log(room);
}

