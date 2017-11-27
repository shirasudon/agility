// @format
import React from 'react'
import { connect } from 'react-redux'
import { ListItem, ListItemText } from 'material-ui/List'
import { compose } from 'recompose'

import { toJS } from './ToJS'

export const FriendList = ({ friendIds, users }) => {
  const friendComponentList = friendIds.map((friendId, index) => {
    if (!users.byId.hasOwnProperty(friendId)) {
      return null
    }
    const friend = users.byId[friendId]
    return (
      <ListItem button key={index}>
        <ListItemText
          primary={friend.firstName + ' ' + friend.lastName}
          secondary={friend.username}
        />
      </ListItem>
    )
  })
  return <div> {friendComponentList} </div>
}

const mapStateToProps = state => ({
  friendIds: state.get('friendIds'),
  users: state.getIn(['entities', 'users']),
})

export const enhancer = compose(connect(mapStateToProps, null), toJS)

export default enhancer(FriendList)
