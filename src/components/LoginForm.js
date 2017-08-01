import { Alert, Button, Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';

import {login as loginAction} from '../actions/AuthActions';

class LoginForm extends Component {

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
        const {authenticated} = this.props;

        if (authenticated) {
            return <Redirect to="/chat" />;
        }

        return (
            <div>
                {
                    loginFail &&
                    (<Alert bsStyle="danger">
                        <strong>Wrong username or password! Please try again!</strong>
                    </Alert>)
                }
                <Form horizontal>
                    <FormGroup controlId="formHorizontalEmail">
                        <Col componentClass={ControlLabel} sm={2}>
                            Email
                        </Col>
                        <Col sm={3}>
                            <FormControl
                                type="username"
                                placeholder="Username"
                                name="username"
                                value={username}
                                onChange={this.onChange}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalPassword">
                        <Col componentClass={ControlLabel} sm={2}>
                            Password
                        </Col>
                        <Col sm={3}>
                            <FormControl
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={this.onChange}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.onSubmit}>
                                Sign in
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);
