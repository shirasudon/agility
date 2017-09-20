import React, {Component} from 'react';
import {connect} from 'react-redux';

import Card, { CardHeader, CardContent,} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Balloon from './Balloon';
import { KEY_ENTER } from '../keyCodes.js';


class MessageWindow extends Component {

    constructor(props) {
        super(props); 
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = {
            curText: '',
        }
    }

    handleKeyDown(e) {
        switch (e.keyCode){
        case KEY_ENTER: 
            console.log("ENTER is pressed");
            break;
        default:
            const newText = this.state.curText + e.key;
            this.setState({curText: newText});
            break;
        }
    }

    render() {
        const { currentRoomId, session, entities } = this.props;
        const { messages, rooms } = entities;
        const currentRoom = rooms.byId[currentRoomId]; 
        const me = session.user;

        if(currentRoomId === null){
            return (
                <Card>
                    <CardContent>
                        <div>Lets start chatting with your friends!!</div>

                    </CardContent>
                </Card>
            );
        }

        const roomMessages = messages.byRoomId[currentRoomId];
        const messagesDOM = roomMessages ? 
            roomMessages.map((message, index) => {
                const direction = ( message.userId === me.id ) ? "right" : "left";

                return (
                        <Balloon key={index} direction={direction} postDate={message.postDate}>
                            {message.text}
                        </Balloon>
                );
        }):
        (<span>There is no conversation yet</span>);
        
        return (
            <div>
                <Card>
                    <CardHeader
                        title={currentRoom.name}
                    />
                    <Divider/>
                    <CardContent>
                        {messagesDOM}
                        <TextField
                            id="post-text-field"
                            InputProps={{ placeholder: 'Press enter to send message!' }}
                            fullWidth
                            autoFocus={true}
                            onKeyDown={this.handleKeyDown}
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

export default connect(mapStateToProps, null)(MessageWindow);
