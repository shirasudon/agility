import { Button, Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';

import {login as loginAction} from '../actions/AuthActions';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            user: {
                email: '',
                password: '',
            }
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const {value, name} = e.target;
        const newState = Object.assign({}, this.state);
        const {user} = newState;
        user[name] = value;
        this.setState(newState);
    }

    onSubmit(e) {
        e.preventDefault();
        const {login} = this.props;
        const {user} = this.state;
        const onSuccess = () => {
            //const newState = Object.assign({}, this.state, {redirect: true});
            //this.setState(newState);
        };
        login(user, onSuccess);
    }

    render() {
        const { user: { email, password }} = this.state;
        const {authenticated} = this.props;

        if (authenticated) {
            return <Redirect to="/chat" />;
        }

        return (
            <Form horizontal>
                <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} sm={2}>
                        Email
                    </Col>
                    <Col sm={3}>
                        <FormControl
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={email}
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
        );
    }
}

const mapStateToProps = ({session}) => ({
   authenticated: session.authenticated,
});

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user, cb) => {
            dispatch(loginAction(user, cb));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);
