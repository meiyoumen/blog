[TOC]
# Promise
>Promise是JS异步编程中的重要概念，异步抽象处理对象，是目前比较流行Javascript异步编程解决方案之一

表示一个异步操作的==最终结果==。

`Promise`最主要的交互方法是通过将函数传入它的`then`方法，从而获取得`Promise`最终的值或`Promise`最终被拒绝（reject）的原因。

## Promise的流程图分析
![image](https://user-gold-cdn.xitu.io/2019/3/28/169c500344dfe50a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```js
var p = new Promise(function(resolve,reject){
    resolve("success")
    console.log("创建一个新的promise")
})

p.then(function(x){
  console.log(x) // success
})
```
上述是一个 ==promise的实例==，输出内容为，“==创建一个promise==”，输出"success"。

从上述的例子可以看出，promise方便处理异步操作。此外promise还可以链式的调用：

```js
var p=new Promise(function(resolve,reject){resolve()});
p.then(...).then(...).then(...)
```

此外Promise除了then方法外，还提供了Promise.resolve、Promise.all、Promise.race等等方法。

## 对于几种常见异步编程方案
- 回调函数
- 事件监听
- 发布/订阅
- Promise对象


## Promise 相关概念
### then()方法介绍
一个`Promise`必须提供一个`then`方法来获取其值或原因。

```JS
promise.then(onFulfilled,onRejected)
```
1. `onFulfilled` 和 `onRejected` 都是可选参数，如果 `onFulfilled` 或者 `onRejected` 不是一个函数，则忽略。
1. 如果 `onFulfilled` 是一个函数：
    1. 它必须在 `promisefulfilled` 后调用，且 `promise` 的 `value` 为其第一个参数。
    2. 它不能被多次调用
1. 如果 `onRejected` 是一个函数：
    1. 它必须在 `promiserejected` 后调用， 且 `promise` 的 `reason` 为其第一个参数。
    2. 不能被多次调用。
1. 都只允许在`ececution context`栈仅包含平台代码时运行
1. 都必须当做函数调用
1. 对于一个 `promise`，它的 `then` 方法可以调用多次。所有的 `onFulfilled` 或者 `onRejected` 都必须按照其注册顺序执行。
1. ==`then`必须返回一个`promise`==

then 方法带有如下三个参数：
- 成功回调
- 失败回调
- 前进回调（规范没有要求包括前进回调的实现，但是很多都实现了）。
一个全新的 promise 对象从每个 then 的调用中返回。

### 术语
1. `promise` 是具有then方法的对象或函数，其行为符合此规范。
2. `thenable` 是定义then方法的对象或函数。
3. `value` 是任意合法的Javascript值，（包括undefined,thenable, promise）
4. `exception` 是使用throw语句抛出的值
5. `reason` 是表示promise为什么被拒绝(rejected)原因的值


### Promise对象状态
- Promise 对象代表一个异步操作，其不受外界影响，有三种状态：
- Pending（进行中、未完成的）
- Resolved（已完成，又称 Fulfilled）
- Rejected（已失败）。

### Promise/A规范图解
![image](http://www.hangge.com/blog_uploads/201703/2017033019290334312.png)

### 打印Promise对象
```js
console.dir(Promise)
ƒ Promise()
    all: ƒ all()
    arguments: (...)
    caller: (...)
    length: 1
    name: "Promise"
    prototype: Promise
        catch: ƒ catch()
        constructor: ƒ Promise()
        finally: ƒ finally()
        then: ƒ then()
        Symbol(Symbol.toStringTag): "Promise"
    __proto__: Object
    race: ƒ race()
    reject: ƒ reject()
    resolve: ƒ resolve()
    Symbol(Symbol.species): (...)
    get Symbol(Symbol.species): ƒ [Symbol.species]()
    __proto__: ƒ ()
        apply: ƒ apply()
        arguments: (...)
        bind: ƒ bind()
        call: ƒ call()
        caller: (...)
        constructor: ƒ Function()
        length: 0
        name: ""
        toString: ƒ toString()
        Symbol(Symbol.hasInstance): ƒ [Symbol.hasInstance]()
        get arguments: ƒ ()
        set arguments: ƒ ()
        get caller: ƒ ()
        set caller: ƒ ()
        __proto__: Object
            [[FunctionLocation]]: <unknown>
        [[Scopes]]: Scopes[0]
    [[Scopes]]: Scopes[0]
```

## ==使用promises的优势==
1. 解决回调地狱（Callback Hell）问题
2. 更好地进行错误捕获 
3. ==链式调用==，==可以在 `then` 方法中继续写 `Promise` 对象并返回==，然后==继续调用 then 来进行回调操作==。

### 1. 解决回调地狱（Callback Hell）问题

1. 有时我们要进行一些相互间有依赖关系的异步操作，比如有多个请求，后一个的请求需要上一次请求的返回结果。
过去常规做法只能 callback 层层嵌套，但嵌套层数过多的话就会有 callback hell 问题。比如下面代码，可读性和维护性都很差的。

```js
firstAsync(function(data){
    //处理得到的 data 数据
    //....
    secondAsync(function(data2){
        //处理得到的 data2 数据
        //....
        thirdAsync(function(data3){
              //处理得到的 data3 数据
              //....
        });
    });
});
```

2. 如果使用 `promises` 的话，代码就会变得扁平且更可读了。==前面提到 `then` 返回了一个 `promise`==，因此我们可以将 ==`then `的调用不停地串连起来==。  
其中 then 返回的 promise 装载了由调用返回的值。

```js
firstAsync()
.then(function(data){
    //处理得到的 data 数据
    //....
    return secondAsync();
})
.then(function(data2){
    //处理得到的 data2 数据
    //....
    return thirdAsync();
})
.then(function(data3){
    //处理得到的 data3 数据
    //....
});
```

### 2. 更好地进行错误捕获 
多重嵌套 callback 除了会造成上面讲的代码缩进问题，更可怕的是可能会造成无法捕获异常或异常捕获不可控。

1. 比如下面代码我们使用 `setTimeout` 模拟异步操作，在其中抛出了个异常。  
但由于异步回调中，回调函数的执行栈与原函数分离开，导致外部无法抓住异常。

```js
function fetch(callback) {
    setTimeout(() => {
        throw Error('请求失败')
    }, 2000)
}
 
try {
    fetch(() => {
        console.log('请求处理') // 永远不会执行
    })
} catch (error) {
    console.log('触发异常', error) // 永远不会执行
}
 
// 程序崩溃
// Uncaught Error: 请求失败
```
2. 如果使用 `promises` 的话，通过 `reject` 方法把 `Promise` 的状态置为 `rejected`，这样我们在 `then` 中就能捕捉到，然后执行“失败”情况的回调。

```js
function fetch(callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
             reject('请求失败');
        }, 2000)
    })
}
fetch().then(
    function(data){
        console.log('请求处理');
        console.log(data);
    },
    function(reason, data){
        console.log('触发异常');   // 这里会执行打印
        console.log(reason);
    }
)
```

当然我们在 `catch` 方法中处理 `reject` 回调也是可以的。
```js
function fetch(callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
             reject('请求失败');
        }, 2000)
    })
}
 
 
fetch()
.then(function(data){
    console.log('请求处理')
    console.log(data)
})
.catch(function(reason){
    console.log('触发异常')
    console.log(reason)
})
```

### 3. 链式调用
```js
cook()
.then(function(data){
    return eat(data)
})
.then(function(data){
    return wash(data)
})
.then(function(data){
    console.log(data)
})

