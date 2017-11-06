import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'


export const ChatHeader = ( { title: '', shouldShowDeleteIcon: false, deleteRoom, currentRoomId } ) => (
    <div className="chatHeader">
        <div> { title } </ div>
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

export const enhancer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withCurrentText,
)

export default enhancer(ChatHeader)

