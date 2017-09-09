import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import green from 'material-ui/colors/green';
import Button from 'material-ui/Button';
import CheckIcon from 'material-ui-icons/Check';
import AddIcon from 'material-ui-icons/Add';

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

class CircularProgressButton extends Component {

    constructor(props) {
        super(props)
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }

    handleButtonClick() {
        const { status, onClick } = this.props;
        if ( status !== 'loading' && onClick ) { // if not loading and onClick is callable
            onClick()
        }
    }

    render() {
        const { children, classes, status } = this.props;
        let buttonClass = '';

        // if ( status === 'success') {
        //     buttonClass = classes.successButton + ' successButton';
        // }

        return (
            <div className={classes.wrapper}>
                <Button 
                    fab
                    className={buttonClass} 
                    onClick={this.handleButtonClick}
                    raised={this.props.raised}
                    color={this.props.color} >
                    { status === "success" ? <CheckIcon /> : <AddIcon />} {children}
                </Button>
                { status === "loading" && <CircularProgress size={60} className={classes.progress} />}
            </div>
        );
    }
}

CircularProgressButton.propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    status: PropTypes.string,
};

export default withStyles(styles)(CircularProgressButton);
