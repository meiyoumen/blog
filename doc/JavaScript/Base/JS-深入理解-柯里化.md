[TOC]
# 什么是柯里化？
在计算机科学中，柯里化（Currying）是把==接受多个参数==的函数变换成==接受一个单一参数==（最初函数的第一个参数）的函数，并且返回接受余下的参数且返回结果的新函数的技术。

这个技术由 Christopher Strachey 以逻辑学家 Haskell Curry 命名的，尽管它是 Moses Schnfinkel 和 Gottlob Frege 发明的。


在说JavaScript 中的柯里化前，可以聊一下原始的 Currying 是什么，又从何而来。  
在编码过程中，身为码农的我们本质上所进行的工作就是——将复杂问题分解为多个可编程的小问题。


Currying ==为实现多参函数提供了一个递归降解的实现思路==——把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数，在某些编程语言中（如 Haskell），是通过 Currying 技术支持多参函数这一语言特性的。
  
所以 ==Currying 原本是一门编译原理层面的技术，用途是实现多参函数==。

## 在 JavaScript 中实现 Currying
为了实现只传递给函数一部分参数来调用它，让它==返回一个函数==去处理==剩下的参数==这句话所描述的特性。 我们先写一个实现加法的函数 add：


```js
function add (x, y) {

  return (x + y)

}
```
现在我们直接实现一个被 Currying 的 add 函数，该函数名为 curriedAdd，则根据上面的定义，curriedAdd 需要满足以下条件：


```js
curriedAdd(1)(3) === 4

// true

var increment = curriedAdd(1)

increment(2) === 3

// true

var addTen = curriedAdd(10)

addTen(2) === 12

// true
```

满足以上条件的 curriedAdd 的函数可以用以下代码段实现：
```js
function curriedAdd (x) {

  return function(y) {

    return x + y

  }
}
```



当然以上实现是有一些问题的：==它并不通用，并且我们并不想通过重新编码函数本身的方式来实现 Currying 化。==

但是这个 curriedAdd 的实现表明了实现 Currying 的一个基础 —— Currying 延迟求值的特性需要用到 JavaScript 中的作用域——说得更通俗一些，我们需要使用作用域来保存上一次传进来的参数。

对 curriedAdd 进行抽象，可能会得到如下函数 currying ：


```js
function currying (fn, ...args1) {

    return function (...args2) {

        return fn(...args1, ...args2)

    }
}

var increment = currying(add, 1)

increment(2) === 3

// true

var addTen = currying(add, 10)

addTen(2) === 12

// true
```

在此实现中，`currying 函数的返回值其实是一个接收剩余参数并且立即返回计算值的函数`。==即它的返回值并没有自动被 Currying化 。==

所以我们可以==通过递归来将 currying 的返回的函数也自动 Currying 化==。


```js
  function log() {
    console.log.apply(console, arguments)
  }

  function add (x, y) {
    return (x + y)
  }

  function currying(fn, ...args) {
    /**
     * fn.length 是add方法中的参数个数
     * Local
         args: [10]
         fn: ƒ add(x, y, z)
           arguments: null
           caller: null
           length: 3
           name: "add"
           prototype: {constructor: ƒ}
           __proto__: ƒ ()
           [[FunctionLocation]]: 1.html?_ijt=nhdu23s7ih2r2l1m7rdhgc8o7n:10
           [[Scopes]]: Scopes[1]
     */
    if (args.length >= fn.length) {
      return fn(...args)
    }

    return function (...args2) {
      return currying(fn, ...args, ...args2)
    }
  }

  let addTen = currying(add, 10)
  let isTrue = addTen(2) === 12
  log(isTrue) // true
```

以上函数很简短，但是已经实现 Currying 的核心思想了。JavaScript 中的常用库 Lodash 中的 curry 方法，其核心思想和以上并没有太大差异——比较多次接受的参数总数与函数定义时的入参数量，当接受参数的数量大于或等于被 Currying 函数的传入参数数量时，就返回计算结果，否则返回一个继续接受参数的函数。

Lodash 中实现 Currying 的代码段较长，因为它考虑了更多的事情，比如绑定 this 变量等。在此处就不直接贴出 Lodash 中的代码段，感兴趣的同学可以去看看看 Lodash 源码，比较一下这两种实现会导致什么样的差异。


