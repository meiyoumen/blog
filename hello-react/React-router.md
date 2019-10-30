[TOC]
# Router
## 路路由组件说明

简要说明：
- react-router: 实现了路由的核心功能
- react-router-dom: 基于react-router，加入了在浏览器运行环境下的一些功能，例如：Link组件，会渲染一个a标签，Link组件源码a标签行; BrowserRouter和HashRouter 组件，前者使用pushState和popState事件构建路由，后者使用window.location.hash和hashchange事件构建路由。
- react-router-native: 基于react-router，类似react-router-dom，加入了react-native运行环境下的一些功能。


`react-router-dom` 依赖 `react-router`，所以我们使用npm安装依赖的时候，只需要安装相应环境下的库即可，不用再显式安装react-router。

- 基于浏览器环境的开发，只需要安装 `react-router-dom`；
- 基于react-native环境的开发，只需要安装react-router-native。

npm会自动解析 `react-router-dom` 包中package.json的依赖并安装。   

## react-router-dom 模块

组件   |   功能说明   |    常用属性
---|---|---
Link           |    路路由跳转，是router中的“超链接”     | to
BrowserRouter  |    整体容器器，提供路路由封装           |
Route          |    一个接受路路由的组件，和Link配合使用 | path | component | render | exact
Switch         | 路由自动切换组件                        | 
Redirect       | 路路由重定向组件                        | from | to
Prompt         | 确认框组件                              | when | message


### BrowserRouter - 整体路路由容器器
引入组件

```
import {BrowserRouter as Router} from ‘react-router-dom’
```
*as 可理理解为 `var Router = BrowserRouter` 为一种别名
==BrowserRouter只能有一个子元素==
```
<Router>
<div>
    <Link to=“/amount”>
    <Route path=“/amount” render={()=><p>Amount</p>}>
    </div>
</Router>
```

### Link - 路路由超链接
`<Link>`会指向对应的 `<Route>`


```
<Link to=“/home” />  匹配！   <Routepath=“/home” component={Amount}/>
<Link to=“/home” />  不匹配！ <Routepath=“/blog” component={Amount}/>
```

### Route - 路路由组件和参数

```
<Route
    component={Home}
    render={()=><div>Home</div>}
    path=“/Home”
    exact
/>
```

属性 | 说明  | 要求的类型
---|---|---
component  |  此路路由渲染的组件                       | react.Component
render     |  此路路由渲染的组件                       | function
path       |  路路由组件的路路径，和Link的to属性对应   | string
exact      |  是否严格匹配                             | boolean

==`render`和`component`  二选一即可==

#### exact严格匹配属性说明
例子
在跳转到/a/b路路径时，/a也会满⾜足匹配条件⽽而被匹配到
```
<Link to=“/a/b” >Home</Link>
<Route path=“/a” />
<Route path=“/a/b” />
```
path |  实际路路径 | exact  |   是否匹配
---|---|---|---
/a | /a/b | true  | 否
/a | /a/b | false | 是


### Redirect 前端重定向

```
<Redirect from=“/old” to=“/new” />  /old 路路由被重定向到 /new路路由中
```

### Prompt 弹窗提示
```
<Prompt  when={true} message={‘是否要跳转？’}/>
```


### router props 路路由参数 
在router中，路路由参数的传递统⼀一为router props的形式

例例如：`<Route component={Home} />`
在Home组件的this.props中携带三个对象：`match`、`location`、`history`

参数说明

参数名称 |  作用
---|---
match    | 携带匹配结果及url参数
location | 匹配url的解析结果
history  | 历史记录操作的封装


### router props之match

match携带路路由的匹配信息

属性  |  类型 | 说明   | 示例
---|---|---|---
isExact | boolean | 是否为严格匹配  |  true
params  | object  | 路路由携带参数  | { id : “lamp” }
path    | string Route中定义的路路径| /detail/:id
url     | string 当前的实际路路径   | /detail/lamp

## Demo
```js
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

```

## 参考
- https://react-guide.github.io/react-router-cn/index.html
- https://github.com/ReactTraining/react-router
