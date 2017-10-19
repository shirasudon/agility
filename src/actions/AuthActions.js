import { sessionService } from 'redux-react-session';
import SessionApiStub from '../api/sessionStub';


let sessionApi = SessionApiStub;

export const setSessionApi = api => {
    sessionApi = api;
}

export const login = (user) => {
    return (dispatch) => {
        let responseUser;
        return sessionApi.login(user).then(response => {
            if (response.ok) {
                responseUser = response.data;
                return sessionService.saveSession(response.token);
            }
            else {
                return Promise.resolve(false);
            }
        }).then(() => {
            sessionService.saveUser(responseUser);

                console.log(responseUser);
            return Promise.resolve(true);
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

