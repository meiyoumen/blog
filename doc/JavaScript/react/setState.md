# React 中 setState 什么时候是同步的，什么时候是异步的？
在React中，==如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state==，除此之外的setState调用会同步执行this.state。

所谓“除此之外”，指的是绕过React
- 通过addEventListener直接添加的事件处理函数
- 还有通过setTimeout/setInterval产生的异步调用。

**原因：** 在React的setState函数实现中，会根据一个变量 `isBatchingUpdates` 判断是直接更新 `this.state` 还是放到队列中回头再说。

==而`isBatchingUpdates`默认是false，也就表示 `setState` 会同步更新`this.state`。==

但是，有一个函数`batchedUpdates`，==这个函数会把 `isBatchingUpdates` 修改为true，而当React在调用事件处理函数之前就会调用这个`batchedUpdates`==。

造成的后果，就是由React控制的事件处理过程setState不会同步更新this.state。

# demo
React 是通过管理状态来实现对组件的管理，即使用 this.state 获取 state，通过 this.setState() 来更新 state，当使用 this.setState() 时，React 会调用 render 方法来重新渲染 UI。


```js
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```
答案是： 0	0	2	3，你做对了吗？


==因为在 `componentDidMount` 中调用 `setState` 时，batchingStrategy 的 isBatchingUpdates 已经被设为 true==，所以两次 setState 的结果并没有立即生效，而是被放进了 dirtyComponents 中。

这也解释了两次打印this.state.val 都是 0 的原因，新的 state 还没有被应用到组件中。


再反观 `setTimeout` 中的两次 `setState`，因为没有前置的 batchedUpdate 调用，所以 `batchingStrategy` 的 `isBatchingUpdates` 标志位是 `false`，也就导致了新的 state 马上生效，没有走到 dirtyComponents 分支。

也就是，setTimeout 中第一次 setState 时，this.state.val 为 1，而 setState 完成后打印时 this.state.val 变成了 2。第二次 setState 同理。

在上文介绍 Transaction 时也提到了其在 React 源码中的多处应用，想必调试过 React 源码的同学应该能经常见到它的身影，像 initialize、perform、close、closeAll、notifyAll 等方法出现在调用栈里时，都说明当前处于一个 Transaction 中。

既然事务那么有用，那我们可以用它吗？

答案是不能，但在 React 15.0 之前的版本中还是为开发者提供了 batchedUpdates 方法，它可以解决针对一开始例子中 setTimeout 里的两次 setState 导致 rendor 的情况：


```
import ReactDom, { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  this.setState(val: this.state.val + 1);
  this.setState(val: this.state.val + 1);
});
```

在 React 15.0 之后的版本已经将 `batchedUpdates` 彻底移除了，所以，不再建议使用。


react-hooks时代已经没这个东西了,而且第一个例子用react-hooks写的话,得到的结果都是0,而不是0 0 2 3,


```js
import React, {useEffect, useState} from 'react';

const ComponentTwo = () => {
    const [val, setVal] = useState(0);

    useEffect(() => {
        setVal(val+1);
        console.log(val);
        setVal(val+1);
        console.log(val);
        setVal(val+1);
        console.log(val);
        setTimeout(() => {
            console.log(val);
            setVal(val+1);
            console.log(val);
            setVal(val+1);
            console.log(val);
        }, 0)
    }, []);
    return null
};

export default ComponentTwo;
```

# setState 异步更新
setState 通过一个==队列机制==来实现 state 更新，当执行 setState() 时，会将需要更新的 state 浅合并后放入 状态队列，而不会立即更新 state，队列机制可以高效的==批量更新== state。

而如果不通过setState，直接修改this.state 的值，则不会放入状态队列，当下一次调用 setState 对状态队列进行合并时，之前对 this.state 的修改将会被忽略，造成无法预知的错误。

==React通过状态队列机制实现了 setState 的异步更新，避免重复的更新 state。==

```
setState(nextState, callback)
```

在 setState 官方文档中介绍：将 nextState 浅合并到当前 state。这是在事件处理函数和服务器请求回调函数中触发 UI 更新的主要方法。不保证 setState 调用会同步执行，考虑到性能问题，可能会对多次调用作批处理。

举个例子：


```js
// 假设 state.count === 0
this.setState({count: state.count + 1});
this.setState({count: state.count + 1});
this.setState({count: state.count + 1});
// state.count === 1, 而不是 3
```


本质上等同于：
```js
// 假设 state.count === 0
Object.assign(state,
              {count: state.count + 1},
              {count: state.count + 1},
              {count: state.count + 1}
             )
// {count: 1}
```

但是如何解决这个问题喃，在文档中有提到：

也可以传递一个签名为 `function(state, props) => newState` 的函数作为参数。

这会将一个原子性的更新操作加入更新队列，在设置任何值之前，此操作会查询前一刻的 state 和 props。...setState() 并不会立即改变 this.state ，而是会创建一个待执行的变动。

调用此方法后访问 this.state 有可能会得到当前已存在的 state（译注：指 state 尚未来得及改变）。

即使用 setState() 的第二种形式：以一个函数而不是对象作为参数，此函数的第一个参数是前一刻的state，第二个参数是 state 更新执行瞬间的 props。


```js
// 正确用法
this.setState((prevState, props) => ({
    count: prevState.count + props.increment
}))
```


这种函数式 setState() 工作机制类似：

```js
[
    {increment: 1},
    {increment: 1},
    {increment: 1}
].reduce((prevState, props) => ({
    count: prevState.count + props.increment
}), {count: 0})
// {count: 3}
```

关键点在于更新函数（updater function）：


```js
(prevState, props) => ({
  count: prevState.count + props.increment
})
```

这基本上就是个 reducer，其中 prevState 类似于一个累加器（accumulator），而 props 则像是新的数据源。  
类似于 Redux 中的 reducers，你可以使用任何标准的 reduce 工具库对该函数进行 reduce（包括 `Array.prototype.reduce()`）。  

同样类似于 Redux，reducer 应该是 纯函数 。

> 注意：企图直接修改 prevState 通常都是初学者困惑的根源。

相关源码：

```js
// 将新的 state 合并到状态队列
var nextState = this._processPendingState(nextProps, nextContext)

// 根据更新队列和 shouldComponentUpdate 的状态来判断是否需要更新组件
var shouldUpdate = this._pendingForceUpdate ||
    !inst.shouldComponentUpdate ||
    inst.shouldComponentUpdate(nextProps, nextState, nextContext)
```



原文：https://github.com/sisterAn/blog/issues/26