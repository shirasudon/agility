import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import green from 'material-ui/colors/green';
import Button from 'material-ui/Button';


const styles = {
    wrapper: {
        position: 'relative',
    },
    successButton: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    progress: {
        color: green[500],
        position: 'absolute',
        top: -2,
        left: -2,
        opacity: 0.5,
    },
};

export class CircularProgressButton extends Component {

    constructor(props) {
        super(props)
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }

    handleButtonClick() {
        const { onClick, ui } = this.props;
        console.log(ui.createGroup.isRequesting)
        if ( !ui.createGroup.isRequesting && onClick ) { // if not loading and onClick is callable
            onClick()
        }
    }

    render() {
        const { children, classes, ui } = this.props;
        const { isRequesting } = ui.createGroup;

        let buttonClass = '';

        return (
            <div className={classes.wrapper}>
                <Button 
                    fab
                    className={buttonClass} 
                    onClick={this.handleButtonClick}
                    raised={this.props.raised}
                    color={this.props.color} >
                    {children}
                </Button>
                { isRequesting && <CircularProgress size={60} className={classes.progress} />}
            </div>
        );
    }
}

CircularProgressButton.propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

const mapStateToProps = ({ ui }) => ({
    ui,
});

const mapDispatchToProps = (dispatch) => ({
});


const StyledCircularProgressButton = withStyles(styles)(CircularProgressButton);

export default connect(mapStateToProps, mapDispatchToProps)(StyledCircularProgressButton);
