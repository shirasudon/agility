import React from 'react';
import { setSessionApi, setSessionService, login, logout } from './AuthActions';


let SessionApiStub
let sessionService

beforeEach( () => {
    SessionApiStub = {
        login: user => {
            if (user.username === "john" && user.password === "pass") {
                return Promise.resolve({
                    ok: true,
                    data: "data",
                    token: "token!"
                })
            }
            else {
                return Promise.resolve({
                    ok: false,
                })
            }
        },
        logout: () => {
            return Promise.resolve()    
        }
    }

    sessionService = {
        saveSession: jest.fn(),
        saveUser: jest.fn(),
        deleteSession: jest.fn(),
        deleteUser: jest.fn(),
    }


    setSessionApi(SessionApiStub)
    setSessionService(sessionService)
})

describe("login", () => {

    it('login successfully with existing username and correct password', done => {

        login({username: "john", password: "pass"})().then( success => {
            expect(success).toBe(true)
            expect(sessionService.saveSession).toHaveBeenCalledWith("token!")
            expect(sessionService.saveUser).toHaveBeenCalledWith("data")
            done()
        })

    })

    it('login fail with existing username and incorrect password', done => {
        login({username: "john", password: "wrongpassword"})().then( success => {
            expect(success).toBe(false)
            expect(sessionService.saveSession).not.toHaveBeenCalled()
            expect(sessionService.saveUser).not.toHaveBeenCalled()
            done()
        });
    });

    it('login fail with non-existing username and random password', done => {
        login({username: "non-existing-username", password: "randompassword"})().then( success => {
            expect(success).toBe(false)
            expect(sessionService.saveSession).not.toHaveBeenCalled()
            expect(sessionService.saveUser).not.toHaveBeenCalled()
            done()
        })
    })
})

describe("logout", () => {
    it("", (done) => {
        logout()().then( () => {
            expect(sessionService.deleteSession).toHaveBeenCalled()
            expect(sessionService.deleteUser).toHaveBeenCalled()
            done()
        })
    })
})
