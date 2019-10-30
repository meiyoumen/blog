import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware} from 'redux'

/**
 * Redux 快速上手指南  https://github.com/collinxz-coder/blog/issues/1
 */

// import reducers from './reducers.js'

// 拆分后的reducer
import reducers from './reducers/index'

import {addTodo} from './action'

// logger 中间件
const logger = store => next => action => {
  console.group('dispatching: ', action)
  let result = next(action)
  console.log('next state: ', store.getState())
  console.groupEnd()
  return result
}

// 异常捕获中间件
const trycatch = store => next => action => {
  try {
    return next(action)
  } catch (e) {
    console.log(e)
    throw e
  }
}


const store = createStore(reducers, applyMiddleware(
  logger,
  trycatch
))

console.log(store.getState())

let unsubscribe = store.subscribe(() => {
  console.log(store.getState())
})

store.dispatch(addTodo('some think.'))
store.dispatch(addTodo('second think.'))

unsubscribe()

class App extends React.Component {
  render(){
    return(<div></div>)
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))

