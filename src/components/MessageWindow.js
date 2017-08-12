import React, {Component} from 'react';
import {connect} from 'react-redux';

import Card, { CardHeader, CardContent,} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

class MessageWindow extends Component {

    render() {
        const {currentRoom} = this.props;
        return (
            currentRoom === null ?
                (
                    <Card>
                        <CardContent>
                            <div>Lets start chatting with your friends!!</div>
                        </CardContent>
                    </Card>

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
