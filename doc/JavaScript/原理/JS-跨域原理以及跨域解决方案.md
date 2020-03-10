[TOC]
# 目录
## 跨域到底是什么？
==No 'Access-Control-Allow-Origin'==  这是跨域的经典标志)

## 认识URL网址

```
URL地址：    http://www.justbecoder.com:80/article/index.html
http                                  超文本传输协议
www.justbecoder.com                   域名
80                                    端口号
article/index.html                    文件目录与文件名
```

## 同源策略
- 概念  
同源策略是浏览器最核心也是最基本的的安全功能，是指我们在发送网络请求时请求必须要遵守同源策略，==即域名、协议、端口号都要相同==

- 意义  
==是为了保证用户信息的安全，防止恶意的网站窃取数据==。

## 触发跨域的场景以及原因  
当同源策略中的 ==域名、协议、端口号有一样不相同时==，都会触发跨域 
```
假定当前在的网址是： http://www.justbecoder.com:80/，当我向以下网址发送请求时都会触发跨域
url: https://www.justbecoder.com:80/   // 协议不同 --- 喂，老婆，我听不懂呀，你说话加密啦！
url: http://www.baidu.com:80/          // 域名不同 --- 哎呀，菇凉认错认了，你不是我老婆
url: http://www.justbecoder.com:8080/  // 端口不同 --- 是你老婆没错，但是你没有找对你老婆身上的门啊
```

## 为什么浏览器不支持跨域请求
==为了保证安全性，防止CSRF攻击==。CSRF(Cross-site request forgery),中文名==称跨站请求伪造==。

可以这么理解CSRF:攻击者盗用了你的身份，以你的名义发送恶意请求。CSRF能够做的事情包括：以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账......造成的问题包括：个人隐私泄露以及财产安全。




## 跨域的几种解决办法
解决跨域的办法有N种，做常用的主要以下几种：
- document.domain + iframe (只有在主域相同的时候才能使用该方法)
- 动态创建script
- location.hash + iframe
- window.name + iframe
- postMessage（HTML5中的XMLHttpRequest Level 2中的API）
- CORS
- JSONP
- web sockets

不过解决跨域基本就两种方式：
- 客户端想方法，一般使用jsonp
- 服务端想办法，做配置（即CORS）。而CORS相对比较灵活，功能比较强大。
CORS解决跨域
CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。

下面先上实现代码,以node的Express框架为例(CORS)：

```js
app.all('*', function(req, res, next) {
    console.log(req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-type');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
    res.header('Access-Control-Max-Age',1728000);//预请求缓存20天
    next();  
});
```
## CORS 跨域资源共享
### 原理
CORS请求原理
CORS是一个W3C标准，全称是"==跨域资源共享=="（==Cross-origin resource sharing==）。它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。

基本上目前所有的浏览器都实现了CORS标准，其实目前几乎所有的浏览器ajax请求都是基于CORS机制的，只不过可能平时前端开发人员并不关心而已(所以说其实现在CORS解决方案主要是考虑后台该如何实现的问题)。

### 简介
CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

因此，实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。

### 两种请求
浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。
只要同时满足以下两大条件，就属于简单请求。
1. 请求方法是以下三种方法之一：

```
HEAD
GET
POST
```

2. HTTP的头信息不超出以下几种字段：

```
Accept
Accept-Language
Content-Language
Last-Event-ID
```
Content-Type：只限于三个值
- application/x-www-form-urlencoded
- multipart/form-data
- text/plain
凡是不同时满足上面两个条件，就属于非简单请求。
浏览器对这两种请求的处理，是不一样的。

### 简单请求
对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，增加一个Origin字段。
下面是一个例子，浏览器发现这次跨源AJAX请求是简单请求，就自动在头信息之中，添加一个==Origin==字段。

```
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```
上面的头信息中，Origin字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段（详见下文），就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。

如果Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

```
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```


上面的头信息之中，有三个与CORS请求相关的字段，都以Access-Control-开头。

