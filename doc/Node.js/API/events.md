[TOC]
# EventEmitter
Node.js 所有的异步 I/O 操作在完成时都会发送一个事件到事件队列。

Node.js 里面的许多对象都会分发事件，所有这些==产生事件的对象都是 events.EventEmitter 的实例==
- net.Server 对象会在每次有新连接时触发一个事件
- fs.readStream 对象会在文件被打开的时候触发一个事件  

## 继承 EventEmitter
大多数时候我们不会直接使用 EventEmitter，而是在对象中继承它。包括 ==fs、net、 http== 在内的，只要是支持事件响应的核心模块都是 EventEmitter 的子类。

为什么要这样做呢？原因有两点：
- 具有某个实体功能的对象实现事件符合语义， 事件的监听和发生应该是一个对象的方法。
- JavaScript 的对象机制是基于原型的，支持 部分多重继承，继承 EventEmitter 不会打乱对象原有的继承关系。

## EventEmitter API
```js
class EventEmitter  {
    /** @deprecated since v4.0.0 */
    
    // 返回指定事件的监听器数量。
    static listenerCount(emitter: EventEmitter, event: string | symbol): number;
    
    // 默认事件最大监听个数，在源码中 默认是10个，设置最大监听个数为10个，因为如果监听的个数过多的话，会导致 内存泄露的问题产生
    static defaultMaxListeners: number;

    // 为指定事件添加一个监听器到监听器数组的尾部。该方法是on的别名。该方法接收一个事件名和一个回调函数。
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    
    // 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    
    // 为指定事件注册一个单次监听器，即 监听器最多只会触发一次，触发后立刻解除该监听器。
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    
    // 当一个事件绑定了多个响应函数时，会按照函数绑定的顺序依次执行，
    // 除非响应函数是通过 prependListener() 方法绑定的，它使用的方式和 on() 类似，不过会将响应函数插到当前该事件处理函数队列的头部
    
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    
    // 移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器。
    // 它接受两个参数，第一个是事件名称，第二个是回调函数名称
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    
    // emoveListener的别名是off。
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    
    // 移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器。
    removeAllListeners(event?: string | symbol): this;
    
    // 设置监听器个数，默认为10，超出就会输出警告信息
    setMaxListeners(n: number): this;
    
    // 获取最大的监听个数
    getMaxListeners(): number;
    
    // 返回指定事件的监听器数组
    listeners(event: string | symbol): Function[];
    rawListeners(event: string | symbol): Function[];
    
    // 按监听器的顺序执行执行每个监听器，如果事件有注册监听返回 true，否则返回 false。
    emit(event: string | symbol, ...args: any[]): boolean;
    
    eventNames(): Array<string | symbol>;
    
    // 法返回注册了指定事件的监听数量
    listenerCount(type: string | symbol): number;
}
```

```js
const {EventEmitter} = require('events')
console.dir(EventEmitter)

ƒ EventEmitter()
    EventEmitter: ƒ EventEmitter()
    defaultMaxListeners: 10
    init: ƒ ()
    listenerCount: ƒ (emitter, type)
    usingDomains: false
    arguments: (...)
    caller: (...)
    length: 0
    name: "EventEmitter"
    prototype:
        addListener: ƒ addListener(type, listener)
        emit: ƒ emit(type, ...args)
        eventNames: ƒ eventNames()
        getMaxListeners: ƒ getMaxListeners()
        listenerCount: ƒ listenerCount(type)
        listeners: ƒ listeners(type)
        off: ƒ removeListener(type, listener)
        on: ƒ addListener(type, listener)
        once: ƒ once(type, listener)
        prependListener: ƒ prependListener(type, listener)
        prependOnceListener: ƒ prependOnceListener(type, listener)
        rawListeners: ƒ rawListeners(type)
        removeAllListeners: ƒ removeAllListeners(type)
        removeListener: ƒ removeListener(type, listener)
        setMaxListeners: ƒ setMaxListeners(n)
        _events: undefined
        _eventsCount: 0
        _maxListeners: undefined
        constructor: ƒ EventEmitter()
    __proto__: Object
    get defaultMaxListeners: ƒ ()
    set defaultMaxListeners: ƒ (arg)
    __proto__: ƒ ()
        [[FunctionLocation]]: events.js:26
    [[Scopes]]: Scopes[3]

```

