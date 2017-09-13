import {combineReducers} from 'redux';

import {
    CLOSE_CREATE_GROUP_MODAL,
    OPEN_CREATE_GROUP_MODAL,
    RECEIVE_CREATE_ROOM,
    REQUEST_CREATE_ROOM
} from "../actions/actionTypes";

export const createGroup = (state =
                         {isRequesting: false,
                             showModal: false
                         },
                     action) => {

    switch (action.type) {
        case OPEN_CREATE_GROUP_MODAL:
            return Object.assign({}, state, {
                showModal: true,
            });
        case CLOSE_CREATE_GROUP_MODAL:
             return Object.assign({}, state, {
                showModal: false,
            });
        case REQUEST_CREATE_ROOM:
            return Object.assign({}, state, {
                isRequesting: true,
            });
        case RECEIVE_CREATE_ROOM:
            return Object.assign({}, state, {
                isRequesting: false,
                showModal: false,
            });
        default:
            return state;
    }
}

export const ui = combineReducers({
    createGroup,
})

export default ui;

