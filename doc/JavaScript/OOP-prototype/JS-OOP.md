[TOC]
# 面向对象的三大特性
- 封装
- 继承
- 多态

## 封装
### 什么是封装（encapsulation ）

```js
function Person(name, age) {
    this.name = name
    var age = age       // 在实例中无法被调用
}

var p1 = new Person("Bob", 20)
console.log(p1)     // Person ->{name: "Bob"} 没有age属性，age属于window
console.log(p1.age) // 无法访问到age属性，这就叫被封（装）起来了
```

### 访问封装属性的方法--特权方法

```js
function Person(age) {
    var age = age               // 私有变量
    this.showAge = function() { // 特权方法
        console.log(age)
    }
}
var p1 = new Person(20) // 新建对象p1
p1.showAge()            // -> 20  这个20是闭包，在闭包笔记处会详解

```
但是如果使用`prototype`来写的函数，==无法访问私有变量==


```js
Person.prototype.myAge = function() {
    console.log(age)        // Person类没有age属性
}

var p1 = new Person(20) // 新建对象p1
p1.myAge()              // 报错 age is not defined
```
其实这也印证了：  
==闭包就是函数里面包函数，由于prototype是通过函数名，指到其他内存空间独立的函数体，因此没法取得闭包的作用域变量==。


## 继承
### 特性
>归纳出继承所有的几个特性

- 子类继承父类中的属性和方法
- 子类、父类的实例对象拥有两份副本，改了其中之一，另一个实例对象的属性并不会随之改变
- 子类可覆盖父类的方法或属性
- 子类和父类的实例对象通过“[对象] instanceof [子类/父类]”判定的结果应该为true
- 子类和父类的实例对象的constructor指针应该分别指向子类和父类的构造函数



### new，你到底干了什么事儿？

```js
var Person = function (){}
Person.prototype.name = "小王"
Person.prototype.age = 10
var p = new Person()
```

    
new关键字在绝大多数面向对象的语言中都扮演者举足轻重的位置，javascript中也不例外。
`StackOverflow`上有一篇帖子关于new关键字的玄机，翻译如下。
- 创建一个新的简单的Object类型的的对象；
- 把Object的内部的`[[prototype]]`属性设置为==构造函数`prototype`属性==。这个`[[prototype]]`属性==在Object内部是无法访问到的，而构造函数的prototype是可以访问到的==；
- 执行构造函数，如果构造函数中用到了this关键字，那就把这个this替换为刚刚创建的那个obje


其实某个对象的`[[prototype]]`属性在很多宿主环境中已经可以访问到，例如Chrome和IE10都可以，用`__proto__`就可以访问到，如果下面出现了`__proto__`字样，==那就代表一个对象的内部prototype==。

### 对象冒充继承
对象冒充的意思就是获取那个类的所有成员，因为js是谁调用那个成员就是谁的，这样MidStu就有了Stu的成员了
```js
function Stu(name, age) {
    this.name = name
    this.age = age
    this.money= 100
    this.show = function () {
      console.log(this.name + " " + this.age)
    }
  }

  function MidStu(name, age) {
    this.stu = Stu
    // 通过对象冒充来实现继承的
    // 对象冒充的意思就是获取那个类的所有成员，因为js是谁调用那个成员就是谁的，这样MidStu就有了Stu的成员了
    this.stu(name, age)
    this.payFee = function () {
      console.log("缴费" + this.money * 0.8)
    }
  }

  function Pupil(name, age) {
    this.stu = Stu
    // 通过对象冒充来实现继承的
    this.stu(name, age)
    this.payFee = function () {
      console.log("缴费" + this.money * 0.5)
    }
  }

  let midStu = new MidStu("zs", 13)
  midStu.show()   // zs 13
  midStu.payFee()  // 缴费80

  let pupil = new Pupil("ls", 10)
  pupil.show()    // ls 10
  pupil.payFee()  // 缴费50
```

### prototype 
- `prototype`属性在==构造函数中可以访问到==，在对象中需要通过`__proto__`访问到。它到底是什么？  
- `prototype`中定义了==一个类所共享的属性和方法==。  
- 这就意味着：一旦`prototype`中的某个==属性的值变了==，那么==所有这个类的实例的该属性的值都变了==。