// 当然上面代码还可以简化成如下：
cook()
.then(eat)
.then(wash)
.then(function(data){
    console.log(data);
})
```

## Promise的方法
- then
- catch
- finally
- all
- race

### then()方法
简单来讲，`then `方法就是把原来的回调写法分离出来，在异步操作执行完后，用链式调用的方式执行回调函数。

==而 `Promise` 的优势就在于这个链式调用  ==
==我们可以在 then 方法中继续写 Promise 对象并返回，然后继续调用 then 来进行回调操作。==

#### 语法
```js
p.then(onFulfilled, onRejected);

p.then(function(value) {
   // fulfillment 成功
  }, function(reason) {
  // rejection    错误
});
```

- onFulfilled
当`Promise`变成接受状态`（fulfillment）`时，该参数作为回调函数被调用。  
该函数==有一个参数==，即==接受的最终结果==（the fulfillment  value）。  
==如果传入的== `onFulfilled` ==参数类型不是函==数，则会在==内部被替换为(x) => x ，即原样返回 promise 最终结果的函数==

- onRejected
当`Promise`变成拒绝状态（rejection ）时，该参数作为回调函数被调用。  
该==函数有一个参数,即拒绝的原因==（the rejection reason）。


#### 返回值
当一个Promise完成（fulfilled）或者失败（rejected），返回函数将被异步调用（由当前的线程循环来调度完成）。具体的返回值依据以下规则返回：

- 如果then中的回调函数返回一个值，那么then返回的Promise将会成为接受状态，并且将返回的值作为接受状态的回调函数的参数值。

- 如果then中的回调函数==没有返回值==，那么then返回的Promise将会成为接受状态，并且该接受状态的回调函数的参数值为==undefined==。
 
- 如果then中的回调函数==抛出一个错误==，那么then返回的Promise将会==成为拒绝状态==，并且将抛出的错误==作为拒绝状态的回调函数的参数值==。

- 如果then中的回调函数返回一个已经是接受状态的Promise，那么then返回的Promise也会成为接受状态，并且将那个Promise的接受状态的回调函数的参数值作为该被返回的Promise的接受状态回调函数的参数值。

- 如果then中的回调函数返回一个==已经是拒绝状态的Promise==，==那么then返回的Promise也会成为拒绝状态==，并且将那个Promise的拒绝状态的==回调函数的参数值作为该被返回的Promise的拒绝状态回调函数的参数==


```js
let p1 = new Promise(function(resolve, reject) {
  resolve("Success!")
  // or
  // reject ("Error!")
})

