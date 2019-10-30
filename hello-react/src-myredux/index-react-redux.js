import React, {Component} from 'react'
import ReactDOM from 'react-dom'

// import {createStore} from './redux.js'
// import {Provider, connect} from './connect'

import {createStore} from 'redux'
import {Provider, connect} from 'react-redux'

import {reducer} from './reducer.js'

let store = createStore(reducer)

class Content extends Component{
  render(){
    console.log('Content props', this.props)
    let {store, tryDispatch} = this.props
    return(
      <div>
        <p>{store.getState().content}</p>
        <button onClick={()=>{store.dispatch({type : 'CHANGE_TITLE' , text : 'Hello React'})}}>点击修改title</button> &nbsp;&nbsp;
        <button onClick={()=>{tryDispatch()}}>点击修改content</button>
        <button onClick={()=>{store.dispatch({type : 'CHANGE_CONTENT' , text : 'Hello Redux 222'})}}>点击修改content</button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    console.log('App props', this.props)
    let {title, name} = this.props
    return (
      <div>
        <h3>{title} - {name}</h3>
        <Content store = {store}></Content>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {return {content: state.content}}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    tryDispatch (){
      dispatch({type : 'CHANGE_CONTENT' , text : 'Hello Redux'})
    }
  }
}

// @todo 这也太蛋疼了吧？ 每个组件都要 connect?
App = connect((state) => {return {title: state.title, name: 'Demo'}}, () => {return {}})(App)
Content = connect(mapStateToProps, mapDispatchToProps)(Content)

ReactDOM.render(
  <Provider store={store}> <App></App></Provider>,
  document.getElementById('root')
)