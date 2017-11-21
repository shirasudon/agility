import { toJS } from 'immutable'

import { createGroup } from './createGroup'
import { chatActionCreator} from "../../actions"

it('returns initialized state when no state is given', () => {
    expect(createGroup(undefined, {type: "NON_EXISTING_TYPE"}).toJS()).toEqual(
        {
            showModal: false,
            isRequesting: false
        }
    )
})

it('sets showModal to true when action type is OPEN_CREATE_GROUP_MODAL', () => {
    expect(
        createGroup(undefined, chatActionCreator.openCreateGroupModal()).toJS()
    ).toEqual(
        {
            showModal: true,
            isRequesting: false
        }
    )
})

it('sets showModal to false when action type is OPEN_CREATE_GROUP_MODAL', () => {
    expect(
        createGroup(undefined, chatActionCreator.closeCreateGroupModal()).toJS()
    ).toEqual(
        {
            showModal: false,
            isRequesting: false
        }
    )
})

it('sets isRequesting to true when action type is REQUEST_CREATE_ROOM', () => {
    expect(
        createGroup(undefined, chatActionCreator.requestCreateRoom()).toJS()
    ).toEqual(
        {
            showModal: false,
            isRequesting: true
        }
    )
})

it('sets isRequesting to false when action type is RECEIVE_CREATE_ROOM', () => {
    const room = {}; // room cannot be empty in action situation!
    expect(
        createGroup(undefined, chatActionCreator.receiveCreateRoom(room)).toJS()
    ).toEqual(
        {
            showModal: false,
            isRequesting: false
        }
    )
})

