import React from 'react'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { toJS } from './ToJS'
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

const mapStateToProps = state => ({
    currentRoomId: state.get("currentRoomId"),
})

const mapDispatchToProps = (dispatch) => ({
    deleteRoom: roomId => {
        dispatch(chatActionCreator.deleteRoom(roomId))
    }
})

export const enhancer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    toJS
)

export default enhancer(ChatHeader)

