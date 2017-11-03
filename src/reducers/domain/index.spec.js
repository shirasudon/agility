import { 
    CHANGE_ROOM,
    RECEIVE_FRIEND_IDS,
} from '../../actions/actionTypes';

import {
    currentRoomId, 
    friendIds,
    rooms
} from './index'

describe("currentRoomId", () => {
    it('has initial state of null', () => {
        expect(currentRoomId(undefined, {type: "NON_EXISTING_TYPE"})).toEqual(null)
    })

    it('returns roomId when action type is CHANGE_ROOM', () => {
        const roomId = 3
        expect(currentRoomId(undefined, {type: "CHANGE_ROOM", roomId,})).toEqual(roomId)
    })

    it('returns null on receiving RECEIVE_DELETE_ROOM', () => {
        const curRoomId = 2
        expect(currentRoomId(curRoomId, {type: "RECEIVE_DELETE_ROOM"})).toBe(null)
    }) 
})


describe("friendIds", () => {
    it('has initial state of empty array', () => {
        expect(friendIds(undefined, {type: "NON_EXISTING_TYPE"})).toEqual([])
    })

    it('returns extended array when action type is RECEIVE_FRIEND_IDS', () => {
        expect(friendIds([3, 4], {type: "RECEIVE_FRIEND_IDS", ids: [5, 6, 7],})).toEqual([3, 4, 5, 6, 7])
    })

})

describe("rooms", () => {
    it("should return initial state of {}", () => {
        expect(rooms(undefined, {type: "NON_EXISTENT_TYPE"})).toEqual({})
    })

    it("should set the indices for the first received message", () => {
        const action = {
            type: "RECEIVE_MESSAGE",
            message: {
                id: 10,
                roomId: 2,
            }
        }
        expect(rooms(undefined, action)).toEqual(
            {
                '2': {
                    msgStartIndex: 10, 
                    msgEndIndex: 10
                }
            }
        )
    })

    it("should not accept incontinuous message id", () => {
        const action = {
            type: "RECEIVE_MESSAGE",
            message: {
                id: 30,
                roomId: 2,
            }
        }

        const initialState = {
            '2': {
                msgStartIndex: 10,
                msgEndIndex: 15
            }
        }
        expect( () => {
            rooms(initialState, action)
        }).toThrowError()
    })

    it("should set msgStartIndex on receiving id which is smaller by one than current msgStartIndex", () => {
        const action = {
            type: "RECEIVE_MESSAGE",
            message: {
                id: 9,
                roomId: 2,
            }
        }

        const initialState = {
            '2': {
                msgStartIndex: 10,
                msgEndIndex: 15
            }
        }

        expect(rooms(initialState, action)).toEqual(
            {
                '2': {
                    msgStartIndex: 9, 
                    msgEndIndex: 15
                }
            }
        )

    })

    it("should set msgEndIndex on receiving id which is bigger by one than current msgStartIndex", () => {
        const action = {
            type: "RECEIVE_MESSAGE",
            message: {
                id: 16,
                roomId: 2,
            }
        }

        const initialState = {
            '2': {
                msgStartIndex: 10,
                msgEndIndex: 15
            }
        }

        expect(rooms(initialState, action)).toEqual(
            {
                '2': {
                    msgStartIndex: 10, 
                    msgEndIndex: 16
                }
            }
        )

    })

    it("should do nothing on receiving message whose id is between msgStartIndex and msgEndIndex", () => {
        const action = {
            type: "RECEIVE_MESSAGE",
            message: {
                id: 12,
                roomId: 2,
            }
        }

        const initialState = {
            '2': {
                msgStartIndex: 10,
                msgEndIndex: 15
            }
        }

        // Returned state should be the same as the initial state
        expect(rooms(initialState, action)).toEqual(initialState)

    })

})
