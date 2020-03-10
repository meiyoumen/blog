[TOC]
# 前言
构造函数本身与普通函数并没有区别，而new操作符却让构造函数变得特殊。  
构造器才使得js的对象完成实例化，同时，在==new==操作符下完成__proto__赋值，让原型链得以施展其强大的继承能力。

## 构造函数原型
```js
function test(){}
test.prototype.name = 'A'
test.prototype.showName = function(){console.log(this.name)}
console.log(test.prototype)

// 打印结果
name: "A"
showName: ƒ ()
{constructor: ƒ}
    constructor: ƒ test()
    arguments: null
    caller: null
    length: 0
    name: "test"
    prototype: {constructor: ƒ}
    __proto__: ƒ ()
    [[FunctionLocation]]: VM1345:1
    [[Scopes]]: Scopes[1]
    0: Global {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
__proto__:
    constructor: ƒ Object()
    hasOwnProperty: ƒ hasOwnProperty()
    isPrototypeOf: ƒ isPrototypeOf()
    propertyIsEnumerable: ƒ propertyIsEnumerable()
    toLocaleString: ƒ toLocaleString()
    toString: ƒ toString()
    valueOf: ƒ valueOf()
    __defineGetter__: ƒ __defineGetter__()
    __defineSetter__: ƒ __defineSetter__()
    __lookupGetter__: ƒ __lookupGetter__()
    __lookupSetter__: ƒ __lookupSetter__()
    get __proto__: ƒ __proto__()
    set __proto__: ƒ __proto__()
```

## new
new操作符做了这些事：

1. 它创建了一个全新的对象
2. 它会被执行[[Prototype]]（也就是__proto__）链接， 让这个空对象的__proto__指向函数的原型prototype
3. 执行构造函数中的代码，构造函数中的this指向该对象
4. 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上
5. 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用。若没有return或return了基本类型，则将新对象作为返回值

### 模拟实现New
```js
// myNew(name, 'cxk', '18')
function new2() {
  // 新建一个对象
  const obj = new Object()
  
  // 取得第一个参数，即传入的构造函数。
  // 将arguments转为真正的数组， shift 会修改原数组，移除数组的第一项，并返回。 因此 arguments 会被去掉第一个参数
  // var person = new2(Person, 'xiao', '18') //返回Person类
  const Constructor = [].shift.call(arguments)

  // 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性了
  // obj的原型指了Person类构造函数
  obj.__proto__ = Constructor.prototype

  
  // 使用 apply ，改变构造函数 this 的指向到新建的对象，这样 obj 就可以的访问到构造函数中的属性了
  // 相当于 Person.apply(obj, arguments)
  const ret = Constructor.apply(obj, arguments)

  // 判断构造函数返回值是否为对象，是的话返回这个对象，不是则正常返回
  // 有返回值返回Person类构造函数中的值，无返回obj对象
  return typeof ret === 'object' ? ret : obj
}
```

### 构造函数中无返回值

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.sayName = function() {
    console.log('I am' + this.name)
}

var person = new2(Person, 'xiao', '18')

console.log(person.name)    // xiao
console.log(person.age)     // 18
person.sayName()            // I am xiao
```

### 构造函数有返回值，并且返回值是一个对象

```js
function Person(name, age) {
    this.skill = 'eat';
    this.age = age;
    return {
        name: name,
        habit: 'sleep'
    }
}
var person = new Person('xiao', '18')

// 打印的是构造函数中的返回值
console.log(person.name)      // xiao
console.log(person.habit)     // sleep

console.log(person.skill)     // undefined
console.log(person.age)       //  undefined
```
实例`person`中==只能访问返回的对象中的属==性，说明此时`new`的==返回值====为构造函数Person return==出来的对象。

### 构造函数返回值是一个基本类型的值

```js
function Person(name, age) {
    this.skill = 'eat';
    this.age = age;
    return 'hello world'
}

var person = new Person('xiao', '18')

console.log(person.name)      // undefined
console.log(person.habit)     // undefined

console.log(person.skill)     // eat
console.log(person.age)       //  18
```
实例`person`可以==正常访问构造函数中的属性==，说明此时new的返回值为==新创建的原型指向构造函数的对象==。

## Object.create
> 在Vue和Vuex的源码中，作者都使用了Object.create(null)来初始化一个新对象。为什么不用更简洁的{}呢？
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create

### Object.create 是可以继承的

```js
var a = {name:'h', age: 1}
var b = Object.create(a)
    b
    {}
        __proto__: 
            age: 1
            name: "h"
            __proto__: Object
