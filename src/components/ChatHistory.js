import { withState, withHandlers, compose } from 'recompose'

import Balloon from './Balloon'


export const ChatHistory = ( { currentRoomId, session, entities } ) => {

    const { messages, rooms, users } = entities
    const currentRoom = rooms.byId[currentRoomId]
    const me = session.user

    const roomMessages = !messages.byRoomId.hasOwnProperty(currentRoomId) ? null : messages.byRoomId[currentRoomId].map(messageId => messages.byId[messageId] );
    const messagesDOM = roomMessages ?
        roomMessages.map((message, index) => {
            const direction = ( message.userId === me.id ) ? "right" : "left"
            const username = users.byId.hasOwnProperty(message.userId) ? users.byId[message.userId].username : ""

            return (
                    <Balloon key={index} text={message.text} username={username} direction={direction} createdAt={message.createdAt} />
                        
            )
    }):
    (<span>There is no conversation yet</span>)

    return <div className="chatHistory"> { messagesDOM } </div>
}