```js
function Person() {}
Person.prototype.name = '小明'
var p1 = new Person()
console.log(Person.prototype)  // {name: "小明", constructor: ƒ}
console.log(p1.__proto__)      // {name: "小明", constructor: ƒ}
console.log(p1.__proto__ === Person.prototype) // true

console.log(Person)            // ƒ Person() {}
console.log(p1) 
/*
Person {}
    __proto__:
        name: "小王"
        constructor: ƒ Person()
        __proto__: Object
*/

var p2 = new Person()
console.log(p1.name + ' , ' + p2.name)  // 小明 , 小明

Person.prototype.name = '小王'
console.log(p1.name + ' , ' + p2.name)  // 小王 , 小王
```

通过这个代码的实验，我们可以得出以下结论：
- `prototype`属性其实==就是一个实例对象==，其内容为：Person {name: "小明"}
- 通过==构造函数可以访问==到`prototype`属性，通过对象的`__proto__`也可以访问到prototype属性。
- ==`prototype`原型指向的内容是所有对象共享的==，只要`prototype`对象的某个==属性或者方法变了==，==那么所有的通过这个类new出来的实例对象的该属性和方法都变了==。


### this和构造函数

#### 构造函数中方法不被共享问题
看完了上面的new关键字做的第3步，我们不难得出.
其实利用constructor的方式来构造类本质：先new一个临时实例对象，将this关键字替换为临时实例对象关键字，然后使用[对象].[属性]=xxx的方式来构建一个对象，再将其返回。  
可是这样带来一个问题就是：==方法不被共享==。
```js
function Person() {
	this.name = "小明";
	this.showName = function() {
		console.log(this.name)
	}
}
var p1 = new Person()
var p2 = new Person()

p1.showName()   // 小明
p2.showName()   // 小明

// 修改p1的showName方法
p1.showName = function() {
	console.log("我不是小明，我是小王")
}

p1.showName() // 小明
p2.showName() // 我不是小明，我是小王

console.log(p1.showName === p2.showName) // false
```
我们知道，类的同一个方法，应该尽量保持共享，因为他们属于同一个类，那么这一个方法应该相同，所以应该保持共享，==不然会浪费内存==。 
我们的Person类中含有方法showName，虽然p1和p2实例属于两个实例对象，但是其showName却指向了不同的内存块！这可怎么办？
==请出我们的`prototype`，它可以实现属性和方法的共享==。

#### 使用prototype实现属性和方法的共享
```js
function Person() {
	this.name = "小明"
}
Person.prototype.showName = function() {
	console.log(this.name)
}
var p1 = new Person()
var p2 = new Person()
p1.showName()   // 小明
p2.showName()   // 小明

Person.prototype.showName = function() {
	console.log("我的名字是" + this.name)
}
p1.showName()   // 我的名字是小明
p2.showName()   // 我的名字是小明

console.log(p1.showName === p2.showName) // true
```
这样我们非常完美地完成了一个类的构建，他满足：

- 属性非共享
- 方法共享（其实对于需要共享的属性，我们也可以用prototype来设置）

但是！在使用`prototype`来==设置共享方法==的时候==千万不要把构造函数的整个prototype都改写了==。  
这样导致的结果就是：constructor不明。

#### constructor不明问题

```js
function Person1() {}

// prototype 没有完全被改写
Person1.prototype.showName = function() {
	console.log(this.name);
}

var p1 = new Person1()
console.log(p1 instanceof Person1)  // true
console.log(p1.constructor)         // ƒ Person1() {}



function Person2() {}

// prototype 完全被改写
Person2.prototype = {
	showName : function() {
		console.log(this.name)
	}
}

var p2 = new Person2()
console.log(p2 instanceof Person2)  // true
console.log(p2.constructor)         // ƒ Object() { [native code] }     被改写后构造函数指向了Object
```

通过以上代码，我们可以看出：
- `Person2`重写==整个`prototype`会将对象的`constructor`指针直接指向了Object==，从而==导致了constructor不明的问题==。

