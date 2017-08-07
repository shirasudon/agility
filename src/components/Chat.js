import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button, Panel, Grid, Row, Col, ListGroup, ListGroupItem, Tabs, Tab} from 'react-bootstrap';

import {fetchRoomInfo, fetchRooms, fetchFriends, enterRoom} from '../actions/chat';
import socket from '../api/socket';

const FRIEND_KEY = "friend-list";
const ROOM_KEY = "room-list";

class Chat extends Component {

    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            activeTab: FRIEND_KEY,
            room: null
        };
        this.onSelect = this.onSelect.bind(this);
        this.showRoom = this.showRoom.bind(this);
        //this.showFriendTalk = this.showFriendTalk(this);
    }

    componentDidMount(){
        const {fetchRooms, fetchFriends} = this.props;
        fetchRooms();
        fetchFriends();
    }

    onSelect(eventKey){
        this.setState({activeTab: eventKey});
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
                    <ListGroupItem 
                        key={index} 
                        header={friend.firstName + " " + friend.lastName}
                    >
                        {friend.username}
                    </ListGroupItem>
                );
            }
        );

        console.log(rooms);
        const roomList = rooms.all.map(
            (roomId, index) => {
                const room = rooms.byId[roomId];
                return (
                <ListGroupItem 
                    key={index} 
                    header={room.name}
                    onClick={() => {this.showRoom(room.id);}}
                >
                </ListGroupItem>);
            }
        );
        
        return (
            <Grid>
                <Row>
                    <Col xsOffset={1} xs={3}>
                         <Button>グループ作成</Button>
                         <Tabs activeKey={this.state.activeTab} onSelect={this.onSelect} id="controlled-tab-example">
                            <Tab eventKey={FRIEND_KEY} title="友達">
                                <ListGroup>
                                    {friendList}
                                </ListGroup>
                            </Tab>
                            <Tab eventKey={ROOM_KEY} title="ルーム">
                                <ListGroup>
                                    {roomList}
                                </ListGroup>
                            </Tab>
                        </Tabs>
                   </Col>

                    <Col xs={6}>
                        {this.state.room == null ? 
                            (
                                <Panel>
                                    <div>Lets start chatting with your friends!!</div>
                                </Panel>
                            ):
                            (
                                <Panel header={this.state.room.name}>
                                    {this.state.room.name}
                                </Panel>
                            )
                        }
                    </Col>

                </Row>
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
