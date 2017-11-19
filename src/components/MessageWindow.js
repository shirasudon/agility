import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { compose } from 'recompose'

import ChatHeader from './ChatHeader'
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'

const styles = {
    root: {
        height: "100%",
    },
}


export const MessageWindow = ( { currentRoomId, entities, session, classes } ) => {
    if (currentRoomId === null) {
        return (
            <div className="message-container">
                Lets start chatting with your friends!!
            </div>
        )
    }

    const rooms = entities.get("rooms")
    const currentRoom = rooms.getIn(["byId", currentRoomId])
    const me = session.get("user")

    return (
        <div className={classes.root}>
            <ChatHeader title={currentRoom.get("name")} shouldShowDeleteIcon={currentRoom.get("createdBy") === me.get("id")} />
            <ChatHistory />
            <ChatInput />
        </div>
    )
}

const mapStateToProps = props => ({
    currentRoomId: props.get("currentRoomId"),
    session: props.get("session"),
    entities: props.get("entities"),
})

export const enhancer = compose(
    connect(mapStateToProps, null),
    withStyles(styles)
)

export default enhancer(MessageWindow)

