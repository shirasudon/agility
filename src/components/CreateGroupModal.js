import React from 'react'
import {connect} from 'react-redux'
import { withStyles } from 'material-ui/styles'
import Dialog, { DialogContent } from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import List, { ListItem, ListItemText, } from 'material-ui/List'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import Slide from 'material-ui/transitions/Slide'
import CircularProgressButton from './CircularProgressButton'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'

import { withState, compose, withHandlers } from 'recompose'

import ChipsArray from './ChipsArray'
import { chatActionCreator } from '../actions'

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

export const withSelectedUsers = withState('selectedUsers', 'setSelectedUsers', [])
export const withSearchText = withState('searchText', 'setSearchText', '')
export const withRoomName = withState('roomName', 'setRoomName', '')
export const withModalHandlers = withHandlers({

    handleDeleteChip: ( {selectedUsers, setSelectedUsers}) => data => {
        const newSelectedUsers = selectedUsers.filter((u, index) => {
            return u !== data.label
        });
        setSelectedUsers(newSelectedUsers)
    },
    handleAddChip: ({selectedUsers, setSelectedUsers}) => username => {
        const newSelectedUsers = selectedUsers.slice();
        newSelectedUsers.push(username)
        setSelectedUsers(newSelectedUsers)
    },
    handleSearchTextChange: ({setSearchText}) => event => {
        setSearchText(event.target.value)
    },
    handleRoomNameChange: ({setRoomName}) => event =>{
        setRoomName(event.target.value)
    },
    handleCreateRoomClick: ({createRoom, selectedUsers, roomName}) => () => {
        createRoom(selectedUsers, roomName)
    }

})

export const mapSelectedUsersToChipData = (users) => (
    users.map(
        (username, index) => ({ label: username, key: index, })
    )
)

export const MatchedUserList = ( { users, searchText, handleAddChip, selectedUsers } ) => {

    const matchedUsernames = users.all.filter((username) => {
        const user = users.byUsername[username];
        const regex = new RegExp(searchText);
        return regex.test(user.username) && !selectedUsers.includes(username);
    });

    const matchedUserList = matchedUsernames.map((username, index) => {
        return (
            <ListItem button key={index}>
                <ListItemText
                    primary={username}
                    onClick={()=>{handleAddChip(username);}}
                />
            </ListItem>
        );
    });

    return matchedUserList.length > 0 ? <List> { matchedUserList } </List> : <span>No matching users</span>
}
 

export const CreateGroupModal = ( {ui, closeModal, entities, classes, selectedUsers, searchText, roomName, handleAddChip, handleRoomNameChange, handleCreateRoomClick, handleDeleteChip, handleSearchTextChange} ) => {

    const { showModal } = ui.createGroup;
    const { friends } = entities;

    return (
        <Dialog
            open={showModal}
            onRequestClose={ closeModal }
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
                <Grid container>
                    <Grid item xs={10}>
                        <TextField
                            id="roomName"
                            value={roomName}
                            InputProps={{ placeholder: 'Type room name here!' }}
                            onChange={handleRoomNameChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <CircularProgressButton
                            raised
                            color="primary"
                            onClick={() => {handleCreateRoomClick()}}
                        >
                            Go
                        </CircularProgressButton>
                    </Grid>
                    <Grid item xs={12}>
                        <ChipsArray
                            chipData={mapSelectedUsersToChipData(selectedUsers)}
                            handleRequestDelete={handleDeleteChip}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="search-friend"
                            value={searchText}
                            InputProps={{ placeholder: 'Search Your friends!' }}
                            onChange={handleSearchTextChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MatchedUserList 
                            users={friends} 
                            searchText={searchText}
                            handleAddChip={handleAddChip}
                            selectedUsers={selectedUsers} 
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

const mapStateToProps = ({entities, ui}) => ({
    entities,
    ui,
})

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
})

export const enhancer = compose(
    connect(mapStateToProps, mapDispatchToProps), 
    withStyles(styleSheet),
    withSelectedUsers,
    withRoomName,
    withSearchText,
    withModalHandlers,
)

export default enhancer(CreateGroupModal)
