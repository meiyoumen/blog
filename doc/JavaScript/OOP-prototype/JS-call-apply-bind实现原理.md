[TOC]
# 目录
## call
call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

举个例子：
```js
var foo = {
    value: 1
}

function bar() {
    console.log(this.value);
}

bar.call(foo) // 1
```
注意两点：
- call 改变了 this 的指向，指向到 foo
- bar 函数执行了


### 模拟实现第一步
那么我们该怎么模拟实现这两个效果呢？

试想当调用 call 的时候，把 foo 对象改造成如下：
```js
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```

这个时候 this 就指向了 foo，是不是很简单呢？

但是这样却给 foo 对象本身添加了一个属性，这可不行呐！

不过也不用担心，我们用 delete 再删除它不就好了~

所以我们模拟的步骤可以分为：
- 将函数设为对象的属性
- 执行该函数
- 删除该函数

以上个例子为例，就是：
```js
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
```
fn 是对象的属性名，反正最后也要删除它，所以起成什么都无所谓。  

根据这个思路，我们可以尝试着去写第一版的 call2 函数：

#### 第一版
```js
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this
    context.fn()
    delete context.fn
}

// 测试一下
var foo = {
    value: 1
};

function bar() {
    console.log(this.value)
}

bar.call2(foo)  // 1

```
正好可以打印 1 哎！是不是很开心！(～￣▽￣)～

### 模拟实现第二步
最一开始也讲了，call 函数还能给定参数执行函数。举个例子：
```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}

bar.call(foo, 'kevin', 18)
// kevin
// 18
// 1
```

注意：传入的参数并不确定，这可咋办？

不急，我们可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

比如这样：
```js
// 以上个例子为例，此时的arguments为：
// arguments = {
//      0: foo,
//      1: 'kevin',
//      2: 18,
//      length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环
```


```js
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}
// 执行后 args为 ["arguments[1]", "arguments[2]", "arguments[3]"]
```
不定长的参数问题解决了，我们接着要把这个参数数组放到要执行的函数的参数里面去。

// 将数组里的元素作为多个参数放进函数的形参里

```js
context.fn(args.join(','))
// (O_o)??
// 这个方法肯定是不行的啦！！！
```

也许有人想到用 ES6 的方法，不过 call 是 ES3 的方法，我们为了模拟实现一个 ES3 的方法，要用到ES6的方法，好像……，嗯，也可以啦。但是我们这次用 eval 方法拼成一个函数，类似于这样：


```js
eval('context.fn(' + args +')')
```

这里 args 会自动调用 Array.toString() 这个方法。

所以我们的第二版克服了两个大问题，代码如下：

#### 第二版
```js
// 第二版
Function.prototype.call2 = function(context) {
    /**
     * context -> foo: {value: 2}
     * this    -> bar
     */
    context.fn = this
    let args = []
    for(let i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']')
    }
    eval('context.fn(' + args +')')
    delete context.fn
  }

// 测试一下
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```
### 模拟实现第三步
模拟代码已经完成 80%，还有两个小点要注意：

1. `this` 参数可以传 `null`，当为 `null` 的时候，视为指向 `window`
2. 函数是可以有返回值的！

举个例子：
```js
var value = 1;

function bar() {
    console.log(this.value);
}

bar.call(null); // 1
```

虽然这个例子本身不使用 call，结果依然一样。

2. 函数是可以有返回值的！

举个例子：
```js
var obj = {
    value: 1
}

function bar(name, age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}

console.log(bar.call(obj, 'kevin', 18));
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```
#### 第三版
不过都很好解决，让我们直接看第三版也就是最后一版的代码：
```js
// 第三版
Function.prototype.call = function (context) {
    // context传的对象，传null处理 call(null)
    var context = context || window

    // this -> 当前方法
    context.fn = this

    let args = []

    /**
     *  bar.call(foo, 'kevin', 18)
     *  arguments = [foo, 'kevin', 18]
     *  arguments[1] = 'kevin'
     */
    for (var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']')
    }

    // 处理返回值
    var result = eval('context.fn('+args+')')
    delete context.fn
    return result
  }

// 测试一下
var value = 200;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call(null)  // 200 window.value

console.log(bar.call(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

到此，我们完成了 call 的模拟实现，给自己一个赞 ｂ（￣▽￣）ｄ


## apply的模拟实现
apply 的实现跟 call 类似
```js
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```

## bind()方法的实现
bind()还有一个最大的特点: ==它会创建一个新的函数，以便于我们稍后作调用==。这也是它区别于apply()和call()的地方。


```js
var foo = {
    value: 1
}

function bar(name, age) {
    console.log(this.value) // 使用bind，this指向了foo
    console.log(name);
    console.log(age);

}
var bindFoo = bar.bind(foo, 'xiao');
bindFoo('18')
// 1
// xiao
// 18
```
###  模拟实现 一 bind的传参
bind还有一个特点：就是 bind 返回的函数可以被作为构造函数来使用，此时 bind 指定的this值会失效，但传入的参数依然生效。如下例子：

Array.slice(1,n)
- 截取数组，从1到n，1和n为索引值	
- 返回截取的数组(在这里返回从1开始，到n之前结束)

```js
function test() {
	var a = [].slice.call(arguments, 1) // 先将arguments转换为真正的数组，再进行截取操作
    console.log(a)              // ["B"]
    console.log(arguments)      // Arguments(2)["A", "B", callee: ƒ, Symbol(Symbol.iterator): ƒ]
}
test('A', 'B')
```

```js
Function.prototype.bind2 = function (context) {
    let self = this
    
    // 获取 bind2 函数从第二个参数 到 最后一个参数 即：'xiao', x, y
    // var bindFoo = bar.bind(foo, 'xiao', x, y) 
    let args = Array.prototype.slice.call(arguments, 1)
    
    // bind 会返回一个方法，这个方法是可以传入参数的
    return function() {
        // bind返回方法中的参数，转为真正的数组
        // bindFoo('18')
        var bindArgs = Array.prototype.slice.call(arguments)
        
        // 执行时，传入上下文this, args.concat(bindArgs)将参数连接起来 'xiao', x, y, 18
        self.apply(context, args.concat(bindArgs))
    }
}

