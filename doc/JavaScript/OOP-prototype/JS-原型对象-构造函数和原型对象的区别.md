[TOC]
# 构造函数
## 简单介绍
所谓构造函数，就是提供了一个生成对象的模板并描述对象的基本结构的函数。  
一个构造函数，可以生成多个对象，每个对象都有相同的结构。  
总的来说，构造函数就是对象的模板，对象就是构造函数的实例。

构造函数的特点有：
- 构造函数的函数名首字母必须大写
- 内部使用this对象，来指向将要生成的对象实例
- 使用new操作符来调用构造函数，并返回对象实例

例子。
```js
function Person(){
    this.name = 'keith';
}
var boy = new Person()
console.log(boy.name)    //' keith'
```

## 构造函数的缺点
所有的实例对象都可以==继承构造函数中的属性和方法==。  
但是，同一个对象实例之间，无法共享构造函数中的属性和方法。

```js
function Person(name,height){
    this.name=name;
    this.height=height;
    this.hobby=function(){
        return 'watching movies';
    }
}

var boy  = new Person('keith',180)
var girl = new Person('rascal',153)
console.log(boy.name);              // 'keith'
console.log(girl.name);             // 'rascal'
console.log(boy.hobby===girl.hobby) //false
```
一个构造函数`Person`生成了两个对象实例`boy`和`girl`，并且有两个属性和一个方法。

但是，它们的`hobby`方法是不一样的。

也就是说，每当你==使用new来调用构造函数==返回一个对象实例的时候，==都会创建一个hobby方法==。

这既没有必要，又浪费资源，因为所有hobby方法都是童颜的行为，完全可以被两个对象实例共享。

所以，构造函数的缺点就是：==同一个构造函数的对象实例之间无法共享属性或方法==。


# prototype属性的作用
为了解决==构造函数的对象实例之间无法共享属性的缺点==，js提供了`prototype`属性。

js中每个数据类型都是对象（除了null和undefined），
- 每个对象都继承自另外一个对象，后者称为`“原型”（prototype）对象`，
- 只有null除外，它没有自己的原型对象。
- 原型对象上的所有属性和方法，都会被对象实例所共享
- 通过构造函数生成对象实例时，会将对象实例的原型指向构造函数的prototype属性。每一个构造函数都有一个prototype属性，这个属性就是对象实例的原型对象。
　

```js
function Person(name,height){
    this.name=name;
    this.height=height;
}

Person.prototype.hobby=function(){
    return 'watching movies';
}

var boy=new Person('keith',180);
var girl=new Person('rascal',153);

console.log(boy.name);                // 'keith'
console.log(girl.name);               // 'rascal'
console.log(boy.hobby===girl.hobby);  // true
```

上面代码中，如果将`hobby`方法放在原型对象上，那么两个实例对象都共享着同一个方法。

- 对于构造函数来说，`prototype`是作为==构造函数的属性==；
- 对于对象实例来说，prototype是对象实例的原型对象。所以prototype即是属性，又是对象。
- 原型对象的属性不是对象实例的属性。对象实例的属性是继承自构造函数定义的属性，因为构造函数内部有一个this关键字来指向将要生成的对象实例。
- 对象实例的属性，其实就是构造函数内部定义的属性。只要修改原型对象上的属性和方法，变动就会立刻体现在所有对象实例上。

```js
Person.prototype.hobby=function(){
    return 'swimming';
}
console.log(boy.hobby===girl.hobby);  //true
console.log(boy.hobby());    //'swimming'
console.log(girl.hobby());    //'swimming'
```
上面代码中
- 当修改了原型对象的`hobby`方法之后，两个对象实例都发生了变化。  
这是因为对象实例其实是没有hobby方法，都是读取原型对象的hobby方法。
- 当某个对象实例没有该属性和方法时，就会到原型对象上去查找。  
- ==如果实例对象自身有某个属性或方法，就不会去原型对象上查找==。

  
```js
boy.hobby=function(){
 return 'play basketball';
}
console.log(boy.hobby());      // 'play basketball'
console.log(girl.hobby());     //'swimming'
```
上面代码中:
- `boy`对象实例的`hobby`方法修改时，==就不会在继承原型对象上的hobby方法了==。  
- girl仍然会继承原型对象的方法。

## 总结一下：
1. 原型对象的作用，就是定义所有对象实例所共享的属性和方法。
2. prototype，对于构造函数来说，它是一个属性；对于对象实例来说，它是一个原型对象。

