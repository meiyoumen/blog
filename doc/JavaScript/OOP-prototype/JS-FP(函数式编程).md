[TOC]
# 基础知识

## 函数式编程简介
说到函数式编程，人们的第一印象往往是其学院派，晦涩难懂，大概只有那些蓬头散发，不修边幅，甚至有些神经质的大学教授们才会用的编程方式。这可能在历史上的某个阶段的确如此，但是近来函数式编程已经在实际应用中发挥着巨大作用了，而更有越来越多的语言不断的加入诸如 闭包，匿名函数等的支持，从某种程度上来讲，函数式编程正在逐步“同化”命令式编程。

函数式编程思想的源头可以追溯到 20 世纪 30 年代，数学家阿隆左 . 丘奇在进行一项关于问题的可计算性的研究，也就是后来的 lambda 演算。lambda 演算的本质为 一切皆函数，函数可以作为另外一个函数的输出或者 / 和输入，一系列的函数使用最终会形成一个表达式链，这个表达式链可以最终求得一个值，而这个过程，即为计算的本质。

然而，这种思想在当时的硬件基础上很难实现，历史最终选择了同丘奇的 lambda 理论平行的另一种数学理论：图灵机作为计算理论，而采取另一位科学家冯 . 诺依曼的计算机结构，并最终被实现为硬件。由于第一台计算机即为冯 . 诺依曼的程序存储结构，因此运行在此平台的程序也继承了这种基因，程序设计语言如 C/Pascal 等都在一定程度上依赖于此体系。

到了 20 世纪 50 年代，一位 MIT 的教授 John McCarthy 在冯 . 诺依曼体系的机器上成功的实现了 lambda 理论，取名为 LISP(LISt Processor), 至此函数式编程语言便开始活跃于计算机科学领域。

## 函数式编程语言特性
在函数式编程语言中，函数是第一类的对象，也就是说，函数 不依赖于任何其他的对象而可以独立存在，而在面向对象的语言中，函数 ( 方法 ) 是依附于对象的，属于对象的一部分。这一点 j 决定了函数在函数式语言中的一些特别的性质，比如作为传出 / 传入参数，作为一个普通的变量等。  

JavaScript 作为一种典型的多范式编程语言，这两年随着React的火热，函数式编程的概念也开始流行起来，`RxJS`、`cycleJS`、`lodashJS`、`underscoreJS`等多种开源库都使用了函数式的特性。所以下面介绍一些函数式编程的知识和概念。 

### 匿名函数
在函数式编程语言中，==函数是可以没有名字的==，==匿名函数==通常表示：“==可以完成某件事的一块代码==”。  

这种表达在很多场合是有用的，因为我们有时需要用函数完成某件事，但是这个函数可能只是临时性的，那就没有理由专门为其生成一个顶层的函数对象。比如：

```js
function map(array, func){ 
   var res = []; 
   
   for ( let i = 0, len = array.length; i < len; i++) { 
        res.push(func(array[i]))
   } 
   return res
} 
 
 var mapped = map([1, 3, 5, 7, 8],  function (n){  //这里的function(n) {} 匿名函数
  return n = n + 1 
 })
 
 print(mapped)
 
// 运行这段代码，将会打印：
 
 // 2,4,6,8,9// 对数组 [1,3,5,7,8] 中每一个元素加 1
```
注意 `map` 函数的调用，map 的第二个参数为一个函数，这个函数对 map 的第一个参数 ( 数组 ) 中的每一个都有作用，但是对于 map 之外的代码可能没有任何意义，因此，我们无需为其专门定义一个函数，匿名函数已经足够。

### 柯里化函数
`柯里化` 是把 `接受多个参数的函数` 变换成 `接受一个单一参数（最初函数的第一个参数）的函数`，并且`返回接受余下的参数而且返回结果的新函数的技术`。

这句话有点绕口，我们可以通过例子来帮助理解：

