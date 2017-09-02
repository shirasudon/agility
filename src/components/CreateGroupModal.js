import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withStyles, } from 'material-ui/styles';

import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText, } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import {CircularProgress} from 'material-ui/Progress';

import ChipsArray from './ChipsArray';
import {createRoom} from '../actions/chat';

const styleSheet = theme => ({
    flex: {
        flex: 1,
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
            showModal,
            closeModal,
            entities,
            ui,
            classes,
        } = this.props;

        const { friends } = entities;
        const { isRequesting } = ui;

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
                onRequestClose={closeModal}
                fullScreen
                transition={<Slide direction="up" />}
            >
                {isRequesting && <CircularProgress size={80} thickness={5} />}
                <AppBar>
                    <Toolbar>
                        <IconButton color="contrast" onClick={closeModal} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Add your friends to a new group!
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogTitle>グループ作成</DialogTitle>
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
                        <Button
                            raised
                            color="primary"
                            onClick={()=>{}}
                        >
                            Go!
                        </Button>
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
            users,
            roomName,
        };
        dispatch(createRoom(room));
    },
});

const StyledCreateGroupModal = withStyles(styleSheet)(CreateGroupModal);

export default connect(mapStateToProps, mapDispatchToProps)(StyledCreateGroupModal);
