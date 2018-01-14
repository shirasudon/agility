// @format

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import reducer from './reducers'
import './index.css'
import App from './components/App'
import initSessionService from './service/sessionService'
import WebSocketService from './service/websocket'
import registerServiceWorker from './registerServiceWorker'

const logger = createLogger({
  diff: true,
})

const store = createStore(
  reducer,
  applyMiddleware(
    thunk.withExtraArgument({ emit: WebSocketService.emit }),
    logger
  )
)

// initializes services
WebSocketService.init(store, 'ws://localhost:8080/chat/ws')
initSessionService(store).then(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
})

registerServiceWorker()
