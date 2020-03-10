[TOC]
# 构造函数
## 构造函数的缺点
JavaScript 通过构造函数生成新对象，因此构造函数可以视为对象的模板。  
实例对象的属性和方法，可以定义在构造函数内部。
```js
function Cat (name, color) {
  this.name = name
  this.color = color
}

var cat1 = new Cat('大毛', '白色')
cat1.name  // '大毛'
cat1.color // '白色'
```
上面代码中:
- `Cat`函数是一个构造函数，函数内部定义了`name`属性`和color`属性.
- ==所有实例对象（上例是cat1）都会生成这两个属性，即这两个属性会定义在实例对象上面。==

通过构造函数为实例对象定义属性，虽然很方便，但是有一个缺点。
==同一个构造函数的多个实例之间，无法共享属性，从而造成对系统资源的浪费==。

```js
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log('喵喵');
  };
}

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

cat1.meow === cat2.meow // false
```
上面代码中
- `cat1`和`cat2`是同一个构造函数的两个实例，它们都具有`meow`方法。  
- 由于`meow`方法是生成在每个实例对象上面，所以两个实例就生成了两次。  
- 也就是说，每新建一个实例，就会新建一个meow方法。  
- ==这既没有必要，又浪费系统资源，因为所有meow方法都是同样的行为，完全应该共享。==

这个问题的解决方法，就是 JavaScript 的原型对象（prototype）。[参见JS-原型对象]

# 1.借用构造函数继承
让一个构造函数继承另一个构造函数，是非常常见的需求。  
1. 在子类的构造函数中，调用父类的构造函数。 

```js
Person.call(this, name, age)
```

```JS
 function Person(name, age) {
    this.name = name,
    this.age = age,
    this.setName = function () {}
  }
  Person.prototype.setAge = function () {}
  
  function Student(name, age, price) {
    Person.call(this, name, age)  // 相当于: this.Person(name, age)
    /*this.name = name
    this.age = age*/
    this.price = price
  }
  
  var s1 = new Student('Tom', 20, 15000)
  
  console.log(s1.setAge())//Uncaught TypeError: s1.setAge is not a function
```
这种方式只是==实现部分的继承==，==如果父类的原型还有方法和属性，子类是拿不到这些方法和属性的==。

## 特点：

- 解决了原型链继承中子类实例共享父类引用属性的问题
- 创建子类实例时，可以向父类传递参数
- 可以实现多继承(call多个父类对象)

## 缺点：
- 实例并不是父类的实例，只是子类的实例
- 只能继承父类的实例属性和方法，不能继承原型属性和方法
- 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能


# 2. 原型继承 prototype
把父类的私有 + 公有的属性和方法，都作为子类公有的属性。

## 核心
==将父类的实例作为子类的原型。==
- 不是把父类私有+公有的属性克隆一份一模一样的给子类的公有；  
- 他是通过`__proto__`建立和子类之间的原型链，当子类的实例需要使用父类的属性和方法的时候，可以通过`__proto__`一级级找上去使用；


