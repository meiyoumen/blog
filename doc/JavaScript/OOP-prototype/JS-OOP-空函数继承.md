### 空函数中转原理
继承中 直接new Class带来的问题
```js
Male.prototype = new Person()
```
1. 子类的构造函数也指向父类的构造函数
2. 当new Class()来调用构造函数返回一个对象实例的时候，都会创建一个构造函数中的方法，浪费内存。
3. 解决方案：
    1. Cat.prototype = Object.create(Animal.prototype)  // 继承原型
    2. Cat.prototype.constructor = Cat                  // 修正构造函数指向
4. 解决方案中的继承方式，只能继承父类原型上的方法和属生，不能继承构造函中的方法

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
大家可以看到m对象不仅有==name, age , sex==三个属性，而且通过其原型链可以找到`showName`方法。

如果大家仔细观察，会发现多出了两个undefined值的name和age！为什么？  

究其原因，因为在执行`Male.prototype = new Person()`的时候，这两个属性就在内存中分配了值了。 而且改写了`Male`的整`个prototype`，导致`Male`对象的`constructor`也跟着变化了，这也不好。
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