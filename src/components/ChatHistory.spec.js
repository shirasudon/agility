import React from 'react'
import { shallow } from 'enzyme'

import { ChatHistory } from './ChatHistory'
import Balloon from './Balloon'


describe("ChatHistory", () => {

    it("shows chat history given messages in entity", () => {
        const props = {
            currentRoomId: 5,
            entities: {
                users: {
                    byId: {
                        "2": {
                            id: 2,
                            username: "user2"
                        },
                        "3": {
                            id: 3,
                            username: "user3"
                        }
                    }  
                },
                messages: {
                    byRoomId: {
                        "5": [1, 3, 5]
                    },
                    byId: {
                        "1": {
                            id: 1,
                            userId: 2,
                            text: "first message",
                            createdAt: "date1", // createdAt actuall should be # of milliseconds
                        },
                        "3": {
                            id: 3,
                            userId: 3,
                            text: "second message",
                            createdAt: "date2", // createdAt actuall should be # of milliseconds
                       
                        },
                        "5": {
                            id: 5,
                            userId: 2,
                            text: "third message",
                            createdAt: "date3", // createdAt actuall should be # of milliseconds
                        }
                    }
                }
            },
            session: {
                user: {
                    id: 2,
                } 
            },
            classes: {
                root: "chatHistory" 
            },
        }

        const wrapper = shallow(<ChatHistory {...props} />)
        const historyContainer = wrapper.find("." + props.classes.root)
        expect(historyContainer).toHaveLength(1)
        const balloons = historyContainer.find(Balloon) 
        expect(balloons).toHaveLength(3)

        expect(balloons.at(0).prop("message")).toBe(props.entities.messages.byId[1])
        expect(balloons.at(1).prop("message")).toBe(props.entities.messages.byId[3])
        expect(balloons.at(2).prop("message")).toBe(props.entities.messages.byId[5])

    })

})

