import { Button, Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import React, {Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';

class LoginForm extends Component {

    render() {
        return (
            <Form horizontal>
                <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} sm={2}>
                        Email
                    </Col>
                    <Col sm={3}>
                        <FormControl type="email" placeholder="Email"/>
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={2}>
                        Password
                    </Col>
                    <Col sm={3}>
                        <FormControl type="password" placeholder="Password"/>
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <LinkContainer to="/">
                            <Button>
                                Sign in
                            </Button>
                        </LinkContainer>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

export default LoginForm;
