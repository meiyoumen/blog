[TOC]
# 目录

## Object.create()
### 描述
- Object.create() 方法会使用==指定的原型对象及其属性==去创建一个新的对象。
- Object.create() 方法是给==对象原型上添加属性==

### 语法
Object.create(proto[, propertiesObject])
- proto
新创建对象的原型对象。
- propertiesObject
可选。如果没有指定为 undefined，则是要添加到新创建对象的可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）对象的属性描述符以及相应的属性名称。这些属性对应Object.defineProperties()的第二个参数。
- 返回值
在指定原型对象上添加新属性后的对象。

### 与 `=`号的区别

```js
var obj ={a: 1}
var b = Object.create(obj)
var c =  a              // 引用
console.log(obj.a)      // 1
console.log(b.a)        // 1
b.a = 2
console.log(obj.a)      //1
```
1. `=`来赋值，只是一个对象的引用，两者指向同一片内存
2. `Object.create`创建了一个==新的对象==，这个对象==继承（关联）了obj==的属性，改变==新对象的同名属性并不会影响原对象==。

`Object.create()`返回了一个==新的空对象==，并且==这个空对象的构造函数的原型（prototype）是指向obj的==。  
所以当我们访问新对象 `b.a` 的时候实际上是通过==原型链==访问的` obj中的a` 。


当我们试图修改 `b.a` 的时候，这里有一个知识点:
对象的==遮蔽效应==，==如果修改对象的一个与原型链同名属性==，那么会在 `当前对象中新建一个属性`，这==个属性拥有更高级的访问优先级==，所以就会==遮蔽原型链中的同名属性==

所以Object.create的具体内部实现模拟

```js
_create = function (o) {
    let F = function () {}
    F.prototype = o
    return new F()          // 这里是new了
}
```



再来看这个例子

```js
var person = {
	friends : ["Van","Louis","Nick"]
}

var anotherPerson = _create(person)
anotherPerson.friends.push("Rob")

var yetAnotherPerson = _create(person)
yetAnotherPerson.friends.push("Style")

console.log(person.friends) // "Van, Louis, Nick, Rob, Style"
```

相当于做了一次浅复制，新创建的各个对象实际上是会==共享原始对象中的引用类型的值==。  
这意味着`person.friends`不仅属于`person`所有,==而且也会被 `anotherPerson` 以及 `yetAnotherPerson` 共享==

实际上真正的 `Object.create()` 还可以传入第二个参数，这个参数与 `Object.defineProperties` 方法的第二个参数格式相同,==通过第二个参数是会在新对象中重新创建一个属性的==，然后通过==属性遮蔽原理避免修改原对象==。

```js
var person = {
	name : "Van"
}

var anotherPerson = Object.create(person, {
	name : {
		value : "Louis"
	}
})
console.log(anotherPerson.name);    //"Louis"
```




## Object.create 是可以继承的

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

## 使用 Object.create 的 propertyObject参数

```js
var o

// 创建一个原型为null的空对象
o = Object.create(null)


o = {}
// 以字面量方式创建的空对象就相当于
o = Object.create(Object.prototype)


o = Object.create(Object.prototype, {
  // foo会成为所创建对象的数据属性
  foo: { 
    writable:true,
    configurable:true,
    value: "hello" 
  },
  // bar会成为所创建对象的访问器属性
  bar: {
    configurable: false,
    get: function() { return 10 },
    set: function(value) {
      console.log("Setting `o.bar` to", value);
    }
  }
})


function Constructor(){}
o = new Constructor()
// 上面的一句就相当于:
o = Object.create(Constructor.prototype);
// 当然,如果在Constructor函数中有一些初始化代码,Object.create不能执行那些代码


// 创建一个以另一个空对象为原型,且拥有一个属性p的对象
o = Object.create({}, { p: { value: 42 } })

// 省略了的属性特性默认为false,所以属性p是不可写,不可枚举,不可配置的:
o.p = 24
o.p
//42

o.q = 12
for (var prop in o) {
   console.log(prop)
}
//"q"

delete o.p
//false

//创建一个可写的,可枚举的,可配置的属性p
o2 = Object.create({}, {
  p: {
    value: 42, 
    writable: true,
    enumerable: true,
    configurable: true 
  } 
});
```
## Polyfill
这个 polyfill 涵盖了主要的应用场景，它创建一个已经选择了原型的新对象，但没有把第二个参数考虑在内。

请注意，尽管在 ES5 中 Object.create支持设置为[[Prototype]]为null，但因为那些ECMAScript5以前版本限制，此 polyfill 无法支持该特性。

```js
if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (!(proto === null || typeof proto === "object" || typeof proto === "function")) {
            throw TypeError('Argument must be an object, or null');
        }
        var temp = new Object();
        temp.__proto__ = proto;
        if(typeof propertiesObject ==="object")
            Object.defineProperties(temp,propertiesObject);
        return temp;
    };
}
```

