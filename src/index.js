import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { sessionService } from 'redux-react-session';
import thunk from 'redux-thunk';

import reducer from './reducers'
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// import webSocketMiddleware from './middlewares/webSocketMiddleware'

import { chatActionCreator } from './actions'
import { WebSocketClient } from './api/socket'
import { SEND_CHAT_MESSAGE } from './actions/actionTypes'

/**** TODO: remove the lines when you connect to the real socket server *****/
import startMockServer from './mock/mockServer'
const socketURI = "ws://localhost:8080/chat/ws" // except for this line
startMockServer(socketURI);
/*******************************************************************/

let socket = null;

const webSocketMiddleware = store => next => action => {
    if(action.type === SEND_CHAT_MESSAGE) {
        if(socket !== null) {
            socket.send(JSON.stringify({
                type: SEND_CHAT_MESSAGE,
                data: action.data
            }))
        }
    }

    next(action)
}

const store = createStore(
    reducer,
    applyMiddleware(
        thunk,
        webSocketMiddleware
    )
);

socket = new WebSocketClient(WebSocket);
socket.onOpen = (event) => {}
socket.onClose = (event) => {}
socket.onMessage = (event) => {
    store.dispatch(chatActionCreator.receiveMessage(event.data));
    console.log("Received:", event.data);
}

socket.open(socketURI);


sessionService.initSessionService(store, {driver: 'COOKIES'} );

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
