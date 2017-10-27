import React from 'react'
import {connect} from 'react-redux'
import { ListItem, ListItemText } from 'material-ui/List'


export const FriendList = ({ friends }) => {
    if (!friends.all) {
        return null
    }

    const friendComponentList = friends.all.map(
        (userId, index) => {
            const friend = friends.byId[userId];
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
    friends: friendIds.map( id => entities.users.byId[id] ),
});

export default connect(mapStateToProps, null)(FriendList)

