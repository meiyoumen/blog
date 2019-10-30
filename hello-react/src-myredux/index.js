import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider, connect} from 'react-redux'

import thunk from 'redux-thunk'

// action
let load_data = (keywords) => {
  return dispatch => {
    dispatch({type: 'LOAD_DATA'})

    let xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://jsonplaceholder.typicode.com/todos')
    xhr.send()

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let data = xhr.response
        dispatch({ type: 'DONE_LOAD', data: JSON.parse(data)})
      }
    }
  }
}

let reducer = function (state, action) {
  if (!state) {
    return {
      data: [],
      loading: false
    }
  }
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        loading: true
      }
    case 'DONE_LOAD':
      return {
        ...state,
        loading: false,
        data: action.data
      }
    default:
      return state
  }
}

let store = createStore(reducer, applyMiddleware(thunk))
class App extends React.Component {
  render() {
    const {loading, data, loadData} = this.props
    return (
      <div>
        <button onClick={() => {loadData()}}>load data</button>
        <div>{loading ? 'loading...' : 'all data showing'}</div>
        <div>{loading ? '' : (<ul>{data.map((v, k) => (<li key={v.id}>{v.title}</li>))}</ul>)}</div>
      </div>
    )
  }
}

let mapStateToProps = function (state, ownProps) {
  return {
    loading: state.loading,
    data: state.data
  }
}

let mapDispatchToProps = function (dispatch, ownProps) {
  return {
    loadData: function () {
      dispatch(load_data('你好'))
    }
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App)

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)