## 4.原型链（prototype chains）
==原型链就是依托\_\_proto\_\_和prototype连接起来的一个原型链条。==


对象的属性和方法，有可能是定义在自身，也有可能是定义在它的原型对象。  

由于原型对象本身对于对象实例来说也是对象，它也有自己的原型，所以形成了一条原型链（prototype chain）。

比如，a对象是b对象的原型，b对象是c对象的原型，以此类推。

所有一切的对象的原型顶端，都是Object.prototype，即Object构造函数的prototype属性指向的那个对象。


当然，Object.prototype对象也有自己的原型对象，那就是没有任何属性和方法的null对象，而null对象没有自己的原型。

```js
console.log(Object.getPrototypeOf(Object.prototype));   //null
console.log(Person.prototype.isPrototypeOf(boy))         //true
```


###  原型链prototype chain 的特点有：
- 读取对象的某个属性时，JavaScript引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，如果还是找不到，就到原型的原型去找。如果直到最顶层的Object.prototype还是找不到，则返回undefined。

- 如果对象自身和它的原型，都定义了一个同名属性，那么优先读取对象自身的属性，这叫做“覆盖”（overiding）。

- 一级级向上在原型链寻找某个属性，对性能是有影响的。所寻找的属性在越上层的原型对象，对性能的影响越大。如果寻找某个不存在的属性，将会遍历整个原型链。

看一个例子，理解了概念真的很重要。
```js
var arr=[1,2,3];
console.log(arr.length);      //3
console.log(arr.valueOf())    // [1,2,3]
console.log(arr.join('|'))    // 1|2|3
```
上面代码中，定了一个数组`arr`，数组里面有三个元素。

我们并没有给数组添加任何属性和方法，可是却在调用length，join()，valueOf()时，却不会报错。

- `length`属性是继承自`Array.prototype`的，属于原型对象上的一个属性。
- `join`方法也是继承自`Array.prototype`的，属于原型对象上的一个方法。
- 这两个方法是所有数组所共享的。当实例对象上没有这个`length`属性时，就会去原型对象查找。
- `valueOf`方法是继承自`Object.prototype`的。首先，`arr`数组是没有`valueOf`方法的，所以就到原型对象`Array.prototype`查找。然后，发现`Array.prototype`对象上没有`valueOf`方法。最后，再到它的原型对象`Object.prototype`查找。

来看看Array.prototype对象和Object.prototype对象分别有什么属性和方法。
　　
```js
console.log(Object.getOwnPropertyNames(Array.prototype))

["length", "toSource", "toString", "toLocaleString", 
"join", "reverse", "sort", "push", "pop", "shift", "unshift", "splice",
"concat", "slice", "lastIndexOf","indexOf", "forEach", "map", "filter", 
"reduce", "reduceRight", "some", "every", "find", "findIndex", "copyWithin",
"fill", "entries", "keys", "values", "includes", "constructor", "$set", "$remove"]

console.log(Object.getOwnPropertyNames(Object.prototype))

 ["toSource", "toString", "toLocaleString", "valueOf", "watch", "unwatch", 
 "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "__defineGetter__",
 "__defineSetter__", "__lookupGetter__", "__lookupSetter__", "__proto__", "constructor"]
```
打印结果里: `Object.prototype`有`valueOf`方法


## 5.constructor属性
prototype对象有一个constructor属性，默认指向prototype对象所在的构造函数。
```js
function A(){};
console.log(A.prototype.constructor===A)    //true
```
要注意的是，`prototype`是构造函数的属性，而constructor则是==构造函数的prototype属性所指向的那个对象==，也就是原型对象的属性。注意不要混淆。
```js
console.log(A.hasOwnProperty('prototype'))              // true
console.log(A.prototype.hasOwnProperty('constructor'))  // true
```
由于constructor属性是定义在原型（prototype）对象上面，意味着可以被所有实例对象继承。

```js
function A(){};
 var a=new A();
 console.log(a.constructor);                          //A()
 console.log(a.constructor===A.prototype.constructor) //true
```

上面代码中，==a是构造函数A的实例对象==，==但是a自身没有contructor属性，该属性其实是读取原型链上面的A.prototype.constructor属性==。

### constructor属性的作用

