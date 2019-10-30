import React from 'react'
import PropTypes from 'prop-types'

export default class Edit extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    createAt: PropTypes.string.isRequired,
    handlerChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    // 使用了非受控组件
    this.titleInput = React.createRef()
    this.authorNameInput = React.createRef()
    this.createAtInput = React.createRef()
  }

  change(event) {
   // event.preventDefault()
    let newTitle = this.titleInput.current.value
    let newAuthorName = this.authorNameInput.current.value
    let newCreateAt = this.createAtInput.current.value

    // 调用父组件handlerChange方法修改 state
    this.props.handlerChange(newTitle, newAuthorName, newCreateAt)
  }

  render () {
    const { title, authorName, createAt } = this.props
    return (
      <form>
        <div><input type="text" defaultValue={title}      name="title"      ref={this.titleInput} /></div>
        <div><input type="text" defaultValue={authorName} name="authorName" ref={this.authorNameInput} /></div>
        <div><input type="text" defaultValue={createAt}   name="createAt"   ref={this.createAtInput} /></div>
        <button type="button"  onClick={() => {this.change()}}>修改</button>
      </form>
    );
  }
}
