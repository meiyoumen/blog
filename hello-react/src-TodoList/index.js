import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'

import App from './App'
import appReducer from './reducers'


let logger = store => next => action => {
  console.group('log')
  console.log(action)
  let result = next(action)
  console.log(store.getState())
  console.groupEnd()
  return result
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
let store = createStore(
  appReducer,
  composeEnhancers())




ReactDOM.render(
  <Provider store={store}>
    <App></App>
  </Provider>,
  document.getElementById('root')
)