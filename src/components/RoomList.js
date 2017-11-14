import React from 'react'
import {connect} from 'react-redux'
import { ListItem, ListItemText } from 'material-ui/List'

import { chatActionCreator } from "../actions"

export const RoomList = ( { rooms, enterRoom } ) => {

    if (!rooms.all) {
        return null
    }

    const roomComponentList =  rooms.all.map(
        (roomId, index) => {
            const room = rooms.byId[roomId]
            const roomName = room.hasUnreadMessage ? <b>{room.name}</b> : room.name
            return (
                <ListItem button key={index}>
                    <ListItemText
                        primary={roomName}
                        onClick={() => {enterRoom(roomId, !rooms.byId[roomId].initialFetch);}}
                    />
                </ListItem>
            )
        }
    )
    return (
        <div>
            {roomComponentList}
        </div>
    )
}

const mapStateToProps = ( { entities } ) => ({
    rooms: entities.rooms,
})

const mapDispatchToProps = (dispatch) => ({
    enterRoom: (roomId, shouldFetch = false) => {
        dispatch(chatActionCreator.enterRoom(roomId, shouldFetch))
    },
})


export default connect(mapStateToProps, mapDispatchToProps)(RoomList)

