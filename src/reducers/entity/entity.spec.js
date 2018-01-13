// @format
import moment from 'moment'
import { toJS, Map as IMap, List as IList } from 'immutable'

import { users, room, rooms, messages } from './entity'
import {
  RECEIVE_USER,
  RECEIVE_ROOM,
  RECEIVE_ROOM_INFO,
  RECEIVE_MESSAGE,
  CHANGE_ROOM,
  RECEIVE_CREATE_ROOM,
  RECEIVE_DELETE_ROOM,
} from '../../constants/chat'

describe('users', () => {
  it('returns initial state when undefined is given as state', () => {
    const expected = {
      byId: {},
      byUsername: {},
      all: [],
    }
    expect(users(undefined, { type: 'NON_EXISTING_TYPE' }).toJS()).toEqual(
      expected
    )
  })

  it('returns the state with user added', () => {
    const action = {
      type: 'RECEIVE_USER',
      payload: {
        id: 3,
        username: 'user3',
        firstName: 'first3',
        lastName: 'last3',
      },
    }
    const expected = {
      byId: {
        3: {
          id: 3,
          username: 'user3',
          firstName: 'first3',
          lastName: 'last3',
        },
      },
      byUsername: {
        user3: {
          id: 3,
          username: 'user3',
          firstName: 'first3',
          lastName: 'last3',
        },
      },
      all: [3],
    }
    expect(users(undefined, action).toJS()).toEqual(expected)
  })
})

describe('room', () => {
  it('returns initial state when undefined is given as state', () => {
    const expected = {
      createdBy: null,
      id: null,
      name: null,
      members: {},
      initialFetch: false,
      hasUnreadMessage: false,
      oldestMessageTimestamp: Number.MAX_SAFE_INTEGER,
    }
    expect(room(undefined, { type: 'NON_EXISTING_TYPE' }).toJS()).toEqual(
      expected
    )
  })

  it('sets members and initialFetch on receiving RECEIVE_ROOM_INFO', () => {
    const expected = {
      createdBy: 2,
      id: 2,
      name: 'room name',
      members: {
        2: moment('2018-01-11T08:10:49+09:00').valueOf(),
        4: moment('2018-01-11T09:10:49+09:00').valueOf(),
        5: moment('2018-01-11T10:10:49+09:00').valueOf(),
      },
      initialFetch: true,
    }

    const initialState = IMap([
      ['id', 2],
      ['name', 'room name'],
      ['members', {}],
      ['initialFetch', false],
    ])

    const action = {
      type: RECEIVE_ROOM_INFO,
      payload: {
        members: [
          [2, moment('2018-01-11T08:10:49+09:00').valueOf()],
          [4, moment('2018-01-11T09:10:49+09:00').valueOf()],
          [5, moment('2018-01-11T10:10:49+09:00').valueOf()],
        ],
        createdBy: 2,
      },
    }
    expect(room(initialState, action).toJS()).toEqual(expected)
  })

  it('sets id, name, initialFetch, hasUnreadMessage on receiving RECEIVE_ROOM', () => {
    const expected = {
      createdBy: null,
      id: 3,
      name: 'new room',
      members: {},
      initialFetch: false,
      hasUnreadMessage: true,
      oldestMessageTimestamp: Number.MAX_SAFE_INTEGER,
    }
    const action = {
      type: RECEIVE_ROOM,
      payload: {
        id: 3,
        name: 'new room',
        initialFetch: true, // this is to verify that initialFetch is set to false regardless of initialFetch in action
        hasUnreadMessage: true,
        oldestMessageTimestamp: Number.MAX_SAFE_INTEGER,
      },
    }
    expect(room(undefined, action).toJS()).toEqual(expected)
  })

  it('sets id, name, initialFetch on receiving RECEIVE_CREATE_ROOM', () => {
    const expected = {
      createdBy: null,
      id: 3,
      name: 'new room',
      members: {},
      initialFetch: false,
      hasUnreadMessage: false,
      oldestMessageTimestamp: Number.MAX_SAFE_INTEGER,
    }
    const action = {
      type: RECEIVE_CREATE_ROOM,
      payload: {
        id: 3,
        name: 'new room',
        initialFetch: true, // this is to verify that initialFetch is set to false regardless of initialFetch in action
        createdBy: null,
        hasUnreadMessage: false,
      },
    }
    expect(room(undefined, action).toJS()).toEqual(expected)
  })
})

