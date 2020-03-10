[TOC]
# 目录
## 脚手架
```
npm i -g create-react-app
create-react-app hello-react
```
生成目录
```js
hello-react/
    README.md       解释文件：对这个项目的描述、运行行方式等
    node_modules/
    package.json   脚手架文件
    public/        静态目录，存放静态文件
    index.html
    favicon.ico
    src/
    App.css
    App.js        React源代码，主要编辑文件
    App.test.js
    index.css
    index.js
    logo.svg
```

## 初步解读React语法和结构
1. import … from … 关键字
2. class和extends关键字
3. render函数
4. export语法
5. JSX语法和细则


### import … from …
引入其他组件/资源
类似于CommandJS中的require，但这是ES6标准实现的

```
import React, { Component } from ‘react’   // 引入React及其Component
import logo from './logo.svg'              // 引入React logo（图像资源）
import './App.css'                         // 引入APP.css（css资源）
```

### class 和 extends 关键字
ES6中 类和继承的表达方式


```js
// es6
class App extends Component{
    render(){}
}

// es5
var App = function(){
this.render = function(){}}
App.prototype = new Component()
```


### render函数
用于将JSX渲染DOM到页面中
1. 在React组件（类）中是必须要实现的
2. render函数只在state改变后触发


```
import React, {Component} from 'react'
export default class InnerHtml extends Component{
  constructor(){
    super()
  }
  render(){
    return(
      <div>Hello</div>
    )
  }
}
```


### export语法
类似于Node中的exports，组件式开发的基础
变量量引出给其他组件使用

```js
export default class InnerHtml extends Component{}
```

### JSX语法和细则
因为JSX是使用HTML风格书写的JS，需要注意兼容问题

#### JSX标签属性说明

HTML标签属性  | JSX  |  原因
---|---|---
for   | htmlFor | for 在JS中为for循环关键字
class | className | class 在JS中为声明类关键字
style | 需使用JS对象 style= {{border: "1px"}} | 


#### JSX中执行行JS代码：{ }
一个`{ }`中只能执行一行JS语句句
e.g.
```
<div>{xiaoming.sex ? “男”:“⼥女女”}</div>

<div>
    {
        history.map((v,k)=><p></p>)
    }
</div>
```

#### JSX中注释：使用{ }
- HTML注释：`<—注释的内容—>`
- JSX注释：`{ /**注释的内容**/}`

#### JSX中必须只有一个根节点

```
// 正确
render(){
    return(
        <div>
        <p></p>
        <img />
    </div>)
}

// 错误
render(){
    return(
        <div>
        <img />
        </div>
        <p></p>
    )
}
```

## 组件开发

src/Nav.js的 `<Nav />`组件 为例例

### 类方式

```js
import React , {Component} from ‘react’;
export default class Nav extends Component{
    constructor(){
    super()
    }
    render(){…}
}
```

### 函数方式
```
export default Nav = (props) => {
    return <div>NavBar</div>
}
```

### 组件引用方式


```
import Nav from ‘./src/Nav’
render(){
return(
    <div>
        <Nav />
    </div>
    )
}
```


### React组件类属性

#### 默认defaultProps
设定默认的 `props`，==在组件没有被传入 `props` 时生效==
```js
//ES6 写法
class Demo extends Component{
    static defaultProps = {
        name : 0  //默认值
    }
}

// 基础写法
Demo.defaultProps = {
    name : 0
}
```
#### 类型检查propTypes
结合第三方 `prop-types` 组件进行行类型检查

```js
import PropTypes from ‘prop-types’
class Demo extends Component{
    static propTypes = {
        themeColor : PropTypes.string
    }
}
```
如果调用时 `<Demo themeColor={0} />` 传入了了错误的类型，则报错 

### 受控组件
> 受状态属性的一值控制

在React中，受控组件功能强大，但是面临过多的表单/结合redux的表单受控会使代码复杂程度急剧上升

