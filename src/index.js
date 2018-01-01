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
import * as websocket from './service/websocket'
import registerServiceWorker from './registerServiceWorker'

const logger = createLogger({
  diff: true,
})

const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument({ emit: websocket.emit }), logger)
)

websocket.initWebsocketService(store, 'ws://localhost:8080/chat/ws') // TODO: remove hard coding

initSessionService(store).then(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
})

registerServiceWorker()
