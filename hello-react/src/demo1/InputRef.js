import React, {Component} from 'react'

/**
 * 非受控组件，通过refs 操作dom
 * 不受状态控制
 */
export default class InputRef extends Component{
  add () {
    console.log(this.refs)
    let a = parseInt(this.refs.a.value || 0)
    let b = parseInt(this.refs.b.value || 0)
    this.refs.result.value = a + b
  }

  /**
   * 类中的一个属性叫submit，它的值是一个方法。并不是直接定义一个方法
   * 写法的好处就是不用在constructor里初始化属性
   *
   * constructor() {
        super()
        this.submit = () => {}
     }
   *
   */
  submit = () => {
    console.log(this.input.value)
  }

  render(){
    return(
      <div>
       <div>
         <input ref="a" type="text" onClick={()=> this.add()}/>
         <input ref="b" type="text" onClick={()=> this.add()}/>
         <input ref="result" type="text"/>
       </div>

        <div>
          <input type="text" ref={node => {
            // ref接受一个函数作为参数， 并且向其传递真实 dom
            console.log('input')
            this.input = node // dom 传递给this.input 保存起来， 使用的时候直接this.input.value
          }}/>

          <button onClick={this.submit}>提交</button>
        </div>
      </div>
    )
  }
}