受控组件模型
![image](https://note.youdao.com/yws/public/resource/4a0bcf5d1af4d0634e6bdc8bde75dce1/xmlnote/BA53F10A2695466B926C1045A4CE4257/29115)
e.g.
```
import React, {Component} from 'react'

// 受控组件 受状态属性的一值控制
export default class Input extends Component {
  constructor(){
    super()
    this.state = {
      value: ''
    }
  }

  handleInput(e){
    console.log(e.target.value) // html  tag
    console.log(e.nativeEvent)  // 原生事件

    if (e.target.value.length > 10 ) return

    this.setState({
      value: e.target.value
    })
  }

  render(){
    return(
      <input type="text" onChange={(e)=> this.handleInput(e)} value ={this.state.value}/>
    )
  }
}
```
### 非受控组件和ref
在React中，如果能获取到DOM，就可以直接获取input.value，而不用使其受控，
但是方法不不像传统的js，需要使用react提供的API ref。

```
import React, {Component} from 'react'

/**
 * 非受控组件，通过refs 操作dom
 * 不受状态控制
 */
export default class InputRef extends Component{
  add () {
    console.log(this.refs)
    let a = parseInt(this.refs.a.value || 0)
    let b = parseInt(this.refs.b.value || 0)
    this.refs.result.value = a + b
  }

  /**
   * 类中的一个属性叫submit，它的值是一个方法。并不是直接定义一个方法
   * 写法的好处就是不用在constructor里初始化属性
   *
   * constructor() {
        super()
        this.submit = () => {}
     }
   *
   */
  submit = () => {
    console.log(this.input.value)
  }

  render(){
    return(
      <div>
       <div>
         <input ref="a" type="text" onClick={()=> this.add()}/>
         <input ref="b" type="text" onClick={()=> this.add()}/>
         <input ref="result" type="text"/>
       </div>

        <div>
          <input type="text" ref={node => {
            // ref接受一个函数作为参数， 并且向其传递真实 dom
            console.log('input')
            this.input = node // dom 传递给this.input 保存起来， 使用的时候直接this.input.value
          }}/>

          <button onClick={this.submit}>提交</button>
        </div>
      </div>
    )
  }
}

```

### React的innerHTML
因为浏览器器安全（避免XSS攻击），react无法在jsx中直接插入HTML
```
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

```

## 事件监听和处理

### 事件
1. 在jsx中，事件监听的属性为==驼峰式命名==
2. 在jsx中，事件监听指向⼀一个js函数


```
jsx
onClick={()=>this.handleClick()}

html
onclick=“handleClick()”
```

e.g.


```
class Demo extends Component{
    handleClick(){}
    render(){
        <p onClick={()=>this.handleClick()}></p>
    }
}
```
### 在jsx中回调函数的this问题


```
<p onClick={this.handleClick}></p>
// this => <p>
```


jsx的`<p></p>`会被编译为React.createElement，这样会丢失`this`作用域

- 解决方案1： 在constructor中bind绑定组件的this

```js
constructor(){
    this.handleClick.bind(this)
}
handleClick(){}
```

- 解决方案2： 使用 ==箭头函数== 保留留组件this作用域

```
<p onClick={()=>this.handleClick()}></p>
```

### 获取原生标签

```js
handleClick(e){
    e.target //<input />
}

<input onClick={(e)=>this.handleClick(e)} />
```

## state、props、context
React组件的三个属性
- this.state   组件状态
- this.props   组件接受的参数
- this.context 组件接受的上下文


### state 应用状态

1. state只能在组件的constructor中初始化

```js
constructor(){
    this.state = {
        happy : true
    }
}
```

2. state只能使用 ==`setState`== 方法更更新

```js
this.setState({
    happy : false
})
```

3. ==setState会导致render重新执行，渲染组件和子组件==

4. state用在render中渲染jsx

```
render(){
    return(<p> hello !I’m {this.state.happy}</p>)
}
```

### props组件间参数
子组件难免要使用父组件指定的参数

```
import React, {Component} from 'react'

/**
 * 每个组件只维护自己的state，难以去修改别的组件的state
 * 状态提升：将组件的状态提升到共同父组件中，然后级件共享父组件的状态
 */
class Button extends Component{
  constructor(props){
    // props 父组件
    super(props)
    console.log(props)
    console.log(props.themeColor)
  }

  render(){
    let themeColor = this.props.themeColor
    return(
      <div style={{color: themeColor}}>
        <button style={{color: themeColor}} onClick={()=> this.props.handleClick('red')}>红色</button>
        <button style={{color: themeColor}} onClick={()=> this.props.handleClick('green')}>绿色</button>
      </div>
    )
  }
}


export default class App extends React.Component  {
  constructor(){
    super()

    this.state = {
      themeColor: 'red'
    }
  }

  handleClick(color){
    console.log(color)

    this.setState({
      themeColor: color
    })
  }
  render(){
    // 将handleClick传给button组件
    return(
      <div>
        <h5>App</h5
        <Button themeColor={this.state.themeColor}  handleClick={(color)=>this.handleClick(color)}>
            <span>组件的⼦子组件</span>
        </Button>
      </div>
    )
  }
}

```
1. Button组件 `constructor` 中继承父组件的props`props` ：在构造函数需要用 `this.props` 
2. this.props.themeColor 在组件标签中，可以指定一个属性传递给子组件
3. this.props.children ` <span>组件的子组件</span>`, this.props.children是一个特殊的属性，
组件的子组件可以在此获取

### context 上下文参数传递
在主组件中设置context，参数会自动传递

#### context上下文类型检查propTypes
1. 父组件用 `childContextTypes` 静态属性的类型检查，并且在 `getChildContext` 返回子组件需要的`context`
2. 子组件用 contextTypes 静态属性的类型检查

```
import React, {Component} from 'react'

import PropTypes from 'prop-types' // 类型检查

class Title extends Component {
  // 类型检查
  static contextTypes = {
    title: PropTypes.string
  }

  render(){
    console.log(this.props)
    console.log(this.context)
    return(
      <div>
        <p>{this.context.title}</p>
      </div>
    )
  }
}

class Demo extends Component{
  static contextTypes = {
    title: PropTypes.string
  }
  render(){
    return(
      <Title></Title>
    )
  }
}

/**
 * 对于父组件，也就是 `Context`生产者，只需要2件事：
 - 需要通过一个静态属性 ==`childContextTypes`== 声明提供给子组件的 `Context` 对象的属性
 - 并实现一个实例 ==`getChildContext` 方法==，返回一个代表`Context`的纯对象 (plain object)
 */
export default class App extends React.Component  {
  // 声明Context对象属性
  static childContextTypes = {
    title: PropTypes.string
  }

  // 返回Context对象，方法名是约定好的
  getChildContext(){
    return {
      title: '大标题'
    }
  }

  render(){
    return(
      <div>
        <h5>App</h5>
        <Demo title="ABC"></Demo>
      </div>
    )
  }
}
```

## 组件通信

### 状态提升

问题：
在每个组件中可以通过 `setState` 去修改组件状态，==但是如何修改别的组件的 `state` 呢==？

onClick改变Title的颜色？
```
<App />
    <Title />
    <p style={{color:’red’}}>标题</p>
    <Button onClick={() => this.changeColor()} />
```

每个组件维护自己的state，难以去修改别的组件的state
![image](https://note.youdao.com/yws/public/resource/4a0bcf5d1af4d0634e6bdc8bde75dce1/xmlnote/ED069D657CB24958A3EB83072C5396CD/29063)


状态提升：将组件的状态提升到共同的父组件中，==然后组件共享父组件的状态==

![image](https://note.youdao.com/yws/public/resource/4a0bcf5d1af4d0634e6bdc8bde75dce1/xmlnote/CBA2733B490C4137A15B76FA77004344/29065)


```
import React, {Component} from 'react'

/**
 * 每个组件只维护自己的state，难以去修改别的组件的state
 * 状态提升：将组件的状态提升到共同父组件中，然后级件共享父组件的状态
 */
 
 // 子组件 Button
class Button extends Component{
  constructor(props){
    // props 父组件 props
    super(props)
  }

  render(){
    let themeColor = this.props.themeColor
    // onClick={()=> this.props.handleClick('red')} 执行父组件中的handleClick方法
    return(
      <div style={{color: themeColor}}>
        <button style={{color: themeColor}} onClick={()=> this.props.handleClick('red')}>红色</button>
        <button style={{color: themeColor}} onClick={()=> this.props.handleClick('green')}>绿色</button>
      </div>
    )
  }
}

// 子组件Title
class Title extends Component{
  render(){
    return(
      <h2>标题</h2>
    )
  }
}

// 父组件App
export default class App extends React.Component  {
  constructor(){
    super()
    this.state = {
      themeColor: 'red'
    }
  }

  handleClick(color){
    this.setState({
      themeColor: color
    })
  }
  render(){
    // 将handleClick传给button组件
    return(
      <div>
        <h5>App</h5>
        <Title helloName={'App Name'} themeColor={this.state.themeColor}></Title>
        <Button themeColor={this.state.themeColor}  handleClick={(color)=>this.handleClick(color)}></Button>
      </div>
    )
  }
}
```

在Button组件中 `onClick={()=> this.props.handleClick('red')}` 执行父组件中的handleClick方法

### 通过事件传递

App.js
```
import React, {Component} from 'react'
import View from './View.js'
import Edit from './Edit.js'

/**
 * react 组件通信
 */
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: 'React',
      authorName: 'Test',
      createAt: `${Date.now()}`
    }
  }

  // 接收子组件传递过来的消息
  handlerChange(newTitle, newAuthorName, newCreateAt) {
    this.setState({
      title: newTitle,
      authorName: newAuthorName,
      createAt: newCreateAt
    })
  }

  render() {
    return (
      <div>
        <View {...this.state} />

        <hr/>
        <Edit {...this.state}
              handlerChange={(newTitle, newAuthorName, newCreateAt) => this.handlerChange(newTitle, newAuthorName, newCreateAt)}/>
      </div>
    )
  }
}
```

Edit.js
```
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

```
View.js

```
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

```



## 生命周期
![image](https://user-gold-cdn.xitu.io/2018/6/23/1642cca46deb8072?imageslim)

## React测试方法/工具

方式    |    意义    |     工具
---|---|----
快照测试  |  渲染结果生成dom字符串，观察分析结果是否符合预期     |  react-testing-renderer
DOM测试   |  渲染真实dom树，拥有真实的生命周期                   |  react-testing-library enzyme
浅层测试  |  只渲染一层虚拟dom，可以 模拟事件                    | enzyme

==快照测试对我们来说意义不不大==, 而DOM测试和浅层测试都可以使用 `enzyme` 运行

### enzyme

```
npm i enzyme --dev
```

```
import {shallow, render, mount} from 'enzyme'
```

- shallow  浅层渲染, 只渲染一层DOM，其子元素渲染为字符串串
- render   字符串串渲染, 使用cheerio将DOM渲染为字符串串
- mount    DOM渲染， 将组件渲染为真实DOM


### 如何编写测试
React中已经集成了了Jest测试，并集成在npm命令中

npm命令会运行行所有 `src/***.test.js` 文件，
或者` __test__ ` 目录下的 `***.test.js` 文件