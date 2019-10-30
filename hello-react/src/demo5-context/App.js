import React, {Component} from 'react'

import PropTypes from 'prop-types' // 类型检查

class Title extends Component {
  // 类型检查
  static contextTypes = {
    title: PropTypes.string
  }

  render(){
    console.log(this.props)
    console.log(this.context)
    return(
      <div>
        <p>{this.context.title}</p>
      </div>
    )
  }
}

class Demo extends Component{
  static contextTypes = {
    title: PropTypes.string
  }
  render(){
    return(
      <Title></Title>
    )
  }
}

/**
 * 对于父组件，也就是 `Context`生产者，只需要2件事：
 - 需要通过一个静态属性 ==`childContextTypes`== 声明提供给子组件的 `Context` 对象的属性
 - 并实现一个实例 ==`getChildContext` 方法==，返回一个代表`Context`的纯对象 (plain object)
 */

export default class App extends React.Component  {
  // 声明Context对象属性
  static childContextTypes = {
    title: PropTypes.string
  }

  // 返回Context对象，方法名是约定好的
  getChildContext(){
    return {
      title: '大标题'
    }
  }

  render(){
    return(
      <div>
        <h5>App</h5>
        <Demo title="ABC"></Demo>
      </div>
    )
  }
}
