## Cluster 模块
Node.js 默认单进程执行，但这样就无法利用多核计算机的资源，cluster 模块的出现就是为了解决这个问题的。

在开发服务器程序时，可以通过 cluster 创建一个主进程和多个 worker 进程，让每个 worker 进程运行在一个核上，统一通过主进程监听端口和分发请求。


```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
#### 常用属性和方法
##### cluster.isMaster 
用来判断当前进程是否是主进程，cluster.isWorker 用来判断当前进程是否是工作进程，两者返回的都是布尔值。

##### workers 
cluster.workers 是一个包含所有 worker 进程的对象，key 为 worker.id，value 为 worker 进程对象。

```js
// 遍历所有 workers
function eachWorker(callback) {
  for (const id in cluster.workers) {
    callback(cluster.workers[id]);
  }
}
eachWorker((worker) => {
  worker.send('big announcement to all workers');
});
```


##### fork([env])
cluster.fork() 方法用来新建一个 worker 进程，默认上下文复制主进程，只有主进程可调用。

#### 常用事件
- listening  
在工作进程调用 listen 方法后，会触发一个 listening 事件，这个事件可以被 cluster.on('listening') 监听。
比如每当一个 worker 进程连进来时，输出一条 log 信息：



```js
cluster.on('listening', (worker, address) => {
  console.log(
    `A worker is now connected to ${address.address}:${address.port}`);
});
```

- exit
在工作进程挂掉时，会触发一个 exit 事件，这个事件可以被 cluster.on('exit') 监听。

比如自动重启 worker：


```
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d died (%s). restarting...',
    worker.process.pid, signal || code);
  cluster.fork();
});
```

#### worker 对象
worker 对象是 cluster.fork() 的返回值，代表一个 worker 进程。

worker.id
worker.id 是当前 worker 的唯一标识，也是保存在 cluster.workers 中的 key 值。

worker.process
所有的 worker 进程都是通过 child_process.fork() 生成的，这个进程对象保存在 worker.process 中。

worker.send()
worker.send() 用在主进程给子进程发送消息，在子进程中，使用 process.on() 监听消息并使用 process.send() 发送消息。

```js
if (cluster.isMaster) {
  const worker = cluster.fork();
  worker.send('hi there');
} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```
