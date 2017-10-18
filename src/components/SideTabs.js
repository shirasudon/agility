import React, {Component} from 'react';
import {connect} from 'react-redux';

import Tabs, { Tab } from 'material-ui/Tabs';
import { ListItem, ListItemText } from 'material-ui/List';

import {chatActionCreator} from "../actions";


const TabContainer = props => (
    <div style={{ padding: 20 }}>
        {props.children}
    </div>
);

class SideTabs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0
        }

        this.onChange = this.onChange.bind(this);
        this.enterRoom = this.enterRoom.bind(this);
    }

    onChange(event, index){
        this.setState(
            {
                activeTab: index
            }
        );
    }

    enterRoom(roomId) {
        const { rooms } = this.props.entities;
        this.props.enterRoom(roomId, !rooms.byId[roomId].initialFetch)
    }

    render(){
        const {entities} = this.props;
        const {friends, rooms} = entities;

        const friendList = friends.all.map(
            (username, index) => {
                const friend = friends.byUsername[username];
                return (
                    <ListItem button key={index}>
                        <ListItemText
                            primary={friend.firstName + " " + friend.lastName}
                            secondary={friend.username}
                        />
                    </ListItem>
                );
            }
        );

        const roomList = rooms.all.map(
            (roomId, index) => {
                const room = rooms.byId[roomId];
                return (
                    <ListItem button key={index}>
                        <ListItemText
                            primary={room.name}
                            onClick={() => {this.enterRoom(roomId);}}
                        />
                    </ListItem>
                );
            }
        );

        return (
            <div>
                <Tabs value={this.state.activeTab} onChange={this.onChange}>
                    <Tab label="友達"/>
                    <Tab label="ルーム"/>
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    <TabContainer>
                        {friendList}
                    </TabContainer>
                }
                {
                    this.state.activeTab === 1 &&
                    <TabContainer>
                        {roomList}
                    </TabContainer>
                }
            </div>
        );
    }
}

const mapStateToProps = ({entities, currentRoomId}) => ({
    entities,
    currentRoomId,
});

const mapDispatchToProps = (dispatch) => ({
    enterRoom: (roomId, shouldFetch=false) => {
        dispatch(chatActionCreator.enterRoom(roomId, shouldFetch));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SideTabs);
