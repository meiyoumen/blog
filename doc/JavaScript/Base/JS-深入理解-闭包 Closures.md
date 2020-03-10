[TOC]
# 理解闭包
闭包对于 Javascript 来说，当然十分重要。然而对于函数式编程来说，这更加是必不可少的，必须掌握的概念，闭包的定义如下：
> Closure is when a function remembers and accesses variables from outside of its own scope, even when that function is executed in a different scope.

## 有几个亘古不变的问题需要梳理下：
- 什么是闭包?
- 闭包的原理可不可以说一下？
- 你是怎样使用闭包的？

### 什么是闭包?
`闭包` 是指 `有权访问` 另一个`函数作用域中的变量的函数`

#### Demo1
```js
// Closure demo
function cube(x) {
  let z = 1;
  return function larger(y) {
    return x * y * z++
  };
}

const makeCube = cube(10) 
console.log(makeCube(5))  // 50
console.log(makeCube(5))  // 100
```

那么有没有想过在函数 `makeCube`，或者也可以说是函数`larger`是==怎么记住原本不属于自己作用域的变量x和z的==呢？

在控制台查看 `makeCube.prototype`，点开会发现原来是有个==`[[Scopes]]`==。  
这个==内置属性里的Closure(cube)记住了函数larger返回时记住的变量x和z==。

```js
makeCube.prototype
    {constructor: ƒ}
        constructor: ƒ larger(y)
        arguments: null
        caller: null
        length: 1
        name: "larger"
        prototype: {constructor: ƒ}
        __proto__: ƒ ()
        [[FunctionLocation]]: VM40:3
        [[Scopes]]: Scopes[3]
            0: Closure (cube)   // 函数larger返回时记住的变量x和z=，y是没有函数引用，回收
                x: 10
                z: 3
            1: Script {makeCube: ƒ}
            2: Global {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
        __proto__: Object
```

#### Demo2
如果多嵌套几层函数，也会发现多几个Closure(name)在[[Scopes]]的Scopes[]数组里，按序查找变量。

```js
function cube(x) {
  return function wrapper(y) {
    let z = 1;
    return function larger() {
      return x * y * z++
    };
  }
}

const makeCubeY = cube(10)
const makeCube = makeCubeY(5)

const $__VAR1__ = '1. This var is just for test.'
let $__VAR2__ = '2. This var is just for test.'
var $__VAR3__ = '3. This var is just for test.'

console.log(makeCubeY.prototype, makeCube.prototype)
console.log(makeCube())         // 50
console.log(makeCube())         // 100
```

