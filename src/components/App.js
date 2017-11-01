import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'

import Login from './Login'
import Home from './Home'
import NoMatch from './NoMatch'
import Chat from './Chat'
import Navbar from './Navbar'
import PrivateRoute from './PrivateRoute'

export const App = () => (
    <Router history={createHistory()}>
        <div>
            <Navbar />
            <Switch>
                <Route exact={true} path="/" component={Home} />
                <PrivateRoute path="/chat" component={Chat} />
                <Route exact={true} path="/login" component={Login} />
                <Route component={NoMatch} />
            </Switch>
        </div>
    </Router>
)

export default App