然而 Currying 的定义和实现都不是最重要的，本文想要阐述的重点是：  
==它能够解决编码和开发当中怎样的问题，以及在面对不同的问题时，选择一个合适的 Currying，来最恰当的解决问题==


### 柯里化函数

```js
// 原始的加法函数
function origPlus(a, b) {
  return a + b;
}

// 柯里化后的plus函数
function plus(a) {
  return function(b) {
    return a + b;
  }
}

// ES6写法
const plus = a => b => a + b;
```


## 柯里化3个常见作用
- 参数复用
- 提前返回
- 延迟计算/运行

### 参数复用
==固定不变的参数，实现参数复用是 Currying 的主要用途之一。==

上文中的increment, addTen是一个参数复用的实例。  
对add方法固定第一个参数为 10 后，改方法就变成了一个将接受的变量值加 10 的方法。

### 延迟执行
延迟执行也是 Currying 的一个重要使用场景，同样 bind 和箭头函数也能实现同样的功能。
在前端开发中，一个常见的场景就是为标签绑定 onClick 事件，同时考虑为绑定的方法传递参数。
以下列出了几种常见的方法，来比较优劣：


#### 通过 data 属性

```html
<div data-name="name" onClick={handleOnClick} />
```

data 属性本质只能传递字符串的数据，如果需要传递复杂对象，只能通过 JSON.stringify(data) 来传递满足 JSON 对象格式的数据，但对更加复杂的对象无法支持。（虽然大多数时候也无需传递复杂对象）


#### 通过bind方法

```html
<div onClick={handleOnClick.bind(null, data)} />
```

方法和以上实现的 currying 方法，在功能上有极大的相似，在实现上也几乎差不多。可能唯一的不同就是 bind 方法需要强制绑定 context，也就是 bind 的第一个参数会作为原函数运行时的 this 指向。而 currying 不需要此参数。所以使用 currying 或者 bind 只是一个取舍问题。


#### 箭头函数

```html
<div onClick={() => handleOnClick(data))} />
```

箭头函数能够实现延迟执行，同时也不像 bind 方法必需指定 context。可能唯一需要顾虑的就是在 react 中，会有人反对在 jsx 标签内写箭头函数，这样子容易导致直接在 jsx 标签内写业务逻辑。


#### 通过currying

```html
<div onClick={currying(handleOnClick, data)} />
```