### 非简单请求
预检请求
非简单请求是那种对服务器有特殊要求的请求，比如请求方法是==PUT或DELETE==，或者==Content-Type字段的类型是application/json==。

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

下面是一段浏览器的JavaScript脚本。

```js
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```

上面代码中，HTTP请求的方法是==PUT==，并且发送一个==自定义头信息X-Custom-Header==。
浏览器发现，这是一个非简单请求，就自动发出一个"预检"请求，要求服务器确认可以这样请求。下面是这个"预检"请求的HTTP头信息。


```
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```


"预检"请求用的请求方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是Origin，表示请求来自哪个源。
除了Origin字段，"预检"请求的头信息包括两个特殊字段。

1. Access-Control-Request-Method
该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法，上例是PUT。
2. Access-Control-Request-Headers
该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段，上例是X-Custom-Header。

服务器收到"预检"请求以后，==检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后==，确认允许跨源请求，就可以做出回应。

```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```
上面的==HTTP回应中==，关键的是Access-Control-Allow-Origin字段，表示http://api.bob.com可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。

```
Access-Control-Allow-Origin: *
```


如果浏览器==否定了"预检"请求==，会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被XMLHttpRequest对象的onerror回调函数捕获。控制台会打印出如下的报错信息。

```
XMLHttpRequest cannot load http://api.alice.com.
```


Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
服务器回应的其他CORS相关字段如下。

```
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```


### CORS相关字段

#### 1. Access-Control-Allow-Origin  
该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。
#### 2. Access-Control-Allow-Credentials  
该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。

#### 3. Access-Control-Expose-Headers  
该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。

#### 4. Access-Control-Allow-Methods 
该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

#### 5.Access-Control-Allow-Headers
如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

#### 6.Access-Control-Max-Age
该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。

### withCredentials 属性允许发送cookie
上面说到，==CORS请求默认不发送Cookie和HTTP认证信息==。如果要把Cookie发到服务器，一方面要服务器同意，指定Access-Control-Allow-Credentials字段。

```
Access-Control-Allow-Credentials: true
```


另一方面，开发者必须在AJAX请求中打开withCredentials属性。

```js
var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
```
否则，即使服务器同意发送Cookie，浏览器也不会发送。或者，服务器要求设置Cookie，浏览器也不会处理。

但是，如果省略withCredentials设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭withCredentials。

```js
xhr.withCredentials = false;
```


需要注意的是，==如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号==，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的document.cookie也无法读取服务器域名下的Cookie。

## 代理服务器
代理服务器，需要做以下几个步骤：

