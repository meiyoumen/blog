## Function.prototype

```
console.dir(Function.prototype)
    VM103:1 
    ƒ anonymous()
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
```
- Function.prototype.call
- Function.prototype.apply
- Function.prototype.bind

因此JavaScript中每个函数都有call方法、apply方法和bind方法



## call、apply、bind方法的共同点和区别
- 三者都是用来改变函数的this对象的指向的
- 三者第一个参数都是this要指向的对象，也就是想指定的上下文（函数的每次调用都会拥有一个特殊值——本次调用的上下文（context）——这就是this关键字的值。）；
- 三者都可以利用后续参数传参；
- bind 是返回对应函数，便于稍后调用；apply 、call 则是立即调用 。
- call和与apply 如果不想改变上下文this指向下，可以传null


## call
call 方法可将一个函数的对象上下文从初始的上下文改变为由 thisObj 指定的新对象。
thisObj的取值有以下4种情况：
1. 不传，或者传null,undefined， 函数中的this指向window对象
1. 传递另一个函数的函数名，函数中的this指向这个函数的引用
1. 传递字符串、数值或布尔类型等基础类型，函数中的this指向其对应的包装对象，如 String、Number、Boolean
1. 传递一个对象，函数中的this指向这个对


```js
function a(){   
  console.log(this);   //输出函数a中的this对象
}       

function b(){}       

var c={name:"call"};    //定义对象c  

a.call();            // window
a.call(null);        // window
a.call(undefined);   // window
a.call(1);           // Number
a.call('');          // String
a.call(true);        // Boolean
a.call(b);           // function b(){}
a.call(c);           // Object
```


### 改变this指向
```js
var a={ name:'hello'}
    
var name='test'

function exp(a,b){
    console.log(a + this.name + b)
}

// this->window
exp.call(null, 'happy' , 'day')   // happy test day   

// this->a
exp.call(a, 'happy' , 'day')      // happy hello day

// this -> window
exp.apply(null, [' happy', ' every', ' day']) // happy test every
```
### 立即执行

```js
function exp(){
  console.log(1)
}
exp.call()      // 1
exp.apply()     // 1    
```

## call和apply常见的应用写法
-  数组的扩充

```js
var a = [123, 'A', 'B']
var b = ['A', 'D', 9]
Array.prototype.push.apply(a, b)

// 也等同于 [].push.apply(a, b)

console.log(a)  // [123, "A", "B", "A", "D", 9]
```

- 字符串拼接
```js
[].join.apply([123,'2fds','3sdf',34])  // "123,2fds,3sdf,34"

```

-  最大/小值的获取

```js
var arr=[34, 54, 656, 877]           
Math.max.apply(Math, arr)           // 877
Math.max.apply(null, arr)           // 877

Math.max.call(null, 34, 54, 656, 877)  // 877
Math.min.call(null, 34, 54, 656, 877)  // 34

Math.min.apply(null, arr)  // 34
Math.min.apply(Math, arr)  // 34
```

- 验证是否为数组

```js
 function isArray(obj){
    return Object.prototype.toString.call(obj) ==='[object Array]'
}
console.log(isArray(343));
console.log(isArray([4343,565]));

//可以用Array.isArray()
```

- 把一个类数组转换为真正的数组
  - 比较特别的是 arguments 对象
  - getElementsByTagName , document.childNodes 之类的，它们返回NodeList对象都属于伪数组。不能应用 Array下的 push , pop 等方法。

但是我们能通过 Array.prototype.slice.call 转换为真正的数组的带有 length 属性的对象，这样 domNodes 就可以应用 Array 下的所有方法了。

```js
var arr= Array.prototype.slice.call([2,4,5]);
arr                     // [2, 4, 5]
arr.push('33')          // [2, 4, 5, "33"]，能够具备并使用数组的方法例如push()
domNodes.push(3434)     // [2, 4, 5, "33", 3434]
```

## bind
>  bind()方法是会创建一个新函数，当调用这个新函数时，会以创建新函数时传入 bind()方法的第一个参数作为 this。
bind是在EcmaScript5中扩展的方法（IE6,7,8不支持）

```js
var name='xxx'; 

var obj = {name: 'yyy'}

function func() {
    console.log(this.name);
}

var func1 = func.bind(obj)

func1();         // yyy
func();          // xxx
func.bind(obj)() // yyy
```

- bind polyfill
    - 参数
        - thisArg
            当绑定函数被调用时，该参数会作为原函数运行时的this指向。当使用new操作符调用绑定函数时，该参数无效。
        - arg1, arg2, ...
    当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。

```js
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind2) {
    Function.prototype.bind2 = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      // fun.bind(thisArg[, arg1[, arg2[, ...]]])

      //  借用Array的slice方法去掉第一个参数thisArg，剩下的是函数调用参数
      var aArgs   = Array.prototype.slice.call(arguments, 1)  // 截取后只剩下 "hello"
      var fToBind = this

      // 创建一个空函数
      var fNOP    = function() {}

      // 创建返回函数 （柯里化）
      var fBound  = function() {
          // this instanceof fBound === true时, 说明返回的fBound被当做new的构造函数调用
          return fToBind.apply(
            this instanceof fBound ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments)) // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
          )
        }

      // 维护原型关系
      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype
      }

      // 下行的代码使fBound.prototype是fNOP的实例,因此
      // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
      fBound.prototype = new fNOP()

      return fBound;
    };
  }

  var a = {name: 'ABC'}

  function log(arg) {
    console.log(this.name, arg)
  }

  var fn = log.bind2(a, "hello")
  fn()
```

## 总结
- apply 、 call 、bind 三者都是用来改变函数的this对象的指向的；
- apply 、 call 、bind 三者第一个参数都是this要指向的对象，也就是想指定的上下文；
- apply 、 call 、bind 三者都可以利用后续参数传参；
- bind是返回对应函数，便于稍后调用；apply、call则是立即调用 。