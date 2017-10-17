import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withStyles, } from 'material-ui/styles';

import Dialog, { DialogContent } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText, } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import CircularProgressButton from './CircularProgressButton';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';

import ChipsArray from './ChipsArray';
import {chatActionCreator} from '../actions';

const styleSheet = theme => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    dialogContent: {
        marginTop: '50px',
    },
});


class CreateGroupModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedUsers: [],
            roomName: '',
            searchText: '',
        }

        this.handleAddChip = this.handleAddChip.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
        this.handleCreateRoomClick = this.handleCreateRoomClick.bind(this);
    }

    handleAddChip(username) {
        const newSelectedUsers = this.state.selectedUsers.slice();
        newSelectedUsers.push(username);
        this.setState({selectedUsers: newSelectedUsers});
    }

    handleDeleteChip(data) {
        const newSelectedUsers = this.state.selectedUsers.filter((u, index) => {
            return u !== data.label;
        });
        this.setState({selectedUsers: newSelectedUsers});
    }

    handleSearchTextChange(event) {
        this.setState({searchText: event.target.value});
    }

    handleRoomNameChange(event) {
        this.setState({roomName: event.target.value});
    }

    handleCreateRoomClick() {
        const {createRoom} = this.props;
        const {selectedUsers, roomName} = this.state;
        createRoom(selectedUsers, roomName);
    }

    render(){
        const {
            ui,
            closeModal,
            entities,
            classes,
        } = this.props;

        const { showModal } = ui.createGroup;

        const { friends } = entities;

        const {selectedUsers, searchText, roomName} = this.state;

        const matchedUsernames = friends.all.filter((username) => {
            const friend = friends.byUsername[username];
            const regex = new RegExp(searchText);
            return regex.test(friend.username) && !selectedUsers.includes(username);
        });

        const chipData = selectedUsers.map((username, index) => {
            return {
                label: username,
                key: index,
            }
        });

        const matchedUserList = matchedUsernames.map((username, index) => {
            return (
                <ListItem button key={index}>
                    <ListItemText
                        primary={username}
                        onClick={()=>{this.handleAddChip(username);}}
                    />
                </ListItem>
            );
        });

        return (
            <Dialog
                open={showModal}
                onRequestClose={ closeModal }
                fullScreen
                transition={<Slide direction="up" />}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="contrast" onClick={closeModal} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Add your friends to a new group!
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent className={classes.dialogContent}>
                    <Grid container justify="center">
                        <Grid item xs={5}>
                            <TextField
                                id="roomName"
                                value={roomName}
                                InputProps={{ placeholder: 'Type room name here!' }}
                                onChange={this.handleRoomNameChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <CircularProgressButton
                                raised
                                color="primary"
                                onClick={() => {this.handleCreateRoomClick()}}
                            >
                                Go
                            </CircularProgressButton>
                        </Grid>
                    </Grid>
                    <Grid container justify="center">
                        <Grid item xs={6}>
                            <ChipsArray
                                chipData={chipData}
                                handleRequestDelete={this.handleDeleteChip}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify="center">
                        <Grid item xs={6}>
                            <TextField
                                id="search-friend"
                                value={searchText}
                                InputProps={{ placeholder: 'Search Your friends!' }}
                                onChange={this.handleSearchTextChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify="center">
                        <Grid item xs={6}>
                            {matchedUserList.length > 0 ? (
                                    <List>
                                        {matchedUserList}
                                    </List>
                                ):
                                <span>No matched User</span>
                            }
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

const mapStateToProps = ({entities, ui}) => ({
    entities,
    ui,
});

const mapDispatchToProps = (dispatch) => ({
    createRoom: (users, roomName = null) => {
        const room = {
            members: users,
            name: roomName,
        };
        dispatch(chatActionCreator.createRoom(room));
    },
    closeModal: () => {
        dispatch(chatActionCreator.closeCreateGroupModal())
    }
});

const StyledCreateGroupModal = withStyles(styleSheet)(CreateGroupModal);

export default connect(mapStateToProps, mapDispatchToProps)(StyledCreateGroupModal);