### 源码解析
```JS
const toString = Object.prototype.toString;
const isType = obj => toString.call(obj).slice(8, -1).toLowerCase();
const isArray = obj => Array.isArray(obj) || isType(obj) === 'array';
const isNullOrUndefined = obj => obj === null || obj === undefined;

const _addListener = function(type, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  fn.context = context;
  fn.once = !!once;

  const event = this._events[type];
  // only one, let `this._events[type]` to be a function
  if (isNullOrUndefined(event)) {
    this._events[type] = fn;
  } else if (typeof event === 'function') {
    // already has one function, `this._events[type]` must be a function before
    this._events[type] = [event, fn];
  } else if (isArray(event)) {
    // already has more than one function, just push
    this._events[type].push(fn);
  }

  return this;
};

class EventEmitter {
  constructor() {
    if (this._events === undefined) {
      this._events = Object.create(null);
    }
  }

  addListener(type, fn, context) {
    return _addListener.call(this, type, fn, context);
  }

  on(type, fn, context) {
    return this.addListener(type, fn, context);
  }

  once(type, fn, context) {
    return _addListener.call(this, type, fn, context, true);
  }

  emit(type, ...rest) {
    if (isNullOrUndefined(type)) {
      throw new Error('emit must receive at lease one argument');
    }

    const events = this._events[type];

    if (isNullOrUndefined(events)) return false;

    if (typeof events === 'function') {
      events.call(events.context || null, rest);
      if (events.once) {
        this.removeListener(type, events);
      }
    } else if (isArray(events)) {
      events.map(e => {
        e.call(e.context || null, rest);
        if (e.once) {
          this.removeListener(type, e);
        }
      });
    }

    return true;
  }

  removeListener(type, fn) {
    if (isNullOrUndefined(this._events)) return this;

    // if type is undefined or null, nothing to do, just return this
    if (isNullOrUndefined(type)) return this;

    if (typeof fn !== 'function') {
      throw new Error('fn must be a function');
    }

    const events = this._events[type];

    if (typeof events === 'function') {
      events === fn && delete this._events[type];
    } else {
      const findIndex = events.findIndex(e => e === fn);

      if (findIndex === -1) return this;

      // match the first one, shift faster than splice
      if (findIndex === 0) {
        events.shift();
      } else {
        events.splice(findIndex, 1);
      }

      // just left one listener, change Array to Function
      if (events.length === 1) {
        this._events[type] = events[0];
      }
    }

    return this;
  }

  removeAllListeners(type) {
    if (isNullOrUndefined(this._events)) return this;

    // if not provide type, remove all
    if (isNullOrUndefined(type)) this._events = Object.create(null);

    const events = this._events[type];
    if (!isNullOrUndefined(events)) {
      // check if `type` is the last one
      if (Object.keys(this._events).length === 1) {
        this._events = Object.create(null);
      } else {
        delete this._events[type];
      }
    }

    return this;
  }

  listeners(type) {
    if (isNullOrUndefined(this._events)) return [];

    const events = this._events[type];
    // use `map` because we need to return a new array
    return isNullOrUndefined(events) ? [] : (typeof events === 'function' ? [events] : events.map(o => o));
  }

  listenerCount(type) {
    if (isNullOrUndefined(this._events)) return 0;

    const events = this._events[type];

    return isNullOrUndefined(events) ? 0 : (typeof events === 'function' ? 1 : events.length);
  }

  eventNames() {
    if (isNullOrUndefined(this._events)) return [];

    return Object.keys(this._events);
  }
}

export default EventEmitter;
```

### prependListener 方法
```js
const EventEmitter = require('events')
let emitter = new EventEmitter()

// 2
emitter.on('hi', (name) => {
    console.log(`my name is ${name}!`)
})

// 3
emitter.on('hi', () => {
    console.log('I am from ShangHai.')
})

// 1
emitter.prependListener('hi', () => {
    console.log('nice to meet you!')
})

// 4
emitter.on('hi', () => {
    console.log('What is your name?')
})

// 开始执行
emitter.emit('hi', 'ueumd')

// 输出：
// nice to meet you!

// my name is ueumd.
// I am from ShangHai.
// What is your name?
```

## 事件类型
Events模块默认支持两个事件。

### newListener事件：添加新的回调函数时触发。
### removeListener事件：移除回调时触发。

```js
const EventEmitter = require('events')
const emitter = new EventEmitter()

emitter.on('event', () => {
  console.log('an event occurred!');
})

emitter.on('newListener', function (evtName) {
  console.log('New Listener: ' + evtName);
})

emitter.on('removeListener', function (evtName) {
  console.log('Removed Listener: ' + evtName);
})

function foo() {}

emitter.on('save-user', foo)
emitter.removeListener('save-user', foo)

emitter.emit('event')

console.log('hello')

// New Listener: removeListener
// New Listener: save-user
// Removed Listener: save-user
```
上面代码会触发两次newListener事件，以及一次removeListener事件。


## EventEmitter 需要注意的三个地方

