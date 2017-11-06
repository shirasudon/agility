import React from 'react'
import { connect } from 'react-redux'


export const MessageWindow = ( { currentRoomId, entities, session } ) => {
    if(currentRoomId === null){
        return <div>Lets start chatting with your friends!!</div>
    }

    const { rooms, session } = entities
    const currentRoom = rooms.byId[currentRoomId]
    const me = session.user

    <div className="message-container">
        <ChatHeader title={currentRoom.name} shouldDeleteIcon={currentRoom.createdBy === me.id} />
        <ChatHistory />
        <ChatInput />
    </div>
}

const mapStateToProps = ({currentRoomId, session, entities}) => ({
    currentRoomId,
    session,
    entities,
})

export const enhancer = compose(
    connect(mapStateToProps, null),
)

export default enhancer(MessageWindow)
