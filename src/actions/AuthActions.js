import {sessionService} from 'redux-react-session';
import * as defaultSessionApi from '../api/sessionStub';

let sessionApi = defaultSessionApi;

export const setSessionApi = api => {
    sessionApi = api;
}

export const login = user => {
    return () => {
        return sessionApi.login(user).then(response => {
            sessionService.saveSession(response.token)
                .then(() => {
                    sessionService.saveUser(response.data).catch(err => console.error(err));
                }).catch(err => console.error(err));
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
