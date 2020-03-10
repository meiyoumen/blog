[TOC]
# koa是什么
koa是一个精简的node框架，它主要做了以下事情：
- 基于 `node`原生 `req` 和 `res` 为 `request` 和 `response` 对象赋能，==并基于它们封装成一个`context`对象==。
- 基于`async/await（generator）` 的==中间件洋葱模型机制==。

koa源码其实很简单，共4个文件：

```
── lib
   ├── application.js
   ├── context.js
   ├── request.js
   └── response.js
```
这4个文件其实也对应了koa的4个对象：

```
── lib
   ├── new Koa()  || ctx.app
   ├── ctx
   ├── ctx.req  || ctx.request
   └── ctx.res  || ctx.response
```

koa的四大对象：
- application.js 包含 app 的构造以及启动一个服务器
- context.js app 的 context 对象, 传入中间件的上下文对象
- request.js app 的请求对象，包含请求相关的一些属性
- response.js app 的响应对象，包含响应相关的一些属性

## 分析

### application.js
Koa暴露了 `Application` 对象作为入口，`Application`的几个属性挑重要的讲：
- middleware
- context
- request
- response

```js
/**
 * 依赖模块，包括但不止于下面的，只列出核心需要关注的内容
 */
const response = require('./response');
const compose = require('koa-compose');
const context = require('./context');
const request = require('./request');
const Emitter = require('events');
const convert = require('koa-convert');

/**
 * 继承Emitter，很重要，说明 Application 有异步事件的处理能力
 */
module.exports = class Application extends Emitter {
  constructor() {
    super();

    this.middleware = [];  // 该数组存放所有通过use函数的引入的中间件函数
    this.subdomainOffset = 2;  // 需要忽略的域名个数
    this.env = process.env.NODE_ENV || 'development';

    // 通过context.js、request.js、response.js创建对应的context、request、response。为什么用Object.create下面会讲解
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  
  }

  // 创建服务器
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());  //this.callback()是需要重点关注的部分，其实对应了http.createServer的参数(req, res)=> {}
    return server.listen(...args);
  }

   /*
      通过调用koa应用实例的use函数，形如：
      app.use(async (ctx, next) => {
          await next();
      });
      来加入中间件
    */
  use(fn) {
    if (isGeneratorFunction(fn)) {
       fn = convert(fn);  // 兼容koa1的generator写法，下文会讲解转换原理
    }
    this.middleware.push(fn); // 将传入的函数存放到middleware数组中
    return this;
  }

  // 返回一个类似(req, res) => {}的函数，该函数会作为参数传递给上文的listen函数中的http.createServer函数，作为请求处理的函数
  callback() {
    // 将所有传入use的函数通过koa-compose组合一下
    const fn = compose(this.middleware);

    const handleRequest = (req, res) => {
      // 基于req、res封装出更强大的ctx，下文会详细讲解
      const ctx = this.createContext(req, res);
      // 调用app实例上的handleRequest，注意区分本函数handleRequest
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  // 处理请求
  handleRequest(ctx, fnMiddleware) {
     // 省略，见下文
  }

  // 基于req、res封装出更强大的ctx
  createContext(req, res) {
    // 省略，见下文
  }
};
```
从上面代码中，我们可以总结出application.js核心其实处理了这4个事情：

1. 启动框架
2. 实现洋葱模型中间件机制
3. 封装高内聚的context
4. 实现异步函数的统一错误处理机制

### context.js

```js
const util = require('util');
const createError = require('http-errors');
const httpAssert = require('http-assert');
const delegate = require('delegates');

const proto = module.exports = {
  // 省略了一些不甚重要的函数
  onerror(err) {
    // 触发application实例的error事件
    this.app.emit('error', err, this);
  },
};


/*
 在application.createContext函数中
 
 被创建的context对象会挂载基于request.js实现的request对象和基于response.js实现的response对象。
 
 下面2个delegate的作用是让context对象代理request和response的部分属性和方法
 
*/

delegate(proto, 'response')
  .method('attachment')
  ...
  .access('status')
  ...
  .getter('writable')
  ...;

delegate(proto, 'request')
  .method('acceptsLanguages')
  ...
  .access('querystring')
  ...
  .getter('origin')
  ...;
```

从上面代码中，我们可以总结出context.js核心其实处理了这2个事情：
1. 错误事件处理
2. 代理 `response` 对象和 `request` 对象的部分属性和方法

### request.js