describe('rooms', () => {
  it('returns initial state when undefined is given as state', () => {
    const expected = {
      byId: {},
      all: [],
    }
    expect(rooms(undefined, { type: 'NON_EXISTING_TYPE' }).toJS()).toEqual(
      expected
    )
  })

  it('sets byId and all on receiving RECEIVE_ROOM', () => {
    const initialState = IMap([
      [
        'byId',
        IMap([
          [
            1,
            IMap([
              ['id', 1],
              ['name', 'room1'],
              ['members', IMap()],
              ['initialFetch', true],
              ['createdBy', null],
              ['hasUnreadMessage', false],
            ]),
          ],
          [
            2,
            IMap([
              ['id', 2],
              ['name', 'room2'],
              ['members', IMap()],
              ['initialFetch', false],
              ['createdBy', null],
              ['hasUnreadMessage', false],
            ]),
          ],
        ]),
      ],
      ['all', IList.of(1, 2)],
    ])

    const expected = {
      byId: {
        1: {
          id: 1,
          name: 'room1',
          members: {},
          initialFetch: true,
          createdBy: null,
          hasUnreadMessage: false,
        },
        2: {
          id: 2,
          name: 'room2',
          members: {},
          initialFetch: false,
          createdBy: null,
          hasUnreadMessage: false,
        },
        5: {
          id: 5,
          name: 'tennis club',
          members: {},
          initialFetch: false,
          createdBy: null,
          hasUnreadMessage: false,
          oldestMessageTimestamp: Number.MAX_SAFE_INTEGER,
        },
      },
      all: [1, 2, 5],
    }

    const action = {
      type: RECEIVE_ROOM,
      payload: {
        id: 5,
        name: 'tennis club',
        hasUnreadMessage: false,
      },
    }
    expect(rooms(initialState, action).toJS()).toEqual(expected)
  })

  it('update corresponding room on receiving RECEIVE_ROOM_INFO', () => {
    const initialState = IMap([
      [
        'byId',
        IMap([
          [
            1,
            IMap([
              ['id', 1],
              ['name', 'room1'],
              ['members', IMap()],
              ['initialFetch', false],
            ]),
          ],
          [
            2,
            IMap([
              ['id', 2],
              ['name', 'room2'],
              ['members', IMap()],
              ['initialFetch', false],
            ]),
          ],
        ]),
      ],
      ['all', IList.of(1, 2)],
    ])

    const expected = {
      byId: {
        1: {
          id: 1,
          name: 'room1',
          members: {
            5: { readAt: moment('2018-01-11T08:10:49+09:00').valueOf() },
            9: { readAt: moment('2018-01-11T09:10:49+09:00').valueOf() },
            10: { readAt: moment('2018-01-11T10:10:49+09:00').valueOf() },
          },
          initialFetch: true,
        },
        2: {
          id: 2,
          name: 'room2',
          members: {},
          initialFetch: false,
        },
      },
      all: [1, 2],
    }

    const action = {
      type: RECEIVE_ROOM_INFO,
      payload: {
        id: 1,
        members: [
          [5, { readAt: moment('2018-01-11T08:10:49+09:00').valueOf() }],
          [9, { readAt: moment('2018-01-11T09:10:49+09:00').valueOf() }],
          [10, { readAt: moment('2018-01-11T10:10:49+09:00').valueOf() }],
        ],
      },
    }
    expect(rooms(initialState, action).toJS()).toEqual(expected)
  })

  it('add room on receiving RECEIVE_CREATE_ROOM', () => {
    const initialState = IMap([
      [
        'byId',
        IMap([
          [
            1,
            IMap([
              ['id', 1],
              ['name', 'room1'],
              ['members', IMap()],
              ['initialFetch', true],
              ['createdBy', 5],
              ['hasUnreadMessage', false],
            ]),
          ],
        ]),
      ],
      ['all', IList.of(1)],
    ])

    const expected = {
      byId: {
        1: {
          id: 1,
          name: 'room1',
          members: {},
          initialFetch: true,
          createdBy: 5,
          hasUnreadMessage: false,
        },
        5: {
          id: 5,
          name: 'room5',
          members: {},
          initialFetch: false,
          createdBy: null,
          hasUnreadMessage: false,
          oldestMessageTimestamp: Number.MAX_SAFE_INTEGER,
        },
      },
      all: [1, 5],
    }

    const action = {
      type: RECEIVE_CREATE_ROOM,
      payload: {
        id: 5,
        name: 'room5',
      },
    }
    expect(rooms(initialState, action).toJS()).toEqual(expected)
  })

  it('delete room on receiving RECEIVE_DELETE_ROOM', () => {
    const expected = {
      byId: {
        1: {
          id: 1,
          name: 'room1',
          members: {},
          initialFetch: true,
        },
      },
      all: [1],
    }

    const initialState = IMap([
      [
        'byId',
        IMap([
          [
            1,
            IMap([
              ['id', 1],
              ['name', 'room1'],
              ['members', IMap()],
              ['initialFetch', true],
            ]),
          ],
          [
            5,
            IMap([
              ['id', 5],
              ['name', 'room5'],
              ['members', IList.of()],
              ['initialFetch', false],
            ]),
          ],
        ]),
      ],
      ['all', IList.of(1, 5)],
    ])

    const action = {
      type: RECEIVE_DELETE_ROOM,
      payload: {
        roomId: 5,
      },
    }

    expect(rooms(initialState, action).toJS()).toEqual(expected)
  })

  it('should update oldestMessageTimestamp when the received message is older than the oldest message', () => {
    const action = {
      type: 'RECEIVE_MESSAGE',
      payload: {
        id: 3,
        roomId: 5,
        createdAt: moment('2017-11-03 13:00:00').valueOf(),
      },
    }

    const initialState = IMap([
      [
        'byId',
        IMap([
          [
            5,
            IMap([
              ['id', 5],
              ['name', 'room5'],
              ['members', IMap()],
              ['initialFetch', false],
              [
                'oldestMessageTimestamp',
                moment('2017-11-03 19:12:00').valueOf(),
              ],
            ]),
          ],
        ]),
      ],
      ['all', [5]],
    ])

    const expected = {
      byId: {
        5: {
          id: 5,
          name: 'room5',
          members: {},
          initialFetch: false,
          oldestMessageTimestamp: moment('2017-11-03 13:00:00').valueOf(),
        },
      },
      all: [5],
    }

    expect(rooms(initialState, action).toJS()).toEqual(expected)
  })

  it('should do nothing when the received message is newer than the oldest message', () => {
    const action = {
      type: 'RECEIVE_MESSAGE',
      payload: {
        id: 3,
        roomId: 5,
        createdAt: moment('2017-11-03 13:00:00').valueOf(),
      },
    }

    const initialState = IMap([
      [
        'byId',
        IMap([
          [
            5,
            IMap([
              ['id', 5],
              ['name', 'room5'],
              ['members', IMap()],
              ['initialFetch', false],
              [
                'oldestMessageTimestamp',
                moment('2017-11-03 11:12:00').valueOf(),
              ],
            ]),
          ],
        ]),
      ],
      ['all', [5]],
    ])

    // Returned state should be the same as the initial state
    expect(rooms(initialState, action).toJS()).toEqual(initialState.toJS())
  })
})

describe('messages', () => {
  it('returns initial state when undefined is given as state', () => {
    const expected = {
      byId: {},
      byRoomId: {},
      all: [],
    }
    expect(messages(undefined, { type: 'NON_EXISTING_TYPE' }).toJS()).toEqual(
      expected
    )
  })

  it('add room on receiving RECEIVE_MESSAGE', () => {
    const expected = {
      byId: {
        5: {
          id: 5,
          roomId: 3,
        },
      },
      byRoomId: {
        3: [5],
      },
      all: [5],
    }

    const action = {
      type: RECEIVE_MESSAGE,
      payload: {
        id: 5,
        roomId: 3,
      },
    }
    expect(messages(undefined, action).toJS()).toEqual(expected)
  })
})
