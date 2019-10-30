import React, {Component} from 'react'
import axios from 'axios'

export default class AppAjax extends Component{
  constructor(props){
    super()
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    /**
     * axios采⽤了类似中间件的概念，允许请求发起前和响应处理前处理数据
     * ransformRequest :请求前处理数据
     * transformResponse : then前处理数据
     */
    let myAxios = axios.create({
      baseURL: 'http://jsonplaceholder.typicode.com',
      headers: {
        'content-type': 'application/json'
      },
      // 把原来默认处理方式覆盖掉
      transformResponse: [
        response => {
          return JSON.parse(response)
        }
      ],
      transformRequest: [
        data=>{
          console.log(data)
         // data.userId = 1
          return JSON.stringify(data)
        }
      ]
    })

    myAxios.get('/todos', {}).then(res => {
      console.log(res)
      if (res.data && res.data.length) {
        this.setState({
          list: res.data
        })
      }
    })

    myAxios.post('/posts', {
      title: 'foo',
      body: 'bar'
    }).then(res => {
      console.log(res)
    })

  }

  render(){
    let {list} = this.state
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
