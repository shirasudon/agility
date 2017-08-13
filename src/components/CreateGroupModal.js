import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withStyles, createStyleSheet } from 'material-ui/styles';

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

import ChipsArray from './ChipsArray';

const styleSheet = createStyleSheet({
    flex: {
        flex: 1,
    },
});


class CreateGroupModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedUsers: [],
            searchText: ''
        }

        this.handleAddChip = this.handleAddChip.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
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

    render(){
        const {
            showModal,
            closeModal,
            entities,
            classes,
        } = this.props;

        const {friends} = entities;

        const {selectedUsers, searchText} = this.state;

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
                    <Grid item xs={6}>
                        <ChipsArray
                            chipData={chipData}
                            handleRequestDelete={this.handleDeleteChip}
                        />
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid item xs={5}>
                        <TextField
                            id="search-friend"
                            value={searchText}
                            InputProps={{ placeholder: 'Search Your friends!' }}
                            onChange={this.handleSearchTextChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            raised
                            color="primary"
                            onClick={()=>{console.log("request create room");}}
                        >
                            Go!
                        </Button>
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

const mapStateToProps = ({entities}) => ({
    entities: entities
});

const StyledCreateGroupModal = withStyles(styleSheet)(CreateGroupModal);

export default connect(mapStateToProps)(StyledCreateGroupModal);
