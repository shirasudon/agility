import { toJS } from "immutable";

import { entities as reducer } from "./index";

it("returns correct inital state", () => {
  expect(reducer(undefined, { type: "NON_EXISTENT_TYPE" }).toJS()).toEqual({
    messages: {
      byId: {},
      byRoomId: {},
      all: []
    },
    rooms: {
      byId: {},
      all: []
    },
    users: {
      byId: {},
      byUsername: {},
      all: []
    }
  });
});