p1.then(function(value) {
  console.log(value)   // Success!
}, function(reason) {
  console.log(reason)  // Error!
})
```


1. 下面通过样例作为演示，我们定义做饭、吃饭、洗碗（cook、eat、wash）这三个方法，它们是层层依赖的关系，下一步的的操作需要使用上一部操作的结果。（这里使用 setTimeout 模拟异步操作）

```js
//做饭
function cook(){
    console.log('开始做饭。');
    var p = new Promise(function(resolve, reject){        //做一些异步操作
        setTimeout(function(){
            console.log('做饭完毕！');
            resolve('鸡蛋炒饭');
        }, 1000);
    });
    return p;
}
 
//吃饭
function eat(data){
    console.log('开始吃饭：' + data);
    var p = new Promise(function(resolve, reject){        //做一些异步操作
        setTimeout(function(){
            console.log('吃饭完毕!');
            resolve('一块碗和一双筷子');
        }, 2000);
    });
    return p;
}
 
function wash(data){
    console.log('开始洗碗：' + data);
    var p = new Promise(function(resolve, reject){        //做一些异步操作
        setTimeout(function(){
            console.log('洗碗完毕!');
            resolve('干净的碗筷');
        }, 2000);
    });
    return p;
}
```

2. 使用 then 链式调用这三个方法：

```js
cook()
.then(function(data){
    return eat(data)
})
.then(function(data){
    return wash(data)
})
.then(function(data){
    console.log(data)
})

// 当然上面代码还可以简化成如下：
cook()
.then(eat)
.then(wash)
.then(function(data){
    console.log(data);
})

// 打印
// 开始做饭。
// 做饭完毕！

// 开始吃饭：鸡蛋炒饭
// 吃饭完毕!

// 开始洗碗：一块碗和一双筷子
// 洗碗完毕!
// 干净的碗筷
```

### reject()方法
上面样例我们通过 resolve 方法把 Promise 的状态置为完成态（Resolved），这时 then 方法就能捕捉到变化，并执行“成功”情况的回调。

而 reject 方法就是把 Promise 的状态置为已失败（Rejected），这时 then 方法执行“失败”情况的回调（then 方法的第二参数）。

1. 下面同样使用一个样例做演示

```js
//做饭
function cook(){
    console.log('开始做饭。');
    var p = new Promise(function(resolve, reject){        //做一些异步操作
        setTimeout(function(){
            console.log('做饭失败！');
            reject('烧焦的米饭');
        }, 1000);
    });
    return p;
}
 
//吃饭
function eat(data){
    console.log('开始吃饭：' + data);
    var p = new Promise(function(resolve, reject){        //做一些异步操作
        setTimeout(function(){
            console.log('吃饭完毕!');
            resolve('一块碗和一双筷子');
        }, 2000);
    });
    return p;
}
 
cook()
.then(eat, function(data){
  console.log(data + '没法吃!');
})

