[TOC]
# 四种基本类型的流
- Readable - 可读操作。 (如 ==fs.createReadStream()==)
- Writable - 可写操作。 (如 ==fs.createWriteStream()==)
- Duplex - 可读可写操作。(如 ==net.Socket==)
- Transform - 在读写过程中可以修改和变换数据的 Duplex 流 (如 zlib.createDeflate())


```js
const Stream = require('stream')

const Readable = Stream.Readable   // 可读操作
const Writable = Stream.Writable   // 可写操作
const Duplex = Stream.Duplex       // 可读可写
const Transform = Stream.Transform // 读写过程中修改和变换数据的Duplex流
```
使用Stream可实现数据的流式处理，如：


```js
var fs = require('fs')
// `fs.createReadStream`创建一个`Readable`对象以读取`bigFile`的内容，并输出到标准输出
// 如果使用`fs.readFile`则可能由于文件过大而失败

fs.createReadStream(bigFile).pipe(process.stdout)
```

# 可读流 createReadStream
createReadStream ==实现了stream.Readable接口的对象==，将对象数据读取为流数据，当监听data事件后，开始发射数据

```js
var util = require('util')
var fs = require("fs")

fs.createReadStream = function(path, options) {
  return new ReadStream(path, options)
}
util.inherits(ReadStream, Readable)
```
## 创建可读流

```
var rs = fs.createReadStream(path,[options]);

1.path 读取文件的路径
2.options 
    flags打开文件要做的操作，默认为'r'
    encoding默认为null
    start开始读取的索引位置
    end结束读取的索引位置(包括结束位置)
    highWaterMark读取缓存区默认的大小64kb

> 如果指定utf8编码highWaterMark要大于3个字节
```
## 设置编码

```js
// 与指定{encoding:'utf8'}效果相同，设置编码
rs.setEncoding('utf8');
```
## 监听data事件

```js
// 一旦监听data事件时，流就可以读文件的内容，并且发射data。
// 根据设置的读取缓存区默认大小来决定，读一段发射一段，直到读完。

// 默认情况下，监听data事件后会不停的读数据，然后出发data事件，触发完data事件后，再次读数据。不会停。
// 希望流有一个暂停和恢复触发机制，见4.8 暂停和恢复触发data

rs.on('data', function (data) {
    console.log(data);
});
```


## 监听end事件

```js
// 文件读完了，会触发end事件
rs.on('end', function () {
    console.log('读取完成');
});
```


## 监听error事件

```js
// 文件读取出错了，会触发error事件
rs.on('error', function () {
    console.log("error");
});
```


## 监听open事件

```js
// 如果是文件流还会涉及到open和close两个事件
rs.on('open', function () {
    console.log("文件打开");
})
```

## 监听close事件

```js
// 如果是文件流还会涉及到open和close两个事件
rs.on('close', function () {
    console.log("文件关闭");
});
```


## 暂停和恢复触发data

```js
// 通过pause()方法和resume()方法
rs.on('data', function (data) {
    console.log(data);
    rs.pause(); // 暂停读取和发射data事件
    setTimeout(function () {
        rs.resume(); // 恢复读取并触发data事件
    },2000);
});
```

代码以上可以看到：
- open在data前，open 先打开文件，然后data读取完内容发射。
- end在close前，先发现文件读完了执行end，然后再关闭文件close


```js
// 流的方式读取
const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const readline = require('readline')

let filename = path.join(__dirname, './血染的风采.lrc')
let streamReader = fs.createReadStream(filename)
  .pipe(iconv.decodeStream('gbk'))
  // 进行流拷贝

let datas = ''
streamReader.on('data', (chunk) => {
  // 不断的读取数据 chunk文档片断 不完整
  //console.log(typeof chunk)
  datas += chunk.toString()
})

streamReader.on('end', () => {
  // 通知已经读取完，data此时完整文档
  console.log('end')
  console.log(datas)
})
```

## 可读流的两种模式


- 可读流事实上工作在下面两种模式之一：flowing 和 paused
- 在 flowing 模式下， 可读流自动从系统底层读取数据，并通过 EventEmitter 接口的事件尽快将数据提供给应用。
- 在 paused 模式下，必须显式调用 stream.read() 方法来从流中读取数据片段。
- 所有初始工作模式为 paused 的 Readable 流，可以通过下面三种途径切换到 flowing 模式：


```
监听 'data' 事件
var rs = fs.createReadStream(path,[options]);
调用 stream.resume() 方法
调用 stream.pipe() 方法将数据发送到 Writable
```

- 可读流可以通过下面途径切换到 paused 模式：
    - 如果不存在管道目标（pipe destination），可以通过调用 stream.pause() 方法实现。
    - 如果存在管道目标，可以通过取消 'data' 事件监听，并调用 stream.unpipe() 方法移除所有管道目标来实现。

