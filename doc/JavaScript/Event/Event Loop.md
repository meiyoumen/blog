[TOC]
# 目录
## 为什么JavaScript是单线程？
JavaScript语言的一大特点就是==单线程==，也就是说，同一个时间只能做一件事。那么，为什么JavaScript不能有多个线程呢？这样能提高效率啊。

JavaScript的单线程，与它的用途有关。  
作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。  

这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，==假定JavaScript同时有两个线程==，==一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？==


所以，为了避免复杂性，从一诞生，==JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变==。

为了 `利用多核CPU的计算能力` ，`HTML5` 提出 `Web Worker`标准，允许JavaScript脚本创建多个线程，==但是子线程完全受主线程控制，且不得操作DOM==。

所以，这个新标准并没有改变JavaScript单线程的本质。


## 任务队列
==单线程就意味着，所有任务需要排队==，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。


如果排队是因为计算量大，CPU忙不过来，倒也算了，但是很多时候CPU是闲着的，因为==IO设备==（输入输出设备）==很慢==（比如Ajax操作从网络读取数据），==不得不等着结果出来，再往下执行。==


==JavaScript语言的设计者意识到，这时主线程完全可以不管IO设备，挂起处于等待中的任务，先运行排在后面的任务==。

==等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去==。

于是，所有任务可以分成两种：
1. 一种是同步任务（synchronous）
1. 一种是异步任务（asynchronous）。

### 同步任务
指的是，在==主线程上排队执行==的任务，==只有前一个任务执行完毕，才能执行后一个任务==；

### 异步任务
指的是，==不进入主线程==、而==进入"任务队列"==（task queue）的任务。  
==只有"任务队列"通知主线程==，某个异步任务可以执行了，该==任务才会进入主线程执行==。


具体来说，异步执行的运行机制如下。（同步执行也是如此，因为它可以被视为没有异步任务的异步执行。）

1. 所有同步任务都在主线程上执行，==形成一个执行栈==（execution context stack）。

2. 主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

3. 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

4. 主线程不断重复上面的第三步。

