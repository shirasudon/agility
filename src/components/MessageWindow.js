import React from 'react'
import {connect} from 'react-redux'
import { withState, withHandlers, compose } from 'recompose'

import Card, { CardHeader, CardContent,} from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import Balloon from './Balloon'

import { KEY_ENTER } from '../keyCodes.js'
import { chatActionCreator } from '../actions'

export const withCurrentText = withState('curText', 'setCurText', '')

export const withMessagWindowHandlers = withHandlers({
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

export const MessageWindow = ( { currentRoomId, session, entities, deleteRoom, handleChange, handleKeyPress, curText } ) => {
    const { messages, rooms } = entities
    const currentRoom = rooms.byId[currentRoomId];
    const me = session.user

    if(currentRoomId === null){
        return (
            <Card>
                <CardContent>
                    <div>Lets start chatting with your friends!!</div>

                </CardContent>
            </Card>
        );
    }

    const roomMessages = !messages.byRoomId.hasOwnProperty(currentRoomId) ? null : messages.byRoomId[currentRoomId].map(messageId => messages.byId[messageId] );
    const messagesDOM = roomMessages ? 
        roomMessages.map((message, index) => {
            const direction = ( message.userId === me.id ) ? "right" : "left";

            return (
                    <Balloon key={index} direction={direction} postDate={message.postDate}>
                        {message.text}
                    </Balloon>
            )
    }):
    (<span>There is no conversation yet</span>);
    
    return (
        <div>
            <Card>
                <CardHeader
                    title={
                            <div>
                            {currentRoom.name}
                            { currentRoom.createdBy === me.id && ( 
                                <IconButton aria-label="Delete" onClick={()=>{deleteRoom(currentRoomId)}}>
                                    <DeleteIcon />
                                </IconButton>) } 
                        </div>
                    }
                />
                <Divider/>
                <CardContent>
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
    connect(mapStateToProps, mapDispatchToProps),
    withCurrentText,
    withMessagWindowHandlers,
)

export default enhancer(MessageWindow)
