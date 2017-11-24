import React from 'react'
import { withState } from 'recompose'

import Tabs, { Tab } from 'material-ui/Tabs'

import ConnectedRoomList from './RoomList'
import ConnectedFriendList from './FriendList'

export const TabContainer = ({ children }) => (
  <div style={{ padding: 20 }}>{children}</div>
)

export const createSideTabs = (FriendList, RoomList) => ({
  activeTab,
  setActiveTab,
}) => (
  <div>
    <Tabs
      value={activeTab}
      onChange={(event, index) => {
        setActiveTab(index)
      }}
    >
      <Tab label="友達" />
      <Tab label="ルーム" />
    </Tabs>
    <TabContainer>
      {activeTab === 0 && <FriendList />}
      {activeTab === 1 && <RoomList />}
    </TabContainer>
  </div>
)

export const SideTabs = createSideTabs(ConnectedFriendList, ConnectedRoomList)

export default withState('activeTab', 'setActiveTab', 0)(SideTabs)
