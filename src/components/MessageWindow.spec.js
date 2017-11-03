import React from 'react'

import { shallow, mount, render } from 'enzyme'
import Card, { CardHeader, CardContent,} from 'material-ui/Card'
import DeleteIcon from 'material-ui-icons/Delete'
import IconButton from 'material-ui/IconButton'

import { KEY_ENTER } from '../keyCodes.js'
import { withMessageWindowHandlers, MessageWindow } from './MessageWindow' 

describe("withMessageWindowHandlers", () => {
    let props
    beforeEach( () => {
        props = {
            setCurText: jest.fn(),
            curText: 'current text',
            currentRoomId: 2,
            sendMessage: jest.fn(),
            session: {
                user: {
                    id: 5
                }
            } 
        }
    })

    describe("handleKeyPress", () => {

        it("sends a message and set current text to empty when enter key is pressed", () => {
            const DummyComponent = ( { handleKeyPress } ) => (<div>{ handleKeyPress({which: KEY_ENTER }) }</div>)
            const Component = withMessageWindowHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.sendMessage).toHaveBeenCalledWith({
                userId: 5,
                roomId: 2,
                body: 'current text',
            })
            expect(props.setCurText).toHaveBeenCalledWith('')
        })

        it("does not sends a message and set current text to empty when key other than enter key is pressed", () => {
            const DummyComponent = ( { handleKeyPress } ) => (<div>{ handleKeyPress({which: 20 }) }</div>)
            const Component = withMessageWindowHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.sendMessage).not.toHaveBeenCalled()
            expect(props.setCurText).not.toHaveBeenCalled()
        })

    })


    describe("handleChange", () => {
        it("set current text when handleChange is called", () => {
            const DummyComponent = ( { handleChange } ) => (<div>{ handleChange( { target: { value: 'hoge' } }) }</div>)
            const Component = withMessageWindowHandlers(DummyComponent)
            mount(<Component {...props} />)
            expect(props.setCurText).toHaveBeenCalledWith('hoge')

        })

    })

})

describe("MessageWindow", () => {

    it("shows initial message when current room is null", () => {
        const props = {
            setCurText: jest.fn(),
            curText: 'current text',
            currentRoomId: null,
            sendMessage: jest.fn(),
            session: {
                user: {
                    id: 5
                }
            },
            entities: {
            
            },
            deleteRoom: jest.fn(),
        }

        const wrapper = shallow(<MessageWindow {...props} />)
        expect(wrapper.find(Card)).toHaveLength(1)
        expect(wrapper.find(Card).find(CardContent)).toHaveLength(1)
        expect(wrapper.find(Card).find(CardContent).find("div")).toHaveLength(1)
    })

    it("shows delete icon for the rooms created by me", () => {
         const props = {
            setCurText: jest.fn(),
            curText: 'current text',
            currentRoomId: 1,
            sendMessage: jest.fn(),
            session: {
                user: {
                    id: 5
                }
            },
            entities: {
                rooms: {
                    byId: {
                        "1": {
                            createdBy: 5,
                            name: "hoge",
                        }
                    },
                },
                messages: {
                    byRoomId: {
                        "1": [1, 2, 3],
                    },
                    byId: {
                        "1": {},
                        "2": {},
                        "3": {},
                    }
                },
                users: {
                    byId: {}
                }
            },
            deleteRoom: jest.fn(),
        }

        const wrapper = shallow(<MessageWindow {...props} />)

        expect(wrapper.find(IconButton)).toHaveLength(1)
        wrapper.find(IconButton).simulate("click")
        expect(props.deleteRoom).toHaveBeenCalledWith(1)
        expect(wrapper.find(DeleteIcon)).toHaveLength(1)
   
    })

    it("does not show delete icon for the rooms NOT created by me", () => {
         const props = {
            setCurText: jest.fn(),
            curText: 'current text',
            currentRoomId: 1,
            sendMessage: jest.fn(),
            session: {
                user: {
                    id: 5
                }
            },
            entities: {
                rooms: {
                    byId: {
                        "1": {
                            createdBy: 2,
                            name: "hoge",
                        }
                    },
                },
                messages: {
                    byRoomId: {
                        "1": [1, 2, 3],
                    },
                    byId: {
                        "1": {},
                        "2": {},
                        "3": {},
                    }
                },
                users: {
                    byId: { }
                }
            },
            deleteRoom: jest.fn(),
        }

        const wrapper = shallow(<MessageWindow {...props} />)
        expect(wrapper.find(DeleteIcon)).toHaveLength(0)
   
    })

})

