多进程架构  
==依靠node提供的child_process模块，创建工作线程，实现多核cpu的利用==

child_process 模块用于创建和控制子进程，其中最核心的是 .spawn() ，其他 API 算是针对特定场景对它的封装。使用前要先 require 进来：

```js
const cp = require('child_process');
```

child_process 是 Node.js 中一个非常重要的模块，主要功能有：

1. 创建子进程
1. 主进程与子进程通信
1. 主进程读取子进程返回结果 

使用 child_process 模块创建进程一共有六种方法（Node.js v7.1.0）

#### 异步创建进程
- child_process.exec(command[, options][, callback])
- child_process.execFile(file[, args][, options][, callback])
- child_process.fork(modulePath[, args][, options])
- child_process.spawn(command[, args][, options])
#### 同步创建进程
- child_process.execFileSync(file[, args][, options])
- child_process.execSync(command[, options])
- child_process.spawnSync(command[, args][, options])  


以异步函数中 spawn 是最基本的创建子进程的函数，其他三个异步函数都是对 spawn 不同程度的封装。spawn 只能运行指定的程序，参数需要在列表中给出，而 exec 可以直接运行复杂的命令。


#### 说明
- spawn() 启动一个子进程来执行命令
    - options.detached 父进程死后是否允许子进程存活
    - options.stdio 指定子进程的三个标准流
- spawnSync() 同步版的 spawn, 可指定超时, 返回的对象可获得子进程的情况
- exec() 启动一个子进程来执行命令, ==带回调参数获知子进程的情况==, 可指定进程运行的超时时间
- execSync() 同步版的 exec(), 可指定超时, 返回子进程的输出 (stdout)
- execFile() 启动一个子进程来执行一个可执行文件, 可指定进程运行的超时时间
- execFileSync() 同步版的 execFile(), 返回子进程的输出, 如何超时或者 exit code 不为 0, 会直接 throw Error
- fork() 加强版的 spawn(), 返回值是 ChildProcess 对象可以与子进程交互


其中 ==exec/execSync 方法会直接调用 bash 来解释命令==, 所以如果有命令有外部参数, 则需要注意被注入的情况.

#### 常用方法

类型  | 回调/异常  | 进程类型  | 执行类型  | 可设置超时
---|---|---|---|---
spawn()     | X | 任意 | 命令       |  X
exec()      | √ | 任意 | 命令       |  √ 
execFile()  | √ | 任意 | 可执行文件 |  √ 
fork()      | √ | 任意 | js文件     |  X 




#### exec(command[, options][, callback])
exec() 方法用于执行 shell 命令
第一个参数是字符串形式的命令，
第二个参数（可选）用来指定子进程运行时的定制化操作，
第三个参数（可选）用来设置执行完命令的回调函数。
比如在一个特定目录 /Users/huangtengfei/abc 下执行 ls -l 命令：
```js
cp.exec('ls -l', {cwd: '/Users/huangtengfei/abc'}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
})
```

#### execFile

```
child_process.execFile(file[, args][, options][, callback])
```


- file 要执行程序的文件或命令名。字符串类型
- args 要执行程序或命令的参数列表。数组类型
- options 可选参数对象，与exec的options对象相同
- callback 子进程执行完毕的回调函数。与exec的callback函数相同
- 返回值: ChildProcess 对象
```js
const { execFile } = require('child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
 if (error) {
   throw error;
 }
 console.log(stdout);
});
```

与exec()方法类似，但不通过shell来执行（所以性能稍好一点），所以要求传入可执行文件。Windows下某些文件无法直接执行，比如.bat和.cmd，这些文件就不能用execFile()来执行，只能借助exec()或开启了shell选项的spawn()


那么，什么时候使用 exec，什么时候使用 execFile 呢？

如果命令参数是由用户来输入的，对于 exec 函数来说是有安全性风险的，因为 Shell 会运行多行命令，比如 ’ls -l .;pwd，如逗号分隔，之后的命令也会被系统运行。但使用 exeFile 命令时，命令和参数分来，防止了参数注入的安全风险。

==P.S.与exec()一样也不是基于stream的，同样存在输出数据量风险==

#### spawn(command[, args][, options])
- command: 执行的命令
- args: 参数列表，可输入多的参数
- options: 环境变量对象
- return: 返回一个ChildProcess 类的实例

spawn() 用来创建一个子进程执行特定命令
与 exec() 的==区别是它没有回调函数==，只能通过监听事件来获取运行结果，它适用于子进程长时间运行的情况，可以实时输出结果。
属于异步执行，适用于子进程长时间运行的情况。

```js
const ls = cp.spawn('ls', ['-l']);
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```


使用 ==spawn== 可以实现一个简单的==守护进程==，在工作进程不正常退出时重启工作进程：

```js
/* daemon.js */
function spawn(mainModule) {
    const worker = cp.spawn('node', [ mainModule ]);

    worker.on('exit', function (code) {
        if (code !== 0) {
            spawn(mainModule);
        }
    });
}
spawn('worker.js');
```


#### fork(modulePath[, args][, options])
fork() 用来创建一个子进程执行 node 脚本，fork('./child.js') 相当于 spawn('node', ['./child.js'])，区别在于 fork 会在父子进程之间建立一个通信管道（fork() 的返回值），用于进程间通信。

对该通信管道对象可以监听 message 事件，用来获取子进程返回的信息，也可以向子进程发送信息。


```js
/* main.js */
const proc = cp.fork('./child.js');
proc.on('message', function(msg) {
  console.log(`parent got message: ${msg}`);
});
proc.send({ hello: 'world' });

/* child.js */
process.on('message', function(msg) {
  console.log(`child got message: ${msg}`);
});
process.send({ foo: 'bar' });
```
![image](https://lz5z.com/assets/img/process_ipc.png)  


> 进程间通信原理：  
> IPC 全称是 Inter-Process Communication，即进程间通信，Node 实现 IPC 使用管道(pipe)技术，具体实现细节由 libuv 提供。在 Windows 下由命名管道（named pipe）实现，Linux 下采用 Unix Domain Socket 实现。表现在应用层上的进程间通信只有简单的 message 事件和 send() 方法。父进程在实际创建子进程之前，会创建 IPC 通道并监听它，然后才真正创建出子进程，并且通过环境变量 NODE_CHANNEL_FD 告诉子进程这个 IPC 通道的文件描述符。子进程通过这个文件描述符去连接这个已存在的 IPC 通道，从而完成父子进程之间的连接。

因为==fork()自带通信机制的优势==，尤其适合用来拆分耗时逻辑，例如：


```js
const http = require('http');
const longComputation = () => {
 let sum = 0;
 for (let i = 0; i < 1e9; i++) {
   sum += i;
 };
 return sum;
};
const server = http.createServer();
server.on('request', (req, res) => {
 if (req.url === '/compute') {
   const sum = longComputation();
   return res.end(`Sum is ${sum}`);
 } else {
   res.end('Ok')
 }
});server.listen(3000);
```



### Windows
在Windows上执行一个 .bat 或者 .cmd 文件的方式略有不同。

假如有一个bat文件 my.bat

#### spawn


```js
const spawn = require('child_process').spawn;
const bat = spawn('cmd.exe', ['/c', 'my.bat']);

bat.stdout.on('data', (data) => {
  console.log(data);
});

bat.stderr.on('data', (data) => {
  console.log(data);
});

bat.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});
```


#### exec


```js
const exec = require('child_process').exec;
exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});
```

如果文件名中有空格：


```js
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell:true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```


http://huangtengfei.com/2017/03/process/

https://cloud.tencent.com/developer/article/1444616