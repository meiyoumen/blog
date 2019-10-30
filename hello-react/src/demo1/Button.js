import React, {Component} from 'react'

export default class Button extends Component{
  constructor(){
    super()
    this.state = {
      list: [
        {id:1, name: 'xxxx1'},
        {id:2, name: 'xxxx2'}
      ],
      buttonName: 'MyButton'
    }
  }


  render(){
    return(
      <button title={this.state.buttonName} type="button">来自Button组件</button>
    )
  }
}
