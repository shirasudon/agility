// @format
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { withProps, withHandlers, compose, lifecycle } from 'recompose'

import { toJS } from './ToJS'
import { chatActionCreator } from '../actions'
import Balloon from './Balloon'
import RefsStore from '../RefsStore'

const styles = {
  root: {
    height: '80%',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
}

let cac = chatActionCreator

export const withChatHistoryHandlers = withHandlers({
  handleScroll: ({ fetchHistory, currentRoomId, entities }) => event => {
    // const { refs, props } = this;
    const scrollTop = event.target.scrollTop
    if (scrollTop === 0) {
      const { oldestMessageTimestamp } = entities.rooms.byId[currentRoomId]
      fetchHistory(currentRoomId, oldestMessageTimestamp)
    }
  },
})

export const scrollToBottom = dom => {
  const scrollHeight = dom.scrollHeight
  const height = dom.clientHeight
  const maxScrollTop = scrollHeight - height
  ReactDOM.findDOMNode(dom).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
}

export const withLifecycle = lifecycle({
  componentWillUpdate(nextProps) {
    const { refs, entities, currentRoomId } = this.props
    const { messageList } = refs
    const messages = entities.messages.byRoomId[currentRoomId]
    const newMessages = nextProps.entities.messages.byRoomId[currentRoomId]
    if (messages && newMessages && messages.length !== newMessages.length) {
      // update shouldScrollToBottom only when the message history changed
      const scrollPos = messageList.scrollTop
      const scrollBottom = messageList.scrollHeight - messageList.clientHeight
      this.shouldScrollToBottom =
        scrollBottom <= 0 || scrollPos === scrollBottom
    }
  },
  // When new props are received, automatically scroll to the bottom
  componentDidUpdate() {
    const { messageList } = this.props.refs
    if (this.shouldScrollToBottom) {
      scrollToBottom(messageList)
    }
  },
})

export const ChatHistory = ({
  currentRoomId,
  entities,
  classes,
  handleScroll,
  refs,
}) => {
  const { messages } = entities

  const roomMessages = !messages.byRoomId.hasOwnProperty(currentRoomId)
    ? null
    : messages.byRoomId[currentRoomId].map(
        messageId => messages.byId[messageId]
      )
  const messagesDOM = roomMessages ? (
    roomMessages.map((message, index) => {
      return <Balloon key={index} message={message} />
    })
  ) : (
    <span>There is no conversation yet</span>
  )

  return (
    <div
      className={classes.root}
      onScroll={handleScroll}
      ref={r => refs.store('messageList', r)}
    >
      {messagesDOM}
    </div>
  )
}

const mapStateToProps = state => ({
  currentRoomId: state.get('currentRoomId'),
  entities: state.get('entities'),
})

const mapDispatchToProps = dispatch => ({
  fetchHistory: (roomId, timestamp) => {
    dispatch(cac.fetchMessagesByRoomId(roomId, timestamp))
  },
})

export const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  toJS,
  withStyles(styles),
  withChatHistoryHandlers,
  withProps({ refs: new RefsStore() }),
  withLifecycle
)

export default enhancer(ChatHistory)
