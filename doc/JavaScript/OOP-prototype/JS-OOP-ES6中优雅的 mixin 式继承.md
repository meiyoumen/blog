# Mixins
![image](https://p5.ssl.qhimg.com/d/inn/7055f953/mixins.jpg)

我们说 JavaScript / ES5 的继承模型是基于单一原型链的继承模型，通常情况下，在 JavaScript 实践中完全用原型链来实现继承式的代码复用，是远远不能满足需求的。

因此实战中，我们的代码抽象基本上都是采用混合的模式，既有原型继承，也有 mixin 组合。

那什么是 mixin 呢？ 最基本的 mixin 其实就是简单地将一个对象的属性复制给另一个对象：
```js
function mixin(dest, src) {
    for (let key in src ) {
        dest[key] = src[key]
    }
}
```

注意==传入的参数都是对象==：枚举出一个对象的所有属性，然后将这些属性添加到另一个对象上去。

有时候，我们需要将多个对象的属性 mixin 到一个对象上去：

```js
let src1 = {...}
let src2 = {...}
let src3 = {...}
var dest = {...};
[src1, src2, src3].forEach(function(src){
    mixin(dest, src)
})
```
每次都用 forEach 操作显然很繁琐，因此通常情况下， mixin 考虑支持操作多个对象：


```js
  function mixin(...objs){
    return objs.reduce((dest, src) => {
      for (var key in src) {
        dest[key] = src[key]
      }
      return dest
    });
  }
  let src1 ={name: 'SH'}
  let src2 ={areaCode: '021'}
  let src3 ={sb: 'SB'}
  var dest = mixin({}, src1, src2, src3)

  console.log(dest) //{name: "SH", areaCode: "021", sb: "SB"}
```
ES5 中，mixin 为 object 提供功能“混合”能力，由于 JavaScript 的原型继承机制，通过 mixin 一个或多个对象到构造器的 prototype上，能够间接提供为“类”的实例混合功能的能力。


```js
function mixin(...objs){
    return objs.reduce((dest, src) => {
        for (var key in src) {
            dest[key] = src[key]
        }
        return dest;    
    });
}

function createWithPrototype(Cls){
    var P = function(){};
    P.prototype = Cls.prototype;
    return new P();
}

function Person(name, age, gender){
    this.name = name;
    this.age = age;
    this.gender = gender;
}

function Employee(name, age, gender, level, salary){
    Person.call(this, name, age, gender);
    this.level = level;
    this.salary = salary;
}

Employee.prototype = createWithPrototype(Person);

mixin(Employee.prototype, {
    getSalary: function(){
        return this.salary;
    }
});

// 序列化
function Serializable(Cls, serializer){
    mixin(Cls, serializer);
    this.toString = function(){
        return Cls.stringify(this);
    } 
}

mixin(Employee.prototype, new Serializable(Employee, {
        parse: function(str){
            var data = JSON.parse(str);
            return new Employee(
                data.name,
                data.age,
                data.gender,
                data.level,
                data.salary
            );
        },
        stringify: function(employee){
            return JSON.stringify({
                name: employee.name,
                age: employee.age,
                gender: employee.gender,
                level: employee.level,
                salary: employee.salary
            });
        }
    })
);
```

从一定程度上，mixin 弥补了 JavaScript 单一原型链的缺陷，可以实现类似于多重继承的效果。

在上面的例子里，我们让 Employee “继承” Person，同时也“继承” Serializable。有趣的是我们通过 mixin Serializable 让 Employee 拥有了 stringify 和 parse 两个方法，同时我们改写了 Employee 实例的 toString 方法。

我们可以如下使用上面定义的类：

```js
var employee = new Employee("jane",25,"f",1,1000);
var employee2 = Employee.parse(employee+""); //通过序列化反序列化复制对象

console.log(employee2, 
    employee2 instanceof Employee,    //true 
    employee2 instanceof Person,    //true
    employee == employee2);        //false
```
## ES6 中的 mixin 式继承
在 ES6 中，我们可以采用全新的基于类继承的 “mixin” 模式设计更优雅的“语义化”接口，这是因为 ES6 中的 extends 可以继承动态构造的类，这一点和其他的静态声明类的编程语言不同，在说明它的好处之前，我们先看一下 ES6 中如何更好地实现上面 ES5 代码里的 Serializable：

```js
class Serializable{
  constructor(){
    if(typeof this.constructor.stringify !== "function"){
      throw new ReferenceError("Please define stringify method to the Class!");
    }
    if(typeof this.constructor.parse !== "function"){
      throw new ReferenceError("Please define parse method to the Class!");
    }
  }
  toString(){
    return this.constructor.stringify(this);
  }
}

class Person extends Serializable{
  constructor(name, age, gender){
    super();
    Object.assign(this, {name, age, gender});
  }
}

class Employee extends Person{
  constructor(name, age, gender, level, salary){
    super(name, age, gender);
    this.level = level;
    this.salary = salary;
  }
  static stringify(employee){
    let {name, age, gender, level, salary} = employee;
    return JSON.stringify({name, age, gender, level, salary});
  }
  static parse(str){
    let {name, age, gender, level, salary} = JSON.parse(str);
    return new Employee(name, age, gender, level, salary);
  }
}

let employee = new Employee("jane",25,"f",1,1000);
let employee2 = Employee.parse(employee+""); //通过序列化反序列化复制对象

console.log(employee2, 
  employee2 instanceof Employee,  //true 
  employee2 instanceof Person,  //true
  employee == employee2);   //false
```
上面的代码，我们用 ES6 的类继承实现了 Serializable，与 ES5 的实现相比，它非常简单，首先我们设计了一个 `Serializable` 类：


```js
class Serializable{
  constructor(){
  
    // 检查当前实例的类上是否有定义 stringify 
    if(typeof this.constructor.stringify !== "function"){
      throw new ReferenceError("Please define stringify method to the Class!");
    }
    if(typeof this.constructor.parse !== "function"){
      throw new ReferenceError("Please define parse method to the Class!");
    }
  }
  toString(){
    return this.constructor.stringify(this);
  }
}
```
它检查当前实例的类上是否有定义 stringify 和 parse 静态方法，如果有，使用静态方法重写 toString 方法，如果没有，则在实例化对象的时候抛出一个异常。

这么设计挺好的，但它也有不足之处，首先注意到我们将 stringify 和 parse 定义到 Employee 上，这没有什么问题，但是如果我们实例化 Person，它将报错：


```
let person = new Person("john", 22, "m");
//Uncaught ReferenceError: Please define stringify method to the Class!
```

==这是因为我们没有在 Person 上定义 parse 和 stringify 方法==。new Person会先调用父类构造函数。

因为 Serializable 是一个基类，在只支持单继承的 ES6 中，如果我们不需要 Person 可序列化，只需要 Person 的子类 Employee 可序列化，靠这种继承链是做不到的。

另外，如何用 Serializable 让 JS 原生类的子类（比如 Set、Map）可序列化？

所以，我们需要考虑改变一下我们的设计模式：


```JS
const Serializable = Sup => class extends Sup {
  constructor(...args){
  
    super(...args); // super
    
    if(typeof this.constructor.stringify !== "function"){
      throw new ReferenceError("Please define stringify method to the Class!");
    }
    if(typeof this.constructor.parse !== "function"){
      throw new ReferenceError("Please define parse method to the Class!");
    }
  }
  toString(){
    return this.constructor.stringify(this);
  }
}

class Person {
  constructor(name, age, gender){
    Object.assign(this, {name, age, gender});
  }
}

class Employee extends Serializable(Person){
  constructor(name, age, gender, level, salary){
    super(name, age, gender);
    this.level = level;
    this.salary = salary;
  }
  static stringify(employee){
    let {name, age, gender, level, salary} = employee;
    return JSON.stringify({name, age, gender, level, salary});
  }
  static parse(str){
    let {name, age, gender, level, salary} = JSON.parse(str);
    return new Employee(name, age, gender, level, salary);
  }
}

let employee = new Employee("jane",25,"f",1,1000);
let employee2 = Employee.parse(employee+""); //通过序列化反序列化复制对象

console.log(employee2, 
  employee2 instanceof Employee,  //true 
  employee2 instanceof Person,  //true
  employee == employee2);   //false
```
在上面的代码里，我们改变了 `Serializable`，让它成为一个动态返回类型的函数，然后我们通过 `class Employ extends Serializable(Person)` 来实现可序列化，在这里我们没有可序列化`Person` 本身，而将 Serializable 在语义上变成一种修饰，即 Employee 是一种可序列化的 Person。

于是，我们要 new Person 就不会报错了：


```js
let person = new Person("john", 22, "m"); 
//Person {name: "john", age: 22, gender: "m"}
```

这么做了之后，我们还可以实现对原生类的继承，例如：

### 继承原生的 Set 类
```js
const Serializable = Sup => class extends Sup {
  constructor(...args){
    super(...args);
    if(typeof this.constructor.stringify !== "function"){
      throw new ReferenceError("Please define stringify method to the Class!");
    }
    if(typeof this.constructor.parse !== "function"){
      throw new ReferenceError("Please define parse method to the Class!");
    }
  }
  toString(){
    return this.constructor.stringify(this);
  }
}

class MySet extends Serializable(Set){
  static stringify(s){
    return JSON.stringify([...s]);
  }
  static parse(data){
    return new MySet(JSON.parse(data));
  }
}

let s1 = new MySet([1,2,3,4]);
let s2 = MySet.parse(s1 + "");
console.log(s2,         //Set{1,2,3,4}
            s1 == s2);  //false
```

通过 MySet 继承 Serializable(Set)，我们得到了一个可序列化的 Set 类！同样我们还可以实现可序列化的 Map：

```js
class MyMap extends Serializable(Map){
    ...
    static stringify(map){
        ...
    }
    static parse(str){
        ...
    }
}
```

如果不用 mixin 模式而使用继承，我们就得分别定义不同的类来对应 Set 和 Map 的继承，而用了 mixin 模式，我们构造出了通用的 Serializable，它可以用来“修饰”任何对象。


我们还可以定义其他的“修饰符”，然后将它们组合使用，比如：


```js
const Serializable = Sup => class extends Sup {
  constructor(...args){
    super(...args);
    if(typeof this.constructor.stringify !== "function"){
      throw new ReferenceError("Please define stringify method to the Class!");
    }
    if(typeof this.constructor.parse !== "function"){
      throw new ReferenceError("Please define parse method to the Class!");
    }
  }
  toString(){
    return this.constructor.stringify(this);
  }
}

const Immutable = Sup => class extends Sup {
  constructor(...args){
    super(...args);
    Object.freeze(this);
  }
}

class MyArray extends Immutable(Serializable(Array)){
  static stringify(arr){
    return JSON.stringify({Immutable:arr});
  }
  static parse(data){
    return new MyArray(...JSON.parse(data).Immutable);
  }
}

let arr1 = new MyArray(1,2,3,4);
let arr2 = MyArray.parse(arr1 + "");
console.log(arr1, arr2, 
    arr1+"",     //{"Immutable":[1,2,3,4]}
    arr1 == arr2);

arr1.push(5); //throw Error!
```

上面的例子里，我们通过 Immutable 修饰符定义了一个不可变数组，同时通过 Serializable 修饰符修改了它的序列化存储方式，而这一切，通过定义 class MyArray extends Immutable(Serializable(Array)) 来实现。

总结
我们看到了 ES6 的 mixin 式继承的优雅和灵活，相信大家对它强大的功能和非常漂亮的装饰器语义有了比较深刻的印象，在设计我们的程序模型的时候，我们可以开始使用它，因为我们有 Babel，以及 webpack 这样的工具能将它编译打包成 ES5，所以 ES6 早已不是什么虚无缥缈的东西。

记住 mixin 式继承的基本形式：


```js
const decorator = Sup => class extends Sup {
    ...
}

class MyClass extends decorator(SuperClass) {

}
```

最后，除了使用类的 mixin 式继承之外，我们依然可以继续使用普通对象的 mixin，而且我们有了 ES6 的新方法 Obejct.assign，它是用来实对象 mixin 的原生方法。

原文：
[类的装饰器：ES6 中优雅的 mixin 式继承](https://www.h5jun.com/post/mixin-in-es6.html)