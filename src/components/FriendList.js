import React from 'react'
import {connect} from 'react-redux'
import { ListItem, ListItemText } from 'material-ui/List'


export const FriendList = ({ friends }) => {
    if (!friends.all) {
        return null
    }

    const friendComponentList = friends.all.map(
        (username, index) => {
            const friend = friends.byUsername[username];
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

const mapStateToProps = ( { entities } ) => ({
    friends: entities.friends,
});

export default connect(mapStateToProps, null)(FriendList)

