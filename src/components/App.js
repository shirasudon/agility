import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'

import LoginForm from './LoginForm';
import Home from './Home';
import NoMatch from './NoMatch';
import Chat from './Chat';
import Navbar from './Navbar';
import PrivateRoute from './PrivateRoute';

class App extends Component {

    render() {
        return (
            <Router history={createHistory()}>
                <div>
                    <Navbar />
                    <Switch>
                        <Route exact={true} path="/" component={Home} />
                        <PrivateRoute exact={true} path="/chat" component={Chat} />
                        <Route exact={true} path="/login" component={LoginForm} />
                        <Route component={NoMatch} />
                    </Switch>
                </div>
            </Router>
        )
    }
}
export default App;
