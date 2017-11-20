import React from 'react'
import { withState, withHandlers, compose } from 'recompose'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'


import { toJS } from './ToJS'
import { KEY_ENTER } from '../keyCodes.js'
import { chatActionCreator } from '../actions'


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

export const ChatInput = ( { handleChange, handleKeyPress, curText } ) => (
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
)

const mapStateToProps = state => ({
    currentRoomId: state.get("currentRoomId"),
    session: state.get("session"),
})

const mapDispatchToProps = (dispatch) => ({
    sendMessage: (message) => {
        dispatch(chatActionCreator.sendMessage(message));
    },
});

export const enhancer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    toJS,
    withCurrentText,
    withMessageWindowHandlers,
)

export default enhancer(ChatInput)
