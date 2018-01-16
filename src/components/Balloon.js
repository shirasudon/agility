// @format
import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import moment from 'moment'
import { compose } from 'recompose'

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
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
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
  const justify = shouldPutRight ? 'flex-end' : 'flex-start'
  return (
    <Grid id={message.id} container justify={justify}>
      <Grid item xs={6}>
        <div className={balloonStyle}>{message.text}</div>
        <div className={classes.meta}>
          <div className="readCount">
            {message.readBy.length > 0 && message.readBy.length + ' Read'}
          </div>
          <div className="username-and-createdAt">
            {username && <span>{username}</span>}:{' '}
            {moment(message.createdAt).format('MMMM Do YYYY, h:mm a')}
          </div>
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

export const enhancer = compose(
  connect(mapStateToProps, null),
  toJS,
  withStyles(styleSheet)
)

export default enhancer(Balloon)
