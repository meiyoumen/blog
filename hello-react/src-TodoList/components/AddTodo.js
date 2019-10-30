import React, { Component } from 'react';
import { connect } from 'react-redux'
import uuid from 'uuid'

import {addTodo} from '../actions'

class AddTodo extends Component {
  render(){
    const {addTodo} = this.props
    return(
      <div>
        <form action=""
          onSubmit={e => {
            e.preventDefault()
            if (!this.input.value.trim()) return
            addTodo(uuid(), this.input.value)
            this.input.value = ''
          }}
        >
          <input type="text" ref={node => {this.input = node}} />
          <button type="submit">添加</button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => (
  {
    addTodo: (id, text) => {
      dispatch(addTodo(id, text))
    }
  }
)

export default connect(()=> ({}), mapDispatchToProps)(AddTodo)