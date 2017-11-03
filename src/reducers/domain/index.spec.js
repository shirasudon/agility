import moment from 'moment'

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

    it("should update oldestMessageTimestamp when the received message is older than the oldest message", () => {
        const action = {
            type: "RECEIVE_MESSAGE",
            message: {
                id: 3,
                roomId: 2,
                createdAt: moment('2017-11-03 13:00:00').valueOf()
            }
        }

        const initialState = {
            '2': {
                oldestMessageTimestamp: moment('2017-11-03 19:12:00').valueOf()
            }
        }

        expect(rooms(initialState, action)).toEqual(
            {
                '2': {
                    oldestMessageTimestamp: moment('2017-11-03 13:00:00').valueOf()
                }
            }
        )

    })

    it("should do nothing when the received message is newer than the oldest message", () => {
        const action = {
            type: "RECEIVE_MESSAGE",
            message: {
                id: 12,
                roomId: 2,
                createdAt: moment('2017-11-03 13:00:00').valueOf()
            }
        }

        const initialState = {
            '2': {
                oldestMessageTimestamp: moment('2017-11-03 11:12:00').valueOf()
            }
        }

        // Returned state should be the same as the initial state
        expect(rooms(initialState, action)).toEqual(initialState)

    })

})

