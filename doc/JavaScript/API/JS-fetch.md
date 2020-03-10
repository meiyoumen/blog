[TOC]
# fetch和XMLHttpRequest
fetch，说白了，就是XMLHttpRequest的一种替代方案。如果有人问你，除了Ajax获取后台数据之外，还有没有其他的替代方案？

这是你就可以回答，除了XMLHttpRequest对象来获取后台的数据之外，还可以使用一种更优的解决方案fetch。

## 如何获取fetch
到现在为止，fetch的支持性还不是很好，但是在谷歌浏览器中已经支持了fetch。fetch挂在在BOM中，可以直接在谷歌浏览器中使用。

查看fetch的支持情况：[fetch的支持情况](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

当然，如果不支持fetch也没有问题，可以使用第三方的ployfill来实现只会fetch：[whatwg-fetch](https://github.com/github/fetch)

## fetch的helloworld
下面我们来写第一个fetch获取后端数据的例子：

```js
// 通过fetch获取百度的错误提示页面
fetch('https://www.baidu.com/search/error.html') // 返回一个Promise对象
  .then((res)=>{
    return res.text() // res.text()是一个Promise对象
  })
  .then((res)=>{
    console.log(res) // res是最终的结果
  })
```

## GET请求
### GET请求初步
完成了helloworld，这个时候就要来认识一下GET请求如何处理了。

上面的helloworld中这是使用了第一个参数，其实fetch还可以提供第二个参数，就是用来传递一些初始化的信息。

这里如果要特别指明是GET请求，就要写成下面的形式：
```js
// 通过fetch获取百度的错误提示页面
fetch('https://www.baidu.com/search/error.html', {
    method: 'GET'
  })
  .then((res)=>{
    return res.text()
  })
  .then((res)=>{
    console.log(res)
  })
```

### GET请求的参数传递
GET请求中如果需要传递参数怎么办？这个时候，只能把参数写在URL上来进行传递了。

```js
// 通过fetch获取百度的错误提示页面
fetch('https://www.baidu.com/search/error.html?a=1&b=2', { // 在URL中写上传递的参数
    method: 'GET'
  })
  .then((res)=>{
    return res.text()
  })
  .then((res)=>{
    console.log(res)
  })
```

## POST请求
### POST请求初步
与GET请求类似，POST请求的指定也是在fetch的第二个参数中：

```js
// 通过fetch获取百度的错误提示页面
fetch('https://www.baidu.com/search/error.html', {
    method: 'POST' // 指定是POST请求
  })
  .then((res)=>{
    return res.text()
  })
  .then((res)=>{
    console.log(res)
  })
```

### POST请求参数的传递
众所周知，POST请求的参数，一定不能放在URL中，这样做的目的是防止信息泄露。

```js
// 通过fetch获取百度的错误提示页面
fetch('https://www.baidu.com/search/error.html', {
    method: 'POST',
    body: new URLSearchParams([["foo", 1],["bar", 2]]).toString() // 这里是请求对象
  })
  .then((res)=>{
    return res.text()
  })
  .then((res)=>{
    console.log(res)
  })
```

其实除了对象URLSearchParams外，还有几个其他的对象，可以参照：常用的几个对象来学习使用。

### 设置请求的头信息
在POST提交的过程中，一般是表单提交，可是，经过查询，发现默认的提交方式是：Content-Type:text/plain;charset=UTF-8，这个显然是不合理的。下面咱们学习一下，指定头信息：

```js
// 通过fetch获取百度的错误提示页面
fetch('https://www.baidu.com/search/error.html', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded' // 指定提交方式为表单提交
    }),
    body: new URLSearchParams([["foo", 1],["bar", 2]]).toString()
  })
  .then((res)=>{
    return res.text()
  })
  .then((res)=>{
    console.log(res)
  })
```

这个时候，在谷歌浏览器的Network中查询，会发现，请求方式已经变成了`content-type:application/x-www-form-urlencoded`

## 通过接口得到JSON数据
上面所有的例子中都是返回一个文本，那么除了文本，有没有其他的数据类型呢？肯定是有的，具体查询地址：Body的类型

由于最常用的是JSON数据，那么下面就简单演示一下获取JSON数据的方式：


```js
// 通过fetch获取百度的错误提示页面
fetch('https://www.baidu.com/rec?platform=wise&ms=1&rset=rcmd&word=123&qid=11327900426705455986&rq=123&from=844b&baiduid=A1D0B88941B30028C375C79CE5AC2E5E%3AFG%3D1&tn=&clientWidth=375&t=1506826017369&r=8255', { // 在URL中写上传递的参数
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json' // 通过头指定，获取的数据类型是JSON
    })
  })
  .then((res)=>{
    return res.json() // 返回一个Promise，可以解析成JSON
  })
  .then((res)=>{
    console.log(res) // 获取JSON数据
  })
```

## 强制带Cookie
默认情况下, fetch 不会从服务端发送或接收任何 cookies, 如果站点依赖于维护一个用户会话，则导致未经认证的请求(要发送 cookies，必须发送凭据头).


```js
// 通过fetch获取百度的错误提示页面
fetch('https://www.baidu.com/search/error.html', {
    method: 'GET',
    credentials: 'include' // 强制加入凭据头
  })
  .then((res)=>{
    return res.text()
  })
  .then((res)=>{
    console.log(res)
  })
```
## 简单封装一下fetch
最后了，介绍了一大堆内容，有没有发现，在GET和POST传递参数的方式不同呢？下面咱们就来封装一个简单的fetch，来实现GET请求和POST请求参数的统一。


```js
/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj, arr = [], idx = 0) {
  for (let item in obj) {
    arr[idx++] = [item, obj[item]]
  }
  return new URLSearchParams(arr).toString()
}

/**
 * 真正的请求
 * @param url 请求地址
 * @param options 请求参数
 * @param method 请求方式
 */
function commonFetcdh(url, options, method = 'GET') {
  const searchStr = obj2String(options)
  let initObj = {}
  if (method === 'GET') { // 如果是GET请求，拼接url
    url += '?' + searchStr
    initObj = {
      method: method,
      credentials: 'include'
    }
  } else {
    initObj = {
      method: method,
      credentials: 'include',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: searchStr
    }
  }
  fetch(url, initObj).then((res) => {
    return res.json()
  }).then((res) => {
    return res
  })
}

/**
 * GET请求
 * @param url 请求地址
 * @param options 请求参数
 */
function GET(url, options) {
  return commonFetcdh(url, options, 'GET')
}

/**
 * POST请求
 * @param url 请求地址
 * @param options 请求参数
 */
function POST(url, options) {
  return commonFetcdh(url, options, 'POST')
}

GET('https://www.baidu.com/search/error.html', {a:1,b:2})
POST('https://www.baidu.com/search/error.html', {a:1,b:2})
```

参考：
- https://segmentfault.com/a/1190000011433064