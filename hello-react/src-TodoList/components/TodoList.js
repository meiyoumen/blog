import React, {Component} from 'react'
import {connect} from 'react-redux'

import {toggleTodo} from '../actions'

const filterList = (list, filter) => {
  switch (filter) {
    case 'doing':
      return list.filter(todo => !todo.isDone)
    case 'done' :
      return list.filter(todo => todo.isDone)
    default :
      return list
  }
}

class TodoList extends Component {
  render() {
    let {list, toggleTodo, filter} = this.props
    let renderList = filterList(list, filter)
    return (
      <div>
        <ul>
          {renderList.map((e, k) => (
            <li key={e.id} onClick={() => {toggleTodo(e.id)}} style={{textDecoration: e.isDone ? 'line-through' : 'none'}}>
              {e.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => (
  {
    list: state.todoReducer,
    filter: state.filterReducer.filter
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    toggleTodo: (id) => {
      dispatch(toggleTodo(id))
    }
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)