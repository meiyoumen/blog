import React, {Component} from 'react';
import {connect} from 'react-redux'

import {switchFilter} from '../actions'

class Link extends Component {
  render() {
    const {filter, switchFilter} = this.props
    return (
      <a href="#" onClick={
        (e) => {
          e.preventDefault()
          switchFilter(filter)
        }
      }
      >{filter}</a>
    )
  }
}


Link = connect(() => ({}), (dispatch) => (
  {
    switchFilter: (filter) => {
      dispatch(switchFilter(filter))
    }
  }
))(Link)

class FilterLink extends Component {
  render() {
    return (
      <div>
        filter :
        <Link filter={'all'}></Link>
        {' '}
        <Link filter={'doing'}></Link>
        {' '}
        <Link filter={'done'}></Link>
      </div>
    )
  }
}

export default connect()(FilterLink)