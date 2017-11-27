// @format
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { withStyles } from 'material-ui/styles'

import Login from './Login'
import Home from './Home'
import NoMatch from './NoMatch'
import Chat from './Chat'
import Navbar from './Navbar'
import PrivateRoute from './PrivateRoute'

const styles = {
  app: {
    height: '100%',
  },
}

export const App = ({ classes }) => (
  <Router history={createHistory()}>
    <div className={classes.app}>
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

export const enhancer = withStyles(styles)

export default enhancer(App)