```js
module.exports = {
  // 在application.js的createContext函数中，会把node原生的req作为request对象(即request.js封装的对象)的属性
  // request对象会基于req封装很多便利的属性和方法
  
  get header() {
    return this.req.headers
  },

  set header(val) {
    this.req.headers = val
  }

  // 省略了大量类似的工具属性和方法
}
```
1request1 对象 ==基于node原生req封装了一系列便利属性和方==法，供处理请求时调用。

所以当你访问 `ctx.request.xxx` 的时候，实际上是在访问request对象上的赋值器（setter）和取值器（getter）。


### response.js

```js
module.exports = {
  // 在application.js的createContext函数中，会把node原生的res作为response对象（即response.js封装的对象）的属性
  // response对象与request对象类似，基于res封装了一系列便利的属性和方法
  get body() {
    return this._body;
  },

  set body(val) {
    // 支持string
    if ('string' == typeof val) {
    }

    // 支持buffer
    if (Buffer.isBuffer(val)) {
    }

    // 支持stream
    if ('function' == typeof val.pipe) {
    }

    // 支持json
    this.remove('Content-Length');
    this.type = 'json';
  }
 }
```

`response` 对象与 `request` 对象类似，就不再赘述。

值得注意的是，返回的body支持Buffer、Stream、String以及最常见的json，如上示例所示。

## 深入理解koa源码
通过上面的阅读，相信对koa有了一个初步认识，但毕竟是走马观花，本着追根问底的学术精神，还需要对大量细节进行揣摩。
下文会从 `初始化`、`启动应用`、`处理请求`等的角度，来对这过程中比较重要的细节进行讲解及延伸。  
如果彻底弄懂，会对`koa`以及`ES6`、`generator`、`async/await`、`co`、`异步中间件`等有更深一步的了解。

### 初始化
koa实例化：

```js
const Koa = require('koa')
const app = new Koa()
```

koa执行源码：


```js
module.exports = class Application extends Emitter {
  constructor() {
    super();
    this.proxy = false;
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = Object.create(context); //为什么要使用Object.create？ 见下面原因
    this.request = Object.create(request);
    this.response = Object.create(response);
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }
}
```

==实例化koa的时候，koa做了以下2件事==
- 继承Emitter，具备处理异步事件的能力。然而koa是如何处理，现在还不得而知，这里打个问号。
- 在创建实例过程中，有三个对象作为实例的属性被初始化，分别是`context`、`request`、`response`。还有我们熟悉的存放中间件的数组`mddleware`。

这里需要注意，是使用 `Object.create(xxx)` 对 `this.xxx` 进行赋值。

#### 为什么要使用Object.create
Object.create(xxx)作用：
根据xxx创建一个新对象，并且将xxx的属性和方法作为新的对象的proto。

举个例子，代码在demo02：

```js
const a = {
    name: 'rose',
    getName: function(){
        return 'rose'
    }
};

const b = Object.create(a);
console.log('a is ', a);
console.log('b is ', b);

var obj ={a: 1}
var b = Object.create(obj)

console.log(obj.a) // 1
console.log(b.a) // 1

b.a = 2
console.log(obj.a) //1
```

可以看到，`a` 的属性和方法已经挂载在 `b` 的原型（proto）下了。

所以我们立马可以想到Object.create貌似创建了一个新的对象，这个对象继承（关联）了obj的属性，改变新对象的同名属性并不会影响原对象。

如果直接==用“=”来赋值，只是一个对象的引用==。

那么，为什么会这样呢？是因为Object.create()复制了一个新对象么？
实际上并不是，只是Object.create()返回了一个新的空对象，并且这个空对象的构造函数的原型（prototype）是指向obj的。
所以当我们访问新对象`b.a`的时候实际上是通过`原型链访问的obj中的a`。  

当我们==试图修改b.a的时候==，这里有一个==知识点==（==对象的遮蔽效应，如果修改对象的一个与原型链同名属性，那么会在当前对象中新建一个改属性，这个属性拥有更高级的访问优先级，所以就会遮蔽原型链中的同名属性==）

```js
_create = function (o) {
    let F = function () {}
    F.prototype = o
    return new F()
}
```


所以，当执行完

```js
this.context = Object.create(context);
this.request = Object.create(request)
this.response = Object.create(response)
```

的时候，以`context`为例，其实是创建一个新对象，==使用`context`对象来提供新创建对象的proto，并且将这个对象赋值给`this.context`，实现了类继承的作用==。

