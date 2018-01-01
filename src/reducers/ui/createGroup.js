// @format
import { fromJS } from "immutable";
import {
  CLOSE_CREATE_GROUP_MODAL,
  OPEN_CREATE_GROUP_MODAL,
  RECEIVE_CREATE_ROOM,
  REQUEST_CREATE_ROOM
} from "../../constants/chat";

export const createGroupInitialState = fromJS({
  isRequesting: false,
  showModal: false
});

export function createGroup(state = createGroupInitialState, action) {
  switch (action.type) {
    case OPEN_CREATE_GROUP_MODAL:
      return state.set("showModal", true);
    case CLOSE_CREATE_GROUP_MODAL:
      return state.set("showModal", false);
    case REQUEST_CREATE_ROOM:
      return state.set("isRequesting", true);
    case RECEIVE_CREATE_ROOM:
      return state.merge(
        fromJS({
          isRequesting: false,
          showModal: false
        })
      );
    default:
      return state;
  }
}
