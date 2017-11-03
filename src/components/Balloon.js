import React from 'react'
import { withStyles, } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import moment from 'moment'

const RIGHT = "right"
const LEFT = "left"

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

})

export const Balloon = ( { classes, text, username, createdAt, direction=RIGHT } ) => {
    const balloonStyle = (direction === RIGHT ? classes.balloonRight: classes.balloonLeft)
    const justify = (direction === RIGHT ? "flex-end": "flex-start")
    return (
        <Grid container justify={justify}>
            <Grid item xs={6}>
                <span>{moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}</span>
                { username && <span>{username}</span> }
                <div className={balloonStyle}>
                    {text}
                </div>
            </Grid>
        </Grid>
    )
}

export default withStyles(styleSheet)(Balloon)

