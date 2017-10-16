import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import GridList from 'material-ui/GridList';
import { withStyles } from 'material-ui/styles';

import {login as loginAction} from '../actions/AuthActions';


const styleSheet = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    loginButton: {
        marginTop: theme.spacing.unit,
    },
}); 

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginFail: false,
            user: {
                username: '',
                password: '',
            }
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    /**
     * This method get called when username or password changes.
     * Internally it synchronizes the values of input boxes with component's state.
     * @param e event object
     */
    onChange(e) {
        const {value, name} = e.target;
        const newState = Object.assign({}, this.state);
        const {user} = newState;
        user[name] = value;
        this.setState(newState);
    }


    /**
     * This method get called when login button is pressed.
     * It validates the username and password. Upon successful login, user will be redirected to chat page.
     * Otherwise, stuck on the same page.
     * @param e event object
    */
    onSubmit(e) {
        e.preventDefault();
        const {login} = this.props;
        const {user} = this.state;
        login(user).then(success => {
            if(!success){
                const newState = Object.assign({}, this.state, {loginFail: true});
                this.setState(newState);
            }
        });
    }

    render() {
        const { user: { username, password }, loginFail} = this.state;
        const {authenticated, classes} = this.props;

        if (authenticated) {
            return <Redirect to="/chat" />;
        }

        return (
            <div>
            <Grid container justify="center">
                {
                    loginFail && <strong>Wrong username or password! Please try again!</strong>
                }
                <TextField
                    name="username"
                    label="ユーザー名"
                    value={username}
                    className={classes.textField}
                    onChange={this.onChange}
                    margin="normal"
                />
            </Grid>
            <Grid container justify="center">
                <TextField
                    name="password"
                    type="password"
                    label="パスワード"
                    value={password}
                    className={classes.textField}
                    onChange={this.onChange}
                    margin="normal"
                />
            </Grid>
            <Grid container justify="center">
                <Button color="primary" raised onClick={this.onSubmit} className={classes.loginButton}>ログイン</Button>
            </Grid>
            </div>
        );
    }
}

const mapStateToProps = ({session}) => ({
    authenticated: session.authenticated,
});

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user, cb) => {
            return dispatch(loginAction(user, cb));
        },
    };
};

const StyledLogin = withStyles(styleSheet)(Login);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledLogin);
