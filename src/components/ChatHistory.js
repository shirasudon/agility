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

// send read notification to the server if the last message is not read by the current user
export const sendReadIfExistNonRead = props => {
  const { entities, sendRead, myId, currentRoomId } = props
  const messages = entities.messages.byRoomId[currentRoomId]
  const latestMessage =
    messages &&
    messages.length > 0 &&
    entities.messages.byId[messages[messages.length - 1]]

  if (latestMessage && !latestMessage.readBy.includes(myId)) {
    // notify the server that the current user has read the specific message
    sendRead(currentRoomId, latestMessage.createdAt)
  }
}

export const withLifecycleFactory = (sendReadIfExistNonRead, scrollToBottom) =>
  lifecycle({
    componentDidMount() {
      sendReadIfExistNonRead(this.props)
      scrollToBottom(this.props.refs.messageList)
    },
    componentWillUpdate(nextProps) {
      const { refs, currentRoomId: nextRoomId } = nextProps
      const { messageList } = refs
      const messages = this.props.entities.messages.byRoomId[nextRoomId]
      const newMessages = nextProps.entities.messages.byRoomId[nextRoomId]
      this.historyChanged =
        (!messages && newMessages) ||
        (messages && newMessages && messages.length !== newMessages.length)
      if (this.historyChanged) {
        // update shouldScrollToBottom only when the message history changed
        const scrollPos = messageList.scrollTop
        const scrollBottom = messageList.scrollHeight - messageList.clientHeight
        this.shouldScrollToBottom =
          scrollBottom <= 0 || scrollPos === scrollBottom
        if (!this.shouldScrollToBottom) {
          const numMessages = messageList.childNodes.length
          // TODO: Since the messages fetched initially are dispatched one by one,
          // the line code cannot actually prevent the user from losing their scroll position when new data arrives
          this.topMessage = numMessages === 0 ? null : messageList.childNodes[0]
        }
      }
      this.roomChanged = this.props.currentRoomId !== nextRoomId
    },
    componentDidUpdate() {
      // force scroll bar to the bottom when the room is changed
      if (this.roomChanged) {
        scrollToBottom(this.props.refs.messageList)
      }
      // When new props are received, automatically scroll to the bottom
      if (this.historyChanged) {
        if (this.shouldScrollToBottom) {
          scrollToBottom(this.props.refs.messageList)
        }
        // Prevent the user from losing their scroll position when new data arrives
        if (this.topMessage) {
          ReactDOM.findDOMNode(this.topMessage).scrollIntoView()
        }
      }

      if (this.historyChanged || this.roomChanged) {
        sendReadIfExistNonRead(this.props)
      }
    },
  })

export const withLifecycle = withLifecycleFactory(
  sendReadIfExistNonRead,
  scrollToBottom
)

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
      return <Balloon key={message.id} message={message} />
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
  myId: state.getIn(['auth', 'myId']),
})

const mapDispatchToProps = dispatch => ({
  fetchHistory: (roomId, timestamp) => {
    dispatch(cac.fetchMessagesByRoomId(roomId, timestamp))
  },
  sendRead: (roomId, readAt) => {
    dispatch(chatActionCreator.sendMessageRead(roomId, readAt))
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
