// @format
import React from 'react'
import { connect } from 'react-redux'
import { ListItem, ListItemText } from 'material-ui/List'
import { compose } from 'recompose'

import { chatActionCreator } from '../actions'
import { toJS } from './ToJS'

export const RoomList = ({ rooms, enterRoom }) => {
  if (!rooms.all) {
    return null
  }

  const roomComponentList = rooms.all.map((roomId, index) => {
    const room = rooms.byId[roomId]
    const roomName = room.hasUnreadMessage ? <b>{room.name}</b> : room.name
    return (
      <ListItem button key={index}>
        <ListItemText
          primary={roomName}
          onClick={() => {
            enterRoom(roomId, !rooms.byId[roomId].initialFetch)
          }}
        />
      </ListItem>
    )
  })
  return <div>{roomComponentList}</div>
}

const mapStateToProps = state => ({
  rooms: state.getIn(['entities', 'rooms']),
})

const mapDispatchToProps = dispatch => ({
  enterRoom: (roomId, shouldFetch = false) => {
    dispatch(chatActionCreator.enterRoom(roomId, shouldFetch))
  },
})

export const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  toJS
)

export default enhancer(RoomList)
