import { shallow } from 'enzyme'
import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

import { FriendList } from './FriendList'

describe("RoomList", () => {

    it("returns list of friends", () => {
        const users = {
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
        const wrapper = shallow(<FriendList friendIds={[5]}users={users} />)
        expect(wrapper.find(ListItem)).toHaveLength(1)
    })
})