#### 1.分辨原型对象到底属于哪个构造函数
```js
function A(){};
var a=new A();
console.log(a.constructor===A)          //true
console.log(a.constructor===Array)    //false
```
上面代码表示，使用constructor属性，确定实例对象a的构造函数是A，而不是Array。

#### 2.从实例新建另一个实例
```js
function A() {};
var a = new A();
var b = new a.constructor();
console.log(b instanceof A);    //true
```
上面代码中，a是构造函数A的实例对象，可以从a.constructor间接调用构造函数。

#### 3.调用自身的构造函数成为可能
```js
A.prototype.hello = function() {
 return new this.constructor();
}
```

#### 4.提供了一种从构造函数继承另外一种构造函数的模式
```js
function Father() {}

function Son() {
 Son.height.constructor.call(this) // Son继承Father的效果
}

Son.height = new Father();
```
上面代码中，`Father`和`Son`都是构造函数，在`Son`内部的this上调用`Father`，就会形成Son继承Father的效果。

#### 5. 由于constructor属性是一种原型对象和构造函数的关系，所以在修改原型对象的时候，一定要注意constructor的指向问题。
解决方法有两种
- 要么将constructor属性指向原来的构造函数
- 要么只在原型对象上添加属性和方法，避免instanceof失真。


### 6.instanceof运算符
instanceof运算符返回一个布尔值，表示指定对象是否为某个构造函数的实例。
```js
function A() {};
var a = new A();
console.log(a instanceof A);    //true
```

因为instanceof对整个原型链上的对象都有效，所以同一个实例对象，可能会对多个构造函数都返回true。
```js
function A() {};
 var a = new A();
 console.log(a instanceof A);         //true
 console.log(a instanceof Object)   //true
```

注意，instanceof对象只能用于复杂数据类型（数组，对象等），==不能用于简单数据类型（布尔值，数字，字符串等）==。
```js
var x = [1];
var o = {};
var b = true;
var c = 'string';
console.log(x instanceof Array);      // true
console.log(o instanceof Object);     // true

console.log(b instanceof Boolean);    // false
console.log(c instanceof String);     // false
```

此外，null和undefined都不是对象，所以instanceof 总是返回false。
```js
console.log(null instanceof Object)         // false
console.log(undefined instanceof Object);   // false
```

利用instanceof运算符，还可以巧妙地解决，调用构造函数时，忘了加new命令的问题。

```js
function Keith(name,height) {
 if (! this instanceof Keith) {
     return new Keith(name,height);
 }
 this.name = name;
 this.height = height;
 }
```
上面代码中，使用了`instanceof`运算符来判断函数体内的this关键字是否指向构造函数Keith的实例，如果不是，就表明忘记加new命令，此时构造函数会返回一个对象实例，避免出现意想不到的结果。


## 总结
==原型链就是依托\_\_proto\_\_和prototype连接起来的一个原型链条。==
```js
function test() {}

  test.prototype.name = 'A'
  test.prototype.showName = function () {
    console.log(this.name)
  }

  function B() {
  }

  // 原型继承
  B.prototype = new test()  //B.prototype被重写,导致B.prototype.constructor也一同被重写
  B.prototype.sayHi = function () {
    console.log('hi, ' + this.name)
  }

  let t = new test()
  let b = new B()

  console.log(1, t.__proto__)             //  {name: "A",showName: ƒ (), constructor: ƒ test(), __proto__: Objec}
  //
  console.log(2, t.__proto__.showName())  // A
  console.log(3, t.prototype)             // undefined 说明只有Function才会有原型对象 prototype
  console.log(5, test.prototype)          // {name: "A", showName: ƒ, constructor: ƒ}

  // ==原型链就是依托\_\_proto\_\_和prototype连接起来的一个原型链条。==
  // 原型链 查找 b.showName ，先到自身原型上查找，没有找到，沿着源型链往上查找到test.prototype，找到showName
  console.log(test.prototype.__proto__ === Object.prototype) // true
  console.log(B.prototype.__proto__ === test.prototype)      // true
  console.log(Object.prototype.__proto__)                     // null
  console.log(B.prototype.__proto__) // {name: "A" showName: ƒ () constructor: ƒ test() __proto__: Object}

  console.log(4, test)                                       // ƒ test() {}
  console.log(6, test.prototype.constructor)                 // ƒ test() {}
  console.log(7, test.prototype.constructor === test) // true

  console.log(8, t.constructor === test) // true
  console.log(9, t.constructor.prototype === test.prototype) // true
  console.log(10, t.__proto__.constructor === test)    // true
```


