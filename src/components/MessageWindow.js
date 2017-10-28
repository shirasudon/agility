import React, {Component} from 'react'
import {connect} from 'react-redux'

import Card, { CardHeader, CardContent,} from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import Balloon from './Balloon'

import { KEY_ENTER } from '../keyCodes.js'
import { chatActionCreator } from '../actions'

class MessageWindow extends Component {

    constructor(props) {
        super(props); 
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.state = {
            curText: '',
        }
    }

    handleKeyPress(e) {
        switch  (e.which) {
            case KEY_ENTER:
                const { currentRoomId } = this.props;
                this.props.sendMessage({
                    userId: this.props.session.user.id,
                    roomId: currentRoomId,
                    body: this.state.curText,
                })
                this.setState({curText: ""});
                break;
            default:
                break;
        }
    }

    handleChange(e) {
        this.setState({curText: e.target.value});
    }

    render() {
        const { currentRoomId, session, entities } = this.props;
        const { messages, rooms } = entities;
        const currentRoom = rooms.byId[currentRoomId]; 
        const me = session.user;

        if(currentRoomId === null || !messages.byRoomId.hasOwnProperty(currentRoomId)){
            return (
                <Card>
                    <CardContent>
                        <div>Lets start chatting with your friends!!</div>

                    </CardContent>
                </Card>
            );
        }

        const roomMessages = messages.byRoomId[currentRoomId].map(messageId => messages.byId[messageId] );
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
                                 
                                <IconButton aria-label="Delete">
                                    <DeleteIcon />
                                </IconButton>
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
                            onChange={this.handleChange}
                            onKeyPress={this.handleKeyPress}
                            value={this.state.curText}
                            margin="normal"
                        />
                    </CardContent>
                </Card>

            </div>
        );
    }
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
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageWindow);
