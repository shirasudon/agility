import React from 'react';
import {setSessionApi, login, logout} from './AuthActions';
import SessionApiStub from '../api/sessionStub';


it('login successfully with existing username and correct password', () => {
    setSessionApi(SessionApiStub);

    login({username: "john", password: "pass"})().then( success => {
        expect(success).toBe(true);
    });

});

it('login fail with existing username and incorrect password', () => {
    setSessionApi(SessionApiStub);

    login({username: "john", password: "wrongpassword"})().then( success => {
        expect(success).toBe(false);
    });
});

it('login fail with non-existing username and random password', () => {
    setSessionApi(SessionApiStub);

    login({username: "non-existing-username", password: "randompassword"})().then( success => {
        expect(success).toBe(false);
    });
});
