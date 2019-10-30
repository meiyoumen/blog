import React, {Component} from 'react'

/**
 * 插入HTML
 * dangerouslySetInnerHTML  需要考虑xss攻击
 */
export default class InnerHtml extends Component{
  constructor(){
    super()
    this.state = {
      html: '<h1>Markdown</h1>'
    }
  }
  render(){
    return(
      <div>
        <div dangerouslySetInnerHTML={
          {__html: this.state.html}
        }></div>
      </div>
    )
  }
}