#### 为什么不直接用 `this.context=context` 呢？
我的理解是：
1. 这样会导致两者==指向同一片内存==，==而不是实现继承的目的==
2. Object.create建了一个新的对象，这个对象继承（关联）了context的属性，改变新对象`this.context`的同名属性并不会影响原对象。



## 启动应用及处理请求
在实例化koa之后，接下来，使用 `app.use` 传入中间件函数

```js
app.use(async (ctx,next) => {
    await next();
})
```


koa对应执行源码：

```js
use(fn) {
    if (isGeneratorFunction(fn)) {
      fn = convert(fn);
    }
    this.middleware.push(fn);
    return this;
  }
```

当我们执行app.use的时候，koa做了这2件事情：

- 判断是否是generator函数，如果是，使用koa-convert做转换（koa3将不再支持generator）。
- 所有传入use的方法，会被push到middleware中。

这里做下延伸讲解，如何将generator函数转为类async函数。
如何将generator函数转为类async函数
koa2处于对koa1版本的兼容，中间件函数如果是generator函数的话，会使用koa-convert进行转换为`类async函数`。（不过到第三个版本，该兼容会取消）。

那么究竟是怎么转换的呢？

### generator和async区别

唯一的区别：==async会自动执行==，而==generator每次都要调用next函数==。

所以问题变为，如何让generator自动执行next函数？

回忆一下generator的知识：每次执行generator的next函数时，它会返回一个对象：

```js
{ value: xxx, done: false }
```

返回这个对象后，如果能再次执行next，就可以达到自动执行的目的了。

看下面的例子：

```js
function * gen(){
    yield new Promise((resolve,reject){
        //异步函数1
        if（成功）{
            resolve（）
        }else{
            reject();
        }
    });
    
    yield new Promise((resolve,reject){
        //异步函数2
        if（成功）{
            resolve（）
        }else{
            reject();
        }
    })
}
let g = gen();
let ret = g.next();
```

此时ret = { value: Promise实例; done: false}；value已经拿到了Promise对象，那就可以自己定义成功/失败的回调函数了。如：

ret.value.then(()=>{
        g.next();
    })
现在就大功告成啦。我们只要找到一个合适的方法让g.next()一直持续下去就可以自动执行了。

所以问题的关键在于yield的value必须是一个Promise。那么我们来看看co是如何把这些都东西都转化为


```js
function co(gen) {
  var ctx = this;                       // 把上下文转换为当前调用co的对象
  var args = slice.call(arguments, 1)  // 获取参数

  // we wrap everything in a promise to avoid promise chaining,
  // 不管你的gen是什么，都先用Promise包裹起来
  
  return new Promise(function(resolve, reject) {
    // 如果gen是函数，则修改gen的this为co中的this对象并执行gen
    if (typeof gen === 'function') gen = gen.apply(ctx, args);

   // 因为执行了gen，所以gen现在是一个有next和value的对象，如果gen不存在、或者不是函数则直接返回gen
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    // 执行类似上面示例g.next()的代码
    onFulfilled();

  
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);  // 执行每一个gen.next()
      } catch (e) {
        return reject(e);
      }
      next(ret);  //把执行得到的返回值传入到next函数中，next函数是自动执行的关键
    }


    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * Get the next value in the generator,
     * return a promise.
     */
    function next(ret) {
      // 如果ret.done=true说明迭代已经完毕，返回最后一次迭代的value
      if (ret.done) return resolve(ret.value);

      // 无论ret.value是什么，都转换为Promise，并且把上下文指向ctx
      var value = toPromise.call(ctx, ret.value);

      // 如果value是一个Promise，则继续在then中调用onFulfilled。相当于从头开始！！
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);

      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}
```

请留意上面代码的注释。

从上面代码可以得到这样的结论，co的思想其实就是：

把一个generator封装在一个Promise对象中，然后再这个Promise对象中再次把它的gen.next()也封装出Promise对象，相当于这个子Promise对象完成的时候也重复调用gen.next()。当所有迭代完成时，把父Promise对象resolve掉。这就成了一个类async函数了。

以上就是如何把generator函数转为类async的内容。

好啦，我们继续回来看koa的源码。

当执行完app.use时，服务还没启动，只有当执行到app.listen(3000)时，程序才真正启动。

koa源码：


```js
listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
```

这里使用了`node`原生`http.createServer`创建服务器，并把`this.callback()`作为参数传递进去。
可以知道，`this.callback()`返回的一定是这种形式：(req, res) => {}。继续看下this.callback代码。

