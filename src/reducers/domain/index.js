import {
    CHANGE_ROOM,
} from '../../actions/actionTypes';

export function currentRoomId(state = null, action) {
    switch (action.type) {
        case CHANGE_ROOM:
            return action.roomId;
        default:
            return state;
    }
}
