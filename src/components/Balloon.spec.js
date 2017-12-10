// @format
import React from 'react'
import moment from 'moment'
import { shallow, mount, render } from 'enzyme'

import { Balloon, RIGHT, LEFT, withLifecycle } from './Balloon'

describe('withLifecycles', () => {
  it('calls sendRead when a message is not read by the user', () => {
    const props = {
      sendRead: jest.fn(),
      message: {
        id: 3,
        readBy: [1, 3, 5],
      },
      myId: 2,
    }
    const BaseComponent = () => <div>hoge</div>
    const Component = withLifecycle(BaseComponent)
    const wrapper = mount(<Component {...props} />)
    expect(props.sendRead).toHaveBeenCalledWith(props.message.id, props.myId)
  })

  it('does not call sendRead when a message is already read by the user', () => {
    const props = {
      sendRead: jest.fn(),
      message: {
        id: 3,
        readBy: [1, 3, 5],
      },
      myId: 3,
    }
    const BaseComponent = () => <div>hoge</div>
    const Component = withLifecycle(BaseComponent)
    const wrapper = mount(<Component {...props} />)
    expect(props.sendRead).not.toHaveBeenCalled()
  })
})

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
    expect(wrapper.find('.postMetaRight')).toContainReact(
      <div className="postMetaRight">
        <span>hitochan</span> : <span>November 4th 2017, 12:34 pm</span>
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
    expect(wrapper.find('.postMetaLeft')).toContainReact(
      <div className="postMetaLeft">
        <span>john</span> : <span>November 4th 2017, 12:34 pm</span>
      </div>
    )
  })
})