#### 显示指定其constructor，解决constructor不明问题
如何解决呢？我们可以通过显示指定其constructor为Person即可。
```js
function Person2() {}

// prototype 完全被改写
Person2.prototype = {
    
    // 显示指定其constructor, 防止constructor不明的问题
	constructor : Person2,      
	
	showName : function() {
		console.log(this.name);
	}
}

var p2 = new Person2()
console.log(p2 instanceof Person2)  // true
console.log(p2.constructor)         // ƒ Person2() {}
```
#### 对象、constructor和prototype三者之间的关系 

上面说了那么多，我想大家都有点被==`constructor`、`prototype`、`对象`==搞得云里雾里的。  
下面我总结叙述一下这三者之间的关：

- ==构造函数==有个`prototype`属性，==这个`prototype`属性指向一个实例对象==，这个==对象的所有的属性和方法为所有该构造函数实例化的类所共享！==

- 对象的创建是通过`constructor`构造函数来创建的，==每当new一次就调用一次构造函数==。构造函数内部执行的机制是：==new一个临时Object实例空对象，然后把this关键字提换成这个临时对象==，然后==依次设置这个临时对象的各个属性和方法，最后返回这个临时实例对象==。

- ==被实例化的对象本身有个`__proto__`指针==，==指向创建该对象的构造函数的的prototype对象==。

- 如果你还是云里雾里的，没有关系，我们来看下Javascript的Object架构，看完这个你肯定就会明白的一清二楚了。

模拟new的实现
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
#### 属性的查找过程
Javascript对象的属性查找方式 我们访问一个Javascript对象的属性（含“方法”）的时候，查找过程到底是什么样的呢？  
先找对象自身上的属性，自身对象的属性中没有，那就找对象的prototype共享属性
```js
var p = {name : "小明"}

//对象中能查找到name
console.log(p.name) // 小明

//对象中找不到myName，查找其prototype属性，由于p是Object类型的对象，故而查找Object的prototype是否有myName
console.log(p.myName) // undefined
 
Object.prototype.myName="我的名字是小明"
console.log(p.myName) // 我的名字是小明
```
#### 原型链 
如果构造函数的prototype对象的`__proto__`指针（每个实例对象都有一个`__proto__`指针）指向的是另一个`prototype`对象（我们称之为prototype对象2）的话，而prototype对象2的constructor指向的是构建prototype对象2的构造函数。那么依次往复，==就构成了原型链==。

- ==原型链只能继承共享的属性和方==法
- 对于非共享的属性和方法，我们需要通过显示调用父类构造函数来实现。

查找对象的属性的修正：
- 查找对象是否含有该属性；
- 如果没有改属性，则查找其`prototype`是否含有该属性；
- 如果还是没有，则向上查找原型链的上一级，查找其`prototype`的`__proto__`所指向的`prototype`是否含有该属性，直到查找`Object`。

所以很简单，我们想要实现Javascript的继承已经呼之欲出了：

- 继承prototype中定义的属性和方法；
- 继承构造函数中定义的属性和方法；
- 修改子类的prototype对象的constructor指针，使得constructor的判别正确

### 继承中原型的问题
#### 继承构造函数中定义的属性和方法 

##### 子类的构造函数也指向了父类

我们通过call或者apply方法即可实现父类构造函数调用，然后把当前对象this和参数传递给父类，这样就可以实现继承构造函数中定义的属性和方法了。
```js
function Person(name, age) {
	this.name = name
	this.age = age
}

Person.prototype.showName = function() {
	console.log(this.name)
}

function Male(name, age) {
	// 调用Person构造函数，把this和参数传递给Person
	Person.apply(this, arguments);
	this.sex = "男"
}

// 继承prototype 写样的问题会导致子类的构造函数也指向了父类
Male.prototype = new Person()

var m = new Male("小明", 20)

console.log(m)
/*
Male {name: "小明", age: 20, sex: "男"}         // m实例对象
    age: 20
    name: "小明"
    sex: "男"
    __proto__: Person                           // Male.prototype Person的实例
        age: undefined
        name: undefined
        __proto__:  
            showName: ƒ ()
            constructor: ƒ Person(name, age)     // Person构造函数
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

*/

console.log(Male.prototype.__proto__.constructor)
/*
ƒ Person(name, age) {
	this.name = name
	this.age = age
}
*/

console.log(Male.prototype.constructor) 
/*
ƒ Person(name, age) {
	this.name = name
	this.age = age
}
*/


console.log(m instanceof Male)      // true
console.log(m instanceof Person)    // true
console.log(m instanceof Object)    // true
```
大家可以看到m对象不仅有name, age , sex三个属性，而且通过其原型链可以找到showName方法。

