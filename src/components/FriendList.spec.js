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
            byUsername: {
                "user1": {
                    username: "user1",
                    firstName: "first1",
                    lastName: "lastName1",
                },
                "user5": {
                    username: "user5",
                    firstName: "first5",
                    lastName: "lastName5",
                },
            },
            all: ["user1", "user5"],
        }
        const wrapper = shallow(<FriendList friends={friends} />)
        expect(wrapper.find(ListItem)).toHaveLength(2)
    })
})

