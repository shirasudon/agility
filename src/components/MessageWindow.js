import React from 'react'
import { connect } from 'react-redux'

import ChatHeader from './ChatHeader'
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'


export const MessageWindow = ( { currentRoomId, entities, session } ) => {
    if(currentRoomId === null){
        return (
            <div className="message-container">
                Lets start chatting with your friends!!
            </div>
        )
    }

    const { rooms } = entities
    const currentRoom = rooms.byId[currentRoomId]
    const me = session.user

    return (
        <div className="message-container">
            <ChatHeader title={currentRoom.name} shouldShowDeleteIcon={currentRoom.createdBy === me.id} />
            <ChatHistory />
            <ChatInput />
        </div>
    )
}

const mapStateToProps = ({currentRoomId, session, entities}) => ({
    currentRoomId,
    session,
    entities,
})

export const enhancer = connect(mapStateToProps, null)

export default enhancer(MessageWindow)

