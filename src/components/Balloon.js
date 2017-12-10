// @format
import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import moment from 'moment'
import { lifecycle, compose } from 'recompose'
import { chatActionCreator } from '../actions'

import { toJS } from './ToJS'

export const RIGHT = 'right'
export const LEFT = 'left'

const baloonMain = {
  position: 'relative',
  padding: '20px 10px',
  borderRadius: '20px',
  minWidth: '10%',
  maxWidth: '100%',
  color: '#555',
  fontSize: '16px',
  background: '#e0edff',
}

const styleSheet = theme => ({
  balloonLeft: {
    ...baloonMain,
  },
  balloonRight: {
    ...baloonMain,
  },
  postMetaLeft: {
    textAlign: 'left',
  },
  postMetaRight: {
    textAlign: 'right',
  },
})

export const withLifecycle = lifecycle({
  componentDidMount() {
    // dispatch read notification to the server
    const { message, myId, sendRead } = this.props
    if (!message.readBy.includes(myId)) {
      // notify the server that the current user has read the specific message
      sendRead(message.id, myId)
    }
  },
})

export const Balloon = ({ message, classes, myId, users }) => {
  const shouldPutRight = message.userId === myId
  const balloonStyle = shouldPutRight
    ? classes.balloonRight
    : classes.balloonLeft
  const username = users.byId.hasOwnProperty(message.userId)
    ? users.byId[message.userId].username
    : ''
  const postMeta = shouldPutRight ? classes.postMetaRight : classes.postMetaLeft
  const justify = shouldPutRight ? 'flex-end' : 'flex-start'
  return (
    <Grid id={message.id} container justify={justify}>
      <Grid item xs={6}>
        <div className={balloonStyle}>{message.text}</div>
        <div className="readCount">
          {message.readBy.length > 0 && message.readBy.length + ' Read'}
        </div>
        <div className={postMeta}>
          {username && <span>{username}</span>} :{' '}
          <span>
            {moment(message.createdAt).format('MMMM Do YYYY, h:mm a')}
          </span>
        </div>
      </Grid>
    </Grid>
  )
}

export const mapStateToProps = state => ({
  myId: state.getIn(['auth', 'myId']),
  users: state.getIn(['entities', 'users']),
  messages: state.getIn(['entities', 'messages']),
})

export const mapDispatchToProps = dispatch => ({
  sendRead: (messageId, userId) => {
    dispatch(chatActionCreator.sendMessageRead([messageId], userId))
  },
})

export const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  toJS,
  withStyles(styleSheet),
  withLifecycle
)

export default enhancer(Balloon)