```js
  // 定义一个动物类
  function Animal (name, color) {

    // 属性
    this.name = name || 'Animal'
    this.color = color = 'white'

    // 实例方法
    this.sleep = function(){
      console.log(this.name + '正在睡觉！')
    }
  }

  // 原型方法
  Animal.prototype.eat = function(food) {
    console.log(this.name + '正在吃：' + food)
  }

  function Cat(){ }

  // 第一种写法
  // 缺点：每当new Animal()来调用构造函数返回一个对象实例的时候，都会创建一个sleep方法，浪费内存。
  // 这种写法也有继承的效果，但是子类会具有父类实例的方法。有时，这可能不是我们需要的，所以不推荐使用这种写法。
  Cat.prototype = new Animal() // 子类型的原型为父类型的一个实例对象


  // 别外一种写法
  
  // 错误的形式的写法
  // Cat.prototype = Animal.prototype
  // 1. 这样写子类会修改掉父类所有实例原型的方法和属于，正确写法 Object.create(Animal.prototype)
  // 2. 而且这种方式没办法辨别是对象是子类还是父类实例化

  // 正确写法：     
  // 缺点： 只能继成父类原型上的属性的方法，不能继承父类构造函数中的属性和方法
  // Cat.prototype = Object.create(Animal.prototype)
  // Cat.prototype.constructor = Cat  // 组合继承也是需要修复构造函数指向的

  Cat.prototype.name = 'cat'
  Cat.prototype.eat = function (food) {
    console.log(this.name + '不爱吃：' + food)
  }

  let a1 = new Animal()
  let a2 = new Animal()

  //　Test Code
  let blackCat = new Cat()
  console.log(blackCat.name)               // cat
  console.log(blackCat.eat('fish'))        // cat 正在吃 fish
  console.log(blackCat.sleep())            // cat正在睡觉！
  console.log(blackCat instanceof Animal)  //true
  console.log(blackCat instanceof Cat)     //true

  let whiteCat = new Cat()

  console.log(1, whiteCat.eat === blackCat.eat)     // true
  console.log(2, whiteCat.sleep === blackCat.sleep) // ture

  console.log(3, a1.eat === a2.eat)     // true
  console.log(4, a1.sleep === a2.sleep) //false
  
  
  console.log(cat instanceof Animal)  //true
  console.log(cat instanceof Cat)     //true
  
  console.log(blackCat.__proto__) // 通过原型链指向Animail Animal{name: "cat", color: "white", sleep: ƒ, eat: ƒ}
  console.log(blackCat.__proto__ === whiteCat.__proto__) // true
   console.log(blackCat.__proto__.__proto__ ) // 指向Cat原型 {eat: ƒ, constructor: ƒ}
  console.log(blackCat.__proto__.__proto__ === whiteCat.__proto__.__proto___)  // ture
```
![image](https://note.youdao.com/yws/public/resource/f063c3257d1eff57c9d293a7ebd0a3df/xmlnote/662A1215A1044EE78FB06EF268857CB8/19419)
但这种方式实现的本质是通过将子类的原型指向了父类的实例，所以子类的实例就可以通过__proto__访问到 Cat.prototype 也就是Animal的实例，这样就可以访问到父类的私有方法，然后再通过__proto__指向父类的prototype就可以获得到父类原型上的方法。

### 特点：
- 非常纯粹的继承关系，实例是子类的实例，也是父类的实例
- 父类新增原型方法/原型属性，子类都能访问到
- 简单，易于实现

### 缺点：
- 要想为子类新增属性和方法，必须要在==new Animal()这样的语句之后执行==，不能放到构造器中
- 无法实现多继承
- ==来自原型对象的所有属性被所有实例共享==
- ==创建子类实例时，无法向父类构造函数传参==
-== 所有的子类实例会共享一个父类对象的实例==

# 3. 原型链+调用构造函数的组合继承
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


  // 3. 子类继承父类后，才可以在子类原型上添加方法和属性
  Student.prototype.sayHello = function () { }

  var p1 = new Person('DD', 1)
  var s1 = new Student('Tom', 20, 15000)
  var s2 = new Student('Jack', 22, 14000)

  console.log(s1)
  console.log(s1.constructor) //Student
  console.log(p1.constructor) //Person
```
![image](https://segmentfault.com/img/remote/1460000016708012)

这种方式融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。

不过也存在缺点就是无论在什么情况下，都会调用两次构造函数：
- 一次是在创建子类型原型的时候，
- 另一次是在子类型构造函数的内部，子类型最终会包含父类型对象的全部实例属性，但我们不得不在调用子类构造函数时重写这些属性。所以不推荐使用`Student.prototype = new Person() `

## 优点：
- 可以继承实例属性/方法，也可以继承原型属性/方法
- 不存在引用属性共享问题
- 可传参
- 函数可复用

## 缺点：
- 调用了两次父类构造函数，生成了两份实例 Student.prototype = new Person()

## 完美优化
借助原型可以基于已有的对象来创建对象，var B = Object.create(A)，以A对象为原型，生成了B对象。B继承了A的所有属性和方法。另一种叫法：寄生式继承？
```js
Student.prototype = Object.create(Person.prototype)
Student.prototype.constructor = Student
```
优化后，目前来说，最完美的继承方法！

# 4. ES6中`class`的继承
ES6中引入了`class`关键字，`class`可以通过`extends`关键字实现继承，还可以通过`static`关键字定义类的静态方法。
这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

- ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。
- ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。如果子类没有定义`constructor`方法，==这个方法会被默认添加==。也就是说，不管有没有显式定义，任何一个子类都有constructor方法。

需要注意的是，`class`关键字只是原型的语法糖，==JavaScript继承仍然是基于原型实现的==。
## 几点注意事项

### 1. 如果不调用super方法，子类就得不到this对象。
```js
class Point { /* ... */ }

class ColorPoint extends Point {
  constructor() {
  }
}

let cp = new ColorPoint(); // ReferenceError
```
上面代码中，ColorPoint继承了父类Point，但是它的构造函数没有调用super方法，导致新建实例时报错。
### 2. 子类没有定义constructor方法
如果子类没有定义constructor方法，这个方法会被默认添加，代码如下。也就是说，==不管有没有显式定义，任何一个子类都有constructor方法==。
```js
class ColorPoint extends Point {}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```
### 3. 调用super之后，才可以使用this关键字

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}
```
在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。
这是因==为子类实例的构建，基于父类实例==，==只有super方法才能调用父类实例==。

子类的constructor方法没有调用super之前，就使用this关键字，结果报错，==而放在super方法之后就是正确的==。

### 4. 父类的静态方法也会被子类继承
```js
class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {}
A.hello()  // hello world
B.hello()  // hello world
```
上面代码中，hello()是A类的静态方法，B继承A，也继承了A的静态方法。

## 实现
```js
class Person {

    // 调用类的构造方法
    constructor(name, age) {
        this.name = name
        this.age = age
    }
    
    static hello() {
      console.log('hello world');
    }
    
    // 定义一般的方法
    showName() {
        console.log("调用父类的方法")
        console.log(this.name, this.age);
    }
}

let p1 = new  Person('kobe', 39)

console.log(p1)

// 定义一个子类， 通过extends关键字继成父类Person
class Student extends Person {
    constructor(name, age, salary) {
        super(name, age)        // 通过super调用父类的构造方法
        
        this.salary = salary
    }
    
    // 在子类自身定义方法
    showName() {
        console.log("调用子类的方法")
        console.log(this.name, this.age, this.salary);
    }
}

let s1 = new Student('wade', 38, 1000000000)
console.log(s1)
s1.showName()

console.log(Person.hello()) // hello world
console.log(Student.hello()) // hello world
```
## 优点：
语法简单易懂,操作更方便

## 缺点：
并不是所有的浏览器都支持`class`关键字。不过有babel转换。

## ES6多继承？
对于实质上是单一继承树的原型继承模型来说，不存在菱形问题。

不支持，本质还是 prototype。一旦多继承（虽然没有），则按声明先后顺序覆盖同名方法。
可以用 mixin 的方式来模拟多继承。

多继承中的决菱形问题，如下图：
![image](https://user-gold-cdn.xitu.io/2018/4/4/1628f43bd4e7338c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 实现多继承
```js
function Father(name, age) {
    this.name = name;
    this.age = age;
}
Father.prototype.code = function() {
    console.log('coding...');
}
Father.prototype.greeting = function() {
    console.log('Hi, I\'m Mr ' + this.name);
}


function Mother(eyes, health) {
    this.eyes = eyes;
    this.health = health;
}

Mother.prototype.cook = function() {
    console.log('cooking');
}

function Child(name, age, eyes, health, toys) {
    
    // 实现多继承
    Father.call(this, name, age);
    Mother.call(this, eyes, health);
    
    this.toys = toys;
}

Child.prototype = Object.create(Father.prototype); // Child.prototype.__proto__ = Father.prototype

// 实现多继承Object.assign
Object.assign(Child.prototype, Mother.prototype); // Child.prototype = Child.prototype + Mother.prototype

Child.prototype.constructor = Child


Child.prototype.greeting = function() {
    console.log('Hi, I\'m little ' + this.name);
}

var child = new Child('jr', 1, 'big eyes', 100, ['NICIbear', 'IKEAdog']);

console.log(child); 
```
可以看到 child 的原型链上会同时有来自 Mother 的 cooking 和来自 Father 的 coding，虽然也会有来自 Father 的 greeting，但是也有自己独有的 greeting，只不过自己独有的 greeting 会覆盖 Father 的 greeting。

Object.assign 会把 Mother原型上的函数拷贝到 Child原型上，使 Child的所有实例都可用 Mother的方法。

把上面的代码放到控制台中打印出来，仔细看一下，你会发现 cooking 和 coding 在原型链的位置中是不同的。

这是因为 :
- Object.create() 方法是给==对象原型上添加属性==
- Object.assign() 是给==对象本身添加属性==

- Object.create() 方法主要是在 JS 中用来执行和继承有关的事情  
- Object.assign 则是改造对象本身。这个方法也特别有用，可以用来复制对象，可以用来给对象添加其他对象的属性，甚至可以用来合并对象等等。
想知道这个方法的用法，请看 MDN 的文章：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign



# 总结
- 推荐使用ES6的继承方式，其次是组合继承
- ==JavaScript继承仍然是基于原型实现的==