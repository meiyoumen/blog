[TOC]
# 目录
## 管道将输入定位到输出
首先，我们可以通过管道将输入定位到输出，输入输出可以是控制台或者文件流或者http请求，比如

```js
process.stdin.pipe(process.stdout)
process.stdin.pipe(fs.createWriteStream(path))
fs.createReadStream(path).pipe(process.stdin)
```
## pipe中间进行处理
如果我们想要在管道中间进行处理，比如想将输入的字符串变成大写写到输出里，我们可以使用一些可以作为中间处理的框架，比如through2就很方便

```js
var through2  = require('through2')
var stream = through2(write,end)

process.stdin
    .pipe(stream)
    .pipe(process.stdout)
 
function write(line,_,next){
    this.push(line.toString().toUpperCase())
    next()
}

function end(done) {
    done()
}
```
## stream转化成普通回调

当我们输入是流，而输出是个普通函数，我们需要把输入流转化为普通的buffer，这时可以试用concat-stream库

```js
var concat = require('concat-stream');
 
var reverseStream=concat(function(text){
    console.log(text.toString().split("").reverse().join(""));
})

process.stdin.pipe(reverseStream)

```

## http server中的流
类似stdin和fs，http由于其特性也适合使用流，所以其自带类似特性

```js
var http = require('http')
var server = http.createServer(function(req,res){
    req.pipe(res)
})
```

## 既作为输入也作为输出的流
request框架实现了如下功能，将一个流pipe到request请求中，然后将流的内容发给服务器，然后返回作为流供其他代码使用，实现如下

```js
var request = require('request')
var r = request.post('http://localhost:8099')
process.stdin.pipe(r).pipe(process.stdout)
```

## 分支管道
下边是一个例子，这个例子将输入管道中html包含loud class的元素放入另一个管道进行大写操作，然后最后合并成输出

```js
var trumpet = require('trumpet');
var through2 = require('through2');
var fs = require('fs');
var tr = trumpet();
var stream = tr.select('.loud').createStream()

var upper = through2(function(buf,_,next){
    this.push(buf.toString().toUpperCase());
    next();
})
stream.pipe(upper).pipe(stream);
process.stdin.pipe(tr).pipe(process.stdout)
```


## 合并输入输出stream例子
合并后的输入输出可像前文request一样使用，下边这个例子实现了使用流的方式进行子进程调用

```js
var spawn = require('child_process').spawn;
var duplexer2 = require('duplexer2');
 
module.exports = function(cmd, args){
    var c = spawn(cmd,args)
    return duplexer2(c.stdin,c.stdout)
}
```


## 总结
通过上边的例子，可以知道stream应该还有如何合并等更复杂的应用方式。总之整体上符合如下特性：

- Stream分为readable、writeble
- ==Stream通过pipe方法控制流向==
- ==httpServer和httpClient和file system和process.stdin\out\err通常可以作为stream==
- Stream可以被on(event)转化为普通的变量，普通变量可以被write转换成stream
- Stream自身可以被拆分、合并、过滤


# 参考
- 理解nodejs的stream和pipe机制 http://www.01happy.com/nodejs-stream-pipe/
- 理解nodejs的stream和pipe机制的原理和实现 http://www.ishenping.com/ArtInfo/3223470.html
- http://www.ishenping.com/ArtInfo/3223470.html
- 通过源码解析 Node.js 中导流（pipe）的实现 https://cnodejs.org/topic/56ba030271204e03637a3870
- https://cloud.githubusercontent.com/assets/37303/5728694/f9a3e300-9b20-11e4-9e14-a6938b3327f0.png
- http://www.ishenping.com/ArtInfo/3223470.html