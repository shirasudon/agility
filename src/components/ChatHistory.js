import React from 'react'
import { connect } from 'react-redux'

import Balloon from './Balloon'


export const ChatHistory = ( { currentRoomId, session, entities } ) => {

    const { messages, users } = entities
    const me = session.user

    const roomMessages = !messages.byRoomId.hasOwnProperty(currentRoomId) ? null : messages.byRoomId[currentRoomId].map(messageId => messages.byId[messageId] );
    const messagesDOM = roomMessages ?
        roomMessages.map((message, index) => {
            const direction = ( message.userId === me.id ) ? "right" : "left"
            const username = users.byId.hasOwnProperty(message.userId) ? users.byId[message.userId].username : ""

            return (
                    <Balloon key={index} text={message.text} username={username} direction={direction} createdAt={message.createdAt} messageId={message.id} userId={message.userId} />
            )
    }):
    (<span>There is no conversation yet</span>)

    return <div className="chatHistory"> { messagesDOM } </div>
}

const mapStateToProps = ( { currentRoomId, session, entities } ) => ({
    currentRoomId,
    session,
    entities,
})

export const enhancer = connect(mapStateToProps, null)

export default enhancer(ChatHistory)