// 开始做饭
// 做饭失败
// 烧焦的米饭没法吃
```

### catch()方法
1. 它可以和 `then` 的第二个参数一样，用来指定 `reject` 的回调


```js
cook()
.then(eat)
.catch(function(data){
    console.log(data + '没法吃!')
})
```

2. 它的另一个作用是，当执行 resolve 的回调（也就是上面 then 中的第一个参数）时，如果抛出异常了（代码出错了），那么也不会报错卡死 js，而是会进到这个 catch 方法中。

```js
//做饭
function cook(){
    console.log('开始做饭。');
    var p = new Promise(function(resolve, reject){        //做一些异步操作
        setTimeout(function(){
            console.log('做饭完毕！');
            resolve('鸡蛋炒饭');
        }, 1000);
    });
    return p;
}
 
//吃饭
function eat(data){
    console.log('开始吃饭：' + data);
    var p = new Promise(function(resolve, reject){        //做一些异步操作
        setTimeout(function(){
            console.log('吃饭完毕!');
            resolve('一块碗和一双筷子');
        }, 2000);
    });
    return p;
}
 
cook()
.then(function(data){
    console.log('开始吃饭: ' + data)
    throw new Error('米饭被打翻了！')       // 抛出错误
    eat(data);
})
.catch(function(data){
    console.log(data); // Error米饭被打翻了！
});

// 开始做饭
// 做饭完毕！
// 开始吃饭: 鸡蛋炒饭
// Error: 米饭被打翻了！
```

这种错误的捕获是非常有用的，因为它能够帮助我们在开发中识别代码错误。  
比如，在一个 `then()` 方法内部的任意地方，我们做了一个 `JSON.parse() `操作，如果 `JSON `参数不合法那么它就会抛出一个同步错误。  
用回调的话该错误就会被吞噬掉，但是用 `promises` 我们可以轻松的在 `catch()` 方法里处理掉该错误。

3. 还可以添加多个 catch，实现更加精准的异常捕获。

```js
somePromise.then(function() {
 return a();
}).catch(TypeError, function(e) {
 //If a is defined, will end up here because
 //it is a type error to reference property of undefined
}).catch(ReferenceError, function(e) {
 //Will end up here if a wasn't defined at all
}).catch(function(e) {
 //Generic catch-the rest, error wasn't TypeError nor
 //ReferenceError
});
```

### finally() 
返回一个`Promise`。在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。

这为在Promise是否成功完成后都需要执行的代码提供了一种方式。

==这避免了同样的语句需要在then()和catch()中各写一次的情况==。

#### 语法
```js
p.finally(onFinally)

p.finally(function() {
   // 返回状态为(resolved 或 rejected)
})
```

- 参数 onFinally: Promise 结束后调用的Function。  
- 返回值节: 返回一个设置了 finally 回调函数的Promise对象。 

#### 描述
如果你想在 `promise` ==执行完毕后无论其结果怎样都做一些处理或清理时，finally() 方法可能是有用的==。

`finally()` 虽然与 `.then(onFinally, onFinally)` 类似，它们不同的是：

- 调用内联函数时，不需要多次声明该函数或为该函数创建一个变量保存它。

- ==由于无法知道promise的最终状态==，所以==`finally`的回调函数中不接收任何参数==，它仅用于无论最终结果如何都要执行的情况。

- 与`Promise.resolve(2).then(() => {}, () => {}) `（resolved的结果为undefined）不同，`Promise.resolve(2).finally(() => {})` resolved的结果为 2。
- 同样，`Promise.reject(3).then(() => {}, () => {})` (resolved 的结果为undefined), `Promise.reject(3).finally(() => {})` rejected 的结果为 3。

#### 示例
```js
let isLoading = true

fetch(myRequest).then(function(response) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.includes("application/json")) {
      return response.json()
    }
    throw new TypeError("Oops, we haven't got JSON!");
  })
  .then(function(json) { /* process your JSON further */ })
  .catch(function(error) { console.log(error); })
  .finally(function() { isLoading = false; })
