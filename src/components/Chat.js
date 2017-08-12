import React, { Component } from 'react';
import {connect} from 'react-redux';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import {fetchRoomInfo, fetchRooms, fetchFriends, } from '../actions/chat';
import CreateGroupModal from './CreateGroupModal';
import SideTabs from './SideTabs';
import MessageWindow from './MessageWindow';

class Chat extends Component {

    constructor(props){
        super(props);

        this.state = {
            showModal: false,
        };

        this.showRoom = this.showRoom.bind(this);
        this.openCreateGroupModal = this.openCreateGroupModal.bind(this);
        this.closeCreateGroupModal = this.closeCreateGroupModal.bind(this);
    }

    componentDidMount(){
        const {fetchRooms, fetchFriends} = this.props;
        fetchRooms();
        fetchFriends();
    }

    showRoom(roomId){
        const {fetchRoomInfo, entities} = this.props;
        const {rooms} = entities;
        const {initialFetch} = this.props.rooms.byId[roomId];
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

    render() {
        return (
            <Grid container justify="center">
                <Grid item xs={3}>
                    <CreateGroupModal showModal={this.state.showModal} closeModal={this.closeCreateGroupModal} />
                    <Button onClick={this.openCreateGroupModal} >
                    グループ作成
                    </Button>
                    <SideTabs/>
                </Grid>
                <Grid item xs={6}>
                    <MessageWindow/>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = ({entities}) => ({
    entities,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
