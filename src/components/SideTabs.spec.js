// @format
import { shallow, mount } from 'enzyme'
import React from 'react'
import Tabs, { Tab } from 'material-ui/Tabs'

import { SideTabs, TabContainer, createSideTabs } from './SideTabs'
import { RoomList } from './RoomList'
import { FriendList } from './FriendList'

const DummyComponent = () => <span>dummy</span>

describe('SideTabs', () => {
  it('prints Tabs with two Tab in it, and TabContainer', () => {
    const wrapper = shallow(<SideTabs activeTab={0} />)
    expect(wrapper.find(TabContainer)).toHaveLength(1)
    expect(wrapper.find(Tabs)).toHaveLength(1)
    expect(wrapper.find(Tab)).toHaveLength(2)
  })

  it('renders FriendList when activaTab is 0', () => {
    const MySideTabs = createSideTabs(
      () => <div className="friend" />,
      () => <div className="room" />
    )
    const wrapper = mount(<MySideTabs activeTab={0} />)
    expect(wrapper.find('.friend')).toHaveLength(1)
    expect(wrapper.find('.room')).toHaveLength(0)
  })

  it('renders RoomList when activaTab is 1', () => {
    const MySideTabs = createSideTabs(
      () => <div className="friend" />,
      () => <div className="room" />
    )
    const wrapper = mount(<MySideTabs activeTab={1} />)
    expect(wrapper.find('.friend')).toHaveLength(0)
    expect(wrapper.find('.room')).toHaveLength(1)
  })
})

describe('TabContainer', () => {
  it('renders the children components enclosed with div', () => {
    const wrapper = mount(
      <TabContainer>
        <DummyComponent />
      </TabContainer>
    )
    expect(wrapper.find('span')).toHaveLength(1)
    expect(wrapper.find('span').text()).toBe('dummy')
  })
})
