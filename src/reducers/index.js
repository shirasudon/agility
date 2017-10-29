import { combineReducers } from 'redux';

import * as ui from './ui'
import { sessionReducer as session } from 'redux-react-session'
import * as entity from './entity'
import * as domain from './domain'

export const rootReducer = combineReducers({
    session,
    ...entity,
    ...domain,
    ...ui,
})

export default rootReducer