```js
function adder(num){ 
  return function (x){ 
    return num + x
  } 
} 
 
var add5 = adder(5)
var add6 = adder(6)

 print(add5(1)) // 6
 print(add6(1)) // 7 
```
- 函数 `adder` 接受==一个参数==，==并返回一个函数==。
- 这个 `返回的函数` 可以被预期的那样==被调用==。
- `变量 add5` 保持着 `adder(5) 返回的函数`，==这个函数可以接受一个参数==，并返回参数与 5 的和。

柯里化在 DOM 的回调中非常有用，我们将在下面的小节中看到。

### 高阶函数
`高阶函数` 是对`其他函数进行操作的函数`，操作可以是将`它们作为参数`，或者是`返回它们`。

简单来说，==高阶函数是一个接收函数作为参数或将函数作为输出返回的函数。==
例如，`Array.prototype.map`，`Array.prototype.filter` 和 `Array.prototype.reduce `是语言中==内置的一些高阶函数==。

- 函数可以作为参数传递
- 函数可以作为返回值输出

#### 函数作为参数传递
- 回调函数
    - 在ajax异步请求的过程中，回调函数使用的非常频繁
    - 在不确定请求返回的时间时，将callback回调函数当成参数传入
    - 待请求完成后执行callback函数

#### 函数作为返回值输出
#### AOP

AOP（面向切面编程）是著名的Java Spring框架中的核心概念之一。通过此编程模式可以在保持主逻辑代码不变的前提下，进行额外的功能拓展。

在 Java 中使用 AOP 往往要通过一些高级特性来实现，而 javascript 就简单多了。

比如测试一个函数的执行效率。

```JS
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
    })()
    
var aop = function(fn, proxy) {
    proxy.before && proxy.before()
    
    fn()
    
    proxy.after && proxy.after()
}
    
aop(service, test)

//   计时开始...
//   功能逻辑...
//   计时结束：1
```

### 函数组合 (Composition)
前面提到过，函数式编程的一个特点是通过串联函数来求值。然而，随着串联函数数量的增多，代码的可读性就会不断下降。函数组合就是用来解决这个问题的方法。

假设有一个 compose 函数，它可以接受多个函数作为参数，然后返回一个新的函数。当我们为这个新函数传递参数时，该参数就会「流」过其中的函数，最后返回结果。

```js
//两个函数的组合
var compose = function(f, g) {
    return function(x) {
        return f(g(x))
    }
}

//或者
var compose = (f, g) => (x => f(g(x)))

var add1 = x => x + 1;
var mul5 = x => x * 5;
compose(mul5, add1)(2);// =>15
```

### 闭包（Closure）
如果一个函数引用了自由变量，那么该函数就是一个闭包。何谓自由变量？自由变量是指不属于该函数作用域的变量(所有全局变量都是自由变量，严格来说引用了全局变量的函数都是闭包，但这种闭包并没有什么用，通常情况下我们说的闭包是指函数内部的函数)。
闭包的形成条件：

- 存在内、外两层函数
- 内层函数对外层函数的局部变量进行了引用

闭包的用途:
可以定义一些作用域局限的持久化变量，这些变量可以用来做缓存或者计算的中间量等。

```js
// 简单的缓存工具
// 匿名函数创造了一个闭包
const cache = (function() {
  const store = {};
  
  return {
    get(key) {
      return store[key];
    },
    set(key, val) {
      store[key] = val;
    }
  }
}());
console.log(cache) //{get: ƒ, set: ƒ}
cache.set('a', 1);
cache.get('a');  // 1
```

上面例子是一个简单的缓存工具的实现，匿名函数创造了一个闭包，使得 store 对象 ，一直可以被引用，不会被回收。
闭包的弊端:持久化变量不会被正常释放，持续占用内存空间，很容易造成内存浪费，所以一般需要一些额外手动的清理机制。


## 什么是函数式编程
`函数式编程 （通常简称为 FP）`是指:
- 通过==复合纯函数来构建软件的过程==，它==避免了==`共享的状态（share state）`、`易变的数据(mutable data)`、`以及副作用(side-effects)`。
- 函数式编程==是声明式而不是命令式==，并且应用程序状态通过纯函数流转。
- 对比面向对象编程，后者的应用程序状态通常是共享并共用于对象方法。