b.__proto__ === a
true
```
### Object.create()的定义
照搬一下MDN上的定义：

```
Object.create(proto,[propertiesObject])
```
- proto:新创建对象的原型对象
- propertiesObject:可选。要添加到新对象的可枚举（新添加的属性是其自身的属性，而不是其原型链上的属性）的属性。

### Object.create的实现方式
简单来讲，new Object()是一种通过构造函数来创建object的方式，而Object.create(proto, [ propertiesObject ])
不需要通过构造函数就可以创建一个object，

Object.create()的第一个参数是必须要的，第二个参数可选。  
其实Object.create()内部依然是通过new一个构造函数的方式来实现的，它有构造函数，不过这个构造函数是隐式存在的。
```js
if (!Object.create) {
    Object.create = function (o) {
        function F() {}  //定义了一个隐式的构造函数
        F.prototype = o
        return new F()  //其实还是通过new来实现的
    };
  }
```
上面代码表明，`Object.create`方法的实质是新建一个空的构造函数`F`，然后让`F.prototype`属性指向参数对象`o`，最后==返回一个F的实例==，从而实现让该实例继承o的属性。

#### 3种写法

```js
// 第1种写法
  Object.create1 = function (o) {
    function F() {}  //定义了一个隐式的构造函数
    F.prototype = o
    return new F()  //其实还是通过new来实现的
  }

  // 第2种写法
  Object.create2 = function (obj) {
    let B = {}
    B.__proto__ = obj
    return B
  }

  // 第3种写法
  Object.create3 = function (obj) {
    let B={}
    Object.setPrototypeOf(B,obj);
    return B
  }
```
举列说明：
```js
function Person(name, age) {
    this.name = name
    this.age = age
  }

  Person.prototype.sayHi = function () {
    console.log("sayHi")
  }

  let Student = Object.create(Person)  // 不能new，因为Student是直接赋值，没有构造函数。 var s1 = new Student()

  // 相当于给Person类添加了sayHello方法
  Student.prototype.sayHello = function () {
    console.log('sayHello')
  }

  var p1 = new Person('DD', 1)
  // var s1 = new Student()  //  Student is not a constructor

  console.log(p1)
  console.log(Student)
  // console.log(Student.sayHello()) //Student.sayHello is not a function

  console.log(Student.prototype === Person.prototype) // true
  console.log(Student.__proto__===Person)             // ture
  console.log(Student.__proto__.prototype === Person.prototype) //true
```

使用实例对象,生成另一个实例对象!
![image](https://user-gold-cdn.xitu.io/2018/3/5/161f529790714cee?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### Object.create(null) & Object.create{…}的区别

#### 字面量对象 o = {a：1};
```js
var o = {a：1};
console.log(o)
// 可以看到有原型对象上的属性
a: 1
__proto__:
    constructor: ƒ Object()
    hasOwnProperty: ƒ hasOwnProperty()
    isPrototypeOf: ƒ isPrototypeOf()
    propertyIsEnumerable: ƒ propertyIsEnumerable()
    toLocaleString: ƒ toLocaleString()
    toString: ƒ toString()
    valueOf: ƒ valueOf()
    __defineGetter__: ƒ __defineGetter__()
    __defineSetter__: ƒ __defineSetter__()
    __lookupGetter__: ƒ __lookupGetter__()
    __lookupSetter__: ƒ __lookupSetter__()
    get __proto__: ƒ __proto__()
    set __proto__: ƒ __proto__()
```
#### Object.create(null)
```js
var o = Object.create(null)
console.log(o)
// 打印如下，什么没有
// {}
// No properties
```
##### Object.create(null)的使用场景
使用`Object.create(null)`创建的对象，==没有任何属性==，显==示No properties==。

我们可以把它当作一==个非常纯净的对象来使用==，我们可以自己定义`hasOwnProperty`、`toString`方法，不管是有意还是不小心，我们完全不必担心会将原型链上的同名方法覆盖掉。


```js
// Demo1:
var a= {...省略很多属性和方法...};

// 如果想要检查a是否存在一个名为toString的属性，你必须像下面这样进行检查：
if(Object.prototype.hasOwnProperty.call(a,'toString')){
    ...
}

