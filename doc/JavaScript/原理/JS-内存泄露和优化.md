[TOC]
# 目录
## 什么是内存泄露？
存泄露是指程序中已分配的堆内存由于某种原因未释放或者无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统奔溃等后果。。

## 内存泄漏的常见场景：
- 缓存:存在内存中数据一只没有被清掉
- 作用域未释放（闭包）
- 无效的 DOM 引用
- 没必要的全局变量
- 定时器未清除(React中的合成事件，还有原生事件的绑定区别)
- 事件监听为清空
- 内存泄漏优化


### 缓存

js开发时候喜欢用对象的键值来缓存函数的计算结果，但是缓存中存储的键越多，长期存活的对象就越多，导致垃圾回收在进行扫描和整理时，对这些对象做了很多无用功。

### 作用域未释放（闭包）


```js
var leakArray = [];
exports.leak = function () {
    leakArray.push("leak" + Math.random());
}
```

模块在编译执行后形成的作用域因为模块缓存的原因，不被释放，每次调用 leak 方法，都会导致局部变量 leakArray 不停增加且不被释放。

闭包可以维持函数内部变量驻留内存，使其得不到释放。

### 没有必要的全局变量
```js
function foo() {
    name ='js' // name 挂载在window对角上 window.name = 'js'
}
```
声明过多的全局变量，会导致变量常驻内存，要直到进程结束才能够释放内存。

### 无效的DOM引用

```js
//dom still exist
function click(){
    // 但是 button 变量的引用仍然在内存当中。
    const button = document.getElementById('button');
    button.click();
}

// 移除 button 元素
function removeBtn(){
    document.body.removeChild(document.getElementById('button'));
}
```

### 定时器未清除


```js
// vue 的 mounted 或 react 的 componentDidMount
componentDidMount() {
    setInterval(function () {
        // ...do something
    }, 1000)
}
```

vue 或 react 的页面生命周期初始化时，定义了定时器，但是在离开页面后，未清除定时器，就会导致内存泄漏。

### 事件监听为空白


```js
componentDidMount() {
    window.addEventListener("scroll", function () {
        // do something...
    });
}
```

在页面生命周期初始化时，绑定了事件监听器，但在离开页面后，未清除事件监听器，同样也会导致内存泄漏。

## 内存泄露优化

### 解除引用

确保占用最少的内存可以让页面获得更好的性能。而优化内存占用的最佳方式，就是为执行中的代码只保存必要的数据。一旦数据不再有用，最好通过将其值设置为 null 来释放其引用——这个做法叫做解除引用（dereferencing）

```
function createPerson(name){
    var localPerson = new Object();
    localPerson.name = name;
    return localPerson;
}

var globalPerson = createPerson("Nicholas");

// 手动解除 globalPerson 的引用
globalPerson = null;
```

解除一个值的引用并不意味着自动回收该值所占用的内存。解除引用的真正作用是让值脱离执行环境，以便垃圾收集器下次运行时将其回收。



### 提供手动清空变量的方法

```js
var leakArray = [];

exports.leak = function () {
    leakArray.push("leak" + Math.random());
}

exports.clear = function () {
    leakArray = [];
}
```


### 其他方法
- 在业务不需要的用到的内部函数，可以重构到函数外，实现解除闭包。
- 避免创建过多的生命周期较长的对象，或者将对象分解成多个子对象。
- 避免过多使用闭包。
- 注意清除定时器和事件监听器。
- nodejs中使用stream或buffer来操作大文件，不会受nodejs内存限制。
- 使用redis等外部工具来缓存数据。

## Nodejs垃圾回收内存管理实践

内存泄漏识别

在 Node.js 环境里提供了 process.memoryUsage 方法用来查看当前进程内存使用情况，单位为字节

- rss（resident set size）：RAM 中保存的进程占用的内存部分，包括代码本身、栈、堆。
- heapTotal：堆中总共申请到的内存量。
- heapUsed：堆中目前用到的内存量，判断内存泄漏我们主要以这个字段为准。
- external： V8 引擎内部的 C++ 对象占用的内存。


内存泄漏例子 
堆用来存放对象引用类型，例如字符串、对象。在以下代码中创建一个 Fruit 存放于堆中。

```JS
/**
 * 单位为字节格式为 MB 输出
 */
const format = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
};

/**
 * 封装 print 方法输出内存占用信息 
 */
const print = function() {
    const memoryUsage = process.memoryUsage();

    console.log(JSON.stringify({
        rss: format(memoryUsage.rss),
        heapTotal: format(memoryUsage.heapTotal),
        heapUsed: format(memoryUsage.heapUsed),
        external: format(memoryUsage.external),
    }));
}


// example.js
function Quantity(num) {
    if (num) {
        return new Array(num * 1024 * 1024);
    }
    return num;
}

function Fruit(name, quantity) {
    this.name = name
    this.quantity = new Quantity(quantity)
}

let apple = new Fruit('apple');
print();

let banana = new Fruit('banana', 20);
print();
```
执行以上代码，内存向下面所展示的，apple 对象 heapUsed 的使用仅有 4.21 MB，而 banana 我们对它的 quantity 属性创建了一个很大的数组空间导致 heapUsed 飙升到 164.24 MB。

