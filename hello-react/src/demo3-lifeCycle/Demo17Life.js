import React, {Component} from 'react'

/**
 * react 17版本新生命周期
 * 1. 定时器应该在constructor里执行
 * 2. 移除定时还是放在 componentWillUnmount
 */

export default class Demo extends Component {

  // 生命周期-初始化
  constructor(props) {
    super(props)
    this.state= {
      isRender: true
    }
  }

  // 会被多方执行，不能放定时器等
  static getDerivedStateFromProps(nextProps, prevState){
    console.log('静态生命周期函数')

    // 返回结果将会被添加到state 添加/更新state内容
    // 返回null 不需要任何更新
    return {
      like: true
    }
  }

  /**
   * return的结果将会传给 componentDidUpdate
   */
  getSnapshotBeforeUpdate(){
    console.log('获取快照')
    return 'from'
  }

  render(){
    console.log('render')
    return(
      <div>
        <p>Demo</p>
        <button type="button" onClick={()=>this.setState({})} >setState</button>
      </div>
    )
  }

  // 生命周期： 组件已经加载
  componentDidMount(){
    console.log('组件已经加载 componentDidMount')
  }

  // 生命周期（父）： 组件是否应该更新
  shouldComponentUpdate(){
    console.log('组件是否应该更新 shouldComponentUpdate')
    return true // 返回true 生命周期继续执行, false生命周期结束
  }


  // 生命周期（父）： 组件已更新完毕
  // 将过接收getSnapshotBeforeUpdate传递过来的信息
  componentDidUpdate(prevProps, prevState, info){
    console.log('componentDidUpdate 组件已更新完毕')
    console.log(info)
  }

  // 生命周期： 组件将要卸载
  componentWillUnmount(){
    console.log('componentWillUnmount 组件将要卸载')
  }

}
