import React, {Component} from 'react'

export default class Link extends Component{
  state ={
    active: false
  }

  render() {
    const {label} = this.props

    return(
      <div onClick={() => this.setState({active: true})} className={this.state.active ? 'active': ''}>
        {
          label
        }
      </div>
    )
  }
}
