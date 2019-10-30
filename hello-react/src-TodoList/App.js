import React, { Component } from 'react';

import AddTodo from './components/AddTodo'
import TodoList from './components/TodoList'
import FilterLink from './components/FilterLink'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <AddTodo />
        <TodoList />
        <FilterLink />
      </div>
    )
  }
}
