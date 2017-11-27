// @format
import { shallow } from 'enzyme'
import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

import { RoomList } from './RoomList'

describe('RoomList', () => {
  it('returns null if rooms.all is not array', () => {
    expect(RoomList({ rooms: { all: null } })).toBe(null)
    expect(RoomList({ rooms: { all: undefined } })).toBe(null)
  })

  it('returns list of ListItem if rooms.all is an array', () => {
    const rooms = {
      byId: {
        '1': {
          id: '1',
          name: 'room1',
          initialFetch: false,
        },
        '5': {
          id: '5',
          name: 'room5',
          initialFetch: true,
        },
      },
      all: ['1', '5'],
    }
    const enterRoom = jest.fn()
    const wrapper = shallow(<RoomList rooms={rooms} enterRoom={enterRoom} />)
    expect(wrapper.find(ListItem)).toHaveLength(2)
    wrapper
      .find(ListItemText)
      .first()
      .simulate('click')
    wrapper
      .find(ListItemText)
      .last()
      .simulate('click')
    expect(enterRoom).toHaveBeenCalledWith('1', true)
    expect(enterRoom).toHaveBeenCalledWith('5', false)
  })
})