```


### all()方法
`Promise` 的 `all` 方法提供了==并行执行异步操作==的能力，并且在==所有异步操作执行完==后==才执行回调==。  
- ==只要有其中一个返回reject，就为中断, 后面即使resove也不会执行， 所以有一定的风险==

`Promise.all`的状态就会变成`resolved`，==如果有一个状态变成了rejected==，==那么Promise.all的状态就会变成rejected（任意一个失败就算是失败）==，==这就可以解决我们并行的问题==。


1. 比如下面代码，两个个异步操作是并行执行的，等到它们都执行完后才会进到 then 里面。同时 all 会把所有异步操作的结果放进一个数组中传给 then。

```js
function cutUp(){
    console.log('开始切菜。')
    return new Promise(function(resolve, reject){        //做一些异步操作
      setTimeout(function(){
        resolve('切好的菜')
         // reject('没刀咋切菜')
      }, 1000)
    })
}

//烧水
function boil(){
    console.log('开始烧水。')
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('烧好的水')
      }, 1000)
    })
}

//烧水
function cook(){
    console.log('开始做饭。');
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        // resolve('鸡蛋炒饭')
        reject('烧焦的米饭')  //拒绝
      }, 1000)
    })
}

Promise
.all([cutUp(), boil(), cook()])

 // 打印最终的结果
.then((res) => {
  //只要上面有一个reject这里都不会再执行 所有这个有一定的风险
  console.log("准备工作完毕：")
  console.log(res)
})

// 捕获其中的错误
.catch(e => {
  console.log('没做饭')
  console.log(e) //只会返回  烧焦的米饭
})

/*
开始切菜。
开始烧水。
开始做饭。

准备工作完毕：
["切好的菜", "烧好的水", "鸡蛋炒饭"]

// 把 resolve('鸡蛋炒饭') 改成 reject('烧焦的米饭') 

开始切菜。
开始烧水。
开始做饭。

没做饭
烧焦的米饭
*/    
    
```
### race()方法
`race` 按字面解释，就是==赛跑==的意思。
`race` 的用法==与 `all` 一样==
- all 是等所有异步操作都执行完毕后才执行 then 回调。
- race 的话==只要有一个异步操作执行完毕，就立刻执行 then 回调==。

注意：
- ==其它没有执行完毕的异步操作仍然会继续执行，而不是停止。==
- ==只要有其中一个返回reject，就为中断, 后面即使resove也不会执行， 所以有一定的风险==

1. 这里我们将上面样例的 all 改成 race

```js
Promise
.race([cutUp(), boil(), cook()])

// 打印最终的结果
.then((res) => {
  //只要上面有一个reject这里都不会再执行 所有这个有一定的风险
  console.log("准备工作完毕1：")
  console.log(res)
  return res
})
.then((res) => {
  //只要上面有一个reject这里都不会再执行 所有这个有一定的风险
  console.log("准备工作完毕2：")
  console.log(res)
  return res
})
.then((res) => {
  //只要上面有一个reject这里都不会再执行 所有这个有一定的风险
  console.log("准备工作完毕3：")
  console.log(res)
  return res
})

// 捕获其中的错误
.catch(e => {
  console.log('异常了')
  console.log(e) //只会返回  烧焦的米饭
})

/*

开始切菜。
开始烧水。
开始做饭。

准备工作完毕1：
切好的菜

准备工作完毕2：
切好的菜

准备工作完毕3：
切好的菜


// 把上面 resolve('切好的菜') 改成 reject('没刀咋切菜')

开始切菜。
开始烧水。
开始做饭。

异常了
没刀咋切菜
*/
```

2. race 使用场景很多
比如我们可以用 race 给某个异步请求设置超时时间，并且在超时后执行相应的操作。

```js
//请求某个图片资源
function requestImg(){
    return new Promise(function(resolve, reject){
        var img = new Image()
        img.onload = function(){
           resolve(img)
        }
        img.src = 'https://img.zcool.cn/community/018f2d5d5919b2a8012187f46ef590.jpg@1280w_1l_2o_100sh.jpg'
    })
}
 
//延时函数，用于给请求计时
function timeout(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            reject('图片请求超时')
        }, 5000)
    })
}
 
Promise
.race([requestImg(), timeout()])
.then(function(results){
    console.log(results)
})
.catch(function(reason){
    console.log(reason)
})