```js
node example.js
{"rss":"19.94 MB","heapTotal":"6.83 MB","heapUsed":"4.21 MB","external":"0.01 MB"}

{"rss":"180.04 MB","heapTotal":"166.84 MB","heapUsed":"164.24 MB","external":"0.01 MB"}
```

我们在来看下内存的使用情况，根节点对每个对象都持有引用，则无法释放任何内容导致无法 GC，正如下图所展示的
![image](https://pic4.zhimg.com/80/v2-49c47800ad5bdc2703cc7442308cae47_hd.jpg)

手动执行垃圾回收内存释放  

假设 banana 对象我们不在使用了，对它重新赋予一些新的值，例如 banana = null，看下此刻会发生什么？
![image](https://pic1.zhimg.com/80/v2-abfa58d271ea5eeb960f400c1e3218bc_hd.jpg)  

结果如上图所示，无法从根对象在到达到 Banana 对象，那么在下一个垃圾回收器运行时 Banana 将会被释放。

让我们模拟一下垃圾回收，看下实际情况是什么样的？


```js
// example.js
let apple = new Fruit('apple');
print();

let banana = new Fruit('banana', 20);
print();
banana = null;

global.gc();
print();
```


以下代码中 --expose-gc 参数表示允许手动执行垃圾回收机制，将 banana 对象赋为 null 后进行 GC，在第三个 print 打印出的结果可以看到 heapUsed 的使用已经从 164.24 MB 降到了 3.97 MB

```js
$ node --expose-gc example.js
{"rss":"19.95 MB","heapTotal":"6.83 MB","heapUsed":"4.21 MB","external":"0.01 MB"}
{"rss":"180.05 MB","heapTotal":"166.84 MB","heapUsed":"164.24 MB","external":"0.01 MB"}
{"rss":"52.48 MB","heapTotal":"9.33 MB","heapUsed":"3.97 MB","external":"0.01 MB"}
```
下图所示，右侧的 banana 节点没有了任何内容，经过 GC 之后所占用的内存已经被释放了。
![image](https://pic4.zhimg.com/80/v2-d80cf4c7b5af1722f84437f48ef7ded3_hd.jpg)


### V8堆内存限制

内存在服务端本来就是一个寸土寸金的东西，在 V8 中限制 64 位的机器大约 1.4GB，32 位机器大约为 0.7GB。因此，对于一些大内存的操作需谨慎否则超出 V8 内存限制将会造成进程退出。

一个内存溢出超出边界限制的例子


```js
// overflow.js
const format = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
};

const print = function() {
    const memoryUsage = process.memoryUsage();
    console.log(`heapTotal: ${format(memoryUsage.heapTotal)}, heapUsed: ${format(memoryUsage.heapUsed)}`);
}

const total = [];
setInterval(function() {
    total.push(new Array(20 * 1024 * 1024)); // 大内存占用
    print();
}, 1000)
```
以上例子中 total 为全局变量每次大约增长 160 MB 左右且不会被回收，在接近 V8 边界时无法在分配内存导致进程内存溢出。


```
$ node overflow.js
heapTotal: 166.84 MB, heapUsed: 164.23 MB
heapTotal: 326.85 MB, heapUsed: 324.26 MB
heapTotal: 487.36 MB, heapUsed: 484.27 MB
heapTotal: 649.38 MB, heapUsed: 643.98 MB
heapTotal: 809.39 MB, heapUsed: 803.98 MB
heapTotal: 969.40 MB, heapUsed: 963.98 MB
heapTotal: 1129.41 MB, heapUsed: 1123.96 MB
heapTotal: 1289.42 MB, heapUsed: 1283.96 MB

<--- Last few GCs --->

[87581:0x103800000]    11257 ms: Mark-sweep 1283.9 (1290.9) -> 1283.9 (1290.9) MB, 512.1 / 0.0 ms  allocation failure GC in old space requested
[87581:0x103800000]    11768 ms: Mark-sweep 1283.9 (1290.9) -> 1283.9 (1287.9) MB, 510.7 / 0.0 ms  last resort GC in old space requested
[87581:0x103800000]    12263 ms: Mark-sweep 1283.9 (1287.9) -> 1283.9 (1287.9) MB, 495.3 / 0.0 ms  last resort GC in old space requested
```
在 V8 中也提供了两个参数仅在启动阶段调整内存限制大小

分别为调整老生代、新生代空间，关于老生代、新生代稍后会做介绍。

- –max-old-space-size=2048
- –max-new-space-size=2048  
当然内存也并非越大越好，==一方面服务器资源是昂贵的==，另一方面据说 ==V8 以 1.5GB 的堆内存进行一次小的垃圾回==收大约需要 ==50 毫秒==以上时间，这将会==导致 JavaScript 线程暂停==，这也是最主要的一方面。

## 总结
js是一门具有自动回收垃圾收集的编程语言，在浏览器中主要是通过标记清除的方法回收垃圾，在nodejs中主要是通过:
- 分代回收
- Scavenge
- 标记清除
- 增量标记

等算法来回收垃圾。  
在日常开发中，有一些不引入注意的书写方式可能会导致内存泄露，多注意自己代码规范。