var foo = { value: 1}

function bar(name, x, y, age) {
    console.log(this.value) // 使用bind，this指向了foo  // 
    console.log(x, y)
    console.log(name)
    console.log(age)

}
var bindFoo = bar.bind(foo, 'xiao', 10, 20)
bindFoo('18')
// 1
// xiao
// 10 20
// 18
```


### 模拟实现 一 bind构造函数效果
bind的返回函数会用new的形式执行。
```js
var value = 2;

var foo = { value: 1}

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);        // 当使用new的时候undefined
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin'
var bindFoo = bar.bind(foo, 'daisy')

var obj = new bindFoo('18')  // bind返回值，使用了new操作，不会再继承foo的属性
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```
可以看到由于这里使用了`new`操作符，`this`已经指向了`obj`，`obj`并没有`vluae`属性，因此`this.value`打印出来为undefined。

```js
Function.prototype.bind2 = function (context) {
    var self = this
    
    // 获取 bind2 函数从第二个参数 到 最后一个参数 即：'xiao', x, y
    // var bindFoo = bar.bind(foo, 'xiao', x, y) 
    var args = Array.prototype.slice.call(arguments, 1)

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        
        // 判断是否作用构造函数
        // 当作为构造函数时，将绑定函数的 this 指向 new 创建的实例，可以让实例获得来自绑定函数的值
        // 当作为普通函数时，将绑定函数的 this 指向 context
        
        // this instanceof fBound ? this : xxx
        // var obj = new bindFoo('18')  obj的this指向了foo，而不是bar
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }
    
    
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    // obj 需要继承 bar自身的属性和方法 var obj = new bindFoo('18') 
    fBound.prototype = this.prototype;
    return fBound;
}
```

不过上面的写法还存在点问题，==fBound.prototype = this.prototype==这一句代码直接修改了 fBound.prototype，也会直接修改绑定函数的 prototype。
如下例子：

```js
function bar() {}

var bindFoo = bar.bind2(null);

// 修改 bindFoo 的值
bindFoo.prototype.value = 1;

// 导致bar.prototype 的值也被修改了
console.log(bar.prototype.value)    // 1
```

因此可以通过一个空函数作一个中转，避免绑定函数的 prototype 的属性被修改：

```js
Function.prototype.bind2 = function (context) {
    var self = this
    var args = Array.prototype.slice.call(arguments, 1)
    
    var fNOP = function () {}
    
    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs))
    }
    
    fNOP.prototype = this.prototype
    
    fBound.prototype = new fNOP()
    return fBound;
}
```

### MDN Polyfill 完整实现
当调用bind的不是函数还得做一下错误处理，完整实现如下：
```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1)
    
    var fToBind = this
    
    var fNOP    = function() {} //空函数
    
    var fBound  = function() {
          // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
          // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
          return fToBind.apply(this instanceof fBound? this: oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系,需要判断的原因是有时候返回值不一定是new的形式
    // var bindFoo = bar.bind(foo, 'daisy')
    // var obj = new bindFoo('18') 
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      
      // 利用空函数解决子类会修改掉父类中的原型  fBound.prototype = this.prototype
      fNOP.prototype = this.prototype
    }
    
    
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP()

    return fBound;
  };
}
```

### 空函数中转原理

```js
 function Person(name, age) {
    this.name = name
    this.age = age
  }

  Person.prototype.showName = function () {
    console.log('Person.prototype.showName', this.name)
  }

  Person.prototype.showAge = function () {
    console.log('Person.prototype.showAge', this.age)
  }

  function Student(name, age, price) {
    Person.call(this, name, age)     //1. 调用父类构造函数继承
    this.price = price
  }

  // 写样写会直接修改了父类的原型上所有同名的方法和属性
  // Student.prototype = Person.prototype
  // Student.prototype === Person.prototype
  // s.__proto__ === p.__proto__                      // true
  //  Student.prototype.__proto__ === Person.prototype //false

  // 利用空函数中转
  // Student原型指向了 父类Person实例p的原型上

  // p.__proto__ === Person.prototype                 // true
  // Student.prototype.__proto__ === p.__proto__      // true
  // Student.prototype.__proto__ === Person.prototype // ture
  // s.__proto__ === p.__proto__                      // false

  function fNOP(){}
  fNOP.prototype = Person.prototype
  Student.prototype = new fNOP()

  // 简单方式
  // Student.prototype = Object.create(Person.prototype)

  Student.prototype.showName = function () {
    console.log('Student.prototype.showName', this.name)
  }

  let p = new Person('Tom', 22)
  let s = new Student('Jack', 18)

  // 写样写会直接修改了父类的原型上所有同名的方法和属性
  // Student.prototype = Person.prototype

  p.showName() // Student.prototype.showName Tom
  s.showName() // Student.prototype.showName Jack

  p.showAge() // Person.prototype.showAge 18
  s.showAge() // Person.prototype.showAge 18 子类没有showAge方法，找原型链上的showAge方法

  console.log(fNOP.prototype === Person.prototype) // true
  console.log(Student.prototype.__proto__ === Person.prototype ) // true
```

参考：
- https://github.com/mqyqingfeng/Blog/issues/11