import React from 'react'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import { connect } from 'react-redux'

import { chatActionCreator } from '../actions'

export const ChatHeader = ( { title = '', shouldShowDeleteIcon = false, deleteRoom, currentRoomId } ) => (
    <div className="chatHeader">
        <div className="chatTitle">{ title }</ div>
        { shouldShowDeleteIcon && (
            <IconButton aria-label="Delete" onClick={()=>{deleteRoom(currentRoomId)}}>
                <DeleteIcon />
            </IconButton>
        ) }
    </div>
)

const mapStateToProps = ( { currentRoomId } ) => ({
    currentRoomId,
})

const mapDispatchToProps = (dispatch) => ({
    deleteRoom: roomId => {
        dispatch(chatActionCreator.deleteRoom(roomId))
    }
})

export const enhancer = connect(mapStateToProps, mapDispatchToProps)

export default enhancer(ChatHeader)

