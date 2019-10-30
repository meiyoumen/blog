import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Prompt
} from 'react-router-dom'

/**
 * 1 自由定义路由
 * 2 遍历路由
 * 3 表单输入阻止跳转
 */

/**
 * 自定义路由 封装
 * 高阶组件
 */
class CustomLink extends Component{
  render() {
    const {to, label} = this.props
    return(
      <Route path={to} exact children={(routerProps) => {
        console.log(routerProps)
        let isActive = routerProps.match ? true : false
        return <Link to={to} style={{color: isActive ? 'red' : 'black'}}>{label}</Link>
      }}></Route>
    )
  }
}

class Detail extends Component{
  render(){
    console.log(this.props)
    return(
      <div>
        <h5>这是详情页</h5>
        <div>Name: {this.props.match.params.name}  ID: {this.props.match.params.id}</div>
      </div>
    )
  }
}

class News extends Component{
  render(){
    return(
      <div>新闻</div>
    )
  }
}

class Music extends Component{
  render(){
    return(
      <div>音乐</div>
    )
  }
}

/**
 * 表单跳转阻止
 * 1. Prompt (推荐)
 * 2. history.block
 */
class Form extends Component{
  // 初始化state
  state = {
    value: ''
  }

  render(){
    let {value} = this.state
    const {history} = this.props
    if(value){
      value && history.block('这是一个提示信息！')
    }
    // 页面跳转时，弹出对话框
    return(
      <div>
       {/* <Prompt
          when = {value ? true : false}
          message={"你即将过1个亿"}
        ></Prompt>*/}
        <input type="text" value={value}
               onInput={(e) => {
                  this.setState({
                    value: e.target.value
                  })
               }}
               onChange={() => {}}
        />
      </div>
    )
  }
}


// 遍历路由
const routers = [
  {
    path: '/news',
    exact: true,
    component:News
  },
  {
    path: '/music',
    exact: true,
    component: Music
  },
  {
    path: '/form',
    exact: true,
    component: Form
  }
]

export default class App extends Component{
  render() {
    return(
      <Router>
        <div>
          <ul style={{border: "1px solid #ccc", marginBottom: "20px"}}>
            <li>
              <Route path={"/"} exact children={(routerProps) => {
                console.log(1, routerProps)
                let isActive = routerProps.match ? true : false
                return <Link to={"/"} style={{color: isActive ? 'red' : 'black'}}>首页</Link>
              }}></Route>
            </li>

            <li>
              <Route path={"/blog"} exact children = {(routerProps) => {
                console.log(2, routerProps)
                let isActive = routerProps.match ? true : false
                return <Link to={"/blog"} style={{color: isActive ? 'red' : 'black'}}>博客</Link>
              }}></Route>
            </li>
            <li>
              <Link to="/detail/react/123">详情</Link>
            </li>
          </ul>

          <ul style={{border: "1px solid #ccc", marginBottom: "20px"}}>
            <li><CustomLink to={"/"} label={"首页"}></CustomLink></li>
            <li><CustomLink to={"/blog"} label={"博客"}></CustomLink></li>
            <li><CustomLink to={"/news"} label={"新闻"}></CustomLink></li>
            <li><CustomLink to={"/music"} label={"音乐"}></CustomLink></li>
            <li><CustomLink to={"/form"} label={"表单"}></CustomLink></li>
          </ul>

          <div style={{border: "1px solid #ccc", marginBottom: "20px"}}>
            <Route path={"/"} exact render={() => <div>首页</div>}></Route>
            <Route path={"/blog"} exact render={() => <div>博客</div>}></Route>
            <Route path={'/detail/:name/:id'}  component={Detail} />
            {
              routers.map((v, k)=> {
                return <Route key={k} path={v.path} exact={v.exact} component={v.component}></Route>
              })
            }
          </div>
        </div>
      </Router>
    )
  }
}
