import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { compose } from 'recompose'

import ChatHeader from './ChatHeader'
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import { toJS } from './ToJS'

const styles = {
  root: {
    height: '100%',
  },
}

export const MessageWindow = ({
  currentRoomId,
  entities,
  session,
  classes,
}) => {
  if (currentRoomId === null) {
    return (
      <div className="message-container">
        Lets start chatting with your friends!!
      </div>
    )
  }

  const rooms = entities.rooms
  const currentRoom = rooms.byId[currentRoomId]
  const me = session.user

  return (
    <div className={classes.root}>
      <ChatHeader
        title={currentRoom.name}
        shouldShowDeleteIcon={currentRoom.createdBy === me.id}
      />
      <ChatHistory />
      <ChatInput />
    </div>
  )
}

const mapStateToProps = state => ({
  currentRoomId: state.get('currentRoomId'),
  session: state.get('session'),
  entities: state.get('entities'),
})

export const enhancer = compose(
  connect(mapStateToProps, null),
  toJS,
  withStyles(styles)
)

export default enhancer(MessageWindow)
