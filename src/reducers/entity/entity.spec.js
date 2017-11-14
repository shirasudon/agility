import { users, room, rooms, messages } from './entity'
import {
    RECEIVE_USER,
    RECEIVE_ROOM,
    RECEIVE_ROOM_INFO,
    RECEIVE_MESSAGE,
    CHANGE_ROOM, 
    RECEIVE_CREATE_ROOM,
    RECEIVE_DELETE_ROOM,
} from '../../actions/actionTypes';



describe("users", () => {
    it('returns initial state when undefined is given as state', () => {
        const expected = {
            byId: {},
            byUsername: {}, 
            all: [],
        }
        expect(users(undefined, {type: "NON_EXISTING_TYPE"})).toEqual(expected)
    })

    it('returns the state with user added', () => {
        const action = {
            type: "RECEIVE_USER",
            user: {
                id: 3,
                username: "user3",
                firstName: "first3",
                lastName: "last3",
            },
        }
        const expected = {
            byId: {
                '3': {
                    id: 3,
                    username: "user3",
                    firstName: "first3",
                    lastName: "last3",
                },
            },
            byUsername: {
                user3: {
                    id: 3,
                    username: "user3",
                    firstName: "first3",
                    lastName: "last3",
                },
            }, 
            all: [3] ,
        }
        expect(users(undefined, action)).toEqual(expected)
    })
})

describe("room", () => {
    it('returns initial state when undefined is given as state', () => {
        const expected = {
            createdBy: null,
            id: null,
            name: null,
            members: [],
            initialFetch: false,
            hasUnreadMessage: false,
        }
        expect(room(undefined, {type: "NON_EXISTING_TYPE"})).toEqual(expected)
    })

    it('sets members and initialFetch on receiving RECEIVE_ROOM_INFO', () => {
        const expected = {
            createdBy: 2,
            id: 2,
            name: "room name", 
            members: [2, 4, 5],
            initialFetch: true,
        }
        const initialState = {
            id: 2,
            name: "room name",
            members: [],
            initialFetch: false,
        }
        const action = {
            type: RECEIVE_ROOM_INFO,
            members: [2, 4, 5],
            createdBy: 2,
        }
        expect(room(initialState, action)).toEqual(expected)
    })

    it('sets id, name, initialFetch, hasUnreadMessage on receiving RECEIVE_ROOM', () => {
        const expected = {
            createdBy: null,
            id: 3,
            name: "new room", 
            members: [],
            initialFetch: false,
            hasUnreadMessage: true,
        }
        const action = {
            type: RECEIVE_ROOM,
            id: 3,
            name: "new room",
            initialFetch: true, // this is to verify that initialFetch is set to false regardless of initialFetch in action
            hasUnreadMessage: true
        }
        expect(room(undefined, action)).toEqual(expected)
    })

    it('sets id, name, initialFetch on receiving RECEIVE_CREATE_ROOM', () => {
        const expected = {
            createdBy: null,
            id: 3,
            name: "new room", 
            members: [],
            initialFetch: false,
            hasUnreadMessage: false,
        }
        const action = {
            createdBy: null,
            type: RECEIVE_CREATE_ROOM,
            id: 3,
            name: "new room",
            initialFetch: true, // this is to verify that initialFetch is set to false regardless of initialFetch in action
            hasUnreadMessage: false,
        }
        expect(room(undefined, action)).toEqual(expected)
    })
})