### eventEmitter.emit 是==同步回调==的！
```js
const EventEmitter = require('events')
const emitter = new EventEmitter()

emitter.on('event', () => {
  console.log('an event occurred!');
})
emitter.emit('event')

console.log('hello')

// an event occurred!
// hello
```
详见 https://nodejs.org/api/events.html#events_asynchronous_vs_synchronous

### emit(‘error’) 是一个特殊事件
详见 https://nodejs.org/api/events.html#events_error_events

==当没有设置 error 的事件监听==，emit('error') 会抛出 (throw) 新的错误。

### 当没有设置 ‘error’ 事件监听时，throw new Error() 和 throw 'a string' 有细微的差别

```js
var EventEmitter = require('events');
var emitter = new EventEmitter();
emitter.emit('error', 'a string');

// 输出
events.js:159
      throw err;
      ^

Error: Uncaught, unspecified "error" event. (a string)
    at EventEmitter.emit (events.js:157:17)
    at Object.<anonymous> (<my-path>:3:9)
    at Module._compile (module.js:413:34)
    at Object.Module._extensions..js (module.js:422:10)
    at Module.load (module.js:357:32)
    at Function.Module._load (module.js:314:12)
    at Function.Module.runMain (module.js:447:10)
    at startup (node.js:146:18)
    at node.js:404:3
```

```js
var EventEmitter = require('events');
var emitter = new EventEmitter();
emitter.emit('error', new Error('Ouch!!'));


// 输出
events.js:154
      throw er; // Unhandled 'error' event
      ^

Error: Ouch!!
    at Object.<anonymous> (<my-path>:3:23)
    at Module._compile (module.js:413:34)
    at Object.Module._extensions..js (module.js:422:10)
    at Module.load (module.js:357:32)
    at Function.Module._load (module.js:314:12)
    at Function.Module.runMain (module.js:447:10)
    at startup (node.js:146:18)
    at node.js:404:3
```
因为 node 源码就是这么实现的。

```js
if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
}
```
这会导致开发者难以发现 emit('error') 没有对应监听器的问题。

## Event Emitter 接口的部署
### 在 Node 源码中的使用
==net.Server、fs.ReadStram、stream 等 Node 内建对象都是 EventEmitter 的实例==。
它们通过向外暴露的 ==eventEmitter.on() 接口从而让不同的事件响应函数得以执行==。

这里以 stream 的部分源码为例，讲讲 events.EventEmitter 在 Node 中的使用。
```js
'use strict';

const { Object } = primordials;

const EE = require('events');

function Stream() {
  EE.call(this);
}

Object.setPrototypeOf(Stream.prototype, EE.prototype);
Object.setPrototypeOf(Stream, EE);

Stream.prototype.pipe = function(dest, options) {
  const source = this;

  function ondata(chunk) {
    if (dest.writable && dest.write(chunk) === false && source.pause) {
      source.pause();
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // Don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // Remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);
  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

module.exports = Stream;
```
上述代码主要完成了三件事情：
1. 通过在 `Stream `的构造函数中调用 `EE.call(this)` 和利用Object.setPrototypeOf(Stream.prototype, EE.prototype);
Object.setPrototypeOf(Stream, EE);; 调用，让 Sever 继承自 EventEmitter;

1. 通过 on 方法在数据源 sourse 上注册了 data、end、close、error 等事件的响应函数，在数据目的源 dest 上注册了 drain、end、close、error 等事件的响应函数；

1. 在完成初始化和响应函数注册后，向数据目的源发出 pipe 事件。

### ES6 中的使用方式
```js
const util = require('util')
const EE = require('events')

class RPC {
  constructor() {
    this.show()
  }
  show() {
    console.log('RPC')
  }
}

// type 1
// util.inherits(RPC, EE)

// type 2
Object.setPrototypeOf(RPC.prototype, EE.prototype);
Object.setPrototypeOf(RPC, EE)

// type 3
// RPC.prototype.__proto__ = EE.prototype


let rpc = new RPC()
rpc.on('hi', (name) => {
  console.log(`my name is ${name}!`)
})

rpc.emit('hi', 'ueumd')

// RPC
// my name is ueumd!
```
# 参考
- http://nodejs.cn/api/events.html
- 深入理解 Node.js 中 EventEmitter源码分析(3.0.0版本) https://www.cnblogs.com/tugenhua0707/p/10428807.html
- https://www.shangyang.me/2018/02/26/javascript-nodejs-04-events-and-eventemitter/
- https://zhuanlan.zhihu.com/p/34914945
- 深入学习 Node.js EventEmitter https://semlinker.com/node-event-emitter/
- https://imweb.io/topic/5973722452e1c21811630609