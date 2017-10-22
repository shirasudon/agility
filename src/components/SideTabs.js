import React, {Component} from 'react'
import { withState } from 'recompose'

import Tabs, { Tab } from 'material-ui/Tabs'

import RoomList from './RoomList'
import FriendList from './FriendList'


const TabContainer = ( { children } ) => (
    <div style={{ padding: 20 }}>
        {children}
    </div>
)

const SideTabs = ( { activeTab, setActiveTab } ) => (
    <div>
        <Tabs value={activeTab} onChange={(event, index) => {setActiveTab(index)}}>
            <Tab label="友達"/>
            <Tab label="ルーム"/>
        </Tabs>
        <TabContainer>
            { activeTab === 0 && <FriendList /> }
            { activeTab === 1 && <RoomList /> }
        </TabContainer>
    </div>
)

export default withState('activeTab', 'setActiveTab', 0)(SideTabs)

