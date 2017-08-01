import {sessionService} from 'redux-react-session';
import SessionApiStub from '../api/sessionStub';

let sessionApi = SessionApiStub;

export const setSessionApi = api => {
    sessionApi = api;
}

export const login = (user) => {
    return (dispatch) => {
        return sessionApi.login(user).then(response => {
            if (response.ok) {
                return sessionService.saveSession(response.token)
                    .then(() => {
                        sessionService.saveUser(response.data);
                        return Promise.resolve(true);
                    });
            } else {
                return Promise.resolve(false);
            }
        });
    }
}

export const logout = () => {
    return () => {
        return sessionApi.logout().then(() => {
            sessionService.deleteSession();
            sessionService.deleteUser();
        }).catch(err => {
            throw (err);
        });
    }
}

export const LOGIN_SUCCESS  = "LOGIN_SUCCESS";
function loginSuccess(){
    return {
        type:  LOGIN_SUCCESS
    }
}
