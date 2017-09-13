import { combineReducers } from 'redux';

import { ui } from './ui';
import { sessionReducer as session } from 'redux-react-session';
import { entities, currentRoomId, } from './reducers';

const rootReducer = combineReducers({
    session,
    entities,
    currentRoomId,
    ui,
});

export default rootReducer;
