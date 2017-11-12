import React from 'react'
import { connect } from 'react-redux'
import { withStyles, } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import moment from 'moment'
import { lifecycle, compose } from 'recompose'
import { chatActionCreator } from '../actions'

export const RIGHT = "right"
export const LEFT = "left"

const balloonElement = {
    [LEFT]: {
        content: "''",
        position: "absolute",
        top: "50%",
        left: "-30px",
        marginTop: "-15px",
        border: "15px solid transparent",
        borderRight: "15px solid #e0edff",
    },
    [RIGHT]: {
        content: "''",
        position: "absolute",
        top: "50%",
        left: "100%",
        marginTop: "-15px",
        border: "15px solid transparent",
        borderLeft: "15px solid #e0edff",
    },
}

const baloonMain = {
    position: "relative",
    padding: "20px 10px",
    borderRadius: "20px",
    minWidth: "10%",
    maxWidth: "100%",
    color: "#555",
    fontSize: "16px",
    background: "#e0edff",
}

const styleSheet = theme => ({
    balloonLeft: {
        ...baloonMain,
        "&:before": balloonElement[LEFT],
    },
    balloonRight: {
        ...baloonMain,
        "&:before": balloonElement[RIGHT],
    },
    postMetaLeft: {
        textAlign: "left"
    },
    postMetaRight: {
        textAlign: "right"    
    }
})

export const withLifecycle = lifecycle({
    componentDidMount() {
        // dispatch read notification to the server
        const { entities, messageId, session, sendRead } = this.props
        const message = entities.messages.byId[messageId]
        const me = session.user
        if ( !message.readBy.includes(me.id) ) { // notify the server that the current user has read the specific message
            sendRead([messageId], me.id)
        }
    }
})

export const Balloon = ( { messageId, entities, userId, classes, text, username, createdAt, direction=RIGHT } ) => {
    const balloonStyle = (direction === RIGHT ? classes.balloonRight: classes.balloonLeft)
    const postMeta = (direction === RIGHT ? classes.postMetaRight: classes.postMetaLeft)
    const justify = (direction === RIGHT ? "flex-end": "flex-start")
    const readByCount = entities.messages.byId[messageId].readBy.length - 1
    return (
        <Grid id={messageId} container justify={justify}>
            <Grid item xs={6}>
                <div className={balloonStyle}>
                    {text}
                </div>
                <div>
                    {readByCount} Read 
                </div>
                <div className={postMeta}>
                    { username && <span>{username}</span> } : <span>{moment(createdAt).format("MMMM Do YYYY, h:mm a")}</span>
                </div>
            </Grid>
        </Grid>
    )
}

export const mapStateToProps = ( { entities, session } ) => ({
    entities,
    session,
})

export const mapDispatchToProps = dispatch => ({
    sendRead: (messageId, userId) => {
        dispatch(chatActionCreator.sendMessageRead([messageId], userId))
    }
})

export const enhancer = compose(
    withStyles(styleSheet),
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle,
)

export default enhancer(Balloon)

