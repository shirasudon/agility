// @format
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { toJS } from './ToJS'

export const PrivateRoute = ({ exact, path, myId, component: Component }) => (
  <Route
    exact={exact}
    path={path}
    render={props =>
      myId !== null ? (
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
  myId: state.getIn(['auth', 'myId']),
})

export const enhancer = compose(connect(mapStateToProps), toJS)

export default enhancer(PrivateRoute)
