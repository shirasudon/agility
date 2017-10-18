import React from 'react'
import ReactDOM from 'react-dom'
import ChatActionCreator from './chat'
import thunk from 'redux-thunk'

import configureMockStore from 'redux-mock-store'

let cac; // an instance of ChatActionCreator

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('returns request room info', () => {
    const cac = new ChatActionCreator({}); 
    expect(cac.requestRoomInfo()).toEqual({
        type: "REQUEST_ROOM_INFO",
    });
});

it('returns receive room info', () => {
    const cac = new ChatActionCreator({}); 
    const room = {a: 1, b: 2};
    expect(cac.receiveRoomInfo(room)).toEqual({
        type: "RECEIVE_ROOM_INFO",
        room,
    });
});

it('returns fetch room info', () => {
    const mockApi = {
        fetchRoomInfo: (roomId) => {return Promise.resolve([1,2,3]);},
    };
    cac = new ChatActionCreator(mockApi); 

    const roomId = 3;
    const expectedActions = [
        { type: "REQUEST_ROOM_INFO" },
        { type: "RECEIVE_ROOM_INFO" , room: [1,2,3]}
    ]
    const store = mockStore({})

    return store.dispatch(cac.fetchRoomInfo()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
    })
})

it('returns change room', () => {
    const cac = new ChatActionCreator({}); 
    const roomId = 1;
    expect(cac.changeRoom(roomId)).toEqual({
        type: "CHANGE_ROOM",
        roomId,
    });
   
})

it('dispatch enter room', () => {
    const messages = [{
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
    ];
    const roomInfo = [1, 2, 3];

    const mockApi = {
        fetchRooms: () => {},
        fetchRoomInfo: (roomId) => {return Promise.resolve(roomInfo);},
        fetchMessagesByRoomId: (roomId) => {
            return Promise.resolve(messages);
        },
        createRoom: () => {},
    };
    const cac = new ChatActionCreator(mockApi); 

    const roomId = 3;
    const expectedActions = [
        { type: "REQUEST_ROOM_INFO" },
        { type: "REQUEST_MESSAGES" },
        { type: "RECEIVE_ROOM_INFO", room: roomInfo},
        { type: "RECEIVE_MESSAGE", message: messages[0] },
        { type: "RECEIVE_MESSAGE", message: messages[1] },
        { type: "CHANGE_ROOM", roomId}
    ] // TODO: this test might fail depending on the execution order
    const store = mockStore({})
    const initialFetch = true;

    return store.dispatch(cac.enterRoom(roomId, initialFetch)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
    })
})


it("dispatches REQUEST_ROOMS", () => {
    const cac = new ChatActionCreator({}); 
    expect(cac.requestRooms()).toEqual({type: "REQUEST_ROOMS"}) 
})

it('fetches rooms', () => {
    const rooms = [1, 2, 3];
     const mockApi = {
        fetchRooms: () => {return Promise.resolve(rooms);},
    };
    const cac = new ChatActionCreator(mockApi); 
    const roomId = 3;
    const expectedActions = [
        { type: "REQUEST_ROOMS"},
        { type: "RECEIVE_ROOMS", rooms},
    ] // TODO: this test might fail depending on the execution order
    const store = mockStore({})

    return store.dispatch(cac.fetchRooms()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
    })
})

it("dispatch REQUEST_FRIENDS", () => {
    const cac = new ChatActionCreator({}); 
    expect(cac.requestFriends()).toEqual({type: "REQUEST_FRIENDS"}) 
})

it("dispatch RECEIVE_FRIENDS", () => {
    const friends = [1, 2, 3];
    const cac = new ChatActionCreator({}); 
    expect(cac.receiveFriends(friends)).toEqual(
        {type: "RECEIVE_FRIENDS", friends}
    ) 
})

it("fetches friends", () => {
    const friends = [1, 2, 3];
     const mockApi = {
        fetchFriends: () => {return Promise.resolve(friends);},
    };
    const cac = new ChatActionCreator(mockApi); 
    const expectedActions = [
        { type: "REQUEST_FRIENDS"},
        { type: "RECEIVE_FRIENDS", friends},
    ] // TODO: this test might fail depending on the execution order
    const store = mockStore({})

    return store.dispatch(cac.fetchFriends()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
    })
})

it("dispatches REQUEST_CREATE_ROOM", () => {
    const cac = new ChatActionCreator({}); 
    expect(cac.requestCreateRoom()).toEqual({type: "REQUEST_CREATE_ROOM"})
})

it("dispatches RECEIVE_CREATE_ROOM", () => {
    const room = {"id": 1, name: "hoge"}
    const cac = new ChatActionCreator({}); 
    expect(cac.receiveCreateRoom(room)).toEqual({type: "RECEIVE_CREATE_ROOM", room})
})

it("dispatches REQUEST_MESSAGES", () => {
    const cac = new ChatActionCreator({}); 
    expect(cac.requestMessages()).toEqual({type: "REQUEST_MESSAGES"})
})

it("dispatches RECEIVE_MESSAGE", () => {
    const message = {
        "id": 1,
        "roomId": 1,
        "userId": 1,
        "text": "こんにちは！",
        "postDate": "2017/08/05"
    }
    const cac = new ChatActionCreator({}); 
    expect(cac.receiveMessage(message)).toEqual({type: "RECEIVE_MESSAGE", message})
})

it("fetches messages by room ID", () => {
    const messages = [{
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
    ];
    const roomId = 2; //whatever is fine!

    const mockApi = {
        fetchMessagesByRoomId: (roomId) => {
            return Promise.resolve(messages);
        },
    };
    const cac = new ChatActionCreator(mockApi); 
    const expectedActions = [
        { type: "REQUEST_MESSAGES"},
        { type: "RECEIVE_MESSAGE", message: messages[0]},
        { type: "RECEIVE_MESSAGE", message: messages[1]},
    ] // TODO: this test might fail depending on the execution order
    const store = mockStore({})

    return store.dispatch(cac.fetchMessagesByRoomId(roomId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
    })
})

it("send a request to create a room", () => {
    const mockApi = {
        createRoom: (room) => {
            return Promise.resolve(room)
        },
    };

    const cac = new ChatActionCreator(mockApi)

    const room = {
        id: 2,
        name: "room"
    };
    const expectedActions = [
        { type: 'REQUEST_CREATE_ROOM' },
        { type: 'RECEIVE_CREATE_ROOM', room}
    ]
    const store = mockStore({})

    store.dispatch(cac.createRoom(room)).then( () => {
        expect(store.getActions()).toEqual(expectedActions)
    })
})
