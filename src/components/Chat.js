// @format
import React from 'react'
import { connect } from 'react-redux'
import { lifecycle, compose } from 'recompose'
import { withStyles } from 'material-ui/styles'

import { toJS } from './ToJS'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'

import { chatActionCreator } from '../actions'
import CreateGroupModal from './CreateGroupModal'
import SideTabs from './SideTabs'
import MessageWindow from './MessageWindow'
import WebSocketService from '../service/websocket'

let cac = chatActionCreator

const styles = {
  root: {
    height: '88%',
  },
  sideTabs: {
    height: '100%',
  },
  messageWindow: {
    height: '100%',
  },
}

export const withLifecyclesFactory = webSocketService =>
  lifecycle({
    componentDidMount() {
      webSocketService.connect()
    },
  })

export const withLifecycles = withLifecyclesFactory(WebSocketService)

export const Chat = ({ openCreateGroupModal: openModal, classes }) => (
  <Grid container justify="center" className={classes.root}>
    <Grid item xs={3} className={classes.sideTabs}>
      <CreateGroupModal />
      <Button onClick={openModal}>グループ作成</Button>
      <SideTabs />
    </Grid>
    <Grid item xs={6} className={classes.messageWindow}>
      <MessageWindow />
    </Grid>
  </Grid>
)

export function setChatActionCreator(actionCreator) {
  cac = actionCreator
}

const mapStateToProps = state => ({
  entities: state.get('entities'),
  myId: state.getIn(['auth', 'myId']),
})

export const mapDispatchToProps = dispatch => ({
  openCreateGroupModal: () => {
    dispatch(cac.openCreateGroupModal())
  },
})

export const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  toJS,
  withLifecycles,
  withStyles(styles)
)

export default enhancer(Chat)
