import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import {createStore} from './util/redux.js'
import {Provider, reactRedux} from './util/react-redux.js'

import {reducer} from './reducer.js'

let store = createStore(reducer)

class Content extends Component{
  render(){
    let {store} = this.props
    return(
      <div>
        <p>{store.getState().content}</p>
        <button onClick={()=>{store.dispatch({type : 'CHANGE_TITLE' , text : 'Hello React'})}}>点击修改title</button>
        <button onClick={()=>{store.dispatch({type : 'CHANGE_CONTENT' , text : 'Hello Redux'})}}>点击修改content</button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    let {title, name} = this.props
    console.log('state', this.props)
    return (
      <div>
        <h3>{title} - {name}</h3>
        <Content store = {store}></Content>
      </div>
    )
  }
}

App = reactRedux(
  (state)=> {return {title: state.title, name: 'Demo'}},
  () => {}
)(App)

ReactDOM.render(
  <Provider store={store}> <App></App></Provider>,
  document.getElementById('root')
)