- 接受客户端 请求 。
- 将 请求 转发给服务器。
- 拿到服务器 响应 数据。
- 将 响应 转发给客户端。
这是简单的文字解析，下方为图解流程：
![image](https://user-gold-cdn.xitu.io/2018/5/17/1636e45262f7ca40?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 客户端：
<!DOCTYPE html>

```html
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Ajax测试</title>
</head>
<body>
    <script src="./node_modules/jquery/dist/jquery.min.js"></script>

    <script>
    var data = { name: 'BruceLee', password: '123456' };

    $.ajax({
        url: "http://localhost:3000",
        type: "post",
        data: JSON.stringify(data),
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            console.log(result);
        },
        error: function (msg) {
            console.log(msg);
        }
    })
    </script>
</body>
</html>
```
2. 代理服务器：3000 端口

```js
const http = require('http');

// 第一步：接受客户端请求
const server = http.createServer((request, response) => {
	
    // 代理服务器，直接和浏览器直接交互，也需要设置：CORS 的首部字段
    response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',  // 设置 optins 方法允许所有服务器访问 
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
	
    // 第二步：将请求转发给服务器
    const proxyRequest = http.request({
        host: '127.0.0.1',
        port: 4000,
        url: '/',
        method: request.method,
        headers: request.headers
    }, (serverResponse) => {
        
        // 第三步：收到服务器的响应
        var body = '';

        serverResponse.on('data', (chunk) => {
            body += chunk;
        });

        serverResponse.on('end', () => {
            console.log('The data is ' + body );
            
            // 第四步：将响应结果转发给浏览器
            response.end(body);
        })

    }).end();

});

server.listen(3000, () => {
    console.log('The proxyServer is running at http://localhost:3000');
});
```

复制代码需要我们注意的是：代理服务器，直接与浏览器相连接，也必须需要遵守 浏览器的同源策略，

3. 真实服务器：4000 端口

```js
const http = require('http');

const data = { name: 'BruceLee', password: '123456' };

const server = http.createServer((request, response) => {

    if (request.url === '/') {
        response.end( JSON.stringify(data) );
    }

});
 
server.listen(4000, () => {
    console.log('The server is running at http://localhost:4000');
});
```
代理服务器解决跨域问题了，并且不需要后台做任何设置。

两点：
1. 客户端与代理服务器，直接与浏览器相连接，也必须需要遵守 浏览器的同源策略
2. 代理服务器与真实服务器，后端与后端对接

## 九种跨域方式实现原理（完整版）
### 1. jsonp
- JSONP原理
==利用 <script> 标签没有跨域限制的漏洞==，网页可以得到从其他来源动态产生的 JSON 数据。JSONP请求一定需要对方的服务器做支持才可以。

- JSONP和AJAX对比
JSONP和AJAX相同，都是客户端向服务器端发送请求，从服务器端获取数据的方式。但AJAX属于同源策略，==JSONP属于非同源策略（跨域请求）==

- JSONP优缺点
JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。  
==缺点是仅支持get方法具有局限性,不安全可能会遭受XSS攻击==。

### 2.CORS
CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。

浏览器会自动进行 CORS 通信，实现 CORS
通信的关键是后端。
只要后端实现了 CORS，就实现了跨域。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。

该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。
虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为简单请求和复杂请求。

### 3.postMessage
postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题：

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面与嵌套的iframe消息传递
- 上面三个场景的跨域数据传递

postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递


```js
otherWindow.postMessage(message, targetOrigin, [transfer]);
```



- message: 将要发送到其他 window的数据。
- targetOrigin:通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。
- transfer(可选)：是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。


```html
// a.html 内嵌在http://localhost:3000/a.html
<iframe src="http://localhost:4000/b.html" id="frame" onload="load()">
</iframe> 
<script>
  function load() {
    let frame = document.getElementById('frame')
    frame.contentWindow.postMessage('我爱你', 'http://localhost:4000') //发送数据
    window.onmessage = function(e) { //接受返回数据
      console.log(e.data) //我不爱你
    }
  }
</script>

<script>
// b.html
 window.onmessage = function(e) {
    console.log(e.data) //我爱你
    e.source.postMessage('我不爱你', e.origin)
 }
</script>
```

### 4.websocket
Websocket是HTML5的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。WebSocket和HTTP都是应用层协议，都基于 TCP 协议。

但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据

。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。


原生WebSocket API使用起来不太方便，我们使用Socket.io，它很好地封装了webSocket接口，提供了更简单、灵活的接口，也对不支持webSocket的浏览器提供了向下兼容。

我们先来看个例子：本地文件socket.html向localhost:3000发生数据和接受数据

```html
// socket.html
<script>
    let socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
      socket.send('我爱你');//向服务器发送数据
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
</script>
```

```js
// server.js
let express = require('express');
let app = express();
let WebSocket = require('ws');//记得安装ws
let wss = new WebSocket.Server({port:3000});
wss.on('connection',function(ws) {
  ws.on('message', function (data) {
    console.log(data);
    ws.send('我不爱你')
  });
})
```
### Node中间件代理服务器(两次跨域)
参见上面代理服务器

### 6.nginx反向代理
实现原理类似于Node中间件代理，需要你搭建一个中转nginx服务器，用于转发请求。

使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。

实现思路：通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。

将nginx目录下的nginx.conf修改如下:

```
// proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

通过命令行nginx -s reload启动nginx


```js
// index.html
var xhr = new XMLHttpRequest();
// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;
// 访问nginx中的代理服务器
xhr.open('get', 'http://www.domain1.com:81/?user=admin', true);
xhr.send();


// server.js
var http = require('http');
var server = http.createServer();
var qs = require('querystring');
server.on('request', function(req, res) {
    var params = qs.parse(req.url.substring(2));
    // 向前台写cookie
    res.writeHead(200, {
        'Set-Cookie': 'l=a123456;Path=/;Domain=www.domain2.com;HttpOnly'   // HttpOnly:脚本无法读取
    });
    res.write(JSON.stringify(params));
    res.end();
});
server.listen('8080');
console.log('Server is running at port 8080...');
```

### 7.window.name + iframe
window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。

其中a.html和b.html是同域的，
都是http://localhost:3000;  
而c.html是http://localhost:4000  

```html
 // a.html(http://localhost:3000/b.html)
  <iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe>
  <script>
    let first = true
    // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
    function load() {
      if(first){
      // 第1次onload(跨域页)成功后，切换到同域代理页面
        let iframe = document.getElementById('iframe');
        iframe.src = 'http://localhost:3000/b.html';
        first = false;
      }else{
      // 第2次onload(同域b.html页)成功后，读取同域window.name中数据
        console.log(iframe.contentWindow.name);
      }
    }
  </script>
```
b.html为中间代理页，与a.html同域，内容为空。

```
// c.html(http://localhost:4000/c.html)
  <script>
    window.name = '我不爱你'  
  </script>
```

总结：通过iframe的src属性由外域转向本地域，跨域数据即由iframe的window.name从外域传递到本地域。这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作。


### 8.location.hash +  iframe
实现原理： a.html欲与c.html跨域相互通信，通过中间页b.html来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。
具体实现步骤：一开始a.html给c.html传一个hash值，然后c.html收到hash值后，再把hash值传递给b.html，最后b.html将结果放到a.html的hash值中。  

同样的，a.html和b.html是同域的，都是http://localhost:3000;而c.html是http://localhost:4000


```html
// a.html
  <iframe src="http://localhost:4000/c.html#iloveyou"></iframe>
  <script>
    window.onhashchange = function () { //检测hash的变化
      console.log(location.hash);
    }
  </script>
```

```html
// b.html
<script>
    window.parent.parent.location.hash = location.hash 
    //b.html将结果放到a.html的hash值中，b.html可通过parent.parent访问a.html页面
</script>
```

```js
// c.html
console.log(location.hash);
let iframe = document.createElement('iframe');
iframe.src = 'http://localhost:3000/b.html#idontloveyou';
document.body.appendChild(iframe);
```

### 9.document.domain + iframe

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。

只需要给页面添加 document.domain ='test.com' 表示二级域名都相同就可以实现跨域。

实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。

我们看个例子：  
页面a.zf1.cn:3000/a.html  
获取页面b.zf1.cn:3000/b.html中a的值  

```html
// a.html
<body>
 helloa
  <iframe src="http://b.zf1.cn:3000/b.html" frameborder="0" onload="load()" id="frame"></iframe>
  <script>
    document.domain = 'zf1.cn'
    function load() {
      console.log(frame.contentWindow.a);
    }
  </script>
</body>
```

```html
// b.html
<body>
   hellob
   <script>
     document.domain = 'zf1.cn'
     var a = 100;
   </script>
</body>
```


## 三、总结
- 
- CORS支持所有类型的HTTP请求，是跨域HTTP请求的根本解决方案
- JSONP只支持GET请求，JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。
- 不管是Node中间件代理还是nginx反向代理，主要是通过同源策略对服务器不加限制。
- 日常工作中，==用得比较多的跨域方案是cors和nginx反向代理==

参考：
- https://www.jianshu.com/p/5dce55bff521
- https://juejin.im/post/5c23993de51d457b8c1f4ee1