describe("rooms", () => {
    it('returns initial state when undefined is given as state', () => {
        const expected = {
            byId: {},
            all: [],
        }
        expect(rooms(undefined, {type: "NON_EXISTING_TYPE"})).toEqual(expected)
    })

    it('sets byId and all on receiving RECEIVE_ROOM', () => {
        const initialState = {
            byId: {
                "1": {
                    id: "1",
                    name: "room1",
                    members: [5, 2, 6],
                    initialFetch: true,
                    createdBy: null,
                    hasUnreadMessage: false,
                },
                "2": {
                    id: "2",
                    name: "room2",
                    members: [1, 2, 3],
                    initialFetch: false,
                    createdBy: null,
                    hasUnreadMessage: false,
                }
            },
            all: ["1", "2"]
        }

        const expected = {
            byId: {
                "1": {
                    id: "1",
                    name: "room1",
                    members: [5, 2, 6],
                    initialFetch: true,
                    createdBy: null,
                    hasUnreadMessage: false,
                },
                "2": {
                    id: "2",
                    name: "room2",
                    members: [1, 2, 3],
                    initialFetch: false,
                    createdBy: null,
                    hasUnreadMessage: false,
                },
                "5": {
                    id: "5",
                    name: "tennis club",
                    members: [],
                    initialFetch: false,
                    createdBy: null,
                    hasUnreadMessage: false,
                },
            },
            all: ["1", "2", "5"]
        }

        const action = {
            type: RECEIVE_ROOM,
            id: "5",
            name: "tennis club",
            hasUnreadMessage: false,
        }
        expect(rooms(initialState, action)).toEqual(expected)
    })

    it('update corresponding room on receiving RECEIVE_ROOM_INFO', () => {
        const initialState = {
            byId: {
                "1": {
                    id: "1",
                    name: "room1",
                    members: [],
                    initialFetch: false,
                },
                "2": {
                    id: "2",
                    name: "room2",
                    members: [],
                    initialFetch: false,
                }
            },
            all: ["1", "2"]
        }

        const expected = {
            byId: {
                "1": {
                    id: "1",
                    name: "room1",
                    members: [5, 9, 10],
                    initialFetch: true,
                },
                "2": {
                    id: "2",
                    name: "room2",
                    members: [],
                    initialFetch: false,
                }
            },
            all: ["1", "2"]
        }

        const action = {
            type: RECEIVE_ROOM_INFO,
            id: "1",
            members: [5, 9, 10],
        }
        expect(rooms(initialState, action)).toEqual(expected)
    })

    it('add room on receiving RECEIVE_CREATE_ROOM', () => {
        const initialState = {
            byId: {
                "1": {
                    id: "1",
                    name: "room1",
                    members: [5, 9, 10],
                    initialFetch: true,
                    createdBy: 5,
                    hasUnreadMessage: false,
                }
            },
            all: ["1"]
        }

        const expected = {
            byId: {
                "1": {
                    id: "1",
                    name: "room1",
                    members: [5, 9, 10],
                    initialFetch: true,
                    createdBy: 5,
                    hasUnreadMessage: false,
                },
                "5": {
                    id: "5",
                    name: "room5",
                    members: [],
                    initialFetch: false,
                    createdBy: null,
                    hasUnreadMessage: false,
                }
            },
            all: ["1", "5"]
        }

        const action = {
            type: RECEIVE_CREATE_ROOM,
            id: "5",
            name: "room5",
        }
        expect(rooms(initialState, action)).toEqual(expected)
    })


    it('delete room on receiving RECEIVE_DELETE_ROOM', () => {
        const expected = {
            byId: {
                "1": {
                    id: "1",
                    name: "room1",
                    members: [5, 9, 10],
                    initialFetch: true,
                }
            },
            all: ["1"]
        }

        const initialState = {
            byId: {
                "1": {
                    id: "1",
                    name: "room1",
                    members: [5, 9, 10],
                    initialFetch: true,
                },
                "5": {
                    id: "5",
                    name: "room5",
                    members: [],
                    initialFetch: false,
                }
            },
            all: ["1", "5"]
        }

        const action = {
            type: RECEIVE_DELETE_ROOM,
            roomId: "5"
        }

        expect(rooms(initialState, action)).toEqual(expected)
    })

})

describe("messages", () => {
    it('returns initial state when undefined is given as state', () => {
        const expected = {
            byId: {},
            byRoomId: {},
            all: [],
        }
        expect(messages(undefined, {type: "NON_EXISTING_TYPE"})).toEqual(expected)
    })

    it('add room on receiving RECEIVE_MESSAGE', () => {

        const expected = {
            byId: {
                "5": {
                    id: "5",
                    roomId: "3"
                }
            },
            byRoomId: {
                "3": ["5"]
            },
            all: ["5"]
        }

        const action = {
            type: RECEIVE_MESSAGE,
            message: {
                id: "5",
                roomId: "3",
            }
        }
        expect(messages(undefined, action)).toEqual(expected)
    })

})
