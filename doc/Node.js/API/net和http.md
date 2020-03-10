[TOC]
# 目录
## Node.js 网络模块架构
在 Node.js 的模块里面，与网络相关的模块有：
- Net
- DNS
- HTTP
- TLS/SSL
- HTTPS
- UDP/Datagram

除此之外，还有 v8 底层相关的网络模块有 
- tcp_wrap.cc
- udp_wrap.cc
- pipe_wrap.cc
- stream_wrap.cc 
等等，在 JavaScript 层以及 C++ 层之间通过 process.binding 进行桥接相互通信。
![image](http://zhenhua-lee.github.io/img/socket/socket.png)


## NET 模块
### net
Net模块提供了一些用于底层的网络通信接口，包括创建服务器以及客户端，==其中 `HTTP`模块也是基于 `Net`模型的上层封装==。

从组成来看，net模块主要包含两部分，了解socket编程的同学应该比较熟悉了：

#### net.Server
tcp/server, 服务端TCP监听来自客户端的请求，并使用TCP连接(socket)向客户端发送数据； 内部通过socket来实现与客户端的通信；

#### net.Socket
tcp/本地，客户端TCP连接到服务器，并与服务器交换数据； socket的node实现，实现了全双工的stream的接口

==在http模块，`http.Server` 继承了`net.Server`==，此外，http客户端 与http服务端的通信均依赖于socket（net.Socket）。 
也就是说，做node服务端编程，net基本是绕不开的一个模块。

#### net.createConnection()
一个工程函数，用来创建 net.Socket ，然后立即启动 connect() 方法，最终返回 socket 对象，有三种参数传入方式
- net.createConnection(options[, connectListener]) options 与 socket 实例的 connect 方法一致
- net.createConnection(path[, connectListener]) 用来连接路径
- net.createConnection(port[, host][, connectListener]) 连接 TCP

```js
const client = net.createConnection(PORT, HOST, function () {
  console.log('connect success.')
})
const client = net.createConnection({port: PORT, host: HOST}, function () {
  console.log('connect success.')
})
```


#### net.createServer()
创建一个 TCP 或者 IPC 服务器，接受两个参数，第一个参数 options 可选， 第二个参数 connectionListener 监听函数，监听 connection

```js
const app = net.createServer(function (socket) {
    console.log(socket);
})
```


#### net.isIP()
判断某个字符串是不是ip 地址
```js
net.isIP('10.0.0.1') // 4
net.isIP('cats') // 0
```


### demo
#### 服务端net.Server


```js
const net = require('net')
const PORT = 8081
const HOST = '127.0.0.1'

const server = net.createServer((socket) => {
  // socket实例
  console.log('connection:' + socket.remoteAddress, socket.remotePort)

  // 监听客户端信息
  socket.on('data', data => {
    console.log('Receive client message: ' + socket.remoteAddress + ':' + socket.remotePort + '  ' + data)
    socket.write('Service said ' + data + '\r\n') // 向客户端发送信息
  })

  /**
   * 服务端收到客户端发出的关闭连接请求时，会触发end事件
   * 这个时候客户端没有真正的关闭，只是开始关闭；
   * 当真正的关闭的时候，会触发close事件；
   * */
  socket.on('end', () => {
    console.log('client ended')
    server.unref()  // 调用了该方法，则所有的客户端关闭跟本服务器的连接后，将关闭服务器
  })


  socket.on('close', () => {
    console.log('closed:' + socket.remoteAddress + ' ' + socket.remotePort)
  })

  /*socket.pause()
	socket.setTimeout(3000) //设置客户端超时时间，如果客户端一直不输入，超过这个时间，就认为超时了
	socket.on('timeout', () => {
		console.log('超时了')
		socket.pipe(ws, {end: false})
		// 默认情况下，当可读流读到末尾的时候会关闭可写流
	})*/
})

server.listen(PORT, HOST, () => {
  const {port, address} = server.address()
  console.log('service is run  ' + address + ':' + port)
})

server.on('close', () => {
  //关闭服务器，停止接收新的客户端的请求
  console.log( 'close事件：服务端关闭' );
})

server.on('error', (error) => {
  console.log( 'error事件：服务端异常：' + error.message );
})

//服务端也可以通过显式处理"connection"事件来建立TCP连接，只是写法不同，二者没有区别即:
/*
let server = net.createServer()
server.listen(PORT,HOST)
server.on('connection', (socket) => {
	console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
})
*/


```
#### 客户端net.Socket

```js
const net = require('net')

//创建一个TCP客户端连接到刚创建的服务器上，该客户端向服务器发送一串消息，并在得到服务器的反馈后关闭连接。

const client = new net.Socket()
const PORT = 8081
const HOST = '127.0.0.1'

client.setEncoding('utf-8')
client.connect(PORT, HOST, () => {
  console.log('connect to ' + HOST + ':' + PORT)
  client.write('I am ueumd.') // 向服务器发送数据
})

// 监听服务端信息
client.on('data', (data) => {
  console.log('Receive server message: ' + data)
  client.destroy() // 完全关闭连接
})

client.on('close', function () {
  console.log('Connection closed')
})

```
### net.Server
用于创建 TCP 或 IPC server

#### server 实例属性和方法
- address() 返回服务器的地址，包括 port 端口号；family: ip版本；address: ip地址
- close() 方法，停止接受建立新的 connection ，如果 close 之前存在 connection 将会保存
- getConnections(callback) 方法，获取当前并发连接数，回调函数有两个参数，err: 错误信息；count: 并发数量
- listen() 启动一个 server 监听 ，当 server 开始监听，就会触发一个 listening 事件，这个方法的最后一个参数 callback 将会被添加为 listening 事件的监听器，参数 (options[, callback]) options 参数包括 port, host, path 等，也可以通过 listen(path,callback) 监听一个路径，或者通过 listen([port][,host][,callback]) 启动一个 TCP 服务，监听 port 和 host
- listening 属性，表明 server 是否正在监听

#### server 实例的事件
- listening 事件，调用 server.listen() 之后触发
- connection 事件，当一个新 connection 建立的时候触发，回调参数 socket 对象
- error 事件，错误出现的时候触发
- close 事件，当 server 关闭时触发，如果 connection 存在，直到所有 connection 结束才会触发

### net.Socket
socket是啥这里就不做详细的阐述了，下面主要了解下net.Socket这个构造体主要有提供一些什么方法、监听事件的使用。

#### 相关事件
- connect : 当客户端与服务端成功建立链接之后触发，如果链接不上服务器直接抛出error事件错误然后退出node进程。
- data : 当客户端收到服务器传送过来的数据或者是客户端传送给服务器的数据的时候触发回调。
- end : 当另外一侧发送FIN包断开的时候触发，默认情况下面 (allowHalfOpen == false)socket会自我销毁(如果写入待处理队列里面还没正式响应回包)，但是我们可以设置allowHalfOpen参数为true，这样可以继续往该socket里面写数据，但是我们需要自己去调用 end 方法去消耗这个socket，不然可能会造成句柄泄漏。
- close : 链接断开的时候触发，但是如果在传输的过程中有错误的话这里会在回调函数里面抛出 error。
- timeout : 当socket超时空闲的时候触发，如果要在队列里面销毁需要手动去调close方法。
- lookup : 域名解析完成的时候触发。
- drain : 写完缓存的时候触发，可使用在上传大小限制中。

#### 相关方法
- write() : 服务端给客户端发送数据或者是客户端给服务端发送数据。
- address() : 获取服务绑定的socket的IP地址，返回对象有三个属性，分别为端口、host以
- 及IPvX版本。
- end() : 半关闭socket，会发送一个FIN包，服务器仍然可能发送一些数据，也可以这样调用socket.end(data,encoding)。
- pause() : 暂停读取数据，可以用作对数据上传限制。
- resume() : 继续数据读取。
- setEncoding() : 设置数据流的获取格式。
- setKeepAlive() : 允许/禁止keep-alive功能。
- setNoDelay() : 禁止Nagele算法，TCP链接默认使用Nagle算法，它们在发送之前数据会被缓存。这是为true的话在每次socket.write()的时候会立即发送数据，默认为true。
- setTimeout() : 当一个空闲的socket在多少秒后不活跃会被接受到timeout事件，但是该socket不会停止销毁，需要手动调用end()或者destroy()。表示禁止空闲超时。
- destroy() 方法，确保该 socket 上不在有 I/O 活动，一般用在错误部分
- destroyed 属性，指示链接是否已经被销毁
- connect() 方法，启动一个链接，参数 (options[, listener]) options 参数包括 port, host, path 等，也可以通过 listen(path[, listener]) 用于 IPC 链接，或者通过 listen([port][,host][,listener]) 启动一个 TCP 链接，返回值是 socket 自身


#### 相关属性
- bufferSize : 当前缓存的等待被发送的字符串的数量。
- bytesRead : 收到的字节的数量。
- bytesWritten : 发送的字节的数量
- connecting 属性，true：表示 connect() 方法被调用但还未结束，false：在 connect() 方法回调中会返回 false
- destroyed : 标识链接是否已经被破坏，一旦被破环，就不用使用该链接来传输数据。
- localAddress : 远程客户端链接本地地址的host。如果我们监听服务的host是0.0.0.0，而客户端链接的是'192.168.1.1'，最后的值是后者。
- localPort : 本地的端口。
- remoteAddress : 客户端IP，如果socket已经是destryed的话，该值为undefined。
- remoteFamily : 客户端是IPvX

## HTTP 模块
### 核心的模块
#### http.Agent 对象
该对象用作客户端连接，作为 http.request(options[, callback]) 方法的 options 参数的一部分，用来向 Server 发起请求；其主要作用就是在客户端的连接中，针对不同的 Server 请求保持同一个 Socket 连接既 Connection，以达到 Connection 复用的目的；不过能否重用 Connection 还要受到 Server 的限制，具体详情参考 http.Agent 小节；

#### http.ClientRequest
http.request(options[, callback]) 方法调用以后返回的对象，它表示的是一个 in-progress 的请求，也就是说还没有发送之前的 Request 对象，直到我们对其调用 end() 方法使其发送出去；要注意的是，http.ClientRequest 对象所对应的回调事件是 'response' 事件及其其它事件；详情参考 http.ClientRequest 小节；

#### http.request(options[, callback]) 
客户端发起连接的方法其 options 里面包含诸多的参数，里面就包含 http.Agent；该方法调用返回一个 in-progress 的 http.ClientRequest 请求对象；详情参考 http.request() 小节；

#### http.Server
该对象由 http.createServer([requestListener]) 方法返回，http.Server 继承自 net.server，详情参考 http.Server 小节；

#### http.ServerResponse
就是 http.Server 的 'request' 事件回调方法的第二个参数；；

#### http.createServer([requestListener]) 
返回一个 http.Server 对象；详情参考 http.createServer 小节；

#### http.IncomingMessage
Stream 对象，http.ClientRequest 的 'response' 事件的回调参数 response 以及 http.Server 的 'request' 事件的回调参数 request 都是 http.IncomingMessage 类型的对象，归纳起来，既是 Client 请求所获得的 response 数据以及 Server 获得的 request 都是通过 http.IncomingMessage 来处理的；这也是 Node.js 异步处理网络请求的核心机制；注意，http.IncomingMessage 继承自 stream.Readable 对象，是一个实现了 EventEmitter 接口的对象；


### http 模块属性
- METHODS 属性，返回解析器支持的 HTTP 方法列表
- STATUS_CODES 属性，返回标准的 HTTP 响应状态码集合及描述

### http 模块方法
- createServer([requestListener]) 返回一个新建的 http.Server 实例，参数可以是一个 request 事件处理函数
- request(options[, callback]) 发出请求，options 可以是一个对象、字符串、或者URL对象，callback可选，会作为单次监听器添加到responce事件
- get(options[,callback]) 因为大多数请求都是 GET 请求且不带请求主体，所以 Node.js 提供了该便捷方法
- ServerResponse 类
- Agent 类
### http.Server 类
==继承 `net.Server`== ，创建 服务器实例使用 http.createServer(callback)

#### server 实例的方法
> 基本上继承了 net.Server 实例的方法与属性

- listen() 启动一个 server 监听 ，当 server 开始监听，就会触发一个 listening 事件，这个方法的最后一个参数 callback 将会被添加为 listening 事件的监听器，参数 (options[, callback]) options 参数包括 port, host, path 等，也可以通过 listen([port][,host][,callback]) 监听
- close() 方法，停止服务器端接收新的链接
- setTimeout() 方法，设置超时时间

#### server 实例的属性
- timeout 属性，返回超时时间
- listening 返回当前服务器是否正在监听链接

#### server 实例的事件
- connect 事件，当客户端发送 HTTP CONNECT 请求时触发，回调参数 request: HTTP 请求，同 request 事件；socket: 服务器与客户端之间的网络 socket ; head 流的第一个数据包，可能为空
- connection 事件，当一个新的 TCP 流被建立时触发，回调参数 socket
- request 事件，每次接收到一个请求时触发，每个链接可能有多个请求，回调参数 request、response
- upgrade 事件，每当客户端发送 HTTP upgrade 请求时触发

```js
const http = require('http')
const url = require('url')
const PORT = 8867
const HOST = '127.0.0.1'

const app = http.createServer(function (req, res) {
  res.end('Hello Http')
})

app.listen(PORT, HOST, function () {
  console.log('listen http ', HOST + ':' + PORT)
  console.log('app.listening', app.listening) // true
})

app.on('connect', function (req, socket, head) {
  console.log(req)
})

app.on('connection', function (socket) {
  console.log('http connect ')
})

// 在浏览器里请求时响应
app.on('request', function (req, res) {
  // console.log('on request', res)
  let reqUrl = url.parse(req.url, true) // true 会把query字段自动转换为JSON对象
  console.log(reqUrl)
  res.end()
})

app.setTimeout(12000)
console.log(app.timeout) //12000

app.on('timeout', function () {
  console.log('timeout')
})

/*
url.parse(req.url)
{
  auth: null,
  hash: null,
  host: null,
  hostname: null,
  href: "/sql/test.json?code=200&messaage=successs",
  path: "/sql/test.json?code=200&messaage=successs",
  pathname: "/sql/test.json",
  port: null,
  protocol: null,
  query: "code=200&messaage=successs",
  search: "?code=200&messaage=successs",
  slashes: null
}

url.parse(req.url, true)  query 不一样
{
  auth: null,
  hash: null,
  host: null,
  hostname: null,
  href: "/sql/test.json?code=200&messaage=successs",
  path: "/sql/test.json?code=200&messaage=successs",
  pathname: "/sql/test.json",
  port: null,
  protocol: null,
  query: {
    code: 200,
    message: 'success'
  },
  search: "?code=200&messaage=successs",
  slashes: null
}
*/
```
### http.ClientRequest 类
> 该对象在 http.request() 内部被创建并返回。 它表示着一个正在处理的请求

#### 1. request 实例的属性与方法
- flushHeaders()，刷新请求头
- getHeader(name) 获取请求头信息
- removeHeader(name) 移除某个请求头信息
- setHeader(name, value) 设置请求头信息
- setTimeout(timeout[, callback]) 设置请求时长
- socket 返回底层 socket 的引用
- write(chunk[, encoding][, callback]) 发送请求主体的一个数据块
- abort() 标记请求为终止
- aborted 如果请求终止则返回被终止的时间
- end([data[, encoding]][, callback]) 结束发送请求。 如果部分请求主体还未被发送，则会刷新它们到流中

#### 2. request 实例的事件
- abort 事件，当请求已被客户端终止时触发。 该事件仅在首次调用 abort() 时触发。
- connect 事件，每当服务器响应 CONNECT 请求时触发，回调参数，response、socket、head
- continue 事件，当服务器发送了一个 100 Continue 的 HTTP 响应时触发
- response 事件，当请求的响应被接收到时触发。 该事件只触发一次。
- socket 事件，当 socket 被分配到请求后触发
- timeout 事件，请求超时时触发
- upgrade 事件，当服务器响应 upgrade 请求时触发

```js
const http = require('http');
const querystring = require('querystring')

const PORT = 8867
const HOST = '127.0.0.1'

const postData = querystring.stringify({
  'msg' : 'Hello World!'
})

const options = {
  hostname: HOST,
  port: PORT,
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const request = http.request(options, function (res) {
   console.log(res)
})

request.setHeader('TEST', 'test header')
console.log(request.getHeader('TEST'))

request.removeHeader('TEST')
console.log(request.getHeader('TEST'))

request.flushHeaders()
request.setTimeout(12000)

request.on('abort', function () {
  console.log('abort')
})

request.on('response', function () {
  console.log('response')
})

request.on('timeout', function () {
  console.log('timeout')
})

request.write('get somthing')
request.end('end', function () {
  console.log('request end')
})

// request.abort()
// console.log(request.aborted)

```

### http.createServer() 
方法 ==回调函数中的第一个参数 request 对象的属性、方法、事件==

#### 属性与方法
- req.url 返回发出请求的网址
- req.method 返回 http 请求的方法
- req.headers 返回 http 请求的头信息
- setEncoding() 方法，设置请求的编码
- httpVersion 返回链接到的服务器的 http 版本
- rawHeaders 返回，接收到的原始的请求头列表

#### 事件
- aborted 事件，当请求已被终止且网络 socket 已关闭时触发。
- close 事件，当底层连接被关闭时触发。 同 ‘end’ 事件一样，该事件每个响应只触发一次。
- data 事件，接收到数据触发，回调参数，接受的数据

```js
 const http = require('http')
const fs = require('fs')

const PORT = 8867
const HOST = '127.0.0.1'

const app = http.createServer(function (req, res) {
    req.on('aborted', function () {
        console.log('aborted')
    })

    req.on('close', function () {
        console.log('close')
    })

    console.log(req.url)
    console.log(req.method)
    console.log(req.httpVersion)
    console.log(req.statusCode)
    console.log(req.statusMessage)

    // console.log(req.headers)

    req.on('data', function (postData) {
        console.log(postData.toString())
        res.write('xxx', function () {
            res.end()
        })
    })
})

app.listen(PORT, HOST, function () {
    console.log('listen http://' + HOST + ':' + PORT)
    console.log('app.listening', app.listening)
})
```

### http.ServerResponse 类
> 该对象在 HTTP 服务器内部被创建。 它作为第二个参数被传入 ‘request’ 事件

#### 1. response 实例属性与方法
- setHeader(name, value) 设置响应头的值，如果响应头已存在则会将其覆盖，如要设置多个同名响应头，value 的值可以是字符串数组
- hasHeader(name) 返回是否含有某个响应头
- getHeaderNames() 返回一个包含当前 http 头信息名称数组，均为小写
- getHeaders() 返回当前响应头文件的浅拷贝
- getHeader(name) 返回某个响应头信息
- headersSent 返回响应头是否被发送
- removeHeader(name) 移除响应头
- statusCode 属性，设置发送给客户端的状态码
- statusMessage 属性，控制发送给客户端的状态信息，默认为状态码的标准信息
- write(chunk[,encoding][,callback]) 方法，可以被多次调用，用于设置返回的响应主体
- writeHead(statusCode[, statusMessage][, headers]) 发送响应头，包括状态码和状态描述，只能被调用一次，会与 通过 response.setHeader() 设置的响应头合并
- setTimeout(msecs[, callback]) 设置超时时间
- finished 属性，表示响应是否已完成
- end([data][,encoding][,callback]) 通知服务器所有响应头和响应主体都已被发送，每次响应都必须调用

#### 2. response 实例事件
- close 事件，end() 方法调用后触发
- finish 事件，当响应头与响应主体的最后一部分已被交给操作系统网络进行传输时触发，并不意味着客户端已经接受任何东西

```js
const http = require('http');
const fs = require('fs');

const PORT = 8867;
const HOST = '10.15.32.60';

const app = http.createServer(function (req, res) {

    res.on('close', function () {
        console.log('close');
    })

    res.on('finish', function () {
        console.log('finish');
    })

    res.setHeader('TEST', ['test1', 'test2']);
    console.log(res.hasHeader('TEST'));
    console.log(res.getHeaderNames());
    console.log(res.getHeaders());
    console.log(res.getHeader('TEST'));
    console.log(res.headersSent);

    res.removeHeader('TEST');
    console.log('remove', res.hasHeader('TEST'));
    res.writeHead(222, 'write head statue message', {
        'TEST2': 'this is test header'
    });

    res.statusCode = 200;
    res.statusMessage = 'test status message';
    res.setTimeout(10000);

    fs.readFile('./package.json', function (err, data) {
        res.write(data, function () {
            console.log('data write success');
            res.end('xnxnxn');

            console.log(res.finished);
        })
    })

})

app.listen(PORT, HOST, function () {
    console.log('listen http://' + HOST + ':' + PORT);
    console.log('app.listening', app.listening);
})
```
## http.clicent
http模块提供了两个函数, 功能是作为 ==客户端向http服务器发起请==求。
- http.request
- http.get

### http.request(options,callback)
options是一个类似关联数组的对象，表示请求的参数，callback作为回调函数，需要传递一个参数，为http.ClientResponse的实例，http.request返回一个http.ClientRequest的实例。
options常用的参数有host、port（默认为80）、method（默认为GET）、path（请求的相对于根的路径，默认是“/”，其中querystring应该包含在其中，例如/search?query=byvoid）、headers（请求头内容）
var http=require("http");
```js
const http = require('http')

// https://www.tutorialspoint.com/nodejs/nodejs_request_object.htm

// http.get('http://www.gongjuji.net', (res) => {
//   let html = ''
//   res.on('data', (data) => {
//     html += data
//   })
//   res.on('end', () => {
//     console.log(html) //整个页面的html
//   })
// })


const querystring = require('querystring')
let data = {
  age: 13,
  time: new Date().getTime()
}

const options = {
  hostname: 'www.gongjuji.net',
  port: 80,
  path: '/',
  method: 'GET'
}

//创建请求
const req = http.request(options, function (res) {
  console.log('STATUS:' + res.statusCode)
  console.log('HEADERS:' + JSON.stringify(res.headers))

  res.setEncoding('utf-8')
  res.on('data', function (chunk) {
    console.log('数据片段分隔-----------------------\r\n')
    console.log(chunk)
  })

  res.on('end', function () {
    console.log('响应结束********')
  })
})

req.on('error', function (err) {
  console.error(err)
})

req.end()

```


### http.get(options,callback)
这个方法是http.request方法的简化版，唯一的区别是http.get自动将请求方法设为了GET请求，同时不需要手动调用req.end()。
但是需要记住的是，==如果我们使用http.request方法时没有调用end方法，服务器将不会收到信息==。
```js
/**
 * 该方法与 http.request() 唯一的区别是它设置请求方法为 GET 且自动调用 req.end()
 * @type {*}
 */

const http = require('http')
let url = 'http://paperrestfz.aibeike.com/paperrest/rest/paper/getPaperDetailsInforMation.json?paperId=8a990d955b8055b8015c7c5097aa1adb&appKey=e4ce92a7eeb994c88e631741350e0191'
http.get(url, (res) => { //自带req 这里只有一个参数(res)，而不是(req, res)
  let json = ''
  res.on('data', (chunk) => {
    json += chunk;
  })

  res.on('end', () => {
    try {
      const parsedData = JSON.parse(json)
      console.log(parsedData)
    } catch (e) {
      console.error(e.message)
    }
  })

  res.on('error', (e) => {
    console.error(e)
  })
})
```
##  HTTP代理
在实际开发时，用到http代理的机会还是挺多的，比如，测试说线上出bug了，触屏版页面显示有问题；我们一般第一时间会去看api返回是否正常，这个时候在手机上设置好代理就能轻松捕获HTTP请求了。

老牌的代理工具有fiddler，charles。其实，nodejs下也有，例如node-http-proxy，anyproxy。基本思路是监听request事件，当客户端与代理建立HTTP连接之后，代理会向真正请求的服务器发起连接，然后把两个套接字的流绑在一起。

我们可以实现一个简单的代理服务器：

```js
const http = require('http')
const url = require('url')

http.createServer((req, res) => {
    // request回调函数
    console.log(`proxy request: ${req.url}`)
    let urlObj = url.parse(req.url)
    
    let options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 80,
        path: urlObj.path,
        method: req.method,
        headers: req.headers
    }
    
    // 向目标服务器发起请求
    let proxyRequest = http.request(options, (proxyResponse) => {
    
        // 把目标服务器的响应返回给客户端
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers)
        proxyResponse.pipe(res)
        
    }).on('error', () => {
        res.end()
    })
    
    // 把客户端请求数据转给中间人请求
    req.pipe(proxyRequest)
    
}).listen(8089, '0.0.0.0');
```
验证下是否真的起作用，curl通过代理服务器访问我们的“hello world”版Node.js服务器：


```js
curl -x http://192.168.132.136:8089 http://localhost:3333/
```




#  参考
- Node.js之网络通讯模块浅析 https://segmentfault.com/a/1190000008908077
- 初步研究node中的网络通信模块 http://zhenhua-lee.github.io/node/socket.html
- NET HTTP 网络模块 https://blog.csdn.net/mjzhang1993/article/details/78663954
- http://nodejs.cn/api/net.html
- https://www.shangyang.me/2018/03/02/javascript-nodejs-06-http/
- 走进Node.js 之 HTTP实现分析 https://cloud.tencent.com/developer/article/1013565
- https://www.shangyang.me/2018/03/02/javascript-nodejs-06-http/