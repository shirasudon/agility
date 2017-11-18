import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { compose } from 'recompose'

import Balloon from './Balloon'

const styles = {
    root: {
        height: "80%",
        overflowY: "scroll",
        overflowX: "hidden",
    }
}


export const ChatHistory = ( { currentRoomId, session, entities, classes } ) => {

    const { messages } = entities

    const roomMessages = !messages.byRoomId.hasOwnProperty(currentRoomId) ? null : messages.byRoomId[currentRoomId].map(messageId => messages.byId[messageId] );
    const messagesDOM = roomMessages ?
        roomMessages.map((message, index) => {
            return (
                    <Balloon key={index} message={message} />
            )
    }):
    (<span>There is no conversation yet</span>)

    return <div className={classes.root}> { messagesDOM } </div>
}

const mapStateToProps = ( { currentRoomId, session, entities } ) => ({
    currentRoomId,
    session,
    entities,
})

export const enhancer = compose(
    connect(mapStateToProps, null),
    withStyles(styles),
)

export default enhancer(ChatHistory)

