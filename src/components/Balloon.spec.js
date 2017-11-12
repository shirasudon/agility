import React from 'react'
import moment from 'moment'
import { shallow, mount, render } from 'enzyme'

import { Balloon, RIGHT, LEFT } from './Balloon'


describe("Balloon", () => {
    it("renders username and post date", () => {
        const props = {
            classes: {
                postMetaRight: "postMetaRight",
                postMetaLeft: "postMetaLeft",
            },
            message: {
                id: 2,
                userId: 3,
                text: "this is a text",
                createdAt: moment("2017-11-04 12:34:55").valueOf(),
                readBy: [],
            },
            users: {
                byId: {
                    "3": {
                        username: "hitochan",
                    }
                }   
            },
            session: {
                user: {
                    id: 3,
                }
            }
        }
        const wrapper = mount(<Balloon {...props}/>)
        expect(wrapper.find(".postMetaRight")).toContainReact(
            <div className={props.classes.postMetaRight}>
                <span>{props.username}</span> : <span>November 4th 2017, 12:34 pm</span>
            </div>
        )
    })
})