打印makeCubeY.prototype：
![image](https://user-gold-cdn.xitu.io/2019/4/19/16a35b3bdf4c2ee6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

打印makeCube.prototype：
![image](https://user-gold-cdn.xitu.io/2019/4/19/16a35b5369778785?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

过这几个实验可以从另一个角度去理解Javascript中闭包，一个闭包是怎么去查找不是自己作用域的变量呢？

- `makeCube`函数分别从`[[Scopes]]`中的Closure(wrapper)里找到变量y、z，Closure(cube)里找到变量x。
- 至于全局let、const声明的变量放在了Script里，全局var声明的变量放在了Global里。


在学习==FP==前，==理解闭包是尤为重要的~ 因为事实上大量的FP工具函数都使用了闭包这个特性==。

### 闭包的原理可不可以说一下？
- 作用域链

在代码在一个环境中执行的时候，会创建一个变量对象的一个作用域链。

作用域链的前端，始终都是当前执行的代码所在环境的「变量对象」。全局执行环境的「变量对象」也始终都是链的最后一个对象。

作用域链其实就是引用了当前执行环境的「变量对象」的指针列表，它只是引用，但不是包含。

```js
function foo(){
  var a = 12
  fun(a)
  function fun(a){
    var b = 8
    console.log(a + b)
  }
}
foo()
```

这段代码的执行流程：

- 在创建 foo 的时候，作用域链已经预先包含了一个全局对象，并保存在内部属性 `[[Scope]]` 当中。
- 执行 foo 函数，创建执行环境与活动对象后，取出函数的内部属性 `[[Scope]]` 构建当前环境的作用域链（取出后，只有全局变量对象，然后此时追加了一个它自己的活动对象）。
- 执行过程中遇到了 fun，从而继续对 fun 使用上一步的操作。
- fun 执行结束，移出环境栈。foo 因此也执行完毕，继续移出。
- javscript 监听到 foo 没有被任何变量所引用，开始实施垃圾回收机制，清空占用内存。

### ==面试题==

Closure的本质问题其实就是==词法作用域的问题==, 或者说是JavaScript引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找。

JavaScript引擎查找标识符位置的规则, 简而言之, 就是:

==作用域查找会在找到第一个匹配的标识符时停止==。

换句话说是: 作用域查找始终从运行时所处的最内部作用域开始, 逐级向外或者说向上进行, 知道遇见第一个匹配的标识符为止 

带着以上的结论, 我们看看这个例子来验证一下:

```js
function fun(n, o) {
  console.log(o)
  return {
    fun:function(m) {
      return fun(m, n)
    }
  }
}

var a = fun(0);  // undefined
a.fun(1);  // 0
a.fun(2);  // 0
a.fun(3);  // 0
// undefined,0,0,0

var b = fun(0).fun(1).fun(2).fun(3);          // undefined,0,1,2
var c = fun(0).fun(1); c.fun(2); c.fun(3);    // undefined,0,1,1
```
转换为等价代码

```js
function _fun_(n,o){
    console.log(o);
    return {
        fun:function(m){
            return _fun_(m,n);
        }
    }
}

var a=_fun_(0);//undefined
a.fun(1);//0
a.fun(2);//0
a.fun(3);//0

var b=_fun_(0).fun(1).fun(2).fun(3); //undefined,0,1,2

var c=_fun_(0).fun(1);//undefined,0,
c.fun(2);//1
c.fun(3); //1
```

#### 分析a

```js
function _fun_(n,o){
    console.log(o);
    return {
        fun:function(m){
            return _fun_(m,n);
        }
    }
}

var a=_fun_(0)  //undefined  
a.fun(1)        //0        
a.fun(2)        //0         
a.fun(3)        //0
```


- `_fun_` 函数执行, 因为第2个参数未定义，输出`undefined`。  
- 然后返回一个对象，带有`fun`属性，指向一个函数对象-带有闭包,能够访问到`_fun_`和变量`n`
- `a.fun(1)` 执行返回的对象的`fun`方法，传入`m` 的值 `1`，调用返回`_fun_(1,0)`所以输出为`0`,
- a.fun(2),a.fun(3)和a.fun(1)

由于之前运行了==var a = fun(0)==; ==返回了一个对象，并且赋值给了变量 a==，所以 a 是可以访问对象里面的属性的，例如a.fun。
所以n始终都是0


#### 分析b
```js
function _fun_(n,o){
    console.log(o);
    return {
        fun:function(m){
            return _fun_(m,n)
        }
    }
}
b = _fun_(0).fun(1).fun(2).fun(3)
1. _fun_(0, o)  // undefined  执行_fun后 n = 0   o = undefined
2. fun(1, 0)    // 0          执行fun    m = 1   n = 1   //根据作用域里向上查找，n=1
3. _fun(2, 1)    // 1         执行_fun   m = 2   n = 2        
3. fun(3, 2)    // 2          执行fun    m = 3   n = 3       
```

先从fun(0)开始看，肯定是调用的第一层fun函数；而他的返回值是一个对象，所以第二个fun(1)调用的是第二层fun函数，后面几个也是调用的第二层fun函数。

遂：

- 在第一次调用第一层fun(0)时，o为undefined；

- 第二次调用 .fun(1)时m为1，此时fun闭包了外层函数的n，也就是第一次调用的n=0，即m=1，n=0，并在内部调用第一层fun函数fun(1,0);所以o为0；

- 第三次调用 .fun(2)时m为2，==此时当前的fun函数不是第一次执行的返回对象，而是第二次执行的返回对象==。而在第二次执行第一层fun函数时时(1,0)所以n=1,o=0,返回时闭包了第二次的n，遂在第三次调用第三层fun函数时m=2,n=1==，即调用第一层==函数_fun(2,1)，所以o为1==

- 第四次调用 .fun(3)时m为3，闭包了第三次调用的n，同理，最终调用第一层fun函数为fun(3,2)；所以o为2；

```js
{fun: ƒ}
    fun: ƒ (m)
        arguments: null
        caller: null
        length: 1
        name: "fun"
        prototype: {constructor: ƒ}
        __proto__: ƒ ()
        [[FunctionLocation]]: VM154:4
        [[Scopes]]: Scopes[2]
            0: Closure (_fun_)
                n: 3
```

```js
function fun(n, o){
    console.log(o)
    
    function newFun(m) {
        return fun(m, n)
    }
    
    return {
       newFun
    }
}
```
#### ==b和a的不同点==

```js
var a = fun(0); a.fun(1); a.fun(2); a.fun(3);
var b = fun(0).fun(1).fun(2).fun(3);
```
b和a的不同在于：
1. var a = fun(0); 之后一直用的是a这个对象，是同一个对象。
2. 而b每次用的都是上次返回的对象，不是同一个对象。

如果a改成这样

```js
var a = fun(0); a=a.fun(1); a=a.fun(2); a=a.fun(3)
```

把返回的对象，重新赋值给a，这样两行的结果就是一样的了。 


#### 关于这个函数的执行过程
先大致说一下这个函数的执行过程：

1. 初始化一个具名函数，具名函数就是有名字的函数，名字叫 fun。


2. 第一个 fun 具名函数执行之后会返回一个对象字面量表达式，即返回一个新的 object 对象。
```js
{  // 这是一个对象，这是对象字面量表达式创建对象的写法，例如{a:11,b:22}
  fun: function(m) { 
    return fun(m, n); 
  }
}
```
3. 返回的对象里面含有 fun 这个属性，并且这个属性里面存放的是一个新创建匿名函数表达式function(m) {}。


4. 在3里面创建的匿名函数会返回一个叫 fun 的具名函数return fun(m, n);，这里需要说明一下这个 fun 函数返回之后的执行过程：
    1. 返回 fun 函数，但默认不执行，因为在 js 里面，函数是可以保存在变量里面的。
    
    2. 如果想要执行 fun 函数，那么首先会在当前作用域寻找叫fun 名字的具名函数，但是因为当前作用域里 fun 名字的函数是没有被定义的，所以会自动往上一级查找。
    	2.1 注解：当前的作用域里是一个新创建的对象，并且对象里面只有 fun 属性，而没有 fun 具名函数
        2.2 注解：js 作用域链的问题，会导致他会不断地往上级链查找。
    
    3. 在当前作用域没找到，所以一直往上层找，直到找到了顶层的 fun函数，然后执行这个顶层的 fun 函数。
    
    4. 然后这两个 fun 函数会形成闭包，第二个 fun 函数会不断引用第一个 fun 函数，从而导致一些局部变量例如 n，o 得以保存。

所谓闭包：各种解释都有，但都不是很接地气，==简单的来说就是在 js 里面，有一些变量（内存）可以被不断的引用，导致了变量（内存）没有被释放和回收，从而形成了一个独立的存在，这里涉及了 js 的作用域链和 js 回收机制，结合两者来理解就可以了。==

### 闭包与函数重载

```js
function addMethod(object, name, fn) {
    // 先把原来的object[name] 方法，保存在old中
    // 利用的是递归的方式
    let old = object[name]  // users.find

    // 重新定义 object[name] 方法
    object[name] = function () {    // users.find = function() {}
      // arguments是users.find('xxxx') 中的参数

      // 如果函数需要的参数 和 实际传入的参数 的个数相同，就直接调用fn， 就是没有传参
      if (fn.length === arguments.length) {
        return fn.apply(this, arguments)

        // 如果不相同,判断old 是不是函数，
        // 如果是就调用old，也就是刚才保存的 object[name] 方法
      } else if (typeof old === "function") {
        return old.apply(this, arguments)
      }
    }
  }


  let users = {
    values: ["Dean Edwards", "Alex Russell", "Dean Tom"]
  }

  // 不传参数时，返回整个values数组
  function find0() {
    return this.values
  }

  // 传一个参数时，返回firstName匹配的数组元素
  function find1(firstName) {
    let ret = []
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].indexOf(firstName) === 0) {
        ret.push(this.values[i])
      }
    }
    return ret
  }


  // 传两个参数时，返回firstName和lastName都匹配的数组元素
  function find2(firstName, lastName) {
    let ret = []
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] === (firstName + " " + lastName)) {
        ret.push(this.values[i])
      }
    }
    return ret
  }


  // 给 users 对象添加处理 没有参数 的方法
  addMethod(users, "find", find0)

  // 给 users 对象添加处理 一个参数 的方法
  addMethod(users, "find", find1)

  // 给 users 对象添加处理 两个参数 的方法
  addMethod(users, "find", find2)

  // 测试：
  console.log(users.find())                   // ["Dean Edwards", "Alex Russell", "Dean Tom"]
  console.log(users.find("Dean"))             // ["Dean Edwards", "Dean Tom"]
  console.log(users.find("Dean", "Edwards"))   // ["Dean Edwards"]
```


## 使用闭包的注意点
1. 由于闭包会使得==函数中的变量都被保存在内存中，内存消耗很大==，所以不能滥用闭包，==否则会造成网页的性能问题，在IE中可能导致内存泄露==。解决方法是，在==退出函数之前，将不使用的局部变量全部删除==。
2. 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。

## 小检验

```js
function func() {
    var arr = []
    for(var i = 0;i<3;i++){
        arr.push(i) // 1 2 3
        
        arr.push(()=> {
            console.log(i) // 3 3 3
        })
    }
    return arr
}

var result = func()

result.forEach((item)=> {
    item()
})
```
输出结果是：3 3 3 有没有答对呢 ？   
**解释：**
首先在func函数执行上下文中创建了 `i` 变量（这里涉及到变量提升的知识，不了解自己可以看一下），当执行匿名的函数要`console.log(i)`的时候发现在==该匿名函数的执行上下文没有这个变量==，==则沿着作用域链向上查找==，发现在func的作用域中有i,这个i的值是3（for循环最后结束后i记录为3）。

我们使用闭包进行如下修改，亲，你再猜猜？

```js
function func() {
    var arr = [];
    for(var i = 0;i<3;i++){
        (function(){
            arr.push(()=> {
                console.log(i);
            })
        })()
    }
    return arr
}
var result = func();
result.forEach((item)=> {
    item();
})
```
答案是 3 3 3，解释和上面的一样。如果你想输出 0 ，1 ，2 有两种方案：闭包和使用let


```js
//方案一
function func() {
    var arr = [];
    for(var i = 0;i<3;i++){
        (function(i){
            arr.push(()=> {
                console.log(i);
            })
        })(i)
    }
    return arr
}

var result = func();
result.forEach((item)=> {
    item();
})
//输出 0 1 2

//方案二 let
function func() {
    var arr = [];
    for(let i = 0;i<3;i++){
        arr.push(()=> {
            console.log(i);
        })
    }
    return arr
}
var result = func();
result.forEach((item)=> {
    item();
})
//输出 0 1 2
```




参考：
- [大部分人都会做错的经典JS闭包面试题](https://www.cnblogs.com/xxcanghai/p/4991870.html)
- [一道js闭包面试题的学习.html ](https://www.godblessyuan.com/2018/07/)
- [简单说 一道JS闭包面试题](https://segmentfault.com/a/1190000011862125)