import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { toJS } from './ToJS'

export const PrivateRoute = ({
  exact,
  path,
  authenticated,
  component: Component,
}) => (
  <Route
    exact={exact}
    path={path}
    render={props =>
      authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      )
    }
  />
)

const mapStateToProps = state => ({
  authenticated: state.getIn(['session', 'authenticated']),
})

export const enhancer = compose(connect(mapStateToProps), toJS)

export default enhancer(PrivateRoute)
