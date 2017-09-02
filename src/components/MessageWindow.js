import React, {Component} from 'react';
import {connect} from 'react-redux';

import Card, { CardHeader, CardContent,} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Balloon from './Balloon';

class MessageWindow extends Component {

    render() {
        const {currentRoom} = this.props;
        if(currentRoom === null){
            return (
                <Card>
                    <CardContent>
                        <div>Lets start chatting with your friends!!</div>

                    </CardContent>
                </Card>
            );
        }

        const balloons = currentRoom.messages.map((message, index) => {
            console.log(message);
            return (
                <div key={index}>
                    <span>{message.postDate}</span>
                    <Balloon 
                        direction="left"
                    >
                        {message.text}
                    </Balloon>
                </div>
            );
        });

        return (
            <Card>
                <CardHeader
                    title={currentRoom.name}
                />
                <Divider/>
                <CardContent>
                    {balloons}
                </CardContent>
            </Card>
        );
    }
}

const mapStateToProps = ({currentRoom}) => ({
    currentRoom: currentRoom,
});

export default connect(mapStateToProps, null)(MessageWindow);
