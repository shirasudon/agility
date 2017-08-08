import {Navbar as Nb, Nav, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import React, {Component} from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import {logout as logoutAction} from '../actions/AuthActions';

const styleSheet = createStyleSheet({
    root: {
        "margin-bottom": '30px',
        width: '100%',
    },
    flex: {
        flex: 1,
    },
});

class Navbar extends Component {

    render(){
        const {authenticated, logout, classes} = this.props;
        return(
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Chat
                        </Typography>
                        {authenticated ?
                            (
                                <Button onClick={logout} color="contrast">Logout</Button>
                            ):
                            (
                                <Button component={Link} to="/login" color="contrast">Login</Button>
                            )
                        }
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(logoutAction())
        }
    };
};

const mapStateToProps = ({session}) => ({
    authenticated: session.authenticated,
});

const StyledNavbar = withStyles(styleSheet)(Navbar);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledNavbar);
