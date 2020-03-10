## Process 对象
这里来讨论 Node.js 中的 process 对象. 直接在代码中通过 console.log(process) 即可打印出来. 可以看到 process 对象暴露了非常多有用的属性以及方法, 具体的细节见官方文档, 已经说的挺详细了. 其中包括但不限于:

- 进程基础信息
- 进程Usage
- 进程级事件
- 依赖模块/版本信息
- OS 基础信息
- 账户信息
- 信号收发
- 三个标准流

process.nextTick
上一节已经提到过 process.nextTick 了, 这是一个你需要了解的, 重要的, 基础方法.

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
   
 ```  

process.nextTick 并不属于 Event loop 中的某一个阶段, 而是在 Event loop 的每一个阶段结束后, 直接执行 nextTickQueue 中插入的 "Tick", 并且直到整个 Queue 处理完. 所以面试时又有可以问的问题了, 递归调用 process.nextTick 会怎么样? (doge


```
function test() { 
  process.nextTick(() => test());
}
```

这种情况与以下情况, 有什么区别? 为什么?


```
function test() { 
  setTimeout(() => test(), 0);
}
```
#### 配置
配置是开发部署中一个很常见的问题. 普通的配置有两种方式, 一是定义配置文件, 二是使用环境变量.

#### 常用属性
- argv 属性返回一个数组，第一个元素是 node，第二个元素是脚本文件名称，其余成员是脚本文件的参数。
- env 返回一个对象，包含了当前 Shell 的所有环境变量，比如：
- stdin/stdout
    - process.stdin 指向标准输入（键盘到缓冲区里的东西），返回一个可读的流：
    - process.stdout 指向标准输出（向用户显示内容），返回一个可写的流：


```js
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`data: ${chunk}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});

const fs = require('fs');

fs.createReadStream('wow.txt')
  .pipe(process.stdout);
```
#### 常用方法

cwd()
process.cwd() 返回运行 Node 的工作目录（绝对路径），比如在目录 /Users/huangtengfei/abc 下执行 node server.js，那么 process.cwd() 返回的就是 /Users/huangtengfei/abc。

另一个常用的获取路径的方法是 __dirname，它返回的是执行文件时该文件在文件系统中所在的目录。注意 process.cwd() 和 __dirname 的不同，前者是进程发起时的位置，后者是脚本的位置，两者可能不一致。

- on()
process 对象部署了 EventEmitter 接口，可以使用 process.on() 方法监听各种事件，并指定回调函数。比如监听到系统发出进程终止信号时关闭服务器然后退出进程：

```js
process.on('SIGTERM', function () {
  server.close(function () {
    process.exit(0);
  });
});
```

- exit()
process.exit() 会让 Node 立即终止当前进程（同步），参数为一个退出状态码，0 表示成功，大于 0 的任意整数表示失败。

- kill()
process.kill() 用来对特定 id 的进程（process.pid）发送信号，默认为 SIGINT 信号。比如杀死当前进程：
```js
process.kill(process.pid, 'SIGTERM');
```
虽然名字叫 kill ，但其实 process.kill() 只是负责发送信号，具体发送完信号之后这个怎么处理这个指定进程，取决于信号种类和接收到这个信号之后做了什么操作（比如 process.exit() 或者只是 console.log('Ignored this single')）。