==如果大家仔细观察，会发现多出了两个undefined值的name和age！为什么？==

究其原因，因为在执行==Male.prototype = new Person()==的时候，这==两个属性就在内存中分配了值==了。
而且改写了`Male`的整个`prototype`，导致`Male`对象的`constructor`也跟着变化了，这也不好。


```js
function Person(name, age) {
	this.name = name
	this.age = age
}

function Male(name, age) {
	// 调用Person构造函数，把this和参数传递给Person
	Person.apply(this, arguments);
	this.sex = "男"
}

Male.prototype = new Person()

console.log(Male.prototype.__proto__.constructor)
/*
ƒ Person(name, age) {
	this.name = name
	this.age = age
}
*/

console.log(Male.prototype.constructor)  // Maile的构造函数指向了Person，显然有问题
/*
ƒ Person(name, age) {
	this.name = name
	this.age = age
}
*/

console.log(m.__proto__.constructor)     // Maile的构造函数指向了Person，显然有问题
/*
ƒ Person(name, age) {
	this.name = name
	this.age = age
}
*/

console.log(m.constructor)
/*
ƒ Person(name, age) {
	this.name = name
	this.age = age
}
*/

```
这并不是我们想要的！我们只是单纯的想要继承prototype，而不想要其他的属性。怎么办？

##### ==借用一个空的构造函数，借壳继承prototype，并且显示设置constructor==
```js
function Person(name, age) {
	this.name = name
	this.age = age
}
Person.prototype.showName = function() {
	console.log(this.name);
}


function Male(name, age) {
	// 调用Person构造函数，继承构造函数的属性，把this和参数传递给Person
	Person.apply(this, arguments)
	this.sex = "男"
}

// 借用一个空的构造函数
function F() { }
F.prototype = Person.prototype
// 继承prototype
Male.prototype = new F()
// 显示指定constructor
Male.prototype.constructor = Male
    
    
var m = new Male("小明", 20)
console.log(m)
m.showName()                        // 小明
console.log(m.constructor == Male)  // true
console.log(m instanceof Person)    // true
console.log(m instanceof Male)      // ture
console.log(m instanceof F)         // true    
```

我们可喜的将m的constructor正本清源！而且instanceof类型判断都没有错误（instanceof本质上是通过原型链找的，只要有一个原型满足了那结果就为true）。 ##继承prototype的封装&测试 上述继承prototype的代码很是丑陋，让我们封装起来吧。并且测试了一下代码：

##### 封装空函数 原理
1. 定义空函数  function F() {}
2. 把F的prototype指向父类的prototype F.prototype = superType.prototype
3. new F()，完成两件事情
    1. 执行F构造函数，为空；
    2. 执行==F的prototype的内存分配==，==这里就是父类==，也就是Person的getAge方法
    3. proto = new F() 所以这里`proto`继承了父类的getAge()方法，赋值给了proto
4. proto.constructor = subType 显示指向子类构造函数
5. subType.prototype = proto 实现真正意义上的prototype的继承，并且constructor为子类

