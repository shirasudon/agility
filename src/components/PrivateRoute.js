import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

class PrivateRoute extends Component {

    render() {
        const {exact, path, authenticated, component: Component} = this.props;
        console.log(authenticated);
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
}

const mapStateToProps = ({session}) => ({
    authenticated: session.authenticated,
});

export default connect(mapStateToProps)(PrivateRoute);