// 为什么不能直接用a.hasOwnProperty('toString')?因为你可能给a添加了一个自定义的hasOwnProperty
// 你无法使用下面这种方式来进行判断,因为原型上的toString方法是存在的：
if(a.toString){}

// Demo2:
var a=Object.create(null)

//你可以直接使用下面这种方式判断，因为存在的属性，都将定义在a上面，除非手动指定原型：
if(a.toString){}
```


#### 空对象 Object.create({})
```js
// 将null 改成 {}
var o3 = Object.create({})
console.log(o3)
{}
__proto__:
    __proto__:
        constructor: ƒ Object()
        hasOwnProperty: ƒ hasOwnProperty()
        isPrototypeOf: ƒ isPrototypeOf()
        propertyIsEnumerable: ƒ propertyIsEnumerable()
        toLocaleString: ƒ toLocaleString()
        toString: ƒ toString()
        valueOf: ƒ valueOf()
        __defineGetter__: ƒ __defineGetter__()
        __defineSetter__: ƒ __defineSetter__()
        __lookupGetter__: ƒ __lookupGetter__()
        __lookupSetter__: ƒ __lookupSetter__()
        get __proto__: ƒ __proto__()
        set __proto__: ƒ __proto__()
        

//  将null 改成 Object.prototype 少了一层proto嵌套     
var o4 = Object.create(Object.prototype)
console.log(o4)
{}
    __proto__:
        constructor: ƒ Object()
        hasOwnProperty: ƒ hasOwnProperty()
        isPrototypeOf: ƒ isPrototypeOf()
        propertyIsEnumerable: ƒ propertyIsEnumerable()
        toLocaleString: ƒ toLocaleString()
        toString: ƒ toString()
        valueOf: ƒ valueOf()
        __defineGetter__: ƒ __defineGetter__()
        __defineSetter__: ƒ __defineSetter__()
        __lookupGetter__: ƒ __lookupGetter__()
        __lookupSetter__: ƒ __lookupSetter__()
        get __proto__: ƒ __proto__()
        set __proto__: ƒ __proto__()
```

#### 总结：
1. 你需要一个非常干净且高度可定制的对象当作数据字典的时候用Object.create(null)。
2. 想节省hasOwnProperty带来的一丢丢性能损失并且可以偷懒少些一点代码的时候用Object.create(null)吧！其他时候，请用{}。


### Object.assign

## new vs Object.create & Object.assign

### Object.create vs new
`Object.create`与`new`区别：

1. Object.create传入对象将作为新建对象的原型。
2. Object.create传入构造函数原型时，==无论构造函数是否返回对象，Object.create只会return 以构造函数原型来新建的对象==（参见下面的polyfill），而new则参见上节粗体描述。

```js
function Dog(name){
   const _name = name
   
   function getName(){
      return _name
   }
   
   return {
       name : getName,
       run :  function(){console.log('ok')}
   }
}

Dog.prototype.setName = function(name){
    this.name = name
}

const pet1 = new Dog('rocky')
console.log(pet1.name)              //rocky  
pet1.setName('skye')                //error!!!!!   setName undefined 构造函数中有返回值
pet1.run()                          //ok

const pet2 = Object.create(Dog.prototype);
pet2.setName('skye');                //ok 区别2  构造函数原型
console.log(pet2.name);              //skye 
pet2.run();                          //error!!!!!   run  undefined   区别1, 不是构造函数
```

check polyfill from MDN：


```js
if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject != 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

        function F() {}
        F.prototype = proto;

        return new F();
    };
}
```



### Object.assign vs new
Object.assign 拷贝时需要注意语法：

1.  let c = Object.assign({}, obj)，如果==值是原始类型是深拷贝==，如果是对象类型浅拷贝
2.  let c = Object.assign(obj) 语法不一样，少了==一对{}==
3.  Object.assign 只拷贝对象的属性和函数，丢失原型链，__proto__指向Object.prototype


```
function Dog(name){
   this.name = name;
}
Dog.prototype.getName = function(){
    return this.name;
};
const pet1 = new Dog('rocky'); 
console.log(pet1.getName());      //rocky

const pet2 = Object.assign({},pet1);
console.log(pet2.name)            //rocky
console.log(pet2.getName());      //error!!!!!  getName undefined   丢失原型链上的方法
```

原文： https://zhuanlan.zhihu.com/p/38191171

### 参考
1. 《JavaScript 忍者秘籍》 第6章
2. Fundamental JS: new, Object.create and Object.assign
3. JavaScript For Beginners: the ‘new’ operator