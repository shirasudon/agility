import React, {Component} from 'react';
import {connect} from 'react-redux';

import Card, { CardHeader, CardContent,} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Balloon from './Balloon';

class MessageWindow extends Component {

    render() {
        const {currentRoom} = this.props;
        return (
            currentRoom === null ?
                (
                    <div>
                    <Card>
                        <CardContent>
                            <div>Lets start chatting with your friends!!</div>

                            <Balloon>hello</Balloon>
                            <Balloon direction="left">hello2</Balloon>
                        </CardContent>
                    </Card>

                    </div>

                ):
                (
                    <Card>
                        <CardHeader
                            title={currentRoom.name}
                            subheader="September 14, 2016"
                        />
                        <Divider/>
                        <CardContent>
                            {currentRoom.name}
                        </CardContent>
                    </Card>
                )
        );
    }
}

const mapStateToProps = ({currentRoom}) => ({
    currentRoom: currentRoom,
});

export default connect(mapStateToProps, null)(MessageWindow);
