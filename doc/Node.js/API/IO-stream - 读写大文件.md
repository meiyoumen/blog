[TOC]
# 因素
在 Node.js 中，我们可以通过两种方式来读取文件：

- 使用fs.readFile()一次性将文件内容全部读取出来，考虑到可能将来会操作几 G 大的文件，所以放弃了这种方式；
- 使用fs.createReadStream()创建一个读文件流，这种方式可不受限于文件的大小；
因此，我很顺理成章地选用了 `fs.createReadStream()` 来读取文件，自然在写文件时也使用对应的 `fs.createWriteStream()` 来做。

# 按行读写流

由于要操作的是文本文件，并且文件中的内容每一行记录均使用换行符\n来分隔，我编写了一个模块用来按行从一个stream中读取内容，以及按行往一个stream中写入内容，下面将介绍这个模块的简单使用方法。

```
npm install lei-stream --save
```

按行读取流

```js
var readLine = require('lei-stream').readLine

readLine('./myfile.txt').go(function (data, next) {
  console.log(data)
  
  next()
  
}, function () {
  console.log('end')
})
```
说明：

- `readLine()` 的第一个参数应该传入一个ReadStream实例，当传入的是一个字符串时，会把它当作一个文件，自动调用fs.createReadStream()来创建一个ReadStream
- `readLine()` 的第二个参数为读取到一行内容时的回调函数，为了便于控制读取速度，需要在回调函数中执行next()来继续读取下一行
- `readLine()` 的第三个参数为整个流读取完毕后的回调函数


另外，我们也可以指定各个选项来达到更个性化的控制：

```js
var fs = require('fs')
var readLine = require('lei-stream').readLine


// readLineStream 第一个参数为 ReadStream 实例，也可以为文件名
var s = readLine(fs.createReadStream('./myfile.txt'), {
  // 换行符，默认\n
  newline: '\n',
  // 是否自动读取下一行，默认 false
  autoNext: false,
  // 编码器，可以为函数或字符串（内置编码器：json，base64），默认 null
  encoding: function (data) {
    return JSON.parse(data);
  }
})

// 读取到一行数据时触发 data 事件
s.on('data', function (data) {
  console.log(data)
  s.next()
})

// 流结束时触发 end 事件
s.on('end', function () {
  console.log('end')
})
```

以下是关于readLine()的第二个参数的说明：

newLine表示换行符，默认为\n，当然也可以设置为任意字符，当读取到该字符时程序会认为该行数据已结束，并触发data事件
autoNext表示是否自动读取下一行的内容，默认为false，如果设置为true，则不需要手动执行next()函数来继续读取
encoding为编码器函数，默认为null，表示不对内容编码，我们可以自己指定一个编码器（要求该函数返回的是一个字符串），这样在每次write()一行数据时会自动调用该函数进行预处理
以下是读取数据过程中的一些说明：

当读取到一行数据时，会触发data事件
调用s.next()来读取下一行数据，如果在初始化readLine()时指定了autoNext=true，则可省略
当到达流末尾时，所有数据已读取完毕，会触发end事件

参考
- https://morning.work/page/2015-07/read_and_write_big_file_in_nodejs.html