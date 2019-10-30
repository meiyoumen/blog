import React, {Component} from 'react'
import View from './View.js'
import Edit from './Edit.js'

/**
 * react 组件通信
 */
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: 'React',
      authorName: 'Test',
      createAt: `${Date.now()}`
    }
  }

  // 接收子组件传递过来的消息
  handlerChange(newTitle, newAuthorName, newCreateAt) {
    this.setState({
      title: newTitle,
      authorName: newAuthorName,
      createAt: newCreateAt
    })
  }

  render() {
    return (
      <div>
        <View {...this.state} />

        <hr/>
        <Edit {...this.state}
              handlerChange={(newTitle, newAuthorName, newCreateAt) => this.handlerChange(newTitle, newAuthorName, newCreateAt)}/>
      </div>
    )
  }
}