# Object和Object.prototype

## Object和Object.prototype的区别
个人认为，要学好javascript的其中一个方法就是，必须理解每一个" . "所代表的意思是什么，是调用自身的属性和方法呢，还是继承原型的对象的属性和方法。

来看看Object构造函数和构造函数的原型Object.prototype都有哪些属性和方法。  

`Object`是==构造函数==，而==Object.prototype==是==构造函数的原型对象====。  
- 构造函数自身的属性和方法==无法被共享==
- 原型对象的属性和方法可以==被所有实例对象所共享==。

### Object属性和方法
Object类调用，静态属性和方法
```js
Object.assign({}, 1)
Object.create(null)

```
object.prototype.constructor
![image](https://note.youdao.com/yws/public/resource/73ff5428ea13380ab61fc60a73ef7caa/xmlnote/32E2641B7684464F97D3D85FBC0E9852/19131)

### Object.prototype 属性和方法
![image](http://note.youdao.com/yws/public/resource/3051618508415837c12f78cabbdf1c30/xmlnote/5C5514D2F45F41038B86163C89601BE0/2592)

![image](https://note.youdao.com/yws/public/resource/73ff5428ea13380ab61fc60a73ef7caa/xmlnote/70861CD8E9D14E6DBE1FD45A66046361/19135)

- Object拥有自己的方法`prototype`，`getPrototypeOf()`，`setPrototypeOf()`, `assign()`, `create()`，这些方法无法被实例所共享
- 而`Object.prototypeOf()`的`hasOwnProperty()`，`isPrototypeOf()`，`constructor`等属性和方法是可以被实例对象所共享的。

举一个最简单的例子:
```js
function Keith() {}
let a = new Keith()
console.log(a.prototype)   // undefined
console.log(a.constructor) // Keith()
```
上面代码中，构造函数Keith是没有任何属性和方法的。
- 当访问prototype属性时返回undefined，是因为prototype属性没有办法从构造函数中继承，只能由构造函数本身访问。
- constructor返回了Keith()，因为constructor属性本身就是Object.prototype中的属性，可以被所有实例对象所共享。

那么问题来了，如何知道实例对象的原型呢？可以通过Object.isPrototypeOf方法和继承原型对象的isPrototypeOf方法实现。
　　
```js
console.log(a.__proto__ === Keith.prototype)
console.log(Keith.prototype.isPrototypeOf(a))               //true
console.log(Object.getPrototypeOf(a) === Keith.prototype)   //true
```

### 2.Object.getPrototypeOf()
```js
// 空对象的原型是Object.prototype
console.log(Object.getPrototypeOf({}) === Object.prototype) // true

// 函数的原型Function.prototype
function keith() {}
console.log(Object.getPrototypeOf(keith) === Function.prototype)     //true

// 数组的原型Array.prototype
var arr = [1,2,3];
console.log(Object.getPrototypeOf(arr) === Array.prototype) ///true
```

### 3.Object.setPrototypeOf()
Object.setPrototypeOf方法可以为现有对象==设置原型==，然后返回一个新对象。  
这个可以接收两个参数，第一个是现有对象，第二个是原型对象。

```js
var keith = {
    height: 180
}
var rascal = Object.setPrototypeOf({}, keith);
console.log(rascal.height)   //180

//上下两个代码片段相同。
var keith = {
    height: 180
};
var rascal ={
    __proto__: keith
};
console.log(rascal.height);    //180
```

上面代码中，rascal对象是Object.setPrototypeOf方法返回的一个新对象。  
该对象本身为空、原型为keith对象，所以rascal对象可以拿到keith对象的所有属性和方法。

rascal对象本身并没有height属性，但是JavaScript引擎找到它的原型对象keith，然后读取keith的height属性。

### 4.Object.create()
Object.create方法用于从原型对象生成新的对象实例，可以代替new命令。
它接受一个参数，这个参数为所要继承的原型对象，然后返回一个实例对象。
```js
var Keith = {
    hobby : function() {
        return 'Watching Movies';
    }
};

var rascal = Object.create(Keith.prototype);
console.log(rascal.hobby())    //'Watching Movies'
```
上面代码中，Object.create方法将Keith对象作为rascal的原型对象，此时rascal就继承了Keith对象中的所有属性和方法。
rascal就成为了Keith对象的实例对象。

用下面这段代码比较好理解。
```js
function Keith() {};
Keith.prototype.hobby = function() {
    return 'Watching Movies';
}

var rascal = Object.create(Keith);
console.log(rascal.hobby())    //'Watching Movies';
```
new操作符和Object.create方法都是返回一个对象实例，但是两者有一些区别。

```js
function Keith() {}
var a = new Keith();
var b = Object.create(Keith.prototype);

console.log(a instanceof Keith);    //true
console.log(b instanceof Keith);    //true
```

上面代码中:
- 可以使用new操作符来调用构造函数，返回对象实例；
- 而Object.create传入的参数必须是==构造函数Keith的原型==。

### 注意：
```js
function Keith() {}
Keith.prototype.name ='A'
var a = new Keith();
var b = Object.create(Keith.prototype)
var c = Object.create(Keith)
console.log(a.name) // 'A'
console.log(b.name) // 'A'
console.log(c.name) // 'Keith'

console.log(a instanceof Keith) // true
console.log(b instanceof Keith) // true
console.log(c instanceof Keith) // Uncaught TypeError: b.showName is not a function
```

实际上，如果有老式浏览器不支持Object.create方法，可以用下面这段代码来构造一个Object.create方法。
```js
if (typeof Object.create !=='function') {
    Object.create = function(x) {
        function F() {};
        F.prototype = x;
        return new F();
    };
}
```

下面这三种方式生成的实例对象都是等价的。

```js
var o1 = Object.create({});
var o2 = Object.create(Object.prototype);
var o2 = new Object();
```

在使用Object.create方法时，要注意的是必须传入原型对象，否则会报错。

```
var o1 = Object.create();
console.log(o1);//TypeError: Object.create requires more than 0 arguments
```

Object.create方法生成的对象实例，动态继承了原型对象。也就是说，修改原型对象的属性和方法会反应在对象实例上。


```
var keith = {
    height:180
};

var rascal = Object.create(keith);
keith.height=153;
console.log(rascal.height)    //153
```

上面代码中，修改原型对象，会影响生成的对象实例。

Object.create方法生成的对象，继承了它的原型对象的构造函数。


```
function Keith() {};
var boy = new Keith();
var girl = Object.create(boy);
console.log(Object.getPrototypeOf(girl) === boy); //true
console.log(girl.constructor === Keith);    //true
console.log(girl instanceof Keith);    //true
```
上面代码中，girl对象的原型是boy对象，girl对象的constructor属性指向了原型对象boy的构造函数Keith。

 

## 5.Object.prototype.isPrototypeOf()

对象实例的isPrototypeOf方法，用于判断一个对象对象是否是另外一个对象的原型。


```
var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

console.log(o1.isPrototypeOf(o2)); //true
console.log(o2.isPrototypeOf(o3)); //true
console.log(o1.isPrototypeOf(o3)); //truesole.log(o1.isPrototypeOf(o3)); //true
```


　　上面代码中，可以看出，只要某个对象处于原型链上，isPrototypeOf都返回true。


```
function Keith() {};

 console.log(Function.prototype.isPrototypeOf(Keith));    //true
 console.log(Object.prototype.isPrototypeOf(Function));    //true
 console.log(Object.getPrototypeOf(Object.prototype) === null); //true
```

　　上面代码中，构造函数Keith的原型指向了Function.prototype，而构造函数Function的原型指向了Object.prototype。Object的原型指向了没有任何属性和方法的null对象。

 

6.Object.prototype.__proto__

　　__proto__属性（前后两条下划线）可以改写某个对象的原型对象。这个属于实例方法。


```
var keith = {};
var rascal = {};
rascal.__proto__ = keith;
console.log(keith.isPrototypeOf(rascal));    //true
```

上面代码中，通过rascal对象的__proto__属性，将rascal的原型指向了keith对象。

　　__proto__属性只有浏览器才需要部署，其他环境可以没有这个属性，而且前后的两根下划线，表示它本质是一个内部属性，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用Object.getPrototypeof()（读取）和Object.setPrototypeOf()（设置），进行原型对象的读写操作。


来做一个小小的总结，上面对一些属性和方法的介绍都可以归结为一句话：

构造函数本身的属性无法被对象实例共享，而原型对象上的属性和方法可以被所用对象实例所共享。