// <img src ='https://img.zcool.cn/community/018f2d5d5919b2a8012187f46ef590.jpg@1280w_1l_2o_100sh.jpg'>
```
上面代码 `requestImg` 函数异步请求一张图片，`timeout` 函数是一个延时 `5` 秒的异步操作。我们将它们一起放在 `race` 中赛跑。
- 如果 `5` 秒内图片请求成功那么便进入 `then` 方法，执行正常的流程。
- 如果 `5` 秒钟图片还未成功返回，那么则进入 `catch`，报“图片请求超时”的信息。

## Promise 静态方法
分别是
resolve
reject
all
race

###  Promise.resolve()
此方法有一个可选的参数，参数的类型会影响它的返回值，具体可分为三种情况（如下所列），其中有两种情况会创建一个新的已处理的Promise实例，还有一种情况会返回这个参数。

- 当参数为空或非thenable时，返回一个新的状态为fulfilled的Promise。
- 当参数为thenable时，返回一个新的Promise，而它的状态由自身的then()方法控制，具体细节已在之前的thenable一节做过说明。
- 当参数为Promise时，将不做修改，直接返回这个Promise。

下面用一个例子演示这三种情况，注意观察Promise的then()方法的第一个回调函数中接收到的决议结果。

```js
let tha = {
  then(resolve, reject) {
    resolve("thenable");
  }
}

//参数为空
Promise.resolve().then(function(value) {
  console.log(value)    //undefined
})

//参数为非thenable
Promise.resolve("string").then(function(value) {
  console.log(value)    //"string"
})

//参数为thenable
Promise.resolve(tha).then(function(value) {
  console.log(value)    //"thenable"
})

//参数为Promise
Promise.resolve(new Promise(function(resolve) {
  resolve("Promise")
})).then(function(value) {
  console.log(value)    //"Promise"
})
```

### Promise.reject()
此方法能接收一个参数，表示拒绝理由，它的返回值是一个新的已拒绝的Promise实例。
与`Promise.resolve()`不同，`Promise.reject()`==中所有类型的参数都会原封不动的传递给后续的已拒绝的回调函数==  
如下代码所示。
```js
Promise.reject("rejected").catch(function (reason) {
  console.log(reason);          //"rejected"
})

var p = Promise.resolve()
Promise.reject(p).catch(function (reason) {
  reason === p                 //true
})
```
- 第一次调用`Promise.reject()`的参数是一个`字符`串
- 第二次的参数是一个`Promise`，`catch()`方法中的回调函数接收到的正是这两个参数。

### Promise.all()
此方法和接下来要讲解的Promise.race()都可用来监控多个Promise，当它们的状态发生变化时，这两个方法会给出不同的处理方式。

- `Promise.all()`能接收一个可迭代对象，其中可迭代对象中的成员必须是Promise，如果是字符串、thenable等非Promise的值，那么会自动调用Promise.resolve()转换成Promise
- Promise.all() 的返回值是一个新的Promise实例，当参数中的成员为空时，其状态为fulfilled；而当参数不为空时，其状态由可迭代对象中的成员决定，具体分为两种情况。


1. 当可迭代对象中的所有成员都是已完成的Promise时，新的Promise的状态为fulfilled。而各个成员的决议结果会组成一个数组，传递给后续的已完成的回调函数，如下所示。

```js
var p1 = Promise.resolve(200)
var p2 = "fulfilled"
  
Promise.all([p1, p2]).then(function (value) {
  console.log(value)          //[200, "fulfilled"]
});
```

2. 当可迭代对象中的成员有一个是已拒绝的Promise时，新的Promise的状态为rejected。并且只会处理到这个已拒绝的成员，接下来的成员都会被忽略，其决议结果会传递给后续的已拒绝的回调函数，如下所示。

```js
var p1 = Promise.reject("error")
var p2 = "fulfilled"
Promise.all([p1, p2]).catch(function (reason) {
  console.log(reason)         //"error"
})
```

### Promise.race()
此方法和`Promise.all()`有很多相似的地方，如下所列。

- 能接收一个可迭代对象。
- 成员必须是Promise，对于非Promise的值要用Promise.resolve()做转换。
- 返回值是一个新的Promise实例。


新的Promise实例的状态也与方法的参数有关，当参数的成员为空时，其状态为pending；当参数不为空时，其状态是最先被处理的成员的状态，并且此成员的决议结果会传递给后续相应的回调函数，如下代码所示。

```js
var p1 = new Promise(function(resolve) {
  setTimeout(() => {
    resolve("fulfilled")
  }, 200)
})

var p2 = new Promise(function(resolve, reject) {
  setTimeout(() => {
    reject("rejected")
  }, 100);
})

