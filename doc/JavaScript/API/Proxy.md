[TOC]
## Proxy 支持的拦截操作一览，一共 13 种实例方法
##### get(target, propKey,receiver)
拦截对象属性的读取，比如proxy.foo和proxy['foo']。

##### set(target, propKey, value, receiver)
拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。

##### has(target, propKey)
拦截propKey in proxy的操作，返回一个布尔值。

##### deleteProperty(target, propKey)
拦截delete proxy[propKey]的操作，返回一个布尔值。

##### ownKeys(target)
拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。

##### getOwnPropertyDescriptor(target, propKey)
拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。

##### defineProperty(target, propKey, propDesc)
拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。

##### preventExtensions(target)
拦截Object.preventExtensions(proxy)，返回一个布尔值。

##### getPrototypeOf(target)
拦截Object.getPrototypeOf(proxy)，返回一个对象。

##### isExtensible(target)
拦截Object.isExtensible(proxy)，返回一个布尔值。

##### setPrototypeOf(target, proto)
拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。

##### apply(target, object, args)
拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。

##### construct(target, args)
拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

## 全部的traps
这里列出了handlers所有可以定义的行为 (traps)：


traps      |  	description
---|---
get	                    |       获取某个key值
set		                |       设置某个key值
has		                |       使用in操作符判断某个key是否存在
apply		            |       函数调用，仅在代理对象为function时有效
ownKeys		            |       获取目标对象所有的key
construct		        |       函数通过实例化调用，仅在代理对象为function时有效
isExtensible		    |       判断对象是否可扩展，Object.isExtensible的代理
deleteProperty		    |       删除一个property
defineProperty		    |       定义一个新的property
getPrototypeOf		    |       获取原型对象
setPrototypeOf		    |       设置原型对象
preventExtensions		|       设置对象为不可扩展
getOwnPropertyDescriptor|       获取一个自有属性 （不会去原型链查找） 的属性描述


## Proxy 实例的方法
下面是上面这些拦截方法的详细介绍。

### get()
`get()` 方法用于拦截某个属性的读取操作，可以接受==三个参数==，依次为：
- 目标对象
- 属性名
- proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。

get方法的用法，上文已经有一个例子，下面是另一个拦截读取操作的例子。

```js
  let person = {name: '上海'}

  let obj = new Proxy(person, {
    get(target, property ) {
      if (property  in target) {
        return target[property ]
      } else {
        throw new ReferenceError('Property \'' + property + '\' does not exist.')
      }
    }
  })

  console.log(obj.name)  // 上海
  console.log(obj.city)  // Uncaught ReferenceError: Property 'city' does not exist.
```

### set()
`set方法`用来拦截某个属性的赋值操作，可以接受四个参数，依次为
- 目标对象  target
- 属性名    property
- 属性值    value
- 实例本身，可选。receiver


```js
let validator = {
    set(targe, property, value) {
      if (property === 'age') {
        if (!Number.isInteger(value)) {
          throw new TypeError('The age is not an integer');
        }
        if (value > 200) {
          throw new RangeError('The age seems invalid');
        }
      }

      // 对于满足条件的 age 属性以及其他属性，直接保存
      targe[property] = value;
    }
};

let person = new Proxy({}, validator);

person.age = 100;

console.log(person.age) // 100
person.age = 'young'    // 报错
```

有时，我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合get和set方法，就可以做到防止这些内部属性被外部读写。

```js
const handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```


### apply()
`apply方法`拦截函数的调用、call和apply操作。

apply方法可以接受三个参数，分别是
- 目标对象
- 目标对象的上下文对象（this）
- 目标对象的参数数组。


```js
let handler = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments)
  }
}

下面是一个例子

let target = function () { return 'I am the target'; }

let handler = {
  apply: function () {
    return 'I am the proxy';
  }
};

var p = new Proxy(target, handler);

p()
// "I am the proxy"
```
上面代码中，`变量p` 是 Proxy 的实例，当它作为函数调用时`（p()）`，==就会被apply方法拦截，返回一个字符串==。

下面是另外一个例子。

```js
let twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2
  }
}

function sum (left, right) {
  return left + right;
}

let proxy = new Proxy(sum, twice);

proxy(1, 2)                 // 6
proxy.call(null, 5, 6)      // 22
proxy.apply(null, [7, 8])   // 30
```
上面代码中，==每当执行proxy函数==（直接调用或call和apply调用），==就会被apply方法拦截==。

另外，直接调用Reflect.apply方法，也会被拦截。

```js
Reflect.apply(proxy, null, [9, 10]) // 38
```

### has()
`has方法`用来拦截==HasProperty操作==，==即判断对象是否具有某个属性时，这个方法会生==效。典型的操作就是==in运算符==。

has方法可以接受两个参数，分别是目标对象、需查询的属性名。

下面的例子使用has方法隐藏某些属性，不被in运算符发现。

```js
let handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
}

var target = { _prop: 'foo', prop: 'foo' }
var proxy = new Proxy(target, handler)

'_prop' in proxy // false
```
上面代码中，如果原对象的属性名的第一个字符是下划线，proxy.has就会返回false，从而不会被in运算符发现。

### construct()
==construct方法用于拦截new命令==，下面是拦截对象的写法。

construct方法可以接受两个参数。
- target：目标对象
- args：构造函数的参数对象
- newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p）

```js
var handler = {
  construct (target, args, newTarget) {
    return new target(...args);
  }
}


var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});

(new p(1)).value
// "called: 1"
// 10
```

==construct方法返回的必须是一个对象==，否则会报错。

```js
var p = new Proxy(function() {}, {
  construct: function(target, argumentsList) {
    return 1;
  }
});

new p() // 报错
// Uncaught TypeError: 'construct' on proxy: trap returned non-object ('1')
```





## 拿Proxy来做些什么
### 实现一个简易的断言工具
写过测试的各位童鞋，应该都会知道断言这个东西 
console.assert就是一个断言工具，接受两个参数，如果第一个为false，则会将第二个参数作为Error message抛出。 
我们可以使用Proxy来做一个直接赋值就能实现断言的工具。

```js
let assert = new Proxy({}, {
  set (target, message, value) {
    if (!value) console.error(message)
  }
})

assert['Isn\'t true'] = false      // Error: Isn't true
assert['Less than 18'] = 18 >= 19  // Error: Less than 18
```

### 统计函数调用次数
在做服务端时，我们可以用Proxy代理一些函数，来统计一段时间内调用的次数。 
在后期做性能分析时可能会能够用上：

```js
function orginFunction () {}

let proxyFunction = new Proxy(orginFunction, {
  apply (target, thisArg. argumentsList) {
    log(XXX)
    return target.apply(thisArg, argumentsList)
  }
})
```

## 参考
- https://juejin.im/post/5a5227ce6fb9a01c927e85c4
- https://juejin.im/post/5c7e6857e51d4542194f8c6f
- https://segmentfault.com/a/1190000015009255