import { rootReducer as reducer } from './index'

it("returns correct inital state", () => {
    expect(reducer(undefined, {type: "NON_EXISTENT_TYPE"})).toEqual({
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
            }
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
            }
        }
    })
})
