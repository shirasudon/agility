import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import createHistory from 'history/createBrowserHistory'

import LoginForm from './LoginForm';
import Home from './Home';
import NoMatch from './NoMatch';
import Chat from './Chat';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {login: false};
    }

    render() {
        return (
            <Router history={createHistory()}>
                <div>
                    <Navbar inverse collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Link to="/">Chat</Link>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Nav pullRight>
                            {this.state.login ?
                                (
                                    <LinkContainer to="/">
                                        <NavItem>Logout</NavItem>
                                    </LinkContainer>
                                ):
                                (
                                    <LinkContainer to="/login">
                                        <NavItem>Login</NavItem>
                                    </LinkContainer>
                                )
                            };
                        </Nav>
                    </Navbar>
                    <Switch>
                        <Route exact={true} path="/" component={Home} />
                        <Route exact={true} path="/chat" component={Chat} />
                        <Route exact={true} path="/login" component={LoginForm} />
                        <Route component={NoMatch} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;