### 性能对比
![image](https://user-gold-cdn.xitu.io/2018/5/8/1633e3ce88971668?imageslim)

通过 jsPerf 测试四种方式的性能，结果为：==`箭头函数` > `bind` > `currying` > `trueCurrying`。==

currying 函数相比 bind 函数，其原理相似，但是性能相差巨大，其原因是 bind 由浏览器实现，运行效率有加成。

从这个结果看 Currying 性能无疑是最差的，但是另一方面就算最差的 trueCurrying 的实现，也能在本人的个人电脑上达到 50w Ops/s 的情况下，说明这些性能是无需在意的。
而 trueCurrying 方法中实现的自动 Currying 化，是另外三个方法所不具备的。


## 到底需不需要 Currying
为什么需要 Currying


### 为了多参函数复用性
Currying 让人眼前一亮的地方在于，让人觉得函数还能这样子复用。
通过一行代码，将 add 函数转换为 increment，addTen 等。
对于 Currying 的复杂实现中，以 Lodash 为列，提供了 placeholder 的神奇操作。对多参函数的复用玩出花样。

```js
import _ from 'loadsh'

function abc (a, b, c) {
  return [a, b, c];
}

var curried = _.curry(abc)

// Curried with placeholders.
curried(1)(_, 3)(2)
// => [1, 2, 3]
```


### 为函数式编程而生
Currying 是为函数式而生的东西。应运着有一整套函数式编程的东西，纯函数、compose、container等等事物。（可阅读《mostly-adequate-guide》 ）
假如要写 Pointfree Javascript 风格的代码，那么Currying是不可或缺的。
要使用 compose，要使用 container 等事物，我们也需要 Currying。


### 为什么不需要 Currying

- Currying 的一些特性有其他解决方案
如果我们只是想提前绑定参数，那么我们有很多好几个现成的选择，bind，箭头函数等，而且性能比Curring更好。


- Currying 陷于函数式编程
    在本文中，提供了一个 trueCurrying 的实现，这个实现也是最符合 Currying 定义的，也提供 了bind，箭头函数等不具备的“新奇”特性——可持续的 Currying（这个词是本人临时造的）。
    但是这个“新奇”特性的应用并非想象得那么广泛。

    其原因在于，Currying 是函数式编程的产物，它生于函数式编程，也服务于函数式编程。

    而 JavaScript 并非真正的函数式编程语言，相比 Haskell 等函数式编程语言，JavaScript 使用 Currying 等函数式特性有额外的性能开销，也缺乏类型推导。
从而把 JavaScript 代码写得符合函数式编程思想和规范的项目都较少，从而也限制了 Currying 等技术在 JavaScript 代码中的普遍使用。
假如我们还没有准备好去写函数式编程规范的代码，仅需要在 JSX 代码中提前绑定一次参数，那么 bind 或箭头函数就足够了。


### 结论

- Currying 在 JavaScript 中是“低性能”的，但是这些性能在绝大多数场景，是可以忽略的。
- Currying 的思想极大地助于提升函数的复用性。
- Currying 生于函数式编程，也陷于函数式编程。假如没有准备好写纯正的函数式代码，那么 Currying 有更好的替代品。
- 函数式编程及其思想，是值得关注、学习和应用的事物。所以在文末再次安利 JavaScript 程序员阅读此书 —— 《mostly-adequate-guide》


## 面试中的一些问题

假如有一个接收三个参数的函数A。

```js
function A(a, b, c) {
    // do something
}
```

又假如我们有一个已经封装好了的柯里化通用函数createCurry。他接收bar作为参数，能够将A转化为柯里化函数，返回结果就是这个被转化之后的函数。

```js
var _A = createCurry(A);
```

那么_A作为createCurry运行的返回函数，他能够处理A的剩余参数。因此下面的运行结果都是等价的。


```js
_A(1, 2, 3);
_A(1, 2)(3);
_A(1)(2, 3);
_A(1)(2)(3);
A(1, 2, 3);
```

函数`A`被 `createCurry` 转化之后得到柯里化函数_A，_A能够处理A的所有剩余参数。因此柯里化也被称为部分求值。

在简单的场景下，我们可以不用借助柯里化通用式来转化得到柯里化函数，我们可以凭借眼力自己封装。

例如有一个简单的加法函数，他能够将自身的三个参数加起来并返回计算结果。


```js
function add(a, b, c) {
    return a + b + c;
}
```

那么add函数的柯里化函数_add则可以如下：

```JS
function _add(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        }
    }
}
```

因此下面的运算方式是等价的。


```js
add(1, 2, 3)
_add(1)(2)(3)
```

当然，柯里化通用式具备更加强大的能力，我们靠眼力自己封装的柯里化函数则自由度偏低。因此我们仍然需要知道自己如何去封装这样一个柯里化的通用式。

首先通过_add可以看出，柯里化函数的运行过程其实是一个参数的收集过程，我们将每一次传入的参数收集起来，并在最里层里面处理。因此我们在实现createCurry时，可以借助这个思路来进行封装。

封装如下:

```JS
// 简单实现，参数只能从右到左传递
function createCurry(func, args) {

    var arity = func.length;
    var args = args || [];

    return function() {
        var _args = [].slice.call(arguments);
        [].push.apply(_args, args);

        // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
        if (_args.length < arity) {
            return createCurry.call(this, func, _args);
        }

        // 参数收集完毕，则执行func
        return func.apply(this, _args);
    }
}
```

尽管我已经做了足够详细的注解，但是我想理解起来也并不是那么容易，因此建议大家用点耐心多阅读几遍。这个createCurry函数的封装借助闭包与递归，实现了一个参数收集，并在收集完毕之后执行所有参数的一个过程。

因此聪明的读者可能已经发现，把函数经过 `createCurry` 转化为一个柯里化函数，最后执行的结果，不是正好相当于执行函数自身吗？柯里化是不是把简单的问题复杂化了？

如果你能够提出这样的问题，那么说明你确实已经对柯里化有了一定的了解。柯里化确实是把简答的问题复杂化了，但是复杂化的同时，我们在使用函数时拥有了更加多的自由度。而这里对于函数参数的自由处理，正是柯里化的核心所在。

我们来举一个非常常见的例子。

如果我们想要验证一串数字是否是正确的手机号，那么按照普通的思路来做，大家可能是这样封装，如下：


```js
function checkPhone(phoneNumber) {
    return /^1[34578]\d{9}$/.test(phoneNumber);
}
```

而如果我们想要验证是否是邮箱呢？这么封装：


```js
function checkEmail(email) {
    return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email);
}
```

我们还可能会遇到验证身份证号，验证密码等各种验证信息，因此在实践中，为了统一逻辑，，我们就会封装一个更为通用的函数，将用于验证的正则与将要被验证的字符串作为参数传入。


```js
function check(targetString, reg) {
    return reg.test(targetString);
}
```

但是这样封装之后，在使用时又会稍微麻烦一点，因为会总是输入一串正则，这样就导致了使用时的效率低下。

```js
check(/^1[34578]\d{9}$/, '14900000088');
check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com');
```

那么这个时候，我们就可以借助柯里化，在check的基础上再做一层封装，以简化使用。

```js
var _check = createCurry(check);

var checkPhone = _check(/^1[34578]\d{9}$/);
var checkEmail = _check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);
```

最后在使用的时候就会变得更加直观与简洁了。


```js
checkPhone('183888888')
checkEmail('xxxxx@test.com')
```

### add(1)(2)(3)
在前端面试中，你可能会遇到这样一个涉及到柯里化的题目。

```js
// 实现一个add方法，使计算结果能够满足如下预期：
add(1)(2)(3) = 6
add(1, 2, 3)(4) = 10
add(1)(2)(3)(4)(5) = 15
```


这个题目的目的是想让 `add` 执行之后返回一个函数能够继续执行，最终运算的结果是所有出现过的参数之和。

==而这个题目的难点则在于参数的不固定==。我们不知道函数会执行几次。因此我们不能使用上面我们封装的createCurry的通用公式来转换一个柯里化函数。  
只能自己封装，那么怎么办呢？在此之前，补充2个非常重要的知识点。


- ==一个是ES6函数的不定参数==。

假如我们有一个数组，希望把这个数组中所有的子项展开传递给一个函数作为参数。那么我们应该怎么做？

// 大家可以思考一下，如果将args数组的子项展开作为add的参数传入

```js
function add(a, b, c, d) {
    return a + b + c + d;
}
var args = [1, 3, 100, 1];
```

在ES5中，我们可以借助之前学过的apply来达到我们的目的。


```js
add.apply(null, args);  // 105
```

而在ES6中，提供了一种新的语法来解决这个问题，那就是不定参。写法如下：


```js
add(...args);  // 105
```

- 函数的隐式转换。
==当我们直接将函数参与其他的计算时，函数会默认调用toString方法，直接将函数体转换为字符串参与计算==


```js
function fn() { return 20 }
console.log(fn + 10);     // 输出结果 function fn() { return 20 }10
```

==但是我们可以重写函数的toString方法==，让函数参与计算时，输出我们想要的结果。

```js
function fn() { return 20; }

fn.toString = function() { return 30 }

console.log(fn + 10); // 40
```

除此之外，当我们重写函数的valueOf方法也能够改变函数的隐式转换结果。


```js
function fn() { return 20; }
fn.valueOf = function() { return 60 }

console.log(fn + 10); // 70
```

==当我们同时重写函数的toString方法与valueOf方法时，最终的结果会取valueOf方法的返回结果==。

```js
function fn() { return 20; }
fn.valueOf = function() { return 50 }
fn.toString = function() { return 30 }

console.log(fn + 10); // 60
```

补充了这两个知识点之后，我们可以来尝试完成之前的题目了。
- add方法的实现仍然会是一个参数的收集过程。
- 当add函数执行到最后时，仍然返回的是一个函数，但是我们可以通过定义toString/valueOf的方式，让这个函数可以直接参与计算，并且转换的结果是我们想要的。而且它本身也仍然可以继续执行接收新的参数。

实现方式如下:
```js
function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = [].slice.call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var adder = function () {
        var _adder = function() {
            // [].push.apply(_args, [].slice.call(arguments));
            _args.push(...arguments);
            return _adder;
        };

        // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
        _adder.toString = function () {
            return _args.reduce(function (a, b) {
                return a + b;
            });
        }

        return _adder;
    }
    // return adder.apply(null, _args);
    return adder(..._args)
}


var a = add(1)(2)(3)(4);   // f 10
var b = add(1, 2, 3, 4);   // f 10
var c = add(1, 2)(3, 4);   // f 10
var d = add(1, 2, 3)(4);   // f 10

// 可以利用隐式转换的特性参与计算
console.log(a + 10); // 20
console.log(b + 20); // 30
console.log(c + 30); // 40
console.log(d + 40); // 50

// 也可以继续传入参数，得到的结果再次利用隐式转换参与计算
console.log(a(10) + 100);  // 120
console.log(b(10) + 100);  // 120
console.log(c(10) + 100);  // 120
console.log(d(10) + 100);  // 120

// 其实上栗中的add方法，就是下面这个函数的柯里化函数，只不过我们并没有使用通用式来转化，而是自己封装
function add(...args) {
    return args.reduce((a, b) => a + b)
}
```

## javascript类型转换的思考

实现一个函数，运算结果可以满足如下预期结果：

```js
add(1)(2) // 3
add(1, 2, 3)(10) // 16
add(1)(2)(3)(4)(5) // 15
```

对于一个好奇的切图仔来说，忍不住动手尝试了一下，看到题目首先想到的是会用到高阶函数以及 Array.prototype.reduce()。

> 高阶函数(Higher-order function)：高阶函数的意思是它接收另一个函数作为参数。在 javascript 中，函数是一等公民，允许函数作为参数或者返回值传递。

得到了下面这个解法：

```js
function add() {
    var args = Array.prototype.slice.call(arguments);
 
    return function() {
        var arg2 = Array.prototype.slice.call(arguments);
        return args.concat(arg2).reduce(function(a, b){
            return a + b;
        });
    }
}
```

验证了一下，发现错了：

```js
add(1)(2) // 3
add(1, 2)(3) // 6
add(1)(2)(3) // Uncaught TypeError: add(...)(...) is not a function(…)
```

```js
function add () {
    var args = Array.prototype.slice.call(arguments);
 
    var fn = function () {
        var arg_fn = Array.prototype.slice.call(arguments);
        return add.apply(null, args.concat(arg_fn));
    }
 
    fn.valueOf = function () {
        return args.reduce(function(a, b) {
            return a + b;
        })
    }
 
    return fn;
}
```


```js
add(1)               // 1
add(1,2)(3)          // 6
add(1)(2)(3)(4)(5)   // 15
```



```js
function fixCurry(fn, totalArgs){
    totalArgs = totalArgs || fn.length
    
    return function recursor(){
        return arguments.length < totalArgs ? recursor.bind(this, ...arguments): fn.call(this, ...arguments)
    }
}

var add = fixCurry((a,b,c) => a + b +c)      //fn = summation function
console.log(add(1,2, 3))  // output: 6
console.log(add(1)(2,3))  // output: 6
console.log(add(1)(3)(2)) // output: 6
console.log(add(1,2)(3))  // output: 6

var multiply = fixCurry((a,b,c) => a * b * c) //fn = multiplication function
console.log(multiply(1,2, 3))  // output: 6
console.log(multiply(1)(2,3))  // output: 6
console.log(multiply(1)(3)(2)) // output: 6
console.log(multiply(1,2)(3))  // output: 6

// https://theanubhav.com/2019/02/03/js-currying-in-interview/
```

## 参考：
- https://yangbo5207.github.io/wutongluo/ji-chu-jin-jie-xi-lie/ba-3001-ke-li-hua.html
- https://segmentfault.com/a/1190000012364000
- https://juejin.im/post/5af13664f265da0ba266efcf
- 一道面试题引发的对javascript类型转换的思考 https://www.cnblogs.com/coco1s/p/6509141.html