下图就是 `主线程` 和 `任务队列` 的示意图。  
![image](http://www.ruanyifeng.com/blogimg/asset/2014/bg2014100801.jpg)  

只要`主线程空了`，就会去读取"任务队列"，这就是JavaScript的运行机制。这个过程会不断重复。


## 事件和回调函数
"任务队列"是一个事件的队列（也可以理解成消息的队列），IO设备完成一项任务，就在"任务队列"中添加一个事件，表示相关的异步任务可以进入"执行栈"了。
主线程读取"任务队列"，就是读取里面有哪些事件。  

=="任务队列"中的事件，除了IO设备的事件以外，还包括一些用户产生的事件（比如鼠标点击、页面滚动等等）==。  
==只要指定过回调函数，这些事件发生时就会进入"任务队列"，等待主线程读取==。  

### 任务队列
"任务队列"是一个先进先出的数据结构，==排在前面的事件，优先被主线程读取==。  

主线程的读取过程基本上是自动的，只要执行栈一清空，"任务队列"上第一位的事件就自动进入主线程。但是，由于存在后文提到的"定时器"功能，主线程首先要检查一下执行时间，某些事件只有到了规定的时间，才能返回主线程。


### 回调函数
所谓"回调函数"（callback），==就是那些会被主线程挂起来的代码==。==异步任务必须指定回调函数==，当主线程开始执行异步任务，就是执行对应的回调函数。  

## 为啥要弄懂Event Loop
Event Loop即事件循环，是指 ==`浏览器` ==或 ==`Node`==的==一种解决javaScript单线程运行时不会阻塞的一种机制==，也就是我们经常==使用异步的原理==。

- 是要增加自己技术的深度，也就是懂得 JavaScript 的运行机制。
- 现在在前端领域各种技术层出不穷，掌握底层原理，可以让自己以不变，应万变。
- 应对各大互联网公司的面试，懂其原理，题目任其发挥。


### 关键词解释
#### 执行栈
一个专门用来存放执行代码的栈内存结构，它就像一个容器，也叫做执行的主线程。如果遇到函数，会根据回调关系把回调层级深的函数先推入到执行栈底部执行，其他语句依次推入，当全部执行完了后，会从上到下依次弹出执行代码（也就是“先进后出”），供下一次使用；

#### 宏任务（只针对浏览器环境）
宿主环境提供的任务，包括：script代码块，MessageChannel，requestAnimationFrame，setTimeout，setInterval；

#### 微任务（只针对浏览器环境）
JS自带的任务，包括promise的then和catch，MutationObserver；

#### 任务队列
由宏任务队列与微任务队列组成；

#### event loo
又名事件循环，它会不断地去微任务队列里取任务放到执行栈执行，当微任务队列被清空时，才去宏任务队列取任务执行。假如这个宏任务里面碰到了微任务和宏任务，会分别推入到任务队列中，并按照“只有微任务队列清空才执行宏任务”的原则来执行代码；

![image](https://img2018.cnblogs.com/blog/1328957/201908/1328957-20190819092200294-105331863.png)

## Event Loop
主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）。

为了更好地理解Event Loop，请看下图（转引自Philip Roberts的演讲《Help, I'm stuck in an event-loop》）。

![image](http://www.ruanyifeng.com/blogimg/asset/2014/bg2014100802.png)   
上图中，主线程运行的时候，==产生堆（heap）和栈（stack）==，栈中的代码调用各种外部API，它们在"任务队列"中加入各种事件（click，load，done）。
  
只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。

在JavaScript中，任务被分为两种：
- 一种宏任务（MacroTask）也叫Task
- 一种叫微任务（MicroTask）

### MacroTask（宏任务）
- script全部代码
- setTimeout
- setInterval
- setImmediate（高版本浏览器支持 IE10）
- I/O
- UI Rendering


### MicroTask（微任务）
- Process.nextTick（Node独有）
- Promise
- MutationObserver
- postMessage
- Object.observe(废弃)


## 从Event Loop谈JS的运行机制

- JS分为同步任务和异步任务
- 同步任务都在主线程上执行，形成一个==执行栈==
- 主线程之外，==事件触发线程管理着一个任务队列==，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
- 一旦执==行栈中的所有同步任务执行完==毕（此时JS引擎空闲）==，系统就会读取任务队列==，将可运行的异步任务添加到可执行栈中，开始执行。

![image](https://note.youdao.com/yws/public/resource/73ff5428ea13380ab61fc60a73ef7caa/xmlnote/78E21880E6074A28B2794FA77CADA985/23505)

看到这里，应该就可以理解了：为什么有时候 `setTimeout` 推入的事件不能准时执行？因为可能在它推入到事件列表时，主线程还不空闲，正在执行其它代码， 所以自然有误差。

事件循环机制进一步补充
这里就直接引用一张图片来协助理解：（参考自Philip Roberts的演讲《Help, I’m stuck in an event-loop》）

![image](https://note.youdao.com/yws/public/resource/73ff5428ea13380ab61fc60a73ef7caa/xmlnote/FC7FA634548A44728F2F2D642D81B0C8/23503)

上图大致描述就是：

- 主线程运行时会产生执行栈， 栈中的代码调用某些api时，它们会在事件队列中添加各种事件（当满足触发条件后，如ajax请求完毕）

- 而栈中的代码执行完毕，就会读取事件队列中的事件，去执行那些回调

- 如此循环

- 注意，总是要等待栈中的代码执行完毕后才会去读取事件队列中的事件




## 浏览器

### 浏览器内核
简单来说 `浏览器内核` 是通过取得==页面内容、整理信息（应用 CSS）、计算==和组合最终==输出可视化的图像结果==，通常也被称为==渲染引擎==。

浏览器内核是多线程，在内核控制下各线程相互配合以保持同步，一个浏览器通常由以下常驻线程组成：

- GUI 渲染线程
- JavaScript 引擎线程
- 定时触发器线程
- 事件触发线程
- 异步 http 请求线程

#### 1. GUI 渲染线程
主要负责页面的渲染，解析 HTML、CSS，构建 DOM 树，布局和绘制等。
当界面需要重绘或者由于某种操作引发回流时，将执行该线程。
该线程与 JS 引擎线程互斥，当执行 JS 引擎线程时，GUI 渲染会被挂起，当任务队列空闲时，JS 引擎才会去执行 GUI 渲染。

#### 2. JS 引擎线程
该线程当然是主要负责处理 JavaScript 脚本，执行代码。
也是主要负责执行准备好待执行的事件，即定时器计数结束，或者异步请求成功并正确返回时，将依次进入任务队列，等待 JS 引擎线程的执行。
当然，该线程与 GUI 渲染线程互斥，当 JS 引擎线程执行 JavaScript 脚本时间过长，将导致页面渲染的阻塞。

#### 3. 定时器触发线程
负责执行异步定时器一类的函数的线程，如： setTimeout，setInterval。
主线程依次执行代码时，遇到定时器，会将定时器交给该线程处理，当计数完毕后，事件触发线程会将计数完毕后的事件加入到任务队列的尾部，等待 JS 引擎线程执行。

#### 4. 事件触发线程
主要负责将准备好的事件交给 JS 引擎线程执行。
比如 setTimeout 定时器计数结束， ajax 等异步请求成功并触发回调函数，或者用户触发点击事件时，该线程会将整装待发的事件依次加入到任务队列的队尾，等待 JS 引擎线程的执行。

#### 5. 异步 http 请求线程
负责执行异步请求一类的函数的线程，如： Promise，axios，ajax 等。
主线程依次执行代码时，遇到异步请求，会将函数交给该线程处理，当监听到状态码变更，如果有回调函数，事件触发线程会将回调函数加入到任务队列的尾部，等待 JS 引擎线程执行。

### 浏览器中的Event Loop
#### 1.Micro-Task 与 Macro-Task
浏览器端事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。宏任务队列可以有多个，微任务队列只有一个。

常见的 macro-task 比如：setTimeout、setInterval、script（整体代码）、 I/O 操作、UI 渲染等。
常见的 micro-task 比如: new Promise().then(回调)、MutationObserver(html5新特性) 等。

#### 2.Event Loop 过程解析

一个完整的 Event Loop 过程，可以概括为以下阶段：  
![image](https://note.youdao.com/yws/public/resource/73ff5428ea13380ab61fc60a73ef7caa/xmlnote/28BDE48E38BF4F63B758E33FB5FAA095/30894)

- 一开始执行栈空，我们可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则。micro 队列空，macro 队列里有且只有一个 script 脚本（整体代码）。


- 全局上下文（script 标签）被推入执行栈，同步代码执行。在执行的过程中，会判断是同步任务还是异步任务，通过对一些接口的调用，可以产生新的 macro-task 与 micro-task，它们会分别被推入各自的任务队列里。同步代码执行完了，script 脚本会被移出 macro 队列，这个过程本质上是队列的 macro-task 的执行和出队的过程。


- 上一步我们出队的是一个 macro-task，这一步我们处理的是 micro-task。但需要注意的是：==当 macro-task 出队时，任务是一个一个执行==的；而 ==micro-task 出队时，任务是一队一队执行的==。因此，我们处理 micro 队列这一步，会逐个执行队列中的任务并把它出队，直到队列被清空。


- 执行渲染操作，更新界面

- 检查是否存在 Web worker 任务，如果有，则对其进行处理

- 上述过程循环往复，直到两个队列都清空


我们总结一下，每一次循环都是一个这样的过程：
![image](https://user-gold-cdn.xitu.io/2019/1/10/1683877ba9aab056?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 当某个 `宏任务` 执行完后，会查看是否有微任务队列。
- 如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务。
- 执行宏任务的过程中，遇到微任务，依次加入微任务队列。
- 栈空后，再次读取微任务队列里的任务，依次类推。


```js

Promise.resolve().then(()=>{
  console.log('Promise1') 
  
  setTimeout(()=>{
    console.log('setTimeout2')
  },0)
  
})


setTimeout(()=>{
  console.log('setTimeout1')
  
  Promise.resolve().then(()=>{
    console.log('Promise2')    
  })
  
},0)
```


#### 定时器
我们通常会看到如下的代码:


```js
setTimeout(() => {
	// 执行栈清空后再执行...
}, 0);
```

这是因为我们需要确定同步操作完成后, 第一时间去做任务队列里的排第一的任务,这个0毫秒后立即执行就是这个意思.


```js
setTimeout(() => {
	console.log(1);
}, 0);
console.log(2);
```

执行结果总是先2 然后才1。有时候你定义的是 `10毫秒` 后执行，但是这个系统并不会满足你,它无法保证一定能 `10毫秒` 后去执行那段逻辑代码。

因为执行栈可能有很多比较耗时的操作，此时等到去任务队列的时候可能已经十几毫秒了。  

事实上, HTML5规定了 ==`低于4毫秒`的延期时间都自动增加到了4毫秒==，而在浏览器端==为了省电和节省内存及CPU时间==，==都将一段时间不显示的tab的时延增加到1000毫秒==,另外对于不在充电的笔记本，==`4毫秒`== 时延将会被升至为系统定时器的时延,大概在 ==`15.6毫秒`==。

setTimeout这个特性可以让我们把很多会阻塞页面渲染的操作提取给它去做，比如某一个任务非常耗时且不太重要，但是又需要运行很多次,我们可以这样做:


```js
function func(){
	setTimeout(func, 0)
	// 这里是一些dom操作,同步操作...
	// 不要忘记最后加上一些结束判断条件,否则这里会一直运行(除非是你特意需要的)
}

setTimeout(func, 0)
```

上面的代码只能适用一些同步操作,如果需要使用异步操作,那么需要把 `setTimeout(func, 0)` 放到你异步操作后的回调函数来执行:

```js
function func() {
    fetch('url')
    	.then(res => res.text())
    	.then((res) => {
    		// 处理返回的值
    		setTimeout(func, 0)
    	})
}

setTimeout(func, 0)
```

轮询也是基于上面这类控制代码来完成的.

#### setTimeout而不是setInterval
用setTimeout模拟定期计时和直接用setInterval是有区别的。

因为每次 `setTimeout` 计时到后就会去执行，然后执行一段时间后才会继续 `setTimeout`，中间就多了误差 （误差多少与代码执行时间有关）  

而 `setInterval 则是每次都精确的隔一段时间推入一个事件 （但是，事件的实际执行时间不一定就准确，还有可能是这个事件还没执行完毕，下一个事件就来了）  

而且setInterval有一些比较致命的问题就是：

- 累计效应（上面提到的），如果setInterval代码在（setInterval）再次添加到队列之前还没有完成执行， 就会导致定时器代码连续运行好几次，而之间没有间隔。 就算正常间隔执行，多个setInterval的代码执行时间可能会比预期小（因为代码执行需要一定时间）


- 而且把浏览器最小化显示等操作时，setInterval并不是不执行程序， ==它会把setInterval的回调函数放在队列中，等浏览器窗口再次打开时，一瞬间全部执行时==

所以，鉴于这么多但问题，目前一般认为的最佳方案是：==用setTimeout模拟setInterval，或者特殊场合直接用requestAnimationFrame==

补充：JS高程中有提到，JS引擎会对setInterval进行优化，如果当前事件队列中有setInterval的回调，不会重复添加。不过，仍然是有很多问题。。



## node中的Event Loop
根据node官方文档的描述，node中的Event Loop主要有如下几个阶段：

![image](https://note.youdao.com/yws/public/resource/73ff5428ea13380ab61fc60a73ef7caa/xmlnote/122F2EB792CF45AFB4EB5DDCC6F6147A/23620)

各个阶段执行的任务如下：

- timers 阶段: 这个阶段执行setTimeout和setInterval预定的callback;
- I/O callbacks 阶段: 执行除了 close事件的callbacks、被timers设定的callbacks、setImmediate()设定的callbacks这些之外的callbacks;
- idle, prepare 阶段: 仅node内部使用;
- poll 阶段: 获取新的I/O事件, 适当的条件下node将阻塞在这里;
- check 阶段: 执行setImmediate() 设定的callbacks;
- close callbacks 阶段: 执行socket.on('close', ...)这些 callback


`Node.js` 采用 `V8` 作为 `js` 的解析引擎，而I/O处理方面使用了自己设计的`libuv`。  
`libuv`是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现，核心源码参考：

```js
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int ran_pending;

  r = uv__loop_alive(loop);
  if (!r)
    uv__update_time(loop);

  while (r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop);
    // timers阶段
    uv__run_timers(loop);
    
    // I/O callbacks阶段
    ran_pending = uv__run_pending(loop);
    
    // idle阶段
    uv__run_idle(loop);
    
    // prepare阶段
    uv__run_prepare(loop);

    timeout = 0;
    if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT)
      timeout = uv_backend_timeout(loop);
      
    // poll阶段
    uv__io_poll(loop, timeout);
    
    // check阶段
    uv__run_check(loop);
    
    // close callbacks阶段
    uv__run_closing_handles(loop);
    

    if (mode == UV_RUN_ONCE) {
      uv__update_time(loop);
      uv__run_timers(loop);
    }

    r = uv__loop_alive(loop);
    if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
      break;
  }

  if (loop->stop_flag != 0)
    loop->stop_flag = 0;

  return r;
}
```

首先需要记住它们以下具体区别:

### macrotask
setTimeout 
setInterval 
requestAnimationFrame 
setImmediate I
/O UI渲染

### microtasks
- Promise 
- process.nextTick 
- Object.observe 
- MutationObserver

说道NodeJS的事件循环就应该提一下libuv, 这是一个开源的异步IO库 ,最初就是为 Node.js 开发的,现在很多项目都在用.

任务队列分的就是上面两种,开始我们介绍的是setTimeout, 它是属于macrotasks一类.那么这两个任务队列到底有什么区别了,这就是我想搞懂的问题.

![image](https://www.quietboy.net/assets/images/event-loop-d76e4bbeb8b5ad96fd2c81ba687cabd7031a46696b4639546208f64d9c5067b8.png)


以上图为例我们开始分析一下事件循环流程:

当执行栈为空的时候：
1. 开始去macrotask队列里面执行最早的一个任务
2. 当macrotask为空或者执行完成后开始去microtask队列里执行所有任务
3. 当microtask为空或者执行完成后再回过头来从macrotask再来一次

以上过程内容挺复杂,我只是简单说明了一下,其中的比如说队列先进先出,执行的是最早的那个进入队列的任务,执行完成后将会移出任务等等过程就不用再细说了.

这是个循环,系统会一直检测这两个队列,直到都为空为止,因为有时候你会在 `macrotask` 中创建 `microtask ` 任务,而有时候会在 `microtask` 中创建 `macrotask` 任务,因此这是系统会不断的进行循环的原因.而任务队列当然也有先后之分了,整个程序执行的过程就是:   
`first macrotask` – `all microtask` – `first macrotask` – `all microtask` – `first macrotask` – `all microtask`…..

再简单点可以总结为：

- 在 macrotask 队列中执行最早的那个task，然后移出
- 执行 microtask 队列中所有可用的任务，然后移出
- 下一个循环，执行下一个 macrotask 中的任务 (再跳到第2步)

有些文章跟我这部分表述并不一样,他们会假定一开始没有第一个macrotask(或者描述的样子带给了读者一种错觉),这其实是错误的,比如上面的事件循环图,其实macrotask是第一个task,然后才是microtask.

首先要知道整个程序一开始就全被推入到了执行栈,执行的过程中会根据不同的调用再进行分配到不同的task中去.既然我们弄懂了事件循环了,那么我们开始看看如下的代码:

```js
console.log('start');

const interval = setInterval(() => {  
	console.log('setInterval');
}, 0);

setTimeout(() => {  
	console.log('setTimeout 1');
	
	Promise.resolve()
		.then(() => {
			console.log('promise 3');
		})
		.then(() => {
			console.log('promise 4');
		})
		.then(() => {
			setTimeout(() => {
				console.log('setTimeout 2');
				Promise.resolve()
					.then(() => {
						console.log('promise 5');
					})
					.then(() => {
						console.log('promise 6');
					})
					.then(() => {
						clearInterval(interval);
					});
			}, 0);
		});
}, 0);

new Promise((resolve, reject) => {
	console.log('promise'); // new Promise是同步代码
	
	resolve('promise next');
}).then(res => {
	console.log(res);
})

Promise.resolve()
	.then(() => {  
		console.log('promise 1');
	})
	.then(() => {
		console.log('promise 2');
	});
	
console.log('end');
```
正确答案:


```
start
promise
end

promise next
promise 1
promise 2

setInterval
setTimeout 1

promise 3
promise 4

setInterval
setTimeout 2

promise 5
promise 6
```
- 执行的 `setTimeout` , `setInterval` 其实都是调用的浏览器API,浏览器根据其中时间进行倒计时,当到达了指定的时间后将`task`推入到`macrotask`中,因此上面一开始`marcotask`是空的
- `Promise.then`是异步执行的，而创建==`Promise`实例的构造函数是同步执行的==,如果你需要使用Promise那么你需要知道这个.



Node.js提供了另外两个与”任务队列”有关的方法: process.nextTick和setImmediate

- process.nextTick方法可以在当前”执行栈”(也就是microtask)的尾部—-下一次Event Loop（主线程读取”任务队列”,也就是macrotask）之前—-触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。
- setImmediate方法则是在当前”任务队列”的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行.


```js
process.nextTick(function A() {
	console.log(1);
	process.nextTick(function B(){console.log(2);});
});

setTimeout(function timeout() {
	console.log('TIMEOUT FIRED');
}, 0);
// 1
// 2
// TIMEOUT FIRED
```

上面代码中，由于process.nextTick方法指定的回调函数，总是在当前”执行栈”的尾部触发，所以不仅函数A比setTimeout指定的回调函数timeout先执行，而且函数B也比timeout先执行。这说明，如果有多个process.nextTick语句（不管它们是否嵌套），将全部在当前”执行栈”执行.

## 浏览器Event Loop 和 Node.js 中的Event Loop
event loop是一个执行模型，在不同的地方有不同的实现。浏览器和nodejs基于不同的技术实现了各自的event loop。
浏览器中与node中事件循环与执行机制不同，不可混为一谈。

- 浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。
- 在Node.js中，microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务。

![image](https://user-gold-cdn.xitu.io/2019/1/12/16841bad1cda741f?imageslim)


简单来讲：
- `nodejs` 的 `event` 是==基于libuv==
- 浏览器的event loop则在==`html5的规范中明确定义`==。
- libuv已经对event loop作出了实现，而html5规范中只是定义了浏览器中event loop的模型，具体实现留给了浏览器厂商。


浏览器和Node 环境下，microtask 任务队列的执行时机不同

- Node端，microtask 在事件循环的各个阶段之间执行
- 浏览器端，microtask 在事件循环的 macrotask 执行完之后执行，先执行宏任务，再执行微任务


## 详解promise.then, process.nextTick, setTimeout 以及 setImmediate的执行顺序


```js
setTimeout(function() {         // 宏任务  放到到事件队列里 event queue
    console.log('setTimeout')
})

new Promise(function(resolve) {
    console.log('promise')      // 同步任务
}).then(function() {
    console.log('then')         // 微任务
})

console.log('console')          // 同步任务  到这里宏任务 执行完毕， 接下来判断是否有微任务

// promise
// console
// then
// setTimeout
```

- 首先会遇到setTimeout,将其放到红任务event queue里面
- 然后回到 promise ， new promise 会立即执行， then会分发到微任务
- 遇到 console 立即执行
- 整体宏任务执行完成，接下来判断是否有微任务
- ，刚刚放到微任务里面的then，执行
- ok，第一轮事件结束，进行第二轮，刚刚我们放在event queue 的setTimeout 函数进入到宏任务，立即执行
- 结束


```js
setImmediate(function(){
  console.log(1);   // 3轮
},0);

setTimeout(function(){
  console.log(2)    // 3轮 高于setImmediate
},0);

new Promise(function(resolve){
  console.log(3);    // 1轮
  resolve();
  
  console.log(4);    // 1 轮
  
}).then(function(){
  console.log(5)    // 2轮
});

console.log(6);     // 1轮

process.nextTick(function(){
  console.log(7)    // 2轮 高于Promise        
});

console.log(8);    // 1轮

//  3 4 6 8  同步任务
//  7 5      微任务     
// 2 1       同步任务
```
在解释输出结果之前，我们来看几个概念：

macro-task: script (整体代码)，setTimeout, setInterval, setImmediate, I/O, UI rendering. 
micro-task: process.nextTick, Promise(原生)，Object.observe，MutationObserver

### 第一步. script整体代码被执行，执行过程为

- 创建setImmediate macro-task
- 创建setTimeout macro-task
- 创建micro-task Promise.then 的回调，并执行script console.log(3); resolve(); console.log(4); 此时输出3和4，虽然resolve调用了，执行了但是整体代码还没执行完，无法进入Promise.then 流程。
- console.log(6)输出6
- process.nextTick 创建micro-task
- console.log(8) 输出8
- 第一个过程过后，已经输出了3 4 6 8


### 第二步. 由于其他micro-task 的 优先级高于macro-task。 
此时`micro-task` 中有两个任务按照优先级==`process.nextTick` 高于 `Promise`==。 
所以先输出7，再输出5

### 第三步
micro-task 任务列表已经执行完毕，家下来执行macro-task. 由于setTimeout的优先级高于setIImmediate，所以先输出2，再输出1。

关于micro-task和macro-task的执行顺序，可看下面这个例子(来自《深入浅出Node.js》)：

```js
//加入两个nextTick的回调函数
process.nextTick(function () {
  console.log('nextTick延迟执行1');
});

process.nextTick(function () { 
  console.log('nextTick延迟执行2');
});

// 加入两个setImmediate()的回调函数
setImmediate(function () {
  console.log('setImmediate延迟执行1'); 
  // 进入下次循环 
  process.nextTick(function () {
    console.log('强势插入') //
  });
});

setImmediate(function () {
  console.log('setImmediate延迟执行2'); 
});
 
console.log('正常执行');

// 正常执行
// nextTick延迟执行1
// nextTick延迟执行2
// setImmediate延迟执行1
// setImmediate延迟执行2
// 强势插入
```
在新版的Node中，`process.nextTick` 执行完后，==会循环遍历setImmediate==，==将`setImmediate`都执行完毕后再跳出循环==。  
所以两个setImmediate执行完后队列里只剩下第一个setImmediate里的process.nextTick。最后输出”强势插入”。

### 关于优先级
观察者优先级

- 在每次轮训检查中，各观察者的优先级分别是：

- idle观察者 > I/O观察者 > check观察者。

- idle观察者：process.nextTick

- I/O观察者：一般性的I/O回调，如网络，文件，数据库I/O等

- check观察者：setTimeout > setImmediate

### 总结
- 同步代码执行顺序优先级高于异步代码执行顺序优先级；
- new Promise(fn)中的fn是同步执行；
- process.nextTick()>Promise.then()>setTimeout>setImmediate。


```js
console.log('1');

setTimeout(function() {
    console.log('2');
    
    process.nextTick(function() {
        console.log('3');
    })
    
    new Promise(function(resolve) {
        console.log('4');
        resolve();
        
    }).then(function() {
        console.log('5')
    })
})

process.nextTick(function() {
    console.log('6');
})

new Promise(function(resolve) {
    console.log('7');
    resolve();
    
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    
    process.nextTick(function() {
        console.log('10');
    })
    
    new Promise(function(resolve) {
        console.log('11');
        resolve();
        
    }).then(function() {
        console.log('12')
    })
})


// 1,7,6,8,2,4,3,5,9,11,10,12
```



```js
setImmediate(function () {
  console.log('setImmediate延迟执行1')
  // 在新版的Node中，process.nextTick 执行完后，会循环遍历setImmediate，将setImmediate都执行完毕后再跳出循环。
  process.nextTick(function () {
    console.log('强势插入')
  })
})

setImmediate(function () {
  console.log('setImmediate延迟执行2')
})

setTimeout(function () {
  console.log(2)
}, 0)

setInterval(function () {
  console.log('2setInterval')
}, 0)

new Promise(function (resolve) {
  console.log(3)
  resolve()
  console.log(4)
}).then(function () {
  console.log(5)
})

process.nextTick(function () {
  console.log(7)
})

console.log(8)

/*
3 4 8
7 5 2
2setInterval
setImmediate延迟执行1
setImmediate延迟执行2
强势插入
*/
```
#### 执行顺序
`同步任务` > `process.nextTick()` > `Promise.then()` > `setTimeout` > `setInterval` > `setImmediate`



# 参考
- https://zhuanlan.zhihu.com/p/33058983
- https://imweb.io/topic/5b148768d4c96b9b1b4c4ea1
- http://lynnelv.github.io/js-event-loop-nodejs
- https://blog.fundebug.com/2019/01/15/diffrences-of-browser-and-node-in-event-loop/
- http://www.ruanyifeng.com/blog/2014/10/event-loop.html
- https://juejin.im/post/5c337ae06fb9a049bc4cd218
- https://juejin.im/post/5aa5dcabf265da239c7afe1e
- https://github.com/SunShinewyf/issue-blog/issues/34#issuecomment-371106502
- https://github.com/kaola-fed/blog/issues/234
- https://www.cnblogs.com/xuzhudong/p/8711069.html
- https://www.caibowen.net/article/897894E5FD95
- https://www.quietboy.net/posts/javascript-事件循环-eventloop
- https://www.jishuwen.com/d/2AAa
- https://github.com/fi3ework/blog/issues/29
- https://zhuanlan.zhihu.com/p/55511602
- 从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理  
http://www.dailichun.com/2018/01/21/js_singlethread_eventloop.html

