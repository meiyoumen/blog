# 进程通信
- IPC Inter-Process Communication 进程间通信
- node使用libuv提供的管道(pipe)实现IPC,在window中使用named pipe,*nix使用Unix Domain Socket实现
- 文件描述符：内核（kernel）利用文件描述符（file descriptor）来访问文件。文件描述符是非负整数。打开现存文件或新建文件时，内核会返回一个文件描述符，读写文件也需要使用文件描述符来指定待读写的文件。它是一个索引值，指向内核为每一个进程所维护的该进程打开文件的记录表

在创建工作线程之前会先创建IPC通道并监听，然后通过环境变量（NODE_CHANNEL_FD）告诉工作线程这个IPC通道的文件描述符，工作线程会根据它连接IPC通道完成进程连接。  


IPC通道类似socket属于双向通信，直接在系统内核中完成更高效，IPC被node抽象为stream对象，在调用send()时(类似write())发送数据，接收到消息会通过message事件(类似data)触发

## 句柄传递

```js
// parent.js
var cp = require('child_process');
var child1 = cp.fork('child.js');
var child2 = cp.fork('child.js');
// Open up the server object and send the handle 
var server = require('net').createServer();
server.listen(1337, function() { //主进程发送完句柄后关闭了监听
	child1.send('server', server);
	child2.send('server', server); 
	server.close();
});
// child.js
var http = require('http');
var server = http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});
	res.end('handled by child, pid is ' + process.pid + '\n');
});
process.on('message', function(m, tcp) {
	if (m === 'server') {
		tcp.on('connection', function(socket) {
			server.emit('connection', socket);
		});
	}
});
//多个工作线程同时监听相同端口
```
child_process().fork.send()可以发送的句柄有：

1. net.Socket tcp套接字
1. net.Server tcp服务器 建立在tcp服务上的应用层服务都可以
1. net.Native C++层面的tcp套接字或IPC管道
1. dgarm.Socket UDP套接字
1. dgram.Native c++层面的UDP套接字
send()方法在将消息发送到IPC前，会组装成两个对象 一个是handle 一个是message：

