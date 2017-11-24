import React from 'react'

import { shallow, mount, render } from 'enzyme'
import Card, { CardHeader, CardContent } from 'material-ui/Card'

import { MessageWindow } from './MessageWindow'
import ChatHeader from './ChatHeader'
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'

describe('MessageWindow', () => {
  it('shows initial message when current room is null', () => {
    const props = {
      currentRoomId: null,
      session: {},
      entities: {},
    }

    const wrapper = shallow(<MessageWindow {...props} />)
    const container = wrapper.find('.message-container')
    expect(container).toHaveLength(1)
    expect(container.text()).toBe('Lets start chatting with your friends!!')
  })

  it('shows delete icon for the rooms created by me', () => {
    const props = {
      currentRoomId: 1,
      session: {
        user: {
          id: 5,
        },
      },
      entities: {
        rooms: {
          byId: {
            '1': {
              createdBy: 5,
              name: 'hoge',
            },
          },
        },
        users: {
          byId: {},
        },
      },
      classes: {},
    }

    const wrapper = shallow(<MessageWindow {...props} />)

    expect(wrapper.find(ChatHeader)).toHaveLength(1)
    expect(wrapper.find(ChatHeader).prop('title')).toBe('hoge')
    expect(wrapper.find(ChatHeader).prop('shouldShowDeleteIcon')).toBe(true)
    expect(wrapper.find(ChatHistory)).toHaveLength(1)
    expect(wrapper.find(ChatInput)).toHaveLength(1)
  })

  it('does not show delete icon for the rooms not created by me', () => {
    const props = {
      currentRoomId: 1,
      session: {
        user: {
          id: 5,
        },
      },
      entities: {
        rooms: {
          byId: {
            '1': {
              createdBy: 2,
              name: 'hoge',
            },
          },
        },
        users: {
          byId: {},
        },
      },
      classes: {},
    }

    const wrapper = shallow(<MessageWindow {...props} />)

    expect(wrapper.find(ChatHeader)).toHaveLength(1)
    expect(wrapper.find(ChatHeader).prop('title')).toBe('hoge')
    expect(wrapper.find(ChatHeader).prop('shouldShowDeleteIcon')).toBe(false)
    expect(wrapper.find(ChatHistory)).toHaveLength(1)
    expect(wrapper.find(ChatInput)).toHaveLength(1)
  })
})
