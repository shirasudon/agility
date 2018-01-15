// @format
import React from 'react'
import moment from 'moment'
import { shallow, mount, render } from 'enzyme'

import { Balloon, RIGHT, LEFT, withLifecycle } from './Balloon'

describe('Balloon', () => {
  it('renders message, read count, meta infos on the right when the poster is myself', () => {
    const props = {
      classes: {
        postMetaRight: 'postMetaRight',
        postMetaLeft: 'postMetaLeft',
        balloonRight: 'balloonRight',
        balloonLeft: 'balloonLeft',
      },
      message: {
        id: 2,
        userId: 3,
        text: 'this is a text',
        createdAt: moment('2017-11-04 12:34:55').valueOf(),
        readBy: [],
      },
      users: {
        byId: {
          '3': {
            username: 'hitochan',
          },
        },
      },
      myId: 3,
    }

    const wrapper = mount(<Balloon {...props} />)
    expect(wrapper.find('.balloonRight').text()).toBe(props.message.text)
    expect(wrapper.find('.readCount').text()).toBe('')
    expect(wrapper.find('.username-and-createdAt')).toContainReact(
      <div className="username-and-createdAt">
        <span>hitochan</span>: November 4th 2017, 12:34 pm
      </div>
    )
  })

  it('renders message, read count, meta infos on the left when the poster is the other', () => {
    const props = {
      classes: {
        postMetaRight: 'postMetaRight',
        postMetaLeft: 'postMetaLeft',
        balloonRight: 'balloonRight',
        balloonLeft: 'balloonLeft',
      },
      message: {
        id: 2,
        userId: 5,
        text: 'this is a text',
        createdAt: moment('2017-11-04 12:34:55').valueOf(),
        readBy: [1, 3, 5],
      },
      users: {
        byId: {
          '5': {
            username: 'john',
          },
        },
      },
      session: {
        user: {
          id: 3,
        },
      },
    }

    const wrapper = mount(<Balloon {...props} />)
    expect(wrapper.find('.balloonLeft').text()).toBe(props.message.text)
    expect(wrapper.find('.readCount').text()).toBe('3 Read')
    expect(wrapper.find('.username-and-createdAt')).toContainReact(
      <div className="username-and-createdAt">
        <span>john</span>: November 4th 2017, 12:34 pm
      </div>
    )
  })
})
