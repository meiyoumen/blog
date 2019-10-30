import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import {createStore} from './util/redux.js'
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
  constructor (props) {
    super(props)
    this.state = store.getState()
    store.subscribe(() => {
      this.setState(store.getState())
    })
  }
  render() {
    let {title} = this.state
    console.log('state', this.state)
    return (
      <div>
        <h3>{title}</h3>
       {/* 需要把store传递给子组件*/}
        <Content store = {store}></Content>
      </div>
    )
  }
}

ReactDOM.render(
  <App></App>,
  document.getElementById('root')
)