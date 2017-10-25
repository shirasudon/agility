import React from 'react'

import { shallow, mount, render } from 'enzyme'
import { ListItem, ListItemText } from 'material-ui/List'

import { 
    CreateGroupModal, 
    mapSelectedUsersToChipData,
    withModalHandlers,
    MatchedUserList,
    mapDispatchToProps,
} from './CreateGroupModal'
import { chatActionCreator } from '../actions'

describe("mapSelectedUsersToChipData", () => {

    it("maps list of usernames to data compatible wth Chip", () => {
        const usernames = ['Mary', 'James', 'John']
        const chipData = mapSelectedUsersToChipData(usernames)
        const expected = [
            {
                label: 'Mary',
                key: 0,
            },
            {
                label: 'James',
                key: 1,
            },
            {
                label: 'John',
                key: 2,
            }
        ]
        expect(chipData).toEqual(expected)
    })

})

describe("withModalHandlers", () => {
    let props
    beforeEach( () => {
        props = {
            selectedUsers: ["user1", "user3"],
            roomName: "tennis club",
            setSelectedUsers: jest.fn(),
            setSearchText: jest.fn(),
            setRoomName: jest.fn(),
            createRoom: jest.fn(),
        }
    })

    describe("handleDeleteChip", () => {

        it("calls setSelectedUsers with the user removed if he/she exists", () => {
            const DummyComponent = ({handleDeleteChip}) => (<div>{handleDeleteChip({label: "user1"})}</div>)
            const Component = withModalHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.setSelectedUsers).toHaveBeenCalledWith(["user3"])
        })

        it("calls setSelectedUsers with the original list if he/she does not exist", () => {
            const DummyComponent = ({handleDeleteChip}) => (<div>{handleDeleteChip({label: "user10"})}</div>)
            const Component = withModalHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.setSelectedUsers).toHaveBeenCalledWith(["user1", "user3"])
        })

    })

    describe("handleAddChip", () => {

        it("calls setSelectedUsers with new user added", () => {
            const DummyComponent = ({handleAddChip}) => (<div>{handleAddChip("user5")}</div>)
            const Component = withModalHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.setSelectedUsers).toHaveBeenCalledWith(["user1", "user3", "user5"])
        })

    })

    describe("handleSearchTextChange", () => {

        it("calls setSearchText with event.target.value", () => {
            const DummyComponent = ({handleSearchTextChange}) => (<div>{handleSearchTextChange({target: {value: 'we are the world'}})}</div>)
            const Component = withModalHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.setSearchText).toHaveBeenCalledWith('we are the world')
        }) 

    })

    describe("handleRoomNameChange", () => {

        it("calls setRoomName with event.target.value", () => {
            const DummyComponent = ({handleRoomNameChange}) => (<div>{handleRoomNameChange({target: {value: 'we are the world'}})}</div>)
            const Component = withModalHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.setRoomName).toHaveBeenCalledWith('we are the world')
        }) 

    })

    describe("handleCreateRoomClick", () => {

        it("calls createRoom with selectedUsers and roomName", () => {
            const DummyComponent = ({handleCreateRoomClick}) => (<div>{handleCreateRoomClick()}</div>)
            const Component = withModalHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.createRoom).toHaveBeenCalledWith(props.selectedUsers, props.roomName)
        }) 

    })

})

describe("MatchedUserList", () => {
    const users = {
        byUsername: {
            "john": {
                username: "john",
            },
            "mary": {
                username: "mary",
            }
        },
        all: ["john", "mary"],
    }

    it("return <span>No matching users</span> if there are no matching users found", () => {
        const wrapper = shallow(<MatchedUserList users={users} searchText={'this will no match with any user!'} handleAddChip={()=>{}} selectedUsers={[]}/>) 
        expect(wrapper).toContainReact(<span>No matching users</span>)
    })

    it("return <span>No matching users</span> even if there is a matching users found as long as he/she is in the selectedUser list", () => {
        const wrapper = shallow(<MatchedUserList users={users} searchText={'jo'} handleAddChip={()=>{}} selectedUsers={["john"]}/>) 
        expect(wrapper).toContainReact(<span>No matching users</span>)
    })

    it("return ListItem of john if the search text is jo", () => {
        const wrapper = shallow(<MatchedUserList users={users} searchText={'jo'} handleAddChip={()=>{}} selectedUsers={[]}/>) 
        expect(wrapper.find(ListItem)).toHaveLength(1)
        expect(wrapper.find(ListItem).find(ListItemText)).toHaveLength(1)
        expect(wrapper.find(ListItem).find(ListItemText).prop("primary")).toBe("john")
    })

    it("return all users if the search text is empty", () => {
        const wrapper = shallow(<MatchedUserList users={users} searchText={''} handleAddChip={()=>{}} selectedUsers={[]}/>) 
        expect(wrapper.find(ListItem)).toHaveLength(2)
        expect(wrapper.find(ListItemText)).toHaveLength(2)
        expect(wrapper.find(ListItem).first().find(ListItemText).prop("primary")).toBe("john")
        expect(wrapper.find(ListItem).at(1).find(ListItemText).prop("primary")).toBe("mary")
    })

    it("calls handleAddChip when ListItem is clicked", () => {
        const handleAddChip = jest.fn()
        const wrapper = shallow(<MatchedUserList users={users} searchText={'jo'} handleAddChip={handleAddChip} selectedUsers={[]}/>)
        expect(wrapper.find(ListItem)).toHaveLength(1)
        expect(wrapper.find(ListItem).find(ListItemText)).toHaveLength(1)
        wrapper.find(ListItem).first().find(ListItemText).simulate('click')
        expect(handleAddChip).toHaveBeenCalledWith('john')

    })

})

describe("CreateGroupModal", () => {
    let props

    beforeEach( () => 
        props = {
            ui: {
                createGroup: true,
            },
            entities: {
                friends: {
                    byUsername: {
                        "john": {
                            username: "john",
                        },
                    },
                    all: ["john"],
                } ,
            },
            closeModal: jest.fn(),
            classes: {
                appBar: {
                    position: 'relative',
                },
                flex: {
                    flex: 1,
                },
                dialogContent: {
                    marginTop: '50px',
                },
            },
            selectedUsers: ["ken"],
            searchText: "hoge", 
            roomName: "this is a room!",
            handleAddChip: jest.fn(),
            handleRoomNameChange: jest.fn(), 
            handleCreateRoomClick: jest.fn(),
            handleDeleteChip: jest.fn(),
            handleSearchTextChange: jest.fn(),
        }
    )

    it("renders without crashing", () => {
        render(<CreateGroupModal {...props}/>);
    })
})

// describe("mapDispatchToProps", () => {
//     it("createRoom", () => {
//         const dispatch = jest.fn()
//         const { createRoom } = mapDispatchToProps(dispatch)
//         createRoom(["satosi", "akiko"], "room!!")
//         expect(dispatch).toHaveBeenCalledWith(chatActionCreator.createRoom({
//             members: ["satoshi", "akiko"],
//             roomName: "room!!",
//         }))
//     })
// })
