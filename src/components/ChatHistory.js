import React from 'react'
import { connect } from 'react-redux'

import Balloon from './Balloon'


export const ChatHistory = ( { currentRoomId, session, entities } ) => {

    const { messages } = entities

    const roomMessages = !messages.byRoomId.hasOwnProperty(currentRoomId) ? null : messages.byRoomId[currentRoomId].map(messageId => messages.byId[messageId] );
    const messagesDOM = roomMessages ?
        roomMessages.map((message, index) => {
            return (
                    <Balloon key={index} message={message} />
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


