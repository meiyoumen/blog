import React, {Component} from 'react'

export default class Test extends Component {
  // 生命周期： 构造函数
  constructor(props){
    super(props)
    console.log('constructor')
    this.state = {
      time: +Date.now()
    }
  }

  tick() {
    this.setState({
      time: +Date.now()
    })
  }

  // 生命周期： 组件将要加载
  componentWillMount() {
    console.log('组件将要加载 componentWillMount')

    // 设置定时器
    this.timeId = setInterval(() => this.tick(), 1000)

    // 一般在这里去请求ajax 或者在 componentWillUpdate
  }

  // 生命周期： 组件已经加载
  componentDidMount() {
    console.log('组件已经加载 componentDidMount')
  }

  // 生命周期（父）： 组件将要接收参数
  componentWillReceiveProps(){
    // 更新生命周期
    console.log('组件将要接收参数 componentWillReceiveProps')
  }

  // 生命周期（父）： 组件是否应该更新
  shouldComponentUpdate(){
    console.log('组件是否应该更新 shouldComponentUpdate')
    return true // 返回true 生命周期继续执行, false生命周期结束
  }

  // 生命周期（父）： 组件将要更新
  componentWillUpdate(){
    console.log('组件将要更新 componentWillUpdate')
  }


  // 生命周期（子父）： 组件已更新完毕
  componentDidUpdate() {
    console.log('组件已更新完毕 componentDidUpdate')
  }

  // 生命周期： 组件将要卸载
  componentWillUnmount(){
    console.log('组件将要卸载 componentWillUnmount')
    clearInterval(this.timeId)
  }

  // 生命周期： 渲染
  render(){
    console.log('render')
    return(
      <div style={{border: "1px solid black"}}>
        <button type="button" onClick={()=> this.setState({})}>setState</button>
        <button type="button" onClick={()=> this.forceUpdate()}>forceUpdate</button>
      </div>
    )
  }
}