==如果 Readable 切换到 flowing 模式，且没有消费者处理流中的数据，这些数据将会丢失==  
比如， 调用了 readable.resume() 方法却没有监听 'data' 事件，或是取消了 'data' 事件监听，就有可能出现这种情况。


# 可写流 createWriteStream
createWriteStream实现了stream.Writable接口的对象将流数据写入到对象中

```js
fs.createWriteStream = function(path, options) {
  return new WriteStream(path, options);
};

util.inherits(WriteStream, Writable);
```

## 创建可写流

往可写流里写数据时，不会立刻写入文件的，而会先写入缓存区，
==缓存区大小就是highWaterMark，默认16k==。然后等缓存区满了之后再真正的写入文件里。

```
var ws = fs.createWriteStream(path,[options]);

1. path写入的文件路径
2. options
    flags 打开文件要做的操作,默认为'w'
    encoding 默认为utf8
    start 开始位置
    highWaterMark 写入缓存区的默认大小16kb
```

### write方法
// write方法有返回值flag，按理说返回false就不能往里面写了，但是真的写了数据也不会丢失，会缓存在内存里。等缓存区清空后再从内存读取出来。

let flag = ws.write(chunk,[encoding],[callback]);

1. chunk写入的数据buffer/string
2. encoding编码格式chunk为字符串时有用，可选
3. callback 写入成功后的回调
> 返回值为布尔值，系统缓存区满时为false,未满时为true（缓存区不能接着写返回false，能接着写返回true）

### end方法
ws.end(chunk,[encoding],[callback]);

> 表明接下来没有数据要被写入 Writable 通过传入可选的 chunk 和 encoding 参数，可以在关闭流之前再写入一段数据 如果传入了可选的 callback 函数，它将作为 'finish' 事件的回调函数
复制代码5.4 drain方法

当一个流不处在 drain 的状态， 对 write() 的调用会缓存数据块， 并且返回 false。 一旦所有当前所有缓存的数据块都排空了（被操作系统接受来进行输出）， 那么 'drain' 事件就会被触发
建议， 一旦 write() 返回 false， 在 'drain' 事件触发前， 不能写入任何数据块

```js
// 监听可写流缓存区清空事件
// 缓存区满了后被清空了才会触发drain
ws.on('drain', function () {
    console.log('drain');
});
```


### finish方法

在调用了 stream.end() 方法，且缓冲区数据都已经传给底层系统之后， 'finish' 事件将被触发

```js
ws.end('结束');
ws.on('finish', function () {
    console.log("写入完成");
});
```


```js
const fs = require('fs')
const path = require('path')

// 创建文件的读取流，并没有读出正式的数据，开始了读取文件的任务（）
let reader = fs.createReadStream('F:\\soft\\vs2015.ent_chs.iso')

// 创建一个写入流
let writer = fs.createWriteStream('F:\\soft\\vs2015.ent_chs2.iso')


writer.on('pipe', (src) => {
    console.log(src=== reader) // true
})

// 更方便
let res = reader.pipe(writer) //读取流 非常快 内自自动控制缓冲区大小
```

```js
const fs = require("fs");
 
const rs = fs.createReadStream('c:/11.mp4');   // 文件读取流
const ws = fs.createWriteStream('c:/cc.mp4');  // 文件写入流
// rs.pipe(ws);  // 管道
 
rs.on('data',function(chunk) {
    console.log(chunk.length);  // 65536  chunk就是一个Buffer(存放16进制数据的"数组",长度以B字节计算(两个16进制为一个元素))
    ws.write(chunk);    // Node中的Buffer不占用垃圾回收机制中的内存。  Buffer是由C/C++模块维护。  'data'+chunk会在内部自动调用toString()函数。 建议直接返回buffer节省处理字符串的性能开销。
});
 
rs.on('end',function() {
    console.log('结束啦！');
    ws.end();
})

```


参考：
- 《Node.js设计模式》使用流进行编码 https://juejin.im/post/5a4a377151882546f00a68c9
- https://github.com/chencl1986/Blog/issues/55
- https://juejin.im/post/5afd57e851882542ac7d76af
- Node.js Stream（流）总结 https://juejin.im/post/5ac5b6315188257ddb0fd979
- Node Stream 精华版 https://github.com/ueumd/streamify-your-node-program
- https://juejin.im/post/5a4a377151882546f00a68c9#heading-19
- 在 Node.js 中读写大文件 https://morning.work/page/2015-07/read_and_write_big_file_in_nodejs.html
- Node.js 的 Readable Stream 与日志文件处理 https://morning.work/page/2016-07/readable-stream-and-log-files-processing-in-nodejs.html
- ReadStream & WriteStream 实现 https://juejin.im/post/5b43795951882519eb657d0b