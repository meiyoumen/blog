文章主要包含两大部分: 
- 一是对react-router赖以依存的history进行研究
- 二是分析react-router是如何实现URL与UI同步的。

## react-router的依赖基础 - history

### History的整体介绍
`history` 是一个独立的第三方js库，可以用来兼容在不同浏览器、不同环境下对历史记录的管理，拥有统一的API。

具体来说里面的history分为三类:

- 老浏览器的history: 主要通过hash来实现，对应 `createHashHistory`
- 高版本浏览器: 通过html5里面的history，对应 `createBrowserHistory`
- node环境下: 主要存储在memeory里面，对应 `createMemoryHistory`


上面针对不同的环境提供了三个API，但是三个API有一些共性的操作，将其抽象了一个公共的文件 `createHistory`


```js
// 内部的抽象实现
function createHistory(options={}) {
  ...
  return {
    listenBefore, // 内部的hook机制，可以在location发生变化前执行某些行为，AOP的实现
    listen,       // location发生改变时触发回调
    transitionTo, // 执行location的改变
    push,         // 改变location
    replace,
    go,
    goBack,
    goForward,
    createKey,    // 创建location的key，用于唯一标示该location，是随机生成的
    createPath,
    createHref,
    createLocation, // 创建location
  }
}
```

上述这些方式是history内部最基础的方法，`createHashHistory`、`createBrowserHistory`、`createMemoryHistory` 只是覆盖其中的某些方法而已。

其中需要注意的是，此时的location跟浏览器原生的location是不相同的，最大的区别就在于里面多了key字段，history内部通过key来进行location的操作。

```js
function createLocation() {
  return {
    pathname, // url的基本路径
    search,   // 查询字段
    hash,     // url中的hash值
    state,    // url对应的state字段
    action,   // 分为 push、replace、pop三种
    key       // 生成方法为: Math.random().toString(36).substr(2, length)
  }
}
```

### 内部解析
三个API的大致的技术实现如下:

- createBrowserHistory: 利用HTML5里面的history
- createHashHistory: 通过hash来存储在不同状态下的history信息
- createMemoryHistory: 在内存中进行历史记录的存储

#### 执行URL前进
- createBrowserHistory: `pushState`、`replaceState`
- createHashHistory: `location.hash=*** location.replace()`
- createMemoryHistory: 在内存中进行历史记录的存储

伪代码实现如下:

```js
// createBrowserHistory(HTML5)中的前进实现
function finishTransition(location) {
  ...
  const historyState = { key };
  ...
  if (location.action === 'PUSH') ) {
    window.history.pushState(historyState, null, path);
  } else {
    window.history.replaceState(historyState, null, path)
  }
}
// createHashHistory的内部实现
function finishTransition(location) {
  ...
  if (location.action === 'PUSH') ) {
    window.location.hash = path;
  } else {
    window.location.replace(
    window.location.pathname + window.location.search + '#' + path
  );
  }
}
// createMemoryHistory的内部实现
entries = [];
function finishTransition(location) {
  ...
  switch (location.action) {
    case 'PUSH':
      entries.push(location);
      break;
    case 'REPLACE':
      entries[current] = location;
      break;
  }
}
```

#### 检测URL回退

- createBrowserHistory: popstate
- createHashHistory: hashchange
- createMemoryHistory: 因为是在内存中操作，跟浏览器没有关系，不涉及UI层面的事情，所以可以直接进行历史信息的回退
伪代码实现如下:


```js
// createBrowserHistory(HTML5)中的后退检测
function startPopStateListener({ transitionTo }) {
  function popStateListener(event) {
    ...
    transitionTo( getCurrentLocation(event.state) );
  }
  addEventListener(window, 'popstate', popStateListener);
  ...
}

// createHashHistory的后退检测
function startPopStateListener({ transitionTo }) {
  function hashChangeListener(event) {
    ...
    transitionTo( getCurrentLocation(event.state) );
  }
  addEventListener(window, 'hashchange', hashChangeListener);
  ...
}
// createMemoryHistory的内部实现
function go(n) {
  if (n) {
    ...
    current += n;
  const currentLocation = getCurrentLocation();
  // change action to POP
  history.transitionTo({ ...currentLocation, action: POP });
  }
}
```

#### state的存储
为了维护state的状态，将其存储在sessionStorage里面:


```js
// createBrowserHistory/createHashHistory中state的存储
function saveState(key, state) {
  ...
  window.sessionStorage.setItem(createKey(key), JSON.stringify(state));
}
function readState(key) {
  ...
  json = window.sessionStorage.getItem(createKey(key));
  return JSON.parse(json);
}
// createMemoryHistory仅仅在内存中，所以操作比较简单
const storage = createStateStorage(entries); // storage = {entry.key: entry.state}

function saveState(key, state) {
  storage[key] = state
}
function readState(key) {
  return storage[key]
}
```

原文： http://zhenhua-lee.github.io/react/history.html