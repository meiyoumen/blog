==对于Webpack有一句话Everything is a plugin，Webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable==。

Tapable有点类似nodejs的events库，核心原理也是依赖与发布订阅模式。webpack中最核心的负责编译的Compiler和负责创建bundles的Compilation都是Tapable的实例。下面介绍一下tapable的用法和原理。以下实例的代码原文地址为github.com/USTB-musion…

```
const {
	SyncHook,                    // 同步钩子
	SyncBailHook,                // 同步早退钩子
	SyncWaterfallHook,           // 同步瀑布钩子
	SyncLoopHook,                // 同步循环钩子
	AsyncParallelHook,           // 异步并发钩子
	AsyncParallelBailHook,       // 异步并发可早退钩子
	AsyncSeriesHook,             // 异步顺序钩子
	AsyncSeriesBailHook,         // 异步顺序可早退钩子
	AsyncSeriesWaterfallHook     // 异步顺序瀑布钩子
 } = require("tapable");

```

![image](https://user-gold-cdn.xitu.io/2019/2/8/168cdb3c4c9a71b9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

Tapable提供了很多类型的hook，分为同步和异步两大类(异步中又区分异步并行和异步串行)，而根据事件执行的终止条件的不同，由衍生出 Bail/Waterfall/Loop 类型。
下图展示了每种类型的作用：
![image](https://user-gold-cdn.xitu.io/2018/12/28/167f458ac2b1e527?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![image](https://user-gold-cdn.xitu.io/2018/12/28/167f458d6ff8424f?imageslim)

#### BasicHook
执行每一个，不关心函数的返回值，有 SyncHook、AsyncParallelHook、AsyncSeriesHook。
我们平常使用的 eventEmit 类型中，这种类型的钩子是很常见的。

#### BailHook
顺序执行 Hook，遇到第一个结果 result !== undefined
则返回，不再继续执行。有：SyncBailHook、AsyncSeriseBailHook, AsyncParallelBailHook。

什么样的场景下会使用到 BailHook 呢？设想如下一个例子：假设我们有一个模块 M，如果它满足 A 或者 B 或者 C 三者任何一个条件，就将其打包为一个单独的。这里的 A、B、C 不存在先后顺序，那么就可以使用 AsyncParallelBailHook 来解决:

```js
x.hooks.拆分模块的Hook.tap('A', () => {
   if (A 判断条件满足) {
     return true
   }
 })
 x.hooks.拆分模块的Hook.tap('B', () => {
   if (B 判断条件满足) {
     return true
   }
 })
 x.hooks.拆分模块的Hook.tap('C', () => {
   if (C 判断条件满足) {
     return true
   }
 })
```

如果 A 中返回为 true，那么就无须再去判断 B 和 C。
但是当 A、B、C 的校验，需要严格遵循先后顺序时，就需要使用有顺序的 SyncBailHook(A、B、C 是同步函数时使用) 或者 AsyncSeriseBailHook(A、B、C 是异步函数时使用)。



#### WaterfallHook
类似于 reduce，如果前一个 Hook 函数的结果 result !== undefined，则 result 会作为后一个 Hook 函数的第一个参数。既然是顺序执行，那么就只有 Sync 和 AsyncSeries 类中提供这个Hook：SyncWaterfallHook，AsyncSeriesWaterfallHook

当一个数据，需要经过 A，B，C 三个阶段的处理得到最终结果，并且 A 中如果满足条件 a 就处理，否则不处理，B 和 C 同样，那么可以使用如下


```js
x.hooks.tap('A', (data) => {
   if (满足 A 需要处理的条件) {
     // 处理数据 data
     return data
   } else {
     return
   }
 })
x.hooks.tap('B', (data) => {
   if (满足B需要处理的条件) {
     // 处理数据 data
     return data
   } else {
     return
   }
 })
 x.hooks.tap('C', (data) => {
   if (满足 C 需要处理的条件) {
     // 处理数据 data
     return data
   } else {
     return
   }
 })

```


#### AsyncSeries 
类中提供这个Hook：SyncWaterfallHook，AsyncSeriesWaterfallHook

#### LoopHook 
不停的循环执行 Hook，直到所有函数结果 result === undefined。同样的，由于对串行性有依赖，所以只有 SyncLoopHook 和 AsyncSeriseLoopHook （PS：暂时没看到具体使用 Case）

原理
我们先给出 Tapable 代码的主脉络:


```
hook 事件注册 ——> hook 触发 ——> 生成 hook 执行代码 ——> 执行
```


https://juejin.im/post/5c9bdd026fb9a0710c704955
