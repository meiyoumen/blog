import React , {Component} from 'react'
import Button from './Button'
import Input from './Input'
import InputRef from './InputRef'
import InnerHtml from './InnerHtml'
// 自定义组件大写开头

// 1 类的方式
class Nav extends Component{
  constructor() {
    super()
  }
  render(){
    return(
      <div style={{color: "white", backgroundColor: "black"}}>Skipper</div>
    )
  }
}

// 2 函数方式
// const Button = function () {
//   return (
//     <button type="button">来自Button组件</button>
//   )
// }
class App extends React.Component{
  constructor() {
    super()

    this.state = {
      name: 'Heello react',
      like: false
    }
  }

  hnadClick(){
    // 改变状态, 会触发render
    this.setState({
      like: !this.state.like
    })
  }

  getName (name) {
    console.log('1111', name)
  }

  render(){
    return(
      <div>
        <div style={{border: "1px solid #ccc", marginBottom: "30px"}}>
          <h1>{this.state.name}</h1>
          <Nav />
          <Button />
          <button type="button" style={this.state.like ? {color: "red"} : {color: "blue"}} onClick={()=> this.hnadClick()}>
            {this.state.like ? "已赞" : "喜欢"}
          </button>

          <button type="button"  onClick={()=> this.getName('hello namv')}> Name </button>
        </div>


        <div style={{border: "1px solid #ccc", marginBottom: "30px"}}>
          非受控组件
          <Input/>
        </div>


        <div style={{border: "1px solid #ccc", marginBottom: "30px"}}>
          非受控组件
          <InputRef></InputRef>
        </div>

        <div style={{border: "1px solid #ccc", marginBottom: "30px"}}>
          <InnerHtml></InnerHtml>
        </div>
      </div>
    )
  }
}

export default App
