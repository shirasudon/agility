// @format
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { toJS } from './ToJS'

export const PrivateRoute = ({ exact, path, userId, component: Component }) => (
  <Route
    exact={exact}
    path={path}
    render={props =>
      userId !== null ? (
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
  userId: state.getIn(['auth', 'userId']),
})

export const enhancer = compose(connect(mapStateToProps), toJS)

export default enhancer(PrivateRoute)
