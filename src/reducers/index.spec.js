import { fromJS, toJS } from 'immutable'

import { rootReducer as reducer } from './index'

const initialState = {
  currentRoomId: null,
  entities: {
    messages: {
      byId: {},
      byRoomId: {},
      all: [],
    },
    rooms: {
      byId: {},
      all: [],
    },
    users: {
      byId: {},
      byUsername: {},
      all: [],
    },
  },
  friendIds: [],
  session: {
    authenticated: false,
    checked: false,
    user: {},
  },
  ui: {
    createGroup: {
      isRequesting: false,
      showModal: false,
    },
  },
}

it('returns correct inital state', () => {
  expect(reducer(undefined, { type: 'NON_EXISTENT_TYPE' }).toJS()).toEqual(
    initialState
  )
})

it('returns initialized data when action type is USER_LOGOUT', () => {
  const state = fromJS({
    currentRoomId: null,
    rooms: {},
    entities: {
      messages: {
        byId: {},
        byRoomId: {},
        all: [],
      },
      rooms: {
        byId: {},
        all: [],
      },
      users: {
        byId: {},
        byUsername: {},
        all: [],
      },
    },
    friendIds: [],
    session: {
      authenticated: true,
      checked: true,
      user: {
        id: 2,
      },
    },
    ui: {
      createGroup: {
        isRequesting: false,
        showModal: false,
      },
    },
  })

  expect(reducer(state, { type: 'USER_LOGOUT' }).toJS()).toEqual(initialState)
})
