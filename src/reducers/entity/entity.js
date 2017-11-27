// @format
import Immutable from "immutable";

import {
  RECEIVE_USER,
  RECEIVE_ROOM,
  RECEIVE_ROOM_INFO,
  RECEIVE_MESSAGE,
  RECEIVE_CREATE_ROOM,
  RECEIVE_DELETE_ROOM,
  RECEIVE_MESSAGE_READ,
  EXIST_UNREAD_MESSAGE,
  NO_UNREAD_MESSAGE
} from "../../actions/actionTypes";

export function users(
  state = Immutable.fromJS({
    byId: {},
    byUsername: {},
    all: []
  }),
  action
) {
  switch (action.type) {
    case RECEIVE_USER: {
      const u = action.user;
      if (!state.get("all").includes(u.id)) {
        state = state.setIn(["byId", u.id], u);
        state = state.setIn(["byUsername", u.username], u);
        state = state.update("all", all => all.push(u.id));
      }
      return state;
    }

    default:
      return state;
  }
}

const roomInitialState = Immutable.fromJS({
  id: null,
  name: null,
  members: [],
  createdBy: null,
  initialFetch: false,
  hasUnreadMessage: false,
  oldestMessageTimestamp: null
});

export function room(state = roomInitialState, action) {
  switch (action.type) {
    case RECEIVE_ROOM_INFO:
      return state.merge({
        members: action.members,
        createdBy: action.createdBy,
        initialFetch: true
      });

    case RECEIVE_ROOM:
      return state.merge({
        id: action.id,
        name: action.name,
        initialFetch: false,
        hasUnreadMessage: action.hasUnreadMessage
      });

    case RECEIVE_CREATE_ROOM:
      return state.merge({
        id: action.id,
        name: action.name,
        initialFetch: false
      });

    case EXIST_UNREAD_MESSAGE:
      return state.merge({
        hasUnreadMessage: true
      });

    case NO_UNREAD_MESSAGE:
      return state.merge({
        hasUnreadMessage: false
      });

    case RECEIVE_MESSAGE:
      const { createdAt } = action.message;
      return state.merge({
        oldestMessageTimestamp: Math.min(
          createdAt,
          state.get("oldestMessageTimestamp")
        )
      });

    default:
      return state;
  }
}

export function rooms(
  state = Immutable.fromJS({
    byId: {},
    all: []
  }),
  action
) {
  switch (action.type) {
    case RECEIVE_ROOM: {
      if (!state.get("all").includes(action.id)) {
        // TODO: make `all` a set
        state = state.setIn(
          ["byId", action.id],
          room(state.getIn(["byId", action.id]), action)
        );
        state = state.update("all", all => all.push(action.id));
      }
      return state;
    }

    case RECEIVE_ROOM_INFO: {
      return state.setIn(
        ["byId", action.id],
        room(state.getIn(["byId", action.id]), action)
      );
    }

    case RECEIVE_CREATE_ROOM: {
      if (!state.get("all").includes(action.id)) {
        // TODO: make `all` a set
        state = state.setIn(
          ["byId", action.id],
          room(state.getIn(["byId", action.id]), action)
        );
        state = state.update("all", all => all.push(action.id));
      }
      return state;
    }

    case RECEIVE_DELETE_ROOM: {
      const { roomId } = action;
      const index = state.get("all").indexOf(roomId);

      // If the room is found, delete from array "all"
      if (index > -1) {
        state = state.update("all", all => all.delete(index));
        state = state.update("byId", byId => byId.delete(roomId));
      }
      return state;
    }

    case EXIST_UNREAD_MESSAGE:
    case NO_UNREAD_MESSAGE: {
      return state.setIn(
        ["byId", action.roomId],
        room(state.getIn(["byId", action.roomId]), action)
      );
    }

    case RECEIVE_MESSAGE: {
      const { roomId } = action.message;
      return state.setIn(
        ["byId", roomId],
        room(state.getIn(["byId", roomId]), action)
      );
    }

    default:
      return state;
  }
}

export function messages(
  state = Immutable.fromJS({
    byId: {},
    byRoomId: {},
    all: []
  }),
  action
) {
  switch (action.type) {
    case RECEIVE_MESSAGE: {
      const { id, roomId } = action.message;
      if (!state.get("all").includes(id)) {
        state = state.update("all", all => all.push(id));
        state = state.updateIn(
          ["byRoomId", roomId],
          Immutable.List(),
          messages => messages.push(action.message.id)
        );
        state = state.setIn(["byId", id], action.message);
      }

      return state;
    }

    case RECEIVE_MESSAGE_READ: {
      const { messageId, userId } = action;
      if (!state.getIn(["byId", messageId, "readBy"]).includes(userId)) {
        state.updateIn(["byId", messageId, "readBy"], readBy =>
          readBy.push(userId)
        );
      }
      return state;
    }

    default:
      return state;
  }
}
