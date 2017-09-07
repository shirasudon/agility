import React, { Component } from 'react';
import {connect} from 'react-redux';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import {chatActionCreator} from '../actions'
import CreateGroupModal from './CreateGroupModal';
import SideTabs from './SideTabs';
import MessageWindow from './MessageWindow';

class Chat extends Component {

    constructor(props){
        super(props);

        this.state = {
            showModal: false,
        };

        this.openCreateGroupModal = this.openCreateGroupModal.bind(this);
        this.closeCreateGroupModal = this.closeCreateGroupModal.bind(this);
    }

    componentDidMount(){
        const {fetchRooms, fetchFriends} = this.props;
        fetchRooms();
        fetchFriends();
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
    fetchMessagesByRoomId: (roomId) => {
        dispatch(chatActionCreator.fetchMessagesByRoomId(roomId));
    },
    fetchRoomInfo: (roomId) => {
        dispatch(chatActionCreator.fetchRoomInfo(roomId));
    },
    fetchRooms: () => {
        dispatch(chatActionCreator.fetchRooms());
    },
    fetchFriends: () => {
        dispatch(chatActionCreator.fetchFriends());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
