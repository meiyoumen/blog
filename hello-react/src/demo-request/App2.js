import React, {Component} from 'react'
import $ from 'jquery'

export default class AppAjax extends Component{
  constructor(props){
    super()
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    // $.ajax({
    //   method: 'get',
    //   url: 'http://jsonplaceholder.typicode.com/todos'
    // }).then(res => {
    //   // 注意this
    //   console.log(res)
    //   this.setState({
    //     list: res
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })

    fetch('http://jsonplaceholder.typicode.com/todos', {
      method: 'get',
      credentials: 'include'
    }).then(res => {
      return res.json()
    }).then(json => {
      this.setState({
        list: json
      })
    }).catch(err => {
      console.log(err)
    })

    /**
     * fetch结合Headers和Request
     */

    // api list
    let getTodos = new Request(
      'http://jsonplaceholder.typicode.com/todos',
      {
        method: 'get',
        credentials: 'include'
      }
    )

    let getNames = new Request(
      'http://jsonplaceholder.typicode.com/todos',
      {
        method: 'get',
        credentials: 'include'
      }
    )

    // 设置请求头
    let jsonHeaders = new Headers()
    jsonHeaders.set('content-type', 'application/json')

    let formHeaders = new Headers()
    formHeaders.set('content-type', 'x-www-form....')

    fetch(getTodos, {
      headers: jsonHeaders
    }).then(res => {
      console.log('res', res)
      return res.json()
    }).then(json => {
      console.log('json', json)
    })
  }

  render(){
    var {list} = this.state
    return(
      <div className="App">
        {
          list.map((v, k) => (
            <li key={k}> {v.title} </li>
          ))
        }
      </div>
    )
  }
}