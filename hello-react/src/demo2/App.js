import React, {Component} from 'react'

/**
 * 每个组件只维护自己的state，难以去修改别的组件的state
 * 状态提升：将组件的状态提升到共同父组件中，然后级件共享父组件的状态
 */
class Button extends Component{
  constructor(props){
    // props 父组件
    super(props)
    console.log(props)
    console.log(props.themeColor)
  }

  render(){
    let themeColor = this.props.themeColor
    return(
      <div style={{color: themeColor}}>
        <button style={{color: themeColor}} onClick={()=> this.props.handleClick('red')}>红色</button>
        <button style={{color: themeColor}} onClick={()=> this.props.handleClick('green')}>绿色</button>
      </div>
    )
  }
}

class Title extends Component{
  render(){
    return(
      <h2>标题</h2>
    )
  }
}

export default class App extends React.Component  {
  constructor(){
    super()

    this.state = {
      themeColor: 'red'
    }
  }

  handleClick(color){
    console.log(color)

    this.setState({
      themeColor: color
    })
  }
  render(){
    // 将handleClick传给button组件
    return(
      <div>
        <h5>App</h5>
        <Title helloName={'App Name'} themeColor={this.state.themeColor}></Title>
        <Button themeColor={this.state.themeColor}  handleClick={(color)=>this.handleClick(color)}></Button>
      </div>
    )
  }
}