```js
callback() {
    // compose处理所有中间件函数。洋葱模型实现核心
    const fn = compose(this.middleware);

    // 每次请求执行函数(req, res) => {}
    const handleRequest = (req, res) => {
      // 基于req和res封装ctx
      const ctx = this.createContext(req, res);
      // 调用handleRequest处理请求
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

 handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;

    // 调用context.js的onerror函数
    const onerror = err => ctx.onerror(err);

    // 处理响应内容
    const handleResponse = () => respond(ctx);

    // 确保一个流在关闭、完成和报错时都会执行响应的回调函数
    onFinished(res, onerror);

    // 中间件执行、统一错误处理机制的关键
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

从上面源码可以看到，有这几个细节很关键：

1. compose(this.middleware)做了什么事情（使用了koa-compose包）。
2. 如何实现洋葱式调用的？
3. context是如何处理的？createContext的作用是什么？
4. koa的统一错误处理机制是如何实现的？


### koa-compose和洋葱式调用
先看第一、二个问题。

看看koa-compose的精简源码：

```js
module.exports = compose

function compose(middleware) {
    return function (context, next) {
        //略
    }
}
```

`compose` 函数接收`middleware`数组作为参数，==middleware中每个对象都是async函数==，返回一个以`context`和`next`作为入参的函数，我们跟源码一样，称其为fnMiddleware。

在外部调用this.handleRequest的最后一行，运行了中间件：

```js
fnMiddleware(ctx).then(handleResponse).catch(onerror);
```

我们来看下fnMiddleware究竟是怎么实现的：

```js
function compose (middleware) {
  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

解释之前，我们通过一个例子来理解，假设加入了两个中间件。源码在demo01：

```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx,next) => {
    console.log("1-start");
    await next();
    console.log("1-end");
});

app.use(async (ctx, next) => {
    console.log("2-start");
    await next();
    console.log("2-end");
});
app.listen(3000);
```

我们逐步执行，

- 0：fnMiddleware(ctx)运行；
- 0：执行dispatch(0)；
- 0：进入dispatch函数，下图是各个参数对应的值。



### 单一context原则
接下来，我们再来看第3个问题 == context是如何处理的==？==createContext的作用是什么==？

`context` ==使用node原生的http监听回调函数中的req、res来进一步封装==。  

意味着对于==每一个http请求==，==`koa`都会创建一个 `context ` 并共享给`所有的全局中间件使用`，当所有的中间件执行完后，会将所有的数据统一交给res进行返回==。

所以，在每个中间件中我们才能取得req的数据进行处理，最后ctx再把要返回的body给res进行返回。

请记住句话：==每一个请求都有唯一一个context对象，所有的关于请求和响应的东西都放在其里面==。

下面来看context（即ctx）是怎么封装的：


```js
// 单一context原则
  createContext(req, res) {
    const context = Object.create(this.context); // 创建一个对象，使之拥有context的原型方法，后面以此类推
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }
```

本着==一个请求一个 `context` 的原则==，`context` 必须作为一个==临时对象存在==，所有的东西都必须放进一个对象，因此，从上面源码可以看到，app、req、res属性就此诞生。


请留意以上代码，==为什么app、req、res、ctx也存放在了request、和response对象中呢？==

使它们同时共享一个app、req、res、ctx，是为了将处理==职责进行转移==，当用户访问时，只需要ctx就可以获取koa提供的所有数据和方法，而koa会继续将这些职责进行划分，比如`request`是进一步封装req的，`response`是进一步封装res的，==这样职责得到了分散==，==降低了耦合度==，==同时共享所有资源使`context`具有高内聚的性质，内部元素互相能访问到==。

在createContext中，还有这样一行代码：


```js
context.state = {};
```

这里的 `state` 是专门负责==保存单个请求状态的空对象==，可以根据需要来管理内部内容。


### 异步函数的统一错误处理机制
#### koa的统一错误处理机制是如何实现的？
接下来，我们再来看第四个问题：koa的统一错误处理机制是如何实现的？

回忆一下我们如何在koa中统一处理错误，只需要让koa实例监听onerror事件就可以了。则所有的中间件逻辑错误都会在这里被捕获并处理。如下所示：

```js
app.on('error', err => {
  log.error('server error', err)
})
```


这是怎么做到的呢？核心代码如下（在上面提到的application.js的handleRequest函数中）：

```js
handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    // application.js也有onerror函数，但这里使用了context的onerror，
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);

    // 这里是中间件如果执行出错的话，都能执行到onerror的关键！！！
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

这里其实会有2个疑问：

1. 出错执行的回调函数是context.js的onerror函数，为什么在app上监听onerror事件，就能处理所有中间件的错误呢？

请看下context.js的onerror：
```js
onerror(err) {
    this.app.emit('error', err, this);
}
```

这里的 `this.app` 是对 `application`的引用，当`context.js`调用`onerror`时，==其实是触发application实例的error事件== 。 
该事件是基于“Application类继承自EventEmitter”这一事实。


2. 如何做到集中处理所有中间件的错误？

我们再来回顾一下洋葱模型的中间件实现源码：

```js
function compose (middleware) {
  return function (context, next) {
    let index = -1
    return dispatch(0)

    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

还有外部处理：

```js
// 这里是中间件如果执行出错的话，都能执行到onerror的关键！！！
return fnMiddleware(ctx).then(handleResponse).catch(onerror);
```

主要涉及这几个知识点：

- async函数返回一个Promise对象
- async函数内部抛出错误，会导致Promise对象变为reject状态。抛出的错误会被catch的回调函数(上面为onerror)捕获到。
- await命令后面的Promise对象如果变为reject状态，reject的参数也可以被catch的回调函数(上面为onerror)捕获到。

这样就可以理解为什么koa能实现异步函数的统一错误处理了。



### 委托模式
最后讲一下koa中使用的设计模式——委托模式。

当我们在使用context对象时，往往会这样使用：

- ctx.header 获取请求头
- ctx.method 获取请求方法
- ctx.url 获取请求url

这些对请求参数的获取都得益于`context.request`的许多属性都被委托在`context`上了


```js
delegate(proto, 'request')
  .method('acceptsLanguages')
  ...
  .access('method')
  ...
  .getter('URL')
  .getter('header')
  ...;
```

又比如，

1. ctx.body 设置响应体
1. ctx.status 设置响应状态码
1. ctx.redirect() 请求重定向

这些对响应参数的设置都得益于koa中的context.response的许多方法都被委托在context对象上了：


```js
delegate(proto, 'response')
  .method('redirect')
  ...
  .access('status')
  .access('body')
  ...;
```


#### delegate源码
delegates模块是由TJ大神写的，该模块的作用是将内部对象上的变量或函数委托到外部对象上。
然后我们就可以使用外部对象就能获取内部对象上的变量或函数。delegates委托方式有如下：

- getter: 外部对象可以通过该方法访问内部对象的值。
- setter：外部对象可以通过该方法设置内部对象的值。
- access: 该方法包含getter和setter功能。
- method: 该方法可以使外部对象直接调用内部对象的函数。

```js
/**
 * Expose `Delegator`.
 */

module.exports = Delegator;

/**
 * Initialize a delegator.
 *
 * @param {Object} proto
 * @param {String} target
 * @api public
 */

function Delegator(proto, target) {
  if (!(this instanceof Delegator)) return new Delegator(proto, target);
  this.proto = proto;
  this.target = target;
  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.method = function(name){
  var proto = this.proto;
  var target = this.target;
  this.methods.push(name);

  proto[name] = function(){
    return this[target][name].apply(this[target], arguments);
  };

  return this;
};

/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.access = function(name){
  return this.getter(name).setter(name);
};

/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.getter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.getters.push(name);

  proto.__defineGetter__(name, function(){
    return this[target][name];
  });

  return this;
};

/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.setter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.setters.push(name);

  proto.__defineSetter__(name, function(val){
    return this[target][name] = val;
  });

  return this;
};

/**
 * Delegator fluent accessor
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.fluent = function (name) {
  var proto = this.proto;
  var target = this.target;
  this.fluents.push(name);

  proto[name] = function(val){
    if ('undefined' != typeof val) {
      this[target][name] = val;
      return this;
    } else {
      return this[target][name];
    }
  };

  return this;
};
```



## 参考
- https://github.com/brunoyang/blog/issues/5
- https://developers.weixin.qq.com/community/develop/article/doc/0000e4c9290bc069f3380e7645b813
- https://happyhls.me/2018/10/16/egg-koa-source-code-analysis/
- http://bugzhang.com/?p=228
- https://my.oschina.net/u/3361610/blog/1649987
- http://zhangxiang958.github.io/2018/04/03/koa%20%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90/
- https://juejin.im/entry/59e747f0f265da431c6f668e