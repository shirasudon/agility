import {sessionService} from 'redux-react-session';
import * as defaultSessionApi from '../api/sessionStub';

let sessionApi = defaultSessionApi;

export const setSessionApi = api => {
    sessionApi = api;
}

export const login = (user, onSuccess = ()=>{}, onError = ()=>{}) => {
    return (dispatch) => {
        return sessionApi.login(user).then(response => {
            sessionService.saveSession(response.token)
                .then(() => {
                    sessionService.saveUser(response.data);
                })
                .then(() => {
                    dispatch(loginSuccess());
                    onSuccess();
                })
                .catch(err => {
                    console.error(err);
                    onError();
                });
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
