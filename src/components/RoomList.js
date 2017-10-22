import React from 'react'
import {connect} from 'react-redux'
import { ListItem, ListItemText } from 'material-ui/List'

import { chatActionCreator } from "../actions"

export const RoomList = ( { rooms, enterRoom } ) => {
    return rooms.all.map(
        (roomId, index) => {
            const room = rooms.byId[roomId];
            return (
                <ListItem button key={index}>
                    <ListItemText
                        primary={room.name}
                        onClick={() => {enterRoom(roomId, !rooms.byId[roomId].initialFetch);}}
                    />
                </ListItem>
            );
        }
    )
}

const mapStateToProps = ( { entities } ) => ({
    rooms: entities.rooms,
});

const mapDispatchToProps = (dispatch) => ({
    enterRoom: (roomId, shouldFetch = false) => {
        dispatch(chatActionCreator.enterRoom(roomId, shouldFetch));
    },
});


export default connect(mapStateToProps, mapDispatchToProps)(RoomList)

