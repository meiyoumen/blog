import React, {Component} from 'react'

import PropTypes from 'prop-types' // 类型检查

class Title extends Component {
  // 默认对象属性
  static defaultProps = {
    title: '这个默认的标题'
  }

  // 类型检查
  static propTypes = {
    title: PropTypes.string.isRequired,
    title2: PropTypes.string
  }

  render(){
    return(
      <div>
        <p>{this.props.title}</p>
        <p>{this.props.title2}</p>
      </div>
    )
  }
}

export default class App extends React.Component  {
  constructor(props){
    super(props)
    this.state = {
      isRenderTest: true
    }
  }

  render(){
    return(
      <div>
        <h5>App</h5>
        <Title title={0} title2="这是一个标题"></Title>
      </div>
    )
  }
}
