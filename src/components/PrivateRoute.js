import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({component: Component, exact = false, path, authenticated, ...props}) => (
    <Route
        exact={exact}
        path={path}
        render={
            props=>(
                authenticated?
                    (<Component {...props} />):
                    (<Redirect to={{
                        pathname: '/login',
                    }}/>)
            )
        }
        {...props}
    />
);

export default PrivateRoute;
