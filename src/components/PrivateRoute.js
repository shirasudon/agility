import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

export function PrivateRoute(props) {

    const {exact, path, authenticated, component: Component} = props;
    return <Route
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
    />;
}

const mapStateToProps = ({session}) => ({
    authenticated: session.authenticated,
});

export default connect(mapStateToProps)(PrivateRoute);
