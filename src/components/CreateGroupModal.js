import React, { Component } from 'react';
import {connect} from 'react-redux';

// import ChipInput from 'material-ui-chip-input';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';

import ChipsArray from './ChipsArray';

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
                    <IconButton color="contrast" onClick={closeModal} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </AppBar>
                <DialogTitle>グループ作成</DialogTitle>
                <div>
                        <ChipsArray chipData={chipData} handleRequestDelete={this.handleDeleteChip}/>
                        <TextField
                            id="search-friend"
                            value={searchText}
                            InputProps={{ placeholder: 'Search Your friends!' }}
                            onChange={this.handleSearchTextChange}
                            fullWidth
                            margin="normal"
                       />
                        <Button onClick={()=>{console.log("request create room");}}>
                            Go!
                        </Button>

                       {matchedUserList.length > 0 ? (
                            <List>
                                {matchedUserList}
                            </List>
                       ):
                            <span>No matched User</span>
                       }
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = ({entities}) => ({
    entities: entities
});

export default connect(mapStateToProps)(CreateGroupModal);