## extends继承
```JS
class Point {
    static NAME = 'point'

    constructor(x, y) {
        this.x = x
        this.y = y
    }
  
    outPoint(){
        console.log('point:' + this.x + this.y)
    }
}

class ColorPoint extends Point {

    static COLOR_NAME = 'ColorPoint'

    constructor(x, y, color) {
        super(x, y);    
        this.color = color
    }

    outColorPoint(){
        console.log('ColorPoint:'+this.x+this.y+this.color)
    }
}
```
现在将其通过babel转换为es5，我们将代码简化,去掉验证信息,_createClass使用prototype代替,简化后代码。
```js
'use strict';
function _inherits(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    subClass.__proto__ = superClass;
}
var Point = function(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.outPoint = function outPoint() {
    console.log('point:' + this.x + this.y);
}

Point.NAME = 'point';
var ColorPoint = function(_Point) {

    _inherits(ColorPoint, _Point);

    function ColorPoint(x, y, color) {
        ColorPoint.__proto__.call(this,x,y);  //这里
        this.color = color;
    }
    
    ColorPoint.prototype.outColorPoint = function() {
        console.log('ColorPoint:' + this.x + this.y + this.color);
    }
    return ColorPoint
} (Point)

ColorPoint.COLOR_NAME = 'ColorPoint' 
```
简化后的代码可以看到`_inherits` 方法是实现父类原型对象的继承,`ColorPoint.__proto__`上应用了父类构造函数`Point`,使用`ColorPoint.__proto__.call(this,x,y)`,使用call继承父类构造器中的属性。


```js
function _inherits(subClass, superClass) {
    // 这里和就是原型继承
    subClass.prototype = Object.create(superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    subClass.__proto__ = superClass;
}
```
## 原型链+调用构造函数的组合继承
这种方式关键在于:通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用。
3步：
1. 调用父类构造函数继承 `Person.call(this,name,age)`
2. 原型继承，并修改子类构造函数指向 `Student.prototype = new Person() Student.prototype.constructor = Student`
3. 子类继承父类后，才可以在子类原型上添加方法和属性

```js
  function Person(name, age) {
    this.name = name,
      this.age = age,
      this.setAge = function () { }
  }
  Person.prototype.setAge = function () {
    console.log("111")
  }

  function Student(name, age, price) {
    Person.call(this,name,age)     //1. 调用父类构造函数继承
    this.price = price
    this.setScore = function () { }
  }

  // 2. 原型继承
  // Student.prototype = new Person()  // 不推荐
  
  Student.prototype = Object.create(Person.prototype)
  Student.prototype.constructor = Student  //组合继承也是需要修复构造函数指向的
  /*
   subClass.prototype = Object.create(superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    subClass.__proto__ = superClass;
    */    

  // 3. 子类继承父类后，才可以在子类原型上添加方法和属性
  Student.prototype.sayHello = function () { }

  var p1 = new Person('DD', 1)
  var s1 = new Student('Tom', 20, 15000)
  var s2 = new Student('Jack', 22, 14000)

  console.log(s1)
  console.log(s1.constructor) //Student
  console.log(p1.constructor) //Person
```

### Object.create的实现原理

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

## 使用`Object.create`继承的好处

为了理解好处，首先要弄清楚JavaScript中“类”是什么。您有两个部分：

- 构造函数  
    此函数包含创建“类”实例的所有逻辑，即实例特定代码。
- 原型对象  
    这是实例从中继承的对象。它包含应在所有实例之间共享的所有方法(和其他属性)。

继承建立一个is-a关系，例如，狗是一个动物。这是如何表达的构造函数和原型对象？  
显然，狗必须具有与动物相同的方法，即Dog原型对象必须以某种方式结合来自Animal原型对象的方法。有多种方法可以做到这一点。你会经常看到：
```
Dog.prototype = new Animal()
```

这是因为一个Animal实例继承自Animal原型对象。但它也意味着每个狗继承自一个特定的动物实例。这似乎有点奇怪。应该不是实例特定的代码只在构造函数中运行？突然的实例特定的代码和原型方法似乎混合。

我们实际上不想在那一刻==运行Animal实例特定的代码==，我们==只想要所有的Animal原型对象的方法==。这就是`Object.create`让我们做的：

```js
Dog.prototype = Object.create(Animal.prototype)
```

这里我们==不创建一个新的Animal实例，我们只得到原型方法==。

实例特定的代码在构造函数内部精确执行：

```js
function Dog() { 
   Animal.call(this, 'Dog'); 
}
```

最大的优点是Object.create将总是工作。使用新的Animal()只有当构造函数不需要任何参数时。想象一下，如果构造函数看起来像这样：

```js
function Animal(name) { 
    this.name = name.toLowerCase();
}
```

你总是需要传递一个字符串到Animal，否则你会得到一个错误。
当你做

```js
Dog.prototype = new Animal(??);
```

==？你传递的字符串实际上并不重要，只要传递一些东西，这希望能告诉你这是不好的设计==。

> Some say that Dog.prototype = Animal.prototype; can also work. So now I’m totally confused

将Animal.prototype中的属性“添加”到Dog.prototype的所有内容都将“工作”。
但是解决方案具有不同的质量。在这种情况下，你会有一个问题，你添加到Dog.prototype的任何方法也将添加到Animal.prototype。

例：
```js
Dog.prototype.bark = function() {
    alert('bark');
}
```
因为==Dog.prototype === Animal.prototype==，所有Animal实例都有一个方法bark，这当然不是你想要的。

==`Object.create`(甚至新的Animal)通过创建一个继承自Animal.prototype的新对象，并将该新对象变成Dog.prototype，向继承添加一个间接层次。==

ES6中的继承

ES6引入了一个新的语法来创建构造函数和原型方法，它看起来像这样：

```js
class Dog extends Animal {

  bark() {
    alert('bark');
  }

}
```

这比我上面解释的更方便，但事实证明，==extend也使用一个内部等价于Object.create来设置继承==。
参见ES6 draft中的步骤2和3。这意味着在ES5中使用Object.create(SuperClass.prototype)是“更正确”的方法。