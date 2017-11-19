import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

export const PrivateRoute = ( { exact, path, authenticated, component: Component} ) => (
    <Route
        exact={exact}
        path={path}
        render={
            props => (
                authenticated ?
                    (<Component {...props} />) :
                    (<Redirect to={{
                        pathname: '/login',
                    }}/>)
            )
        }
    />
)

const mapStateToProps = props => ({
    authenticated: props.getIn(["session", "authenticated"])
})

export default connect(mapStateToProps)(PrivateRoute);
