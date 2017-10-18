import { CHANGE_ROOM } from '../../actions/actionTypes';
import { currentRoomId } from './index'


it('has initial state of null', () => {
    expect(currentRoomId(undefined, {type: "NON_EXISTING_TYPE"})).toEqual(null)
})

it('returns roomId when action type is CHANGE_ROOM', () => {
    const roomId = 3
    expect(currentRoomId(undefined, {type: "CHANGE_ROOM", roomId,})).toEqual(roomId)
})