函数式编程是一种编程范式意味着它是一种软件构建的思维方式，有着自己的理论基础和界定法则。其他编程范式的例子包括面 `向对象编程` 和 `过程式编程`。

与命令式或面向对象代码相比，==函数式代码倾向于更简洁、更可预测以及更易于测试==。 但是如果你对它以及与它相关的常见模式不熟悉，读函数式代码会让你觉得信息量太大，而且相关文献对于初学者来说往往难以理解。

如果你开始 google 函数式编程的术语，你很可能一下子碰壁，那些学术术语对新人来说着实有点吓人。它有一个非常陡峭的学习曲线。但是如果你已经用 JavaScript 写了一段时间的代码，你很可能不知不觉中在你的软件里已经使用了很多函数式编程原理和功能。

不要让那些新名词把你吓跑。实际上它比你所听说的要简单很多。

最难的部分是记住那些以前不熟悉的词汇。在这些名词定义中蕴含了许多思想，你只有理解了它们，才能够开始掌握函数式编程真正的意义：

- 纯函数（Pure functions）
- 函数复合（Function composition）
- 避免共享状态（Avoid shared state）
- 避免改变状态（Avoid mutating state）
- 避免副作用（Avoid side effects）


### 纯函数
> 纯函数是这样一种函数，对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

初中的数学知识的话，函数 `f` 的概念就是，对于输入 `x` 产生一个输出 `y = f(x)`。这便是一种最简单的纯函数。

根据定义可以看出纯函数其实就是数学函数，即表示从输入的参数到输出结果的映射。

==而没有副作用的纯函数显然都是引用透明的==。

> 引用透明性（Referential Transparency）指的是，如果一段代码在不改变整个程序行为的前提下，可以替换成它的执行结果。

下面来举个栗子，比如在Javascript中对于数组的操作，有些是纯的，有些就不是纯的：

- Array.splice(i,h,..item1)	i位置 h数量 item要添加的元素,空不添加，==然后返回被删除的项目==
- Array.slice(1,n)	截取数组，从1到n，1和n为索引值，==返回截取的数组==(在这里返回从1开始，到n之前结束)

```js
var arr = [1,2,3,4,5];

// Array.slice是纯函数，因为它没有副作用，对于固定的输入，输出总是固定的
// 可以，这很函数式
xs.slice(0,3)
//=> [1,2,3]

xs.slice(0,3)
//=> [1,2,3]

// Array.splice是不纯的，它有副作用，对于固定的输入，输出不是固定的
// 这不函数式
xs.splice(0,3)
//=> [1,2,3]

xs.splice(0,3);
//=> [4,5]

xs.splice(0,3)
//=> []
```


在函数式编程中，我们想要的是 `slice` 这样的纯函数，而不是 `splice`这种每次调用后都会把数据弄得一团乱的函数。

为什么函数式编程会排斥不纯的函数呢？下面再看一个例子：

#### 不纯的

```js
var min = 18;
var checkage = age => age > min;
```


#### 纯的，很函数式

```js
var checkage = age => age > 18;
```

- 在不纯的版本中，`checkage` 这个函数的行为不仅取决于输入的参数 `age`，还取决于一个外部的变量 min。  
换句话说，这个函数的行为需要由外部的系统环境决定。  
==对于大型系统来说，这种对于外部状态的依赖是造成系统复杂性大大提高的主要原因==。

- 纯的 checkage 把==关键数字 18 硬编码在函数内部==，扩展性比较差，我们可以在后面的柯里化中看到如何用优雅的函数式解决这种问题。

==纯函数==不仅可以有效降低系统的复杂度，还有很多很棒的特性，==比如可缓存性==：

```js
import _ from 'lodash';
var sin = _.memorize(x => Math.sin(x))

//第一次计算的时候会稍慢一点
var a = sin(1)

//第二次有了缓存，速度极快
var b = sin(1)
```
### 共享状态
- 共享状态 的意思是任意变量、对象或者内存空间存在于共享作用域下，或者作为对象的属性在各个作用域之间被传递。
- 共享作用域包括全局作用域和闭包作用域。

