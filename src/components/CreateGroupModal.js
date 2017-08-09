import React, { Component } from 'react';
import {connect} from 'react-redux';

// import ChipInput from 'material-ui-chip-input';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

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
            friends,
        } = this.props;

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
            <Dialog open={showModal} onRequestClose={closeModal}>
                <DialogTitle>グループ作成</DialogTitle>
                <div>
                    <h4>友達を選んでください！</h4>
                        <ChipsArray chipData={chipData} handleRequestDelete={this.handleDeleteChip}/>
                        <TextField
                            id="search-friend"
                            value={searchText}
                            InputProps={{ placeholder: 'Search Your friends!' }}
                            onChange={this.handleSearchTextChange}
                            fullWidth
                            margin="normal"
                       />

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

const mapStateToProps = ({friends}) => ({
    friends: friends
});

export default connect(mapStateToProps)(CreateGroupModal);
