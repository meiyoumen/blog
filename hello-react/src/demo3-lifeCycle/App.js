import React, {Component} from 'react'
import Test from './Test'
import Demo from './Demo17Life'

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
        <div style={{border: "1px solid #ccc", marginBottom: "10px"}}>
          {this.state.isRenderTest ? <Demo/> : "不渲染 Demo"}
        </div>

        <div style={{border:"1px solid #ccc"}}>
          <button type="button" onClick={()=>this.setState({isRenderTest: !this.state.isRenderTest})}>切换Test渲染</button>

          <h5>App</h5>
          <button type="button" onClick={()=>this.setState({})}>App setState</button>
        </div>
      </div>
    )
  }
}
