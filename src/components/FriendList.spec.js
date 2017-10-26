import { shallow } from 'enzyme'
import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

import { FriendList } from './FriendList'

describe("RoomList", () => {
    it("returns null if rooms.all is not array", () => {
        expect(FriendList({friends: {all: null}})).toBe(null)
        expect(FriendList({friends: {all: undefined}})).toBe(null)
    })

    it("returns list of ListItem if rooms.all is an array", () => {
        const friends = {
            byId: {
                "1": {
                    id: 1,
                    username: "user1",
                    firstName: "first1",
                    lastName: "lastName1",
                },
                "5": {
                    id: 5, 
                    username: "user5",
                    firstName: "first5",
                    lastName: "lastName5",
                },

            },
            byUsername: {
                "user1": {
                    id: 1,
                    username: "user1",
                    firstName: "first1",
                    lastName: "lastName1",
                },
                "user5": {
                    id: 5, 
                    username: "user5",
                    firstName: "first5",
                    lastName: "lastName5",
                },
            },
            all: [1, 5],
        }
        const wrapper = shallow(<FriendList friends={friends} />)
        expect(wrapper.find(ListItem)).toHaveLength(2)
    })
})