```json
{
    cmd: ‘NODE_HANDLE’,
    type: ‘net.Server’,
    msg: message
}
```
![image](https://wmtcore.com/picture/child_process_message.png)
message会先JSON.stringify()序列化再写入IPC管道（IPC通道只接受字符串），子线程再解析还原为对象，然后触发message事件，这其中还要进行过滤，如果message.cmd的值以NODE_为前缀，就会响应internalMessage事件，例如为NODE_HANDLE，就会取出message.type和得到的文件描述符一起还原

```js
//此处为接受到tcp服务器句柄后工作线程的还原过程
function(message, handle, emit) {
	var self = this;
	var server = new net.Server();
	server.listen(handle, function() {
		emit(server);
	});
} 
// 子进程根据message.type创建对应TCP服务对象,然后监听到文件描述符
```
==node进程之间只有消息传递，没有实例对象传递==

## 通过stdin/stdout传递json
stdin/stdout and a JSON payload

最直接的通信方式，拿到子进程的handle后，可以访问其stdio流，然后约定一种message格式开始愉快地通信：

```js
// parent.js
const { spawn } = require('child_process');
child = spawn('node', ['./stdio-child.js']);

child.stdout.setEncoding('utf8');

// 父进程-发
child.stdin.write(JSON.stringify({
 type: 'handshake',
 payload: '你好吖'
}));

// 父进程-收
child.stdout.on('data', function (chunk) {
 let data = chunk.toString();
 let message = JSON.parse(data);
 console.log(`${message.type} ${message.payload}`);
});
```

```js

process.stdin.on('data', chunk => {
    let data = chunk.toString()
    let msg = JSON.parese(data)
    
    switch(msg.type) {
        case 'handshake'
        process.stdout.write(.JSON.stringify({
            type: 'message',
            payload: msg.payload + ': hoho'
        }))
        break;
        default:
        break;
    }
})

```

==P.S.==  
VS Code进程间通信就采用了这种方式，具体见access electron API from vscode extension

明显的限制是需要拿到“子”进程的handle，两个完全独立的进程之间无法通过这种方式来通信（比如跨应用，甚至跨机器的场景）

P.S.   
关于stream及pipe的详细信息，请查看Node中的流


## 原生IPC支持
如spawn()及fork()的例子，进程之间可以借助内置的IPC机制通信
父进程：
- process.on('message')收
- child.send()发

子进程：
- process.on('message')收
- process.send()发

限制同上，同样要有一方能够拿到另一方的handle才行

## sockets
借助网络来完成进程间通信，不仅能跨进程，还能跨机器

node-ipc就采用这种方案，例如：


```js
// server
const ipc=require('../../../node-ipc');ipc.config.id = 'world';
ipc.config.retry= 1500;
ipc.config.maxConnections=1;ipc.serveNet(
   function(){
       ipc.server.on(
           'message',
           function(data,socket){
               ipc.log('got a message : ', data);
               ipc.server.emit(
                   socket,
                   'message',
                   data+' world!'
               );
           }
       );       ipc.server.on(
           'socket.disconnected',
           function(data,socket){
               console.log('DISCONNECTED\n\n',arguments);
           }
       );
   }
);
ipc.server.on(
   'error',
   function(err){
       ipc.log('Got an ERROR!',err);
   }
);
ipc.server.start();// client
const ipc=require('node-ipc');ipc.config.id = 'hello';
ipc.config.retry= 1500;ipc.connectToNet(
   'world',
   function(){
       ipc.of.world.on(
           'connect',
           function(){
               ipc.log('## connected to world ##', ipc.config.delay);
               ipc.of.world.emit(
                   'message',
                   'hello'
               );
           }
       );
       ipc.of.world.on(
           'disconnect',
           function(){
               ipc.log('disconnected from world');
           }
       );
       ipc.of.world.on(
           'message',
           function(data){
               ipc.log('got a message from world : ', data);
           }
       );
   }
);
```

P.S.更多示例见RIAEvangelist/node-ipc

当然，单机场景下通过网络来完成进程间通信有些浪费性能，但网络通信的优势在于跨环境的兼容性与更进一步的RPC场景


## message queue

父子进程都通过外部消息机制来通信，跨进程的能力取决于MQ支持

即进程间不直接通信，而是通过中间层（MQ），加一个控制层就能获得更多灵活性和优势：

- 稳定性：消息机制提供了强大的稳定性保证，比如确认送达（消息回执ACK），失败重发/防止多发等等
- 优先级控制：允许调整消息响应次序
- 离线能力：消息可以被缓存
- 事务性消息处理：把关联消息组合成事务，保证其送达顺序及完整性
P.S.不好实现？包一层能解决吗，不行就包两层……

比较受欢迎的有smrchy/rsmq，例如：


```js
// init
RedisSMQ = require("rsmq");
rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );
// create queue
rsmq.createQueue({qname:"myqueue"}, function (err, resp) {
   if (resp===1) {
     console.log("queue created")
   }
});
// send message
rsmq.sendMessage({qname:"myqueue", message:"Hello World"}, function (err, resp) {
 if (resp) {
   console.log("Message sent. ID:", resp);
 }
});
// receive message
rsmq.receiveMessage({qname:"myqueue"}, function (err, resp) {
 if (resp.id) {
   console.log("Message received.", resp)  
 }
 else {
   console.log("No messages for me...")
 }
});
```

会起一个Redis server，基本原理如下：
> Using a shared Redis server multiple Node.js processes can send / receive messages.

消息的收/发/缓存/持久化依靠Redis提供的能力，在此基础上实现完整的队列机制


## Redis
基本思路与message queue类似：

Use Redis as a message bus/broker.

Redis自带Pub/Sub机制（即发布-订阅模式），适用于简单的通信场景，比如一对一或一对多并且不关注消息可靠性的场景

另外，Redis有list结构，可以用作消息队列，以此提高消息可靠性。一般做法是生产者LPUSH消息，消费者BRPOP消息。适用于要求消息可靠性的简单通信场景，但缺点是消息不具状态，且没有ACK机制，无法满足复杂的通信需求

P.S.Redis的Pub/Sub示例见What’s the most efficient node.js inter-process communication library/method?

四.总结
Node进程间通信有4种方式：

- 通过stdin/stdout传递json：最直接的方式，适用于能够拿到“子”进程handle的场景，适用于关联进程之间通信，无法跨机器
- Node原生IPC支持：最native（地道？）的方式，比上一种“正规”一些，具有同样的局限性
- 通过sockets：最通用的方式，有良好的跨环境能力，但存在网络的性能损耗
- 借助message queue：最强大的方式，既然要通信，场景还复杂，不妨扩展出一层消息中间件，漂亮地解决各种通信问题


# 端口共同监听
多进程使用相同的文件描述符
node底层对每个端口监听都设置了SO_REUSEADDR，可以让不同进程对相同的网卡和端口监听，即服务端套接字可以被多进程服用


```
setsockopt(tcp->io_watcher.fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on));
```


当独立启动进程时，多个tcp服务器socket套接字的文件描述符互不相同，所以在监听相同端口时会报错。但send()发送句柄再启动的服务，它们引用了相同的文件描述符，并且文件描述符同一时间只能被一个进程使用，所以当网络请求来时，会出现抢占式服务

参考：  
https://wmtcore.com/2016/08/23/nodejs多进程/