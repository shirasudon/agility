import React from 'react'
import {connect} from 'react-redux'
import { ListItem, ListItemText } from 'material-ui/List'


export const FriendList = ({ friendIds, users }) => {
    const friendComponentList = friendIds.map(
        (friendId, index) => {
            if (!users.get("byId").has(friendId)) {
                return null
            }
            const friend = users.getIn(["byId", friendId])
            return (
                <ListItem button key={index}>
                    <ListItemText
                        primary={friend.get("firstName") + " " + friend.get("lastName")}
                        secondary={friend.get("username")}
                    />
                </ListItem>
            )
        }
    )
    return (<div> { friendComponentList } </div>)
}

const mapStateToProps = props => ({
    friendIds: props.get("friendIds"),
    users: props.getIn(["entities", "users"]),
})

export default connect(mapStateToProps, null)(FriendList)

