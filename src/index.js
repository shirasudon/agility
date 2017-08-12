import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import {sessionService, sessionReducer as session} from 'redux-react-session';
import thunk from 'redux-thunk';

import './index.css';
import App from './components/App';
import {entities, currentRoom} from './reducers/reducers';
import registerServiceWorker from './registerServiceWorker';

const rootReducer = combineReducers({
    session,
    entities,
    currentRoom,
});

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

sessionService.initSessionService(store, {driver: 'COOKIES'} );

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
