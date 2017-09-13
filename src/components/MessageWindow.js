import React, {Component} from 'react';
import {connect} from 'react-redux';

import Card, { CardHeader, CardContent,} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Balloon from './Balloon';

class MessageWindow extends Component {

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
            <Card>
                <CardHeader
                    title={currentRoom.name}
                />
                <Divider/>
                <CardContent>
                    {messagesDOM}
                </CardContent>
            </Card>
        );
    }
}

const mapStateToProps = ({currentRoomId, session, entities}) => ({
    currentRoomId,
    session,
    entities,
});

export default connect(mapStateToProps, null)(MessageWindow);
