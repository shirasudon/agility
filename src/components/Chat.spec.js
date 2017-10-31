import React from 'react'
import { shallow, mount, render } from 'enzyme'
import Button from 'material-ui/Button'

import { chatActionCreator } from '../actions'
import { Chat, mapDispatchToProps, setChatActionCreator, withLifecycles } from './Chat'
import CreateGroupModal from './CreateGroupModal'
import SideTabs from './SideTabs'
import MessageWindow from './MessageWindow'

describe("Chat", () => {

    it("contains CreateGroupModal, Button, SideTabs, MessageWindow ", () => {
        const openCreateGroupModal = jest.fn()
        const wrapper = shallow(<Chat openCreateGroupModal={()=>{}} />)
        expect(wrapper.find(CreateGroupModal)).toHaveLength(1)
        expect(wrapper.find(Button)).toHaveLength(1)
        expect(wrapper.find(SideTabs)).toHaveLength(1)
        expect(wrapper.find(MessageWindow)).toHaveLength(1)
    })

    it("contains calls openCreateGroupModal when a button is clicked ", () => {
        const openCreateGroupModal = jest.fn()
        const wrapper = shallow(<Chat openCreateGroupModal={openCreateGroupModal} />)
        wrapper.find(Button).simulate("click")
        expect(openCreateGroupModal).toHaveBeenCalled()
    })

})

describe("mapDispatchToProps", () => {

    const chatActionCreator = {
        fetchRooms: jest.fn( (roomId) => `fetchRooms: ${roomId}` ),
        fetchFriends: jest.fn( (userId) => `fetchFriends: ${userId}` ),
        openCreateGroupModal: jest.fn(),
    } 
    const dispatch = jest.fn()

    beforeEach( () => {
        jest.clearAllMocks()
        setChatActionCreator(chatActionCreator)
    })

    it("dispatches fetchRooms", () => {
        mapDispatchToProps(dispatch).fetchRooms(3)
        expect(chatActionCreator.fetchRooms).toHaveBeenCalledWith(3)
        expect(dispatch).toHaveBeenCalledWith("fetchRooms: 3")
    })

    it("dispatches fetchFriends", () => {
        mapDispatchToProps(dispatch).fetchFriends(5)
        expect(chatActionCreator.fetchFriends).toHaveBeenCalledWith(5)
        expect(dispatch).toHaveBeenCalledWith("fetchFriends: 5")
    })

    it("dispatches openCreateGroupModal", () => {
        mapDispatchToProps(dispatch).openCreateGroupModal()
        expect(chatActionCreator.openCreateGroupModal).toHaveBeenCalled()
        expect(dispatch).toHaveBeenCalled()
    })

})

describe("componentDidMount", () => {

    it("calls fetchRooms and fetchFriends when user data is ready", () => {
        const props = {
            fetchRooms: jest.fn(),
            fetchFriends: jest.fn(),
            session: {
                user: {
                    id: 3,
                },
            },
        }

        const DummyComponent = () => <div>Dummy</div>
        const Component = withLifecycles(DummyComponent)
        mount(<Component {...props}/>)
        expect(props.fetchFriends).toHaveBeenCalled()
        expect(props.fetchRooms).toHaveBeenCalled()
    })

    it("does not call fetchRooms and fetchFriends when user data is not ready", () => {
        const props = {
            fetchRooms: jest.fn(),
            fetchFriends: jest.fn(),
            session: {
                user: {},
            },
        }

        const DummyComponent = () => <div>Dummy</div>
        const Component = withLifecycles(DummyComponent)
        mount(<Component {...props}/>)
        expect(props.fetchFriends).not.toHaveBeenCalled()
        expect(props.fetchRooms).not.toHaveBeenCalled()
    })

})
