import { Button, Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {login as loginAction} from '../actions/SessionAction';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        this.props.login(this.state.user);
    }

    render() {
        const { user: { email, password } } = this.state;
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
                        <Button onClick={this.onSubmit} >
                            Sign in
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: user => {
            dispatch(loginAction(user))
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(LoginForm);
