import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import React from 'react'
import { compose } from 'recompose'

import { withStyles, } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import { logout as logoutAction } from '../actions/AuthActions'

const style = {
    root: {
        width: "100%",
        height: "12%",
    },
    flex: {
        flex: 1,
    },
}

export const Navbar = ( { authenticated, logout, classes, } ) => (
    <div className={classes.root}>
        <AppBar position="static">
            <Toolbar>
                <Typography type="title" color="inherit" className={classes.flex}>
                    Chat
                </Typography>
                { authenticated ?
                    ( <Button onClick={logout} color="contrast">Logout</Button> ):
                    ( <Button component={Link} to="/login" color="contrast">Login</Button> )
                }
            </Toolbar>
        </AppBar>
    </div>
)

const mapDispatchToProps = (dispatch) => ({
    logout: () => {
        dispatch(logoutAction())
    }
})

const mapStateToProps = ( { session } ) => ({
    authenticated: session.authenticated,
})

export const enhancer = compose(
    withStyles(style),
    connect(mapStateToProps, mapDispatchToProps)
)

export default enhancer(Navbar)
