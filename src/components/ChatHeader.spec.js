import React from 'react'

import { mount } from 'enzyme'
import Card, { CardHeader, CardContent,} from 'material-ui/Card'
import DeleteIcon from 'material-ui-icons/Delete'

import { ChatHeader } from './ChatHeader'


describe("ChatHeader", () => {

    it("shows title but not delete icon when shouldShowDeleteIcon is false", () => {
        const props = {
            title: 'GREAT TITLE',
            shouldShowDeleteIcon: false,
            currentRoomId: 1,
            deleteRoom: jest.fn(),
        }

        const wrapper = mount(<ChatHeader {...props} />)
        expect(wrapper.find(".chatTitle").text()).toBe(props.title)
        expect(wrapper.find(DeleteIcon)).toHaveLength(0)
    })

    it("shows title and delete icon when shouldShowDeleteIcon is true", () => {
        const props = {
            title: 'GREAT TITLE',
            shouldShowDeleteIcon: true,
            currentRoomId: 1,
            deleteRoom: jest.fn(),
        }

        const wrapper = mount(<ChatHeader {...props} />)
        expect(wrapper.find(".chatTitle").text()).toBe(props.title)
        expect(wrapper.find(DeleteIcon)).toHaveLength(1)
    })

    it("calls deleteRoom when delete icon is clicked", () => {
        const props = {
            title: 'GREAT TITLE',
            shouldShowDeleteIcon: true,
            currentRoomId: 1,
            deleteRoom: jest.fn(),
        }

        const wrapper = mount(<ChatHeader {...props} />)
        wrapper.find(DeleteIcon).simulate('click')
        expect(props.deleteRoom).toHaveBeenCalledWith(props.currentRoomId)
    })

})

