import React from 'react'
import { connect } from 'react-redux'
import { withState, withHandlers, compose } from 'recompose'

import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import Balloon from './Balloon'
import { withStyles } from 'material-ui/styles'

import { KEY_ENTER } from '../keyCodes.js'
import { chatActionCreator } from '../actions'

const styleSheet = theme => ({
    cardContent: {
        overflowX: "hidden",
        overflowY: "scroll",
        height: "50vh" // TODO: make this responsive
    },
})

export const withCurrentText = withState('curText', 'setCurText', '')

export const withMessageWindowHandlers = withHandlers({
    handleKeyPress: ( { setCurText, curText, currentRoomId, sendMessage, session }) => event => {
        switch  (event.which) {
            case KEY_ENTER:
                sendMessage({
                    userId: session.user.id,
                    roomId: currentRoomId,
                    body: curText,
                })
                setCurText('')
                break
            default:
                break
        }
    },
    handleChange: ( {setCurText} ) => event => {
        setCurText(event.target.value)
    },
})

export const MessageWindow = ( { currentRoomId, session, entities, deleteRoom, handleChange, handleKeyPress, curText, classes} ) => {

    if(currentRoomId === null){
        return (
            <Card>
                <CardContent>
                    <div>Lets start chatting with your friends!!</div>
                </CardContent>
            </Card>
        );
    }

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
    (<span>There is no conversation yet</span>);
    
    return (
        <div>
            <Card>
                <CardHeader title={currentRoom.name} />
                <Divider/>
                <CardContent className={classes.cardContent}>
                    {messagesDOM}
                    <TextField
                        id="post-text-field"
                        InputProps={{ placeholder: 'Press enter to send message!' }}
                        fullWidth
                        autoFocus={true}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        value={curText}
                        margin="normal"
                    />
                </CardContent>
                <CardActions>
                    { currentRoom.createdBy === me.id && ( 
                        <IconButton aria-label="Delete" onClick={()=>{deleteRoom(currentRoomId)}}>
                            <DeleteIcon />
                        </IconButton>)
                    }

                </CardActions>
            </Card>

        </div>
    )
}

const mapStateToProps = ({currentRoomId, session, entities}) => ({
    currentRoomId,
    session,
    entities,
});

const mapDispatchToProps = (dispatch) => ({
    sendMessage: (message) => {
        dispatch(chatActionCreator.sendMessage(message));
    },
    deleteRoom: roomId => {
        dispatch(chatActionCreator.deleteRoom(roomId))
    }, 
});

export const enhancer = compose(
    withStyles(styleSheet),
    connect(mapStateToProps, mapDispatchToProps),
    withCurrentText,
    withMessageWindowHandlers,
)

export default enhancer(MessageWindow)