通常，`在面向对象编程中`，==对象以添加属性到其他对象上的方式在作用域之间共享==。


举个例子，一个电脑游戏可能会控制一个游戏对象（game object），它上面有角色(characters)和游戏道具（items），这些数据作为属性存储在游戏对象之上。

==而函数式编程避免共享状态== —— 与前者不同地，它==依赖于 `不可变数据结构` 和 `纯粹的计算过程` 来从已存在的数据中派生出新的数据==。要获取更多关于软件开发如何使用函数式编程处理应用程序状态的详细内容，可以阅读“[10 Tips for Better Redux Architecture](https://medium.com/javascript-scene/10-tips-for-better-redux-architecture-69250425af44)”。

#### 共享状态的问题
##### 同步竞争
共享状态的问题是为了理解函数的作用，你需要了解那个函数所用到的全部共享变量的变化历史。

想象你有一个 user 对象需要保存。你的 saveUser() 函数向服务器 API 发起一个请求。此时，用户改变了他们的头像，通过 updateAvatar() 并触发了另一次 saveUser() 请求。  

在保存动作执行后，服务器返回一个更新的 user 对象，客户端要将这个对象替换内存中的对象，以保持与服务器同步。

不幸地是，==第二次请求有可能比第一次请求更早返回==，所以当第一次请求（现在已经过时了）返回时，新的头像又从内存中丢失了，被替换回旧的头像。这是一个同步竞争的例子，是一个非常常见的共享状态 bug。

##### 调用次序
共享状态的另一个常见问题是 `改变函数调用次序可能导致一连串的错误`，因为函数操作共享数据是依时序的：


```js
//使用共享数据，函数调用的次序会改变函数调用的结果
const x = {val: 2}

const x1 = () => x.val += 1
const x2 = () => x.val *= 2

x1()
x2()
console.log(x.val) // 6


//下面的例子与上面的相同，除了调用次序颠倒了一下...
const y = {val: 2}

const y1 = () => y.val += 1

const y2 = () => y.val *= 2

// ...函数的调用次序颠倒了一下...
y2();
y1();

// ... 这改变了结果值:
console.log(y.val); // 5
```
- 如果`避免共享状态`，函数的调用时序不同就==不会改变函数的调用结果==。
- 使用纯函数，给定同样的输入，你将总是能得到同样的输出。这使得函数调用完全独立于其他函数调用，可以从根本上简化变更和重构。改变函数内容，或者改变函数调用的时序不会波及和破坏程序的其他部分。


```js
const x = {val: 2};

const x1 = x => Object.assign({}, x, { val: x.val + 1});
const x2 = x => Object.assign({}, x, { val: x.val * 2});

console.log(x1(x2(x)).val); // 5


const y = {val: 2};

//由于它对于外部变量没有依赖,
//我们不需要不同的函数来操作不同的变量

//这里故意留白


//由于函数没有操作可变数据，你可以调用这些函数任意次，用各种次序
//都不会改变之后调用函数的结果值。
x2(y);
x1(y);

console.log(x1(x2(y)).val); // 5
```
在上面的例子里，我们使用了 `Object.assign()` 并传入一个空的 `object` 作为第一个参数来拷贝 `x` 的属性，以防止 x 在函数内部被改变。

在这个例子里，它等价由于重新创建一个对象，而这是一种 JavaScript 里的通用模式， 用来拷贝已存在状态而不是使用引用，从而避免像我们第一个例子里产生的问题。

如果你仔细看例子里的 `console.log()` 语句，你会发现我前面已经提到过的概念：==`函数复合`==。回顾一下，函数复合看起来像是这样：`f(g(x))`。在这个例子里，我们的 `f()` 和 `g() `是 `x1()` 和 `x2()`，所以复合是 x1·x2。

==当然，如果你改变复合的顺序，输出将改变。操作的顺序仍然很重要。==

`f(g(x)) `并不总是等价于` g(f(x))`，但是，有一件事情发生了改变，==那就是函数外部的变量不会被修改== —— 原本函数修改外部变量是一个大问题。要是函数不纯，我们如果不了解函数使用或操作的每个变量的完整历史，就不可能完全理解它做了什么。

移除函数时序依赖，你就完全消除了一大类潜在的 bug。


### 不可变性

一个不可变的（immutable）对象是指一个==对象不会在它创建之后被改变==。对应地，一个可变的(mutable)对象是指任何在创建之后可以被改变的对象。

==不可变性是函数式编程的一个核心概念==，因为没有它，你的程序中的数据流是有损的。状态历史被抛弃而奇怪的 bug 可能会在你的软件中产生。关于更多不变性的意义，阅读 “The Dao of Immutability.”。

在 JavaScript 中，很重要的一点是不要混淆了 const 和不变性。const 创建一个变量绑定，让该变量不能再次被赋值。
const 并不创建不可变对象。你虽然不能改变绑定到这个变量名上的对象，但你仍然可以改变它的属性，这意味着 const 的变量仍然是可变的，而不是不可变的。

不可变对象完全不能被改变。你可以通过==深度冻结对象来==创造一个==真正的不可变的值==。JavaScript 提供了一个方法，能够浅冻结一个对象：

```js
const a = Object.freeze({
  foo: 'Hello',
  bar: 'world',
  baz: '!'
})

a.foo = 'Goodbye';
// Error: Cannot assign to read only property 'foo' of object Object
```

然而冻结的对象只是表面一层不可变，例如，==深层的属性还是可以被改变==：

```js
const a = Object.freeze({
  foo: { greeting: 'Hello' },
  bar: 'world',
  baz: '!'
});

a.foo.greeting = 'Goodbye';

console.log(`${ a.foo.greeting }, ${ a.bar }${a.baz}`);
```

如你所见，被冻结的 `object` 的顶层基本属性不能被改变，但是如果有一个属性本身也是 object（包括数组等），它依然可以被改变 —— 因此甚至被冻结的对象也不是不可变的，除非你遍历整个对象树并冻结每一个对象属性。

在许多函数式编程语言中，有特殊的不可变数据结构，被称为 trie 数据结构(trie 的发音为 tree)，这一结构有效地深冻结 —— 意味任何属性无论它的对象层级如何都不能被改变。

当一个对象被拷贝给一个操作符时，tries 使用结构共享来共用不可变对象的引用内存地址，这减少内存占用，而且能够显著地改善一些类型的操作的性能。

例如，你可以使用 ID 来比较对象，如果两个对象的根 ID 相同，你不需要继续遍历比较整个对象树来寻找差异。

有一些 JavaScript 的库使用了 tries，包括 `Immutable.js` 和 `Mori`。

我体验了这两个库，最终决定在需要大量不可变状态==大的型项目中使用 Immutable.js==。想要了解这一部分的更多内容，请移步 “10 Tips for Better Redux Architecture”。



### 副作用（Side Effects）
==副作用是指除了函数返回值以外，任何在函数调用之外观察到的应用程序状态改变==。副作用包括：

- 改变了任何外部变量或对象属性（例如，全局变量，或者一个在父级函数作用域链上的变量）
- 写日志
- 在屏幕输出
- 写文件
- 发网络请求
- 触发任何外部进程
- 调用另一个有副作用的函数

在函数式编程中，==副作用被尽可能避免==，这使得程序的作用更容易理解，也使得程序更容易被测试。

Haskell 以及其他函数式编程语言经常从纯函数中隔离和封装副作用，使用 monads 技巧。Mondas 这个话题要深入下去可以写一本书，所以我们先放一放。

你现在需要做的是要从你的软件中隔离副作用行为。如果你让副作用与你的程序逻辑分离，你的软件将会变得更易于扩展、重构、调试、测试和维护。

这也是为什么大部分前端框架鼓励我们分开管理状态和组件渲染，采用松耦合的模型。



## 通过高阶函数提升可重用性
函数式编程倾向于复用一组通用的函数功能来处理数据。面向对象编程倾向于把方法和数据集中到对象上。那些被集中的方法只能用来操作设计好的数据类型，通常是那些包含在特定对象实例上的数据。

在函数式编程里，对任何类型的数据一视同仁。同样的 map() 操作可以 map 对象、字符串、数字或任何别的类型，因为它接受一个函数参数，来适当地操作给定类型。函数式编程通过使用高阶函数来实现这一技巧。

==在 JavaScript 里，函数是一等公民==，JavaScript 允许使用者将函数作为数据 —— 可以将它们赋值给变量、作为参数传递给其他函数、将它们作为返回值返回，等等……

==高阶函数指的是一个函数以函数为参数，或以函数为返回值，或者既以函数为参数又以函数为返回值==。高阶函数经常用于：

- 抽象或隔离行为、作用，异步控制流程作为回调函数，promises，monads，等等……
- 创建可以泛用于各种数据类型的功能
- 部分应用于函数参数（偏函数应用）或创建一个柯里化的函数，用于复用或函数复合。
- 接受一个函数列表并返回一些由这个列表中的函数组成的复合函数。

### 容器、函子（Functor）、列表和流
Functor 是可以被用来执行具体 map 操作的数据。换句话说，它是一个有接口的容器，能够遍历其中的值。当你看到“functor”这个词，你在脑海里应该想到“mappable”。

之前我们说同样的 map() 函数能够操作各种数据类型。它是通过将 map 操作抽象出来，提供给 functor API 使用。map() 利用该接口执行重要的流程控制操作。在 Array.prototype.map() 的场景里，容器是一个数组，但是其他数据接口也可以作为 functor，同样它也提供了 mapping 操作的 API。

让我们看一下 Array.prototype.map() 是如何让你从 mapping 功能里抽象数据类型，让 map() 可以适用于任何数据类型的。我们创建一个简单的 double() mapping，它简单地将传给它的值乘以 2：


```js
const double = n => n * 2;
const doubleMap = numbers => numbers.map(double);
console.log(doubleMap([2, 3, 4])); // [ 4, 6, 8 ]
```

假设我们相对游戏中的目标执行奖励翻倍操作，我们所需要做的只是小小改变一下我们传给 map() 的 double() 函数，这样便一切正常：

```js
const double = n => n.points * 2;

const doubleMap = numbers => numbers.map(double);

console.log(doubleMap([
  { name: 'ball', points: 2 },
  { name: 'coin', points: 3 },
  { name: 'candy', points: 4}
])); // [ 4, 6, 8 ]
```

使用 functors 以及使用高阶函数抽象来创建通用功能函数，以处理任意数值或不同类型的数据，这是函数式编程中很重要的概念。你还能看到类似的概念以各种不同的方式被应用。

“流即是随着时间推移而变化的列表。”

现在你所需要知道的是容器和容器的值所能应用的形式不仅仅只有数组和 functor。一个数组只是一些内容的列表。如果这个列表随着时间推移而变化则成为一个流 —— 所以你可以应用同样的功能来处理时间流 —— 如果你用函数式编程实际开始构建一个真正的软件时，你就会看到很多这种用法。

### 对比声明式与命令式
函数式编程是一个声明式范式，意思是说程序逻辑不需要通过明确描述控制流程来表达。

#### 命令式 
程序花费大量代码来描述用来达成期望结果的特定步骤 —— 控制流：即如何做。


```js
// 命令式
function mysteryFn (nums) {
  let squares = []
  let sum = 0                           // 1. 创建中间变量

  for (let i = 0; i < nums.length; i++) {
    squares.push(nums[i] * nums[i])     // 2. 循环计算平方
  }

  for (let i = 0; i < squares.length; i++) {
    sum += squares[i]                   // 3. 循环累加
  }

  return sum
}

// 以上代码都是 how 而不是 what...
```




#### 声明式 
程序抽象了控制流过程，花费大量代码描述的是数据流：即做什么。

举个例子，下面是一个用 命令式 方式实现的 mapping 过程，接收一个数值数组，并返回一个新的数组，新数组将原数组的每个值乘以 2：

```js
const doubleMap = numbers => {
  const doubled = [];
  for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2);
  }
  return doubled;
};

console.log(doubleMap([2, 3, 4])); // [4, 6, 8]
```

而实现同样功能的 声明式 mapping 用函数 `Array.prototype.map()` 将控制流抽象了，从而我们可以表达更清晰的数据流：


```js
const doubleMap = numbers => numbers.map(n => n * 2);

console.log(doubleMap([2, 3, 4])); // [4, 6, 8]
```

命令式 代码中频繁使用语句。语句是指一小段代码，它用来完成某个行为。通用的语句例子包括 for、if、switch、throw，等等……

声明式 代码更多依赖表达式。表达式是指一小段代码，它用来计算某个值。表达式通常是某些函数调用的复合、一些值和操作符，用来计算出结果值。

以下都是表达式：

```js
2 * 2
doubleMap([2, 3, 4])
Math.max(4, 3, 2)
```

通常在代码里，你会看到一个表达式被赋给某个变量，或者作为函数返回值，或者作为参数传给一个函数。在被赋值、返回或传递之前，表达式首先被计算，之后它的结果值被使用。

### 结论
函数式编程偏好：

- 使用纯函数而不是使用共享状态和副作用
- 让可变数据成为不可变的
- 用函数复合替代命令控制流
- 使用高阶函数来操作许多数据类型，创建通用、可复用功能取代只是操作集中的数据的方法。
- 使用声明式而不是命令式代码（关注做什么，而不是如何做）
- 使用表达式替代语句
- 使用容器与高阶函数替代多态

### 作业
学习和练习这一组核心的数据扩展

- .map()
- .filter()
- .reduce()

使用 map 来转换如下数组的值为 item 名字：


```js
// vvv Don't change vvv
const items = [
  { name: 'ball', points: 2 },
  { name: 'coin', points: 3 },
  { name: 'candy', points: 4}
];
// ^^^ Don't change ^^^

const result = items.map(
  /* ==vvv Replace this code vvv== */
  () => {}
  /* ==^^^ Replace this code ^^^== */
);


// vvv Don't change vvv
test('Map', assert => {
  const msg = 'Should extract names from objects';
  const expected = [
    'ball', 'coin', 'candy'
  ];

  assert.same(result, expected, msg);
  assert.end();
});
// ^^^ Don't change ^^^
```

使用 filter 来选择出 points 大于等于 3 的元素：


```js
// vvv Don't change vvv
const items = [
  { name: 'ball', points: 2 },
  { name: 'coin', points: 3 },
  { name: 'candy', points: 4 }
];
// ^^^ Don't change ^^^

const result = items.filter(
  /* ==vvv Replace this code vvv== */
  () => {}
  /* ==^^^ Replace this code ^^^== */
);


// vvv Don't change vvv
test('Filter', assert => {
  const msg = 'Should select items where points >= 3';
  const expected = [
    { name: 'coin', points: 3 },
    { name: 'candy', points: 4 }
  ];

  assert.same(result, expected, msg);
  assert.end();
});
// ^^^ Don't change ^^^
```

使用 reduce 来求出 points 的和:


```js
// vvv Don't change vvv
const items = [
  { name: 'ball', points: 2 },
  { name: 'coin', points: 3 },
  { name: 'candy', points: 4 }
];
// ^^^ Don't change ^^^

const result = items.reduce(
  /* ==vvv Replace this code vvv== */
  () => {}
  /* ==^^^ Replace this code ^^^== */
);


// vvv Don't change vvv
test('Learn reduce', assert => {
  const msg = 'should sum all the points';
  const expected = 9;

  assert.same(result, expected, msg);
  assert.end();
});
// ^^^ Don't change ^^^
```


## 参考
- https://zhuanlan.zhihu.com/p/21714695
- https://blog.fundebug.com/2018/12/27/to-be-a-functional-programmer-part-1/
- https://www.zcfy.cc/article/master-the-javascript-interview-what-is-functional-programming-2221.html
- https://www.ibm.com/developerworks/cn/web/1006_qiujt_jsfunctional/index.html
- https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/