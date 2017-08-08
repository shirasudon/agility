import React, { Component } from 'react';
import {connect} from 'react-redux';


import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Grid from 'material-ui/Grid';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import {fetchRoomInfo, fetchRooms, fetchFriends, enterRoom} from '../actions/chat';
import socket from '../api/socket';
import CreateGroupModal from './CreateGroupModal';

// const FRIEND_KEY = "friend-list";
// const ROOM_KEY = "room-list";

const TabContainer = props =>
  <div style={{ padding: 20 }}>
    {props.children}
  </div>;

class Chat extends Component {

    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            activeTab: 0,
            room: null,
            showModal: false,
        };
        this.onChange = this.onChange.bind(this);
        this.showRoom = this.showRoom.bind(this);
        this.openCreateGroupModal = this.openCreateGroupModal.bind(this);
        this.closeCreateGroupModal = this.closeCreateGroupModal.bind(this);
        //this.showFriendTalk = this.showFriendTalk(this);
    }

    componentDidMount(){
        const {fetchRooms, fetchFriends} = this.props;
        fetchRooms();
        fetchFriends();
    }

    onChange(event, index){
        this.setState({activeTab: index});
    }

    showRoom(roomId){
        const {fetchRoomInfo, enterRoom, rooms} = this.props;
        const {initialFetch} = this.props.rooms.byId[roomId];
        enterRoom(roomId);
        if(!initialFetch){
            fetchRoomInfo(roomId);
        }
        this.setState({room: rooms.byId[roomId]});
    }

    openCreateGroupModal() {
        this.setState({ showModal: true }); 
    }

    closeCreateGroupModal() {
        this.setState({ showModal: false });
    }

    // showFriendTalk(username){
    //     //TODO implement
    //     this.setState({room: roomId});
    //     this.fetchRoomInfo();
    // }    

    render() {
        const {friends, rooms} = this.props;

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
                            onClick={() => {this.showRoom(room.id);}}
                        />
                    </ListItem>
                );
            }
        );
        
        return (
            <Grid container justify="center">
                <Grid item xs={3}>
                    <CreateGroupModal showModal={this.state.showModal} closeModal={this.closeCreateGroupModal} />
                    <Button
                       onClick={this.openCreateGroupModal}
                    >
                    グループ作成
                    </Button>
                    <Tabs index={this.state.activeTab} onChange={this.onChange}>
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
                </Grid>
                <Grid item xs={6}>
                    {this.state.room == null ? 
                        (
                            <Card>
                                <CardContent>
                                    <div>Lets start chatting with your friends!!</div>
                                </CardContent>
                            </Card>

                        ):
                        (
                            <Card>
                                <CardHeader
                                  title={this.state.room.name}
                                  subheader="September 14, 2016"
                                />
                                <Divider/>
                                <CardContent>
                                   {this.state.room.name}
                                </CardContent>
                            </Card>
                        )
                    }
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = ({friends, rooms}) => ({
    friends: friends,
    rooms: rooms
});

const mapDispatchToProps = (dispatch) => ({
    fetchRoomInfo: (roomId) => {
        dispatch(fetchRoomInfo(roomId));
    },
    fetchRooms: () => {
        dispatch(fetchRooms());
    },
    fetchFriends: () => {
        dispatch(fetchFriends());
    },
    enterRoom: (roomId) => {
        dispatch(enterRoom(roomId));  
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
