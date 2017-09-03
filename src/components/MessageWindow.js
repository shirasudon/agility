import React, {Component} from 'react';
import {connect} from 'react-redux';

import Card, { CardHeader, CardContent,} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Balloon from './Balloon';

class MessageWindow extends Component {

    render() {

        const { currentRoom, session, entities } = this.props;
        const { messages, } = entities;
        const me = session.user;
        console.log(session);

        if(currentRoom === null){
            return (
                <Card>
                    <CardContent>
                        <div>Lets start chatting with your friends!!</div>

                    </CardContent>
                </Card>
            );
        }

        const roomMessages = messages.byRoomId[currentRoom.id];
        const messagesDOM = roomMessages ? 
            roomMessages.map((message, index) => {
                console.log(me);
                const direction = ( message.userId === me.id ) ? "right" : "left";

                return (
                    <div key={index}>
                        <span>{message.postDate}</span>
                        <Balloon direction={direction} >
                            {message.text}
                        </Balloon>
                    </div>
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

const mapStateToProps = ({currentRoom, session, entities}) => ({
    currentRoom,
    session,
    entities,
});

export default connect(mapStateToProps, null)(MessageWindow);