```js
// 继承prototype & 设定subType的constructor为子类，不跟着prototype变化而变化
// subType子类 superType 父类

function inheritPrototype(subType, superType) {
    // 以下三行可以写成一个新的函数来完成
    function F() {}
    
    // 把F的prototype指向父类的prototype，修改整个prototype而不是部分prototype
    F.prototype = superType.prototype
    
    // new F()完成两件事情:
    // 1. 执行F构造函数，为空；
    // 2. 执行F的prototype的内存分配，这里就是父类，也就是Person的getAge方法
    
    // 所以这里是继承了父类的getAge()方法，赋值给了proto
    var proto = new F()
    
    // proto的构造函数显示指定为子类（由于上面重写了F的prototype，故而构造函数也变化了）
    proto.constructor = subType
    // 实现真正意义上的prototype的继承，并且constructor为子类
    subType.prototype = proto;
}

function Person(name, age) {
    this.name = name;
    this.age = age;
    this.getName = function() {
        return this.name;
    }
}

Person.prototype.getAge = function() {
    return this.age;
}

function Male(name, age) {
    Person.apply(this, [name, age]); // 借用构造函数继承属性
    this.sex = "男";
    this.getSex = function() {
        return this.sex
    }
}

inheritPrototype(Male, Person)

// 方法覆盖
Male.prototype.getAge = function() {
    return this.age + 1;
};
var p = new Person("好女人", 30)
var m = new Male("好男人", 30


console.log(p)
console.log(m)
console.log(p.getAge())
console.log(m.getAge())
```
##### 简化Object.create
`Male.prototype = Object.create(Person.prototype)`
`Male.prototype.constructor = Male`
 
```js
function Person(name, age) {
	this.name = name;
	this.age = age;
}
Person.prototype.showName = function() {
	console.log(this.name);
};
function Male(name, age) {
	// 调用Person构造函数，把this和参数传递给Person
	Person.apply(this, arguments);
	this.sex = "男";
}
// 继承prototype
Male.prototype = Object.create(Person.prototype)
 Male.prototype.constructor = Male
var m = new Male("小明", 20)

console.log(m)
Male {name: "小明", age: 20, sex: "男"}
    age: 20
    name: "小明"
    sex: "男"
    __proto__: Person
        constructor: ƒ Male(name, age)
        __proto__:
            showName: ƒ ()
            constructor: ƒ Person(name, age)
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

console.log(m instanceof Male)  // ture
console.log(m instanceof Person) // true
console.log(m instanceof Object) //true
```

### 完美继承
- 第1步  	`Person.apply(this, arguments)` / `Person.call(this, arguments)`
- 第2步     `Male.prototype = Object.create(Person.prototype); Male.prototype.constructor = Male`
#### 构造函数继承
#### 原型继承

```js
function Person(name, age) {
	this.name = name
	this.age = age
}
Person.prototype.showName = function() {
	console.log(this.name);
}


function Male(name, age) {
	// 第1步
	Person.apply(this, arguments)
	this.sex = "男"
}

// 第2步
Male.prototype = Object.create(Person.prototype)
Male.prototype.constructor = Male
    
    
var m = new Male("小明", 20)
console.log(m)
m.showName()                        // 小明
console.log(m.constructor == Male)  // true
console.log(m instanceof Person)    // true
console.log(m instanceof Male)      // ture
console.log(m instanceof F)         // true
```


## 多态
### 定义
所谓多态，就是指一个引用类型在不同情况下的多种状态。==同一个父类继承出来的子类各有各的形态==。

在java中多态是指通过指向父类的引用，来调用在不同子类中实现的方法。
js实际上是无态的，是一种动态语言，一个变量的类型是在运行的过程中由js引擎来决定的，所以说js天生就支持多态。

多态最常见的2种实现方式：
- 覆盖重载，覆盖指子类重新定义父类方法，这正好就是基于prototype继承的玩法，这不就多态了么。
- 重载是指多个同名但参数不同的方法，这个JavaScript确实没有。所以多态还是有的，只不过重载在JavaScript中没有实际对应的语法概念，你得绕个很大的弯子来玩这事

#### 重载
	1. 重载必须在 1 个类之间
	2. 子类无法重载父类的函数，父类同名函数将被名称覆盖
	3. 重载是在编译期间根据参数类型和个数决定函数调用

#### 重写
	1. 重写发生在 2 个类之间（父类子类）
	2. 并且父类与子类中函数必须同有完全相同的原型（函名 类型 个数）


### 重载
#### 1. 根据arguments.length实现重载
```js
function overLoading() {
　　// 根据arguments.length，对不同的值进行不同的操作
　　switch(arguments.length) {
　　　　case 0:
　　　　　　/*操作1的代码写在这里*/
　　　　　　break
　　　　　　
　　　　case 1:
　　　　　　/*操作2的代码写在这里*/
　　　　　　break
　　　　　　
　　　　case 2:
　　　　　　/*操作3的代码写在这里*/
　　　　　　
　　    //后面还有很多的case......
    }
 
}
```
这就是重载的一种实现的方法！不过有没有更好的方法呢？

