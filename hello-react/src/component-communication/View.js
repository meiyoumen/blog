import React , {Component} from 'react'

export default class View extends Component{
  render(){
    const { title, authorName, createAt } = this.props

    return (
      <div>
        <h1>{title}</h1>
        <p>
          {authorName} | {createAt}
        </p>
      </div>
    )
  }
}