Promise.race([p1, p2]).catch(function (reason) {
  console.log(reason)      //"rejected"
})
```
在 `p1` 和 `p2` 的执行器中都有一个定时器。由于后者的定时器会先执行，因此通过调用`Promise.race([p1, p2])`得到的`Promise`实例，==其状态和p2的相同==，==而p2的决议结果会作为拒绝理由被catch()方法中的回调函数接收==。

根据前面的分析可以得出，Promise.all()能处理一个或多个受监控的Promise，而Promise.race()只能处理其中的一个。

## Promise 不完全试坑记录
1. 当已经 resolve 后代码是否会执行

```js
new Promise((resolve, reject) => {
  resolve(233);
  console.log('ahhh');
})
.then(data => console.log(data));

//ahhh
//2333
```


2. 当已经 resolve 后有同步的错误是否会抛出

```js
new Promise((resolve, reject) => {
  resolve(233);
  JSON.parse('[22342343423');
})
.catch(err => console.log(err)).then(res => console.log(233))

// 233


new Promise((resolve, reject) => {
    // 位置换一下
    JSON.parse('fffds');  
    resolve(233);
})
.catch(err => console.log(err)).then(res => console.log(res))
/*
SyntaxError: Unexpected token f in JSON at position 1
    at JSON.parse (<anonymous>)
    at <anonymous>:2:7
    at new Promise (<anonymous>)
    at <anonymous>:1:1
*/
```

3. 当已经 resolve 后再进行 resolve 或者 reject 是否会有什么变化

```js
new Promise((resolve, reject) => {
  resolve(233);
  resolve(474748484);
  reject('err');
})
.then(data => console.log(data))
.catch(err => console.log(err));

//233
```
结果是不会有任何变化

4. 当已经 resolve 后再有异步代码抛错

```js
new Promise((resolve, reject) => {
  resolve(233);
  setTimeout(() => JSON.parse('[23313212'), 0);
})
.then(data => console.log(data))
.catch(err => console.log(err));

//233
//Uncaught SyntaxError: Unexpected end of JSON input
```
这次异步的抛错会被抛出。并且是在 Promise.then 之后

5. 当在 resolve 前有同步出错代码

```js
new Promise((resolve, reject) => {
  JSON.parse('[23423432');
  console.log(32423423);
  resolve(233);
})
.then(data => cosole.log(data))
.catch(err => console.log(err));

//SyntaxError: Unexpected end of JSON input
```
catch 捕捉到错误并且不会执行下一句代码

1. 当都为异步时

```js
new Promise((resolve, reject) => {
  setTimeout(() => resolve(233), 0);
  setTimeout(() => JSON.parse('[43535'), 0);
})
.then(data => console.log(data))
.catch(err => console.log(err));

//233
//Uncaught SyntaxError: Unexpected end of JSON input
```


结论是先then 然后再全局的未捕捉错误抛出



1. 当都为异步但是顺序不一样时

```js
new Promise((resolve, reject) => {
  setTimeout(() => resolve(233), 1000);
  setTimeout(() => JSON.parse('[232432'), 0);
})
.then(data => console.log(data))
.catch(err => console.log(err));

//Uncaught SyntaxError: Unexpected end of JSON input
//233
```


这里因为两个都为异步的，所以==互不会阻塞==，所以并不会影响resolve


1. 当有阻塞的内容存在时

```js
new Promise((resolve, reject) => {
  let date = new Date().getTime();

  //阻塞 3s
  while((new Date()).getTime() - date < 3000)

  resolve(233)
})
.then(data => console.log(data));

console.log('ahhh');

//等待 3s 打印

//ahhh
//233
```
==会阻塞主线程，并且then 会在下一个事件循环中执行==

个人结论：  
==Promise==  里面就是一个盒子，然后盒子的运行是同步的，当里面首先返回了 ==resolve== 或者 ==reject== ,然后 这个盒子就不会管后面的运行了，直接返回 ==resolve== 或者 ==reject== 的值，并且改变状态 ==padding== 到 ==resolved== 或者 rejected ；对于异步的而言，因为都是异步的所以不存在会阻塞什么的，所以当在异步里面调用 ==resolve== 或者 ==reject== 会得到返回值，但是异步的其他问题这个就不属于这个盒子管了，这就是下一个事件循环了，盒子在上一个事件中就已经执行完成了，当然因为没有 返回 ==resolve== 或者 ==reject== 所以还处于 ==padding== 状态，会等待其他 ==reject== 或者 ==resolve== 在异步事件的返回。