#### 2. 利用闭包的特性实现重载
我们先来看一个需求，我们有一个 `users` 对象，`users` 对象的`values` 属性中存着一些名字。   
一个名字由两部分组成，空格左边的是 first-name ，空格右边的是 last-name，像下面这样。
```js
var users = {
  values: ["Dean Edwards", "Alex Russell", "Dean Tom"]
}
```
我们要在 `users` 对象 中添加一个 `find` 方法，实现以下功能：
- 当不传任何参数时， 返回整个`users .values`
- 当传一个参数时，就把 `first-name` 跟这个参数匹配的元素返回
- 当传两个参数时，则把 `first-name` 和 `last-name` 都匹配的返回

下来我们通过一个 `addMethod` 函数，来在 users 对象中添加这个 find 方法。

`addMethod` 函数，它接收3个参数
- object 要绑定方法的对象
- name   绑定的方法名称
- fn     需要绑定的方法

```js
// addMethod(users, "find", find0)

  /**
   * add/reload function for instance
   * @param name target  function name
   * @param fn function
   * @description inspired by https://www.cnblogs.com/yugege/p/5539020.html
   */
  Object.prototype.addMethod = function (name, fn) {
    let old = this[name]
    this[name] = function () {
      let fncLen = fn.length
      let argLen = arguments.length
      if (fncLen === argLen) {
        return fn.apply(this, arguments)
      } else if (typeof old === "function") {
        return old.apply(this, arguments)
      } else {
        throw new Error("no method with " + argLen + " param(s) defined!")
      }
    }
  }


  function addMethod1(object, name, fn) {
    let old = object[name]
    object[name + '_' + fn.length] = fn
    object[name] = function () {
      return object[name + '_' + arguments.length].apply(this, arguments)
    }
  }

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

`addMethod` 函数是利用了闭包的特性，通过变量 old 将每个函数连接了起来，让所有的函数都留在内存中。
每调用一次 `addMethod` 函数，就会产生一个 `old`，形成一个闭包。


我们可以通过 console.dir(users.find) ，把 find 方法打印到控制台看看。
![image](https://user-gold-cdn.xitu.io/2018/7/11/16487ebf42e75ef6?imageslim)

上面这个例子是  `jQuery` 之父 `John Resig`  写的，他在他的博客和他写的书 [《secrets of the JavaScript ninja》](https://pan.baidu.com/s/1kpcqeVlBA9mRxzv6b1n6kQ)第一版中都有提到过，在书中的第4章中也有讲解 Function overloading，文中的 addMethod 函数 就是书中的例子 4.15，感兴趣的朋友可以去看看。

上面的例子，本质都是在判断参数的个数，根据不同的个数，执行不同的操作，而下来举的例子是通过判断参数的类型，来执行不同的操作。


#### 重载的好处
重载其实是把多个功能相近的函数合并为一个函数，重复利用了函数名。  
假如jQuery中的css( )方法不使用 重载，那么就要有5个不同的函数，来完成功能，那我们就需要记住5个不同的函数名，和各个函数相对应的参数的个数和类型，显然就麻烦多了。

#### 总结
==虽然 JavaScript 并没有真正意义上的重载，但是重载的效果在JavaScript中却非常常见==。  
- 比如 数组的 `splice( )`方法，一个参数可以删除，两个参数可以删除一部分，三个参数可以删除完了，再添加新元素。
- 再比如 `parseInt( )`方法 ，传入一个参数，就判断是用十六进制解析，还是用十进制解析，如果传入两个参数，就用第二个参数作为数字的基数，来进行解析。
  
文中提到的实现重载效果的方法，本质都是对参数进行判断，不管是判断参数个数，还是判断参数类型，都是根据参数的不同，来决定执行什么操作的。
==虽然，重载能为我们带来许多的便利，但是也不能滥用，不要把一些根本不相关的函数合为一个函数，那样并没有什么意义。==


### 多态
多态：指一个引用(类型)在不同情况下的多种状态。也可以理解成：多态是指通过==指向父类的引用==，==来调用在不同子类中实现的方法==。
#### 实现多态的三个条件：
##### 1.  要有继承
##### 2. 要有函数重写
##### 3. 用父类指针（父类引用） 指向子类对象

#### 案例一
```js
 // Master类
  function Master(name) {
    this.name = name
  }

  //原型法添加成员函数
  Master.prototype.feed = function (animal, food) {
    console.log(this.name + ": 给" + animal.name + " 喂" + food.name)
  }

  // 食物
  function Food(foodName) {
    this.name = foodName
  }


  //鱼
  function Fish(foodName) {
    // 通过对象冒充来实现继承的
    // 对象冒充的意思就是获取那个类的所有成员，因为js是谁调用那个成员就是谁的，这样Fish就有了Food的成员了
    this.food = Food
    this.food(foodName)
  }

  //骨头
  function Bone(foodName) {
    this.food = Food
    this.food(foodName)
  }

  //桃子
  function Peach(foodName) {
    this.food = Food
    this.food(foodName)
  }

  //动物
  function Animal(animalName) {
    this.name = animalName
  }

  //猫猫
  function Cat(animalName) {
    this.animal = Animal
    this.animal(animalName)
  }

  //狗狗
  function Dog(animalName) {
    this.animal = Animal
    this.animal(animalName)
  }

  //猴子
  function Monkey(animalName) {
    this.animal = Animal
    this.animal(animalName)
  }

  let cat = new Cat("猫")
  let fish = new Fish("鱼")

  let dog = new Dog("狗")
  let bone = new Bone("骨头")

  let monkey = new Monkey("猴")
  let peach = new Peach("桃")

  //创建一个主人
  let master = new Master("zs")

  master.feed(dog, bone)      // zs: 给狗 喂骨头
  master.feed(cat, fish)      // zs: 给猫 喂鱼
  master.feed(monkey, peach)  // zs: 给猴 喂桃
