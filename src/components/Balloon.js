import React from 'react';
import {connect} from 'react-redux';
import { withStyles, } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const RIGHT = "right";
const LEFT = "left";

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

});

export function Balloon(props) {
    const {classes, children, postDate} = props;
    let {direction} = props;
    if(!direction){
        direction = RIGHT;
    }
    const balloonStyle = (direction === RIGHT ? classes.balloonRight: classes.balloonLeft);
    const justify = (direction === RIGHT ? "flex-end": "flex-start");
    return (
        <Grid container justify={justify}>
            <Grid item xs={6}>
                <span>{postDate}</span>
                <div className={balloonStyle}>
                    {children}
                </div>
            </Grid>
        </Grid>
    );
}

const mapStateToProps = () => ({

});

export default connect(mapStateToProps, null)(withStyles(styleSheet)(Balloon));
