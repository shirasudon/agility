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
            text: "this is a text",
            username: "hitochan", 
            createdAt: moment("2017-11-04 12:34:55").valueOf(),
            direction: RIGHT
        }
        const wrapper = mount(<Balloon {...props}/>)
        expect(wrapper.find(".postMetaRight")).toContainReact(
            <div className={props.classes.postMetaRight}>
                <span>{props.username}</span> : <span>November 4th 2017, 12:34 pm</span>
            </div>
        )
    })
})
