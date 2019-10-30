import React, { Component } from 'react';
import './css/App.css';

export default class App extends Component{
  state = {
    todoList: [
      {
        completed : false,
        content : '要做的事情赶紧做！'
      },
      {
        completed : false,
        content : '不做就来不及了！'
      }
    ]
  }

  _handleRemove = (index) => {
    // slice 返回一个新数组 如果 end 未被规定，那么 slice() 方法会选取从 start 到数组结尾的所有元素。
    let todoList = this.state.todoList.slice()
    todoList.splice(index, 1)
    this.setState({
      todoList: todoList
    })
  }

  _toggleComplete = (index) => {
    let todoList = this.state.todoList.slice()
    todoList[index].completed = !todoList[index].completed
    this.setState({
      todoList: todoList
    })
  }

  _handleAdd = () => {
    let todoList = this.state.todoList.slice()
    if (this.input && this.input.value.length) {
      todoList.push({
        completed : false,
        content : this.input.value
      })
      this.input.value = ''
      this.setState({
        todoList: todoList
      })
    } else {
      console.error('内空不能为空')
    }
  }

  render() {
    let {todoList} = this.state
    return(
      <div className="container">
        <h3 className="title">TODO_LIST</h3>

        <ul>
          {
            todoList.map((v, k) => (
              <li key={k}>
                <button className="remove" onClick={() => this._handleRemove(k)}>X</button> {" "}
                <span onClick={()=>{this._toggleComplete(k)}} style={ v.completed? {textDecoration : 'line-through' , color : 'green'} : {}}>
                  {v.content}
                </span>
              </li>
            ))
          }
        </ul>

        <div className="add-wrap">
          <input className='input' type="text" ref={node => {this.input = node}} />
          <button className="add-button" onClick={()=>this._handleAdd()}>+</button>
        </div>
      </div>
    )
  }
}
