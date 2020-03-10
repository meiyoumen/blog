[TOC]
# Koa中间件深入理解
## 如何写一个中间件
`koa的中间`件必须 ==`return `一个中间件函数MiddlewareFunction , 函数形式为(ctx,next)==, ==然后手动执行 next() 进入下一个中间件==

可以把next() 之前的函数想象为浏览器中事件的捕获capture阶段, next()之后为事件的冒泡bubble阶段.

中间件的执行很像一个洋葱，但并不是一层一层的执行，==而是以next为分界==，
- 先执行本层中next以前的部分，
- 当下一层中间件执行完后，再执行本层next以后的部分。

一个洋葱结构，从上往下一层一层进来，再从下往上一层一层回去，递归的形式。
![image](https://user-gold-cdn.xitu.io/2018/7/30/164e9e8c42ddd370?imageslim)  

demo
```js
const Koa = require('koa')
const app = new Koa()

// Middleware
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log('Middleware 1')
})


// Middleware2
app.use(async (ctx, next) => {
  console.log(2)
  await next()
  console.log('Middleware 2')
})

app.use((ctx) => {
  console.log(3)
  console.log('Koa Middleware')
  ctx.body = 'Hello from Koa'
})

app.listen(3000)

// curl http://localhost:3000
/*
输出结果：

1
2
3
Koa Middleware
Middleware 2
Middleware 1
*/

```
从上面结果可以看到，先执行本层中next以前的部分，当最下层中间执行完后，再执行next以后的部分，即：`Koa Middleware` -> `Middleware 2` -< `Middleware 1`。
接下来我们看看源码

## Koa 中间件编写及使用
`Koa` 中中间件即一个处理请求的方法，通过调用 `app.use(fn)` 后，中间件 fn 被保存到了内部一个==中间件数组中==。
[koa/lib/application.js#L105](https://github.com/koajs/koa/blob/75233d974a30af6e3b8ab38a73e5ede67172fc1c/lib/application.js#L105)

###  调用next()
```js
/**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    // 中间件必须是一个函数
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    
    // 中间件是不是 异步函数
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    
    // 将中间件保存到Application 对象的middleware数组中
    this.middleware.push(fn);
    return this;
  }
```
通过上面的代码可看到，注册的中间件被压入 `Application` 对象的 `this.middleware` 数组。

这里有对传入的方法进行判断，区分是否为生成器（[generator]）方法，因为较早版本的 Koa 其中间件是通过生成器来实现的，后面有 async/await 语法后转向了后者，所以更推荐使用后者，因此这里有废弃生成器方式的提示。

因为中间件中需要进行的操作是不可控的，完全有可能涉及异步操作，比如从远端获取数据或从数据库查询数据后返回到 ctx.body，==所以理论上中间件必需是异步函数==。

比如实现计算一个请求耗时的中间件，以下分别是通过普通函数配合 Promise 以及使用 async/await 方式实现的版本：

来自官方 README 中使用 Promise 实现中间件的示例代码

```js
// Middleware normally takes two parameters (ctx, next), ctx is the context for one request,
// next is a function that is invoked to execute the downstream middleware. It returns a Promise with a then function for running code after completion.

app.use((ctx, next) => {
  const start = Date.now();
  return next().then(() => {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
});
```

来自官方 README 中使用 async/await 实现中间件的示例代码

```js
app.use(async (ctx, next) => {
  const start = Date.now();
  
  await next();
  
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
```

可以看到，一个中间件其签名是 `(ctx,next)=>Promise`，其中
- `ctx 为请求上下文对`象，
- `next 是这样一个函数`，调用后将执行流程转入下一个中间件
- 如果当前中间件中==没有调用 next==，==整个中间件的执行流程则会在这里终止==，后续中间件不会得到执行。再拿上面demo测试:

### 不调用next()
```js
const Koa = require('koa')
const app = new Koa()

// Middleware
app.use(async (ctx, next) => {
  console.log(1)
  // await next()                   // 这里不再调用next方法
  console.log('Middleware 1')
})


// Middleware2
app.use(async (ctx, next) => {
  console.log(2)
  await next()
  console.log('Middleware 2')
})

app.use((ctx) => {
  console.log(3)
  console.log('Koa Middleware')
  ctx.body = 'Hello from Koa'
})

app.listen(3000)

// curl http://localhost:3000
/*
输出结果：

1
Middleware 1
*/
```
从结果中可以看出， ==整个中间件的执行Middleware 1完成后，流程则会在这里终止==，后续中间件不会得到执行。

### 等待next()
对于 Koa 来说还有一件事情至关重要。如果你调用 next()，你必须等待它！
```js
const Koa = require('koa')
const app = new Koa()

// Middleware
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log('Middleware 1')
})

// Simple Promise delay
function delay (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

app.use(async (ctx, next) => {
  ctx.status = 200
  console.log('Setting status')
  next() // forgot await!
})

app.use(async (ctx) => {
  await delay(3000) // simulate actual async behavior
  console.log('Setting body')
  ctx.body = 'Hello from Koa'
})

app.listen(3000)

/*

curl http://localhost:3000 OK

1
Setting status
Middleware 1
Setting body
*/
```
我们调用了 `next()`，但是==没有任何 body 信息传递==？  
这是因为 `Koa` 在中间件 ==Promise 链被解析了之后就结束了请求==。这意味着在我们设置 `ctx.body` 之前，==response 就已经被发送给了客户端!==



另一个需要明白的是如果你在使用纯粹的 Promise.then() 替代 async-await 时，你的中间件需要返回一个 promise。当返回的 promise 被解析时，Koa 会在此时恢复之前的中间件。


```js
app.use((ctx, next) => {
  ctx.status = 200
  console.log('Setting status')
  // need to return here, not using async-await
  return next()
})
```

一个更好的使用纯粹 promise 的例子：


```js
// We don't call `next()` because
// we don't want anything else to happen.
app.use((ctx) => {
  return delay(1000).then(() => {
    console.log('Setting body')
    ctx.body = 'Hello from Koa'
  })
})
```


## 中间的执行顺序原理
当多次调用 app.use 注册中间件后，这些中间件是如何被顺次执行的。

中间件的执行是跟随一次请求的。当一个请求来到后台，中间件被顺次执行，在各中间件中对请求 request 及 resposne 进行各种处理。

所以从 Koa 中处理请求的地方出发，找到中间件执行的源头。

通过查看 lib/application.js 中相关代码：

[lib/application.js#L127](https://github.com/koajs/koa/blob/75233d974a30af6e3b8ab38a73e5ede67172fc1c/lib/application.js#L127)
```js
callback() {
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```

可定位到存储在 `this.middleware` 中的中间件数组会传==递给 ==compose== 方法来处理==，处理后得到一个函数 fn。  
即这个 `compose` 方法处理后，==将一组中间件函数处理成了一个函数==，最终在 ==`handleRequest`== 处被调用，==开启了中间件的执行流程==。

[lib/application.js#L151](https://github.com/koajs/koa/blob/75233d974a30af6e3b8ab38a73e5ede67172fc1c/lib/application.js#L151)

```js
handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```
即 `compose` 的签名长这样：`compose([a, b, c, ...])`，它来自另一个单独的仓库 `koajs/compose`，其代码也不复杂：

[koajs/compose/index.js ](https://github.com/koajs/compose/blob/master/index.js)


```js
function compose(middleware) {
  if (!Array.isArray(middleware))
    throw new TypeError("Middleware stack must be an array!");
  for (const fn of middleware) {
    if (typeof fn !== "function")
      throw new TypeError("Middleware must be composed of functions!");
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function(context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```


这个方法只做了两件事，

- 定义了一个 dispatch 方法，
- 然后调用它 dispatch(0)

这里中间件从数组中取出并顺次执行的逻辑便在 `dispatch` 函数中。

- 整体方法体中维护了一个索引 index 其初始值为 -1，后面每调用一次 dispatch 会加 1。
- 当执行 dispatch(0) 时，从中间件数组 middleware 中取出第 0 个中间件并执行，同时将 dispatch(i+1) 作为 next 传递到下一次执行。

```js
let fn = middleware[i];
return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
```

==所以这里就能理解，为什么中间件中必需调用 next，否则后续中间件不会执行==。

这样一直进行下去直到所有中间件执行完毕，此时 `i === middleware.length`，最后一个中间件已经执行完毕，next 是没有值的，所以直接 resolve 掉结束中间件执行流程。

```js
if (i === middleware.length) fn = next;
if (!fn) return Promise.resolve();
```

回到中间件被唤起的地方：

[lib/application.js](https://github.com/koajs/koa/blob/75233d974a30af6e3b8ab38a73e5ede67172fc1c/lib/application.js#L127)


```js
fnMiddleware(ctx)
  .then(handleResponse)
  .catch(onerror);
```

中间件完成后，流程到了 handleResponse。


## 中间件的用法
### 中间件栈
多个中间件会形成一个栈结构（middle stack），==以"先进后出"（first-in-last-out）的顺序执行==。

- 最外层的中间件首先执行。
- 调用next函数，把执行权交给下一个中间件。
- 最内层的中间件最后执行。
- 执行结束后，把执行权交回上一层的中间件。
- 最外层的中间件收回执行权之后，执行next函数后面的代码。

实现的功能就是将所有的中间件串联起来，首先给倒数第一个中间件传入一个noop作为其next，再将这个整理后的倒数第一个中间作为next传入倒数第二个中间件，最终得到的next就是整理后的第一个中间件。  
![image](https://static.cnodejs.org/FqqHNh4U_H76zKWB2VVPeaFvbcIX)  


```js
const Koa = require('koa')
const app = new Koa()
const one = (ctx, next) => {
  console.log('>> one')
  next();
  console.log('<< one')
}
const two = (ctx, next) => {
  console.log('>> two')
  next();
  console.log('<< two')
}
const three = (ctx, next) => {
  console.log('>> three')
  next();
  console.log('<< three')
}
app.use(one)
app.use(two)
app.use(three)

app.listen(3000)


/*
>> one
>> two
>> three

<< three
<< two
<< one
*/
```
运行上面这个 demo。我们发现命令行窗口中输出的==内容和`"先进后出"（first-in-last-out）`的执行顺序一致==。

如果中间件内部没有调用next函数，那么执行权就不会传递下去。

### 异步中间件
迄今为止，所有例子的中间件都是同步的，不包含异步操作。如果有异步操作（比如读取数据库），中间件就必须写成 async 函数。

看下面的 async.js 文件中的代码；

```js
const fs = require('fs.promised')
const Koa = require('koa')
const app = new Koa()

const main = async function (ctx, next) {
  ctx.response.type = 'html'
  ctx.response.body = await fs.readFile('./demos/template.html', 'utf8')
}

app.use(main)
app.listen(3000)
```
上面代码中，==`fs.readFile`==是一个==异步操作==，必须写成await fs.readFile()，然后中间件必须写成 async 函数。

### 中间件的合成
`koa-compose`模块可以将多个中件合成为一个。

```js
const compose = require('koa-compose')

const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`)
  next()
}

const main = ctx => {
  ctx.response.body = 'Hello World'
}

const middlewares = compose([logger, main]);
app.use(middlewares);
```

## 改变游戏规则的特性

举个例子，要实现一个记录完成请求所需的时间并将其发送到 X-ResponseTime 头部的中间件，需要一个“在下一个调用之前”的代码点和一个“在下一个调用之后”的代码点。在 Express 中，它使用流观察的技术来实现。

让我们在 Koa 中来实现它。

```JS
async function responseTime (ctx, next) {
  console.log('Started tracking response time')
  const started = Date.now()
  await next()
  
  // 计算请求时间
  // once all middleware below completes, this continues
  const ellapsed = (Date.now() - started) + 'ms'
  console.log('Response time is:', ellapsed)
  ctx.set('X-ResponseTime', ellapsed)
}

app.use(responseTime)

app.use(async (ctx, next) => {
  ctx.status = 200
  console.log('Setting status')
  await next()
})

app.use(async (ctx) => {
  await delay(1000)
  console.log('Setting body')
  ctx.body = 'Hello from Koa'
})
```

8行，只需要这么多。没有 tricky 的流嗅探，只是看起来非常棒的 async-await 代码。让我们运行一下！这里的 -i 标记是告诉 curl 同时也为我们显示响应的头部信息。


```
$ curl -i http://localhost:3002
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 14
X-ResponseTime: 1001ms
Date: Thu, 30 Mar 2017 12:52:48 GMT
Connection: keep-alive
Hello from Koa
```

非常棒！我们在 HTTP 头部中找到了响应时间。让我们再看看终端上的日志吧，看看日志是以什么顺序输出的。


```
Started tracking response time
Setting status
Setting body
Response time is: 1001ms
```

Koa 让我们完全控制了中间件流程。实现类似身份验证以及错误处理的事情将会变得非常简单！

## 总结
从中间件执行流程可知道：

- 中间件之间存在顺序的问题，先注册的先执行
- 中间件调用next需等待
- ==中间件中需要调用 next 以保证后续中间件的执行==。当然，如果你的中间件会根据一些情况阻止掉后续中间件的执行，那可以不调用 next，比如一个对请求进行权限校验的中间件可以这么写：

```js
app.use(async (ctx, next) => {
  // 获取权限数据相关的操作...
  if (valid) {
    await next();
  } else {
    ctx.throw(403, "没有权限！");
  }
});
```


- https://cnodejs.org/topic/58fd8ec7523b9d0956dad945
- https://hijiangtao.github.io/2017/11/10/Mastering-Koa-Middleware/
- https://juejin.im/post/5b5e780cf265da0f6b7713a8
- https://www.cnblogs.com/Wayou/p/koa_middleware.html