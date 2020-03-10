[TOC]
# 高阶函数
在《javascript设计模式和开发实践》中是这样定义的。

- 函数可以作为参数被传递；
- 函数可以作为返回值输出。

实际上我们日常开发中会经常用到高阶函数。

接下来通过几个经典的应用案例，带你认知高阶函数。

## 回调函数
提起回调，经典的应用莫过于 Ajax 异步请求。

以 jQuery 为例。


```js
var getData = function(url, callback) {
    $.get(url, function(data){
        callback(data);
    });
 }
```

由于网络请求时间的不固定性，我们不能确定请求完成的具体时间，那么解决的办法就是传递一个处理函数作为参数到请求数据的方法中，请求完成后执行回调函数。

## AOP
AOP（面向切面编程）是著名的Java Spring框架中的核心概念之一。通过此编程模式可以在保持主逻辑代码不变的前提下，进行额外的功能拓展。

在 Java 中使用 AOP 往往要通过一些高级特性来实现，而 javascript 就简单多了。

比如测试一个函数的执行效率。

```js
var service = function(){
    console.log('功能逻辑...');
    }
    
var test = (function(){
    var time_start;
    return {
        before: function(){
            time_start = (+new Date());
            console.log('计时开始...');
        },
        after: function(){
            var end = (+new Date()) - time_start;
            console.log('计时结束，用时：' + end);
        }
    }
    })();
    
var aop = function(fn, proxy){
    proxy.before && proxy.before();
    
    fn();
    
    proxy.after && proxy.after();
 }
    
aop(service, test);
//   计时开始...
//   功能逻辑...
//   计时结束：1
```

## 柯里化
在计算机科学中，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

这概念着实让我琢磨了半天，转换成代码大概是这样的。


```
fn(1, 2, 3, 4)  ->  fn(1)(2)(3)(4)()
```

假设这个函数是用于求和，那么就是把本来接收多个参数一次性求和的函数改成了接收单一参数逐个求和的函数。这样是不是容易理解了。

来实现一个柯里化求和函数。


```js
var currying = function(fn){
    var args = [];
    return function(){
        if(!!arguments.length) {
            [].push.apply(args, arguments);
            return arguments.callee;
        } else {
            return fn.apply(this, args);
        }
    }
}


var sum = (function(num){
    var ret = 0;
    return function(){
        for(var i = 0, len = arguments.length; i < len; i++) {
            ret += arguments[i];
        }
        return ret;
    }
    })();
var newSum = currying(sum);
newSum(1)(2)(3)(4)()  // 10
```

看起来挺巧妙，但是这种案例明摆着就像不从实际出发的面试题。那再看下一个例子。


```js
var find = function(arr, el){
    return arr.indexOf(el) !== -1;
}
```

一个简单的函数用于查询数组中是否某个值，每次使用都需要这样调用。


```js
find(arr, 1);
find(arr, 2);
```

既然 arr 是个固定参数，那么我们可以先保存一个接收过 arr 的函数，再用这个函数去处理变化的参数。


```js
var newFind = currying(find)(arr);
newFind(1);
newFind(2);
```

## 反柯里化
与柯里化相对应。

- 柯里化是为了缩小适用范围，创建一个针对性更强的函数；
- 反柯里化则是扩大适用范围，创建一个应用范围更广的函数。

对应的代码转换就变成这样。


```js
fn(1)(2)(3)(4)  ->  fn(1, 2, 3, 4)
```

实例

```js
Array.forEach = function(){
    var fn = [].pop.call(arguments);
    var arr = arguments.length > 1 ? arguments : arguments[0];
    return [].forEach.call(arr, fn);
}

Array.forEach(1, 2, 3, function(i){
    console.log(i);     // 1 2 3
})

Array.forEach('123', function(i){
    console.log(i);     // 1 2 3
})

Array.forEach({
    '0': 1,
    '1': 2,
    '2': 3,
    'length': 3
    }, function(i){
    console.log(i);     // 1 2 3
})
```

类数组借用 Array 原型函数，是很常见的应用了。这个例子应用 call 函数提取出一个新的函数，可以接收更多的参数和类型，适用性更广。

## 函数节流
函数节流也不算很厉害的技巧了，平常写代码严谨的人应该都有此类应用的经历。

比如页面滚动加载数据的场景。

当页面滚动到底部时，会触发 Ajax 去请求数据；当页面滚动频繁时，就可能出现上个请求还未结束又开始了一个新的请求。
这个时候就需要用函数节流了。

```js
var getData = (function(){
    var onAjax = false;     // 是否开始 ajax
    return function(callback){
        if(!onAjax) {
            onAjax = true;
            $.get('/xxx', function(data){
                callback(data);
                onAjax = false;
            });
        }
    }
    })();
$(window).scroll(function(){
    if(滚动到底部) {
        getData(render);
    }
    });
```

## 分时函数
与函数节流一样，分时函数也是用来解决函数频繁执行带来的性能问题。
不同的是，函数节流场景为被动调用，分时函数为主动调用。

就算一个列表展示页面没有使用分页组件，也会像上个例子那样触发式分组渲染。而如果真的遇到需要一次性把所有数据渲染到列表时，大量的 DOM 创建会对浏览器造成极大开销，或卡顿、或假死等。

- 该处理是否必须同步完成？
- 数据是否必须按顺序完成？

如果以上两个问题都为“否”的话，为何不尝试分割这个处理过程。

```js
//  arr: 源数据
//  process: 处理函数
//  count: 每次抽取个数
var chunk = function(arr, process, count){
    setTimeout(function(){
        for(var i = 0; i < Math.min(count, arr.length); i++) {
            process(arr.shift());
        }
        if(arr.length > 0) {
            setTimeout(arguments.callee, 100);
        }
    }, 100);
    }
```

创建一个队列，使用定时器取出下一批要处理的项目进行处理，接着在设置另一个定时器。

一旦某个函数需要花 50ms 以上的时间完成，那么最好看看能否将任务分割为一系列可以使用定时器的小任务。

## 惰性加载
当你逛网店发现了心怡的商品时，是立刻收藏或加购物车，还是等到买的时候再搜索相关商品一个一个的找到它？

浏览器特征检测是前端开发中必不可少的，比如返回顶部，我们需要区分火狐和其他浏览器来决定 scrollTop 应当设置给谁。


```js
// 新手
var gotop = function(){
    if(/firefox/i.test(navigator.userAgent)) {
        document.documentElement.scrollTop = 0;
    } else {
        document.body.scrollTop = 0;
    }
}


// 老司机
var gotop = (function(){
    var isFF = /firefox/i.test(navigator.userAgent);
    var docEl = document[ isFF ? 'documentElement' : 'body' ];
    return function(){
        docEl.scrollTop = 0;
    }
    })()
```

浏览器的特征是保持不变的，既然如此为什么不一开始就保存下来呢。

与此同理，日常编程中要注意缓存那些经常使用、改变较少或不做改变的内容。

## 参考
- https://juejin.im/entry/5815876c8ac247004fb6d132/