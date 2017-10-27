import React, { Component } from 'react';
import {connect} from 'react-redux';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import {chatActionCreator} from '../actions'
import CreateGroupModal from './CreateGroupModal';
import SideTabs from './SideTabs';
import MessageWindow from './MessageWindow';

class Chat extends Component {

    componentDidMount(){
        const {fetchRooms, fetchFriends, session} = this.props;
        fetchRooms()
        console.log(session)
        fetchFriends(session.user.id)
    }

    render() {
        const openModal = this.props.openCreateGroupModal;
        return (
            <Grid container justify="center">
                <Grid item xs={3}>
                    <CreateGroupModal />
                    <Button onClick={openModal} >
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

const mapStateToProps = ({entities, session}) => ({
    entities,
    session,
});

const mapDispatchToProps = (dispatch) => ({
    fetchMessagesByRoomId: (roomId) => {
        dispatch(chatActionCreator.fetchMessagesByRoomId(roomId));
    },
    fetchRoomInfo: (roomId) => {
        dispatch(chatActionCreator.fetchRoomInfo(roomId));
    },
    fetchRooms: () => {
        dispatch(chatActionCreator.fetchRooms());
    },
    fetchFriends: (userId) => {
        dispatch(chatActionCreator.fetchFriends(userId))
    },
    openCreateGroupModal: () => {
        dispatch(chatActionCreator.openCreateGroupModal());
    },
    closeCreateGroupModal: () => {
        dispatch(chatActionCreator.closeCreateGroupModal());
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
