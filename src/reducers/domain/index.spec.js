import { 
    CHANGE_ROOM,
    RECEIVE_FRIEND_IDS,
} from '../../actions/actionTypes';

import { currentRoomId, friendIds } from './index'

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