```
#### 案例二
```js
  function Person() {}

  Person.prototype.name = 'name in Person'
  Person.prototype.learning = function () {
    console.log('learning in Person')
  }

  //子类
  function Student() {}

  Student.prototype = Object.create(Person.prototype)       // 继承
  Student.prototype.constructor = Student                   // 构造函数
  Student.prototype.supr = Person.prototype                 // 父类

  Student.prototype.learning = function () {
    console.log('learning in Student')
  }

  //工人
  function Worker() {}

  Worker.prototype = Object.create(Person.prototype)       //继承
  Worker.prototype.constructor = Worker                    //构造函数
  Worker.prototype.supr = Person.prototype                 //父类

  Worker.prototype.learning = function () {
    console.log('learning in Worker')
  }

  /**
   实现多态的三个条件：
   1.  要有继承
   2、 要有函数重写
   3、 用父类指针（父类引用） 指向子类对象
   */
  let personFactory = function (type) {
    switch (type) {
      case 'Worker':
        return new Worker()
        break
      case 'Student':
        return new Student()
        break
    }
    return new Person()
  }

  //客户端
  let person = personFactory()
  person.learning() // learning in Person

  person = personFactory('Student')
  person.learning() // learning in Student

  person = personFactory('Worker')
  person.learning() // learning in Worker
