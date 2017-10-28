import React from 'react'
import {connect} from 'react-redux'
import { ListItem, ListItemText } from 'material-ui/List'


export const FriendList = ({ friendIds, users }) => {
    const friendComponentList = friendIds.map(
        (friendId, index) => {
            if (!users.byId.hasOwnProperty(friendId)) {
                return null
            }
            const friend = users.byId[friendId];
            return (
                <ListItem button key={index}>
                    <ListItemText
                        primary={friend.firstName + " " + friend.lastName}
                        secondary={friend.username}
                    />
                </ListItem>
            )
        }
    )
    return (<div> { friendComponentList } </div>)
}

const mapStateToProps = ( { friendIds, entities } ) => ({
    friendIds,
    users: entities.users,
});

export default connect(mapStateToProps, null)(FriendList)