```

### 多态和重载的区别
#### 重载：
- 重载可认为是静态的多态，静态联编，发生在编译阶段；
- 重载就是一组具有相同名字、不同参数列表的函数（方法）。
- 重载，函数特征之一，表现为在一个类中同名不同参的方法分别被调用会产生不同的结果。

#### 多态：
- 多态是动态的，动态联编，发生在运行阶段；
- 多态，面向对象特征之一，表现为不同对象调用相同方法会产生不同的结果。可以理解一个方法被不同实现后 展现不同的效果及状态。

静态的比动态的效率高，但动态的最大优点是多态性，提高代码复用性。



## 总结
至此，我们已经完成了真正意义上的javascript继承！
让我们再来回头验证一下：
- 子类继承父类中的属性和方法。Check！

- 子类、父类的实例对象拥有两份副本，改了其中之一，另一个实例对象的属性并不会随之改变。Check！通过constructor继承属性，由于采用了new，故而每个实例对象的属性肯定是有不同的副本。

- 子类可覆盖父类的方法或属性。Check！由于方法的继承是采用继承prototype来实现的，借F的prototype来继承，所以所有被继承的方法都在new F()的一刹那存在了F中，而F是一个空构造函数，故而没有多余的属性，只有被继承的方法。我们再将这个F实例对象指向子类构造函数的prototype对象，即可实现方法继承。从而在改写子类的prototype中的方法并不会影响到父类的prototype中的方法，从而实现方法重写！

- 子类和父类的实例对象通过“[对象] instanceof [子类/父类]”判定的结果应该为true。Check！原型链没有断掉。子类的`__proto__`指向F，F的`__proto__`指向父类。

- 子类和父类的实例对象的constructor指针应该分别指向子类和父类的构造函数。Check！我们在写的过程中显示制定了constructor，所以constructor指针的指向也不会错。

### 继承要点
- 继承父类的构造函数来实现属性继承 call/apply
- ==借中间函数F，继承父类的prototype来实现方法继承&方法覆盖==。Object.create
- 显示指定`constructor`防止`prototype`改写带来的问题

至此，较为漂亮的完成了Javascript的继承！


- 抽象类：==父类构造函数中只有方法定义==，则该父类即为==抽象父类==。

- 接口：父类构造函数中==方法定义为空==。

- 多态：==父类中调用一个未实现的函数，在子类中实现即可==。

- 类型转换：把中间层F断掉，重新指定实例对象的`__proto__`指向的prototype对象，那么F中继承的方法将不复存在，故而调用方法就是直接调用被指向的prototype对象的方法了。

关于类型转换的代码如下：
```js
function inheritPrototype(subType, superType) {
    // 以下三行可以写成一个新的函数来完成
    function F() {}
    
    // 把F的prototype指向父类的prototype，修改整个prototype而不是部分prototype
    F.prototype = superType.prototype
    
    // new F()完成两件事情:
    // 1. 执行F构造函数，为空；
    // 2. 执行F的prototype的内存分配，这里就是父类，也就是Person的getAge方法
    
    // 所以这里是继承了父类的getAge()方法，赋值给了proto
    var proto = new F()
    
    // proto的构造函数显示指定为子类（由于上面重写了F的prototype，故而构造函数也变化了）
    proto.constructor = subType
    // 实现真正意义上的prototype的继承，并且constructor为子类
    subType.prototype = proto;
}

function Person(name, age) {
   this.name = name;
   this.age = age;
   this.getName = function() {
       return this.name
   }
}
Person.prototype.getAge = function() {
   return this.age
}

function Male(name, age) {
   Person.apply(this, [name, age]); // 借用构造函数继承属性
   this.sex = "男"
   this.getSex = function() {
       return this.sex;
   }
}

inheritPrototype(Male, Person)


// 方法覆盖父类原型的getAge方法
Male.prototype.getAge = function() {
   return this.age + 1
}


var p = new Person("好女人", 30)
var m = new Male("好男人", 30)

console.log(p)
console.log(m)

// 将 m 转换为 Person 类型从而调用Person类的方法
m.__proto__ = Person.prototype

console.log(p.constructor == Person) // true
console.log(m.constructor == Male)   // false

console.log(m instanceof Male)       // false
console.log(m instanceof Person)     // true    

console.log(p.getAge())              // 30   
console.log(m.getAge())              // 30      m调用的是父类中的getAge方法



// 将m转换为Male类型从而调用Male类的方法
m.__proto__ = Male.prototype
console.log(p.constructor == Person)    // true
console.log(m.constructor == Male)      // true

console.log(m instanceof Male)          // true
console.log(m instanceof Person)        // true
console.log(p.getAge())                 // 30
console.log(m.getAge())                 // 31
```
可以看到类型转换之后，调getAge()方法的不同了

参考：
- https://github.com/Kelichao/javascript.basics/issues/2
- [由Javascript的继承引发的：抽象类、接口、多态，甚至是类型转换！](https://my.oschina.net/xue777hua/blog/147716)
- https://juejin.im/post/5b4465516fb9a04fe017f926
- https://www.cnblogs.com/yugege/p/5539020.html
