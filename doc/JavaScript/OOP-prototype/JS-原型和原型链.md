## 私有变量和函数
在函数内部定义的变量和函数，如果不对外提供接口，外部是无法访问到的，也就是该函数的私有的变量和函数。

```js
function Box(){
    var color = "blue";//私有变量
    var fn = function() //私有函数
    {
        
    }
}
```

这样在函数对象Box外部无法访问变量color和fn，==他们就变成私有的了==：


```js
var obj = new Box();
    alert(obj.color);   //弹出 undefined
    alert(obj.fn);      //同上
```
如果想访问到怎么办？ 在函数后面添加return 返回 这样访问就会输出 blue, fn=function(){}

```js
    return{
        color:color,
        fn:fn
    }
```



## 静态变量和函数
当定义一个函数后通过点号“==.==”为其添加的属性和函数，通过对象本身仍然可以访问得到，==但是其实例却访问不到==，这样的变量和函数分别被称==为静态变量==和==静态函数==。


```js
function Obj(){};

Obj.num = 72;//静态变量
Obj.fn = function()  //静态函数
{
    
}  

alert(Obj.num);//72
alert(typeof Obj.fn)//function

//实例访问
var t = new Obj();
alert(t.name);//undefined
alert(typeof t.fn);//undefined
```


## 实例变量和函数
在面向对象编程中除了一些库函数我们还是希望在对象定义的时候同时定义一些属性和方法，实例化后可以访问，js也能做到这样


```js
function Box(){
    this.a=[]; //实例变量
    this.fn=function(){ //实例方法
        
    }
}

console.log(typeof Box.a); //undefined
console.log(typeof Box.fn); //undefined

var box=new Box();
console.log(typeof box.a); //object
console.log(typeof box.fn); //function
```

为实例变量和方法添加新的方法和属性

```js
function Box(){
    this.a=[]; //实例变量
    this.fn=function(){ //实例方法
        
    }
}

var box1=new Box();

box1.a.push(1);
box1.fn={};

console.log(box1.a); //[1]
console.log(typeof box1.fn); //object

var box2=new Box();
console.log(box2.a); //[]
console.log(typeof box2.fn); //function
```

==在box1中修改了a和fn，而在box2中没有改变，由于数组和函数都是对象，是引用类型，这就说明box1中的属性和方法与box2中的属性与方法虽然同名但却不是一个引用，而是对Box对象定义的属性和方法的一个复制==

这个对属性来说没有什么问题，但是对于方法来说问题就很大了，因为方法都是在做完全一样的功能，但是却又两份复制，如果一个函数对象有上千和实例方法，那么它的每个实例都要保持一份上千个方法的复制，这显然是不科学的，这可肿么办呢？  
==prototype==应运而生。


## 基本概念

我们创建的每个函数都有一个prototype属性，这个属性是一个指针，指向一个对象，这个对象的用途是包含==可以由特定类型的所有实例共享的属性和方法==。那么，==prototype就是通过调用构造函数而创建的那个对象实例的原型对象==。

使用原型的好处是可以让对象实例共享它所包含的属性和方法。也就是说，不必在构造函数中添加定义对象信息，而是可以直接将这些信息添加到原型中。使用构造函数的主要问题就是每个方法都要在每个实例中创建一遍。

在JavaScript中,一共有两种类型的值,原始值和对象值。每个对象都有一个内部属性 prototype ,我们通常称之为原型。原型的值可以是一个对象,也可以是null。如果它的值是一个对象，则这个对象也一定有自己的原型。这样就形成了一条线性的链，我们称之为原型链。

### 含义
函数可以用来作为构造函数来使用。另外==只有函数才有prototype属性并且可以访问到，但是对象实例不具有该属性==，只有一个内部的不可访问的__proto__属性。__proto__是对象中一个指向相关原型的神秘链接。按照标准，__proto__是不对外公开的，也就是说是个私有属性，但是Firefox的引擎将他暴露了出来成为了一个共有的属性，我们可以对外访问和设置。


```js
var Browser = function(){};
Browser.prototype.run = function(){
    alert("I'm Gecko,a kernel of firefox￼");
}

var Bro = new Browser();
Bro.run();
```
当我们调用Bro.run()方法时，==由于Bro中没有这个方法，所以，他就会去他的__proto__中去找，也就是Browser.prototype，所以最终执行了该run()方法==。（在这里，函数首字母大写的都代表构造函数，以用来区分普通函数）

==当调用构造函数创建一个实例的时候，实例内部将包含一个内部指针（__proto__）指向构造函数的prototype==，这个连接存在于实例和==构造函数的prototype==之间，而不是实例与构造函数之间。


```js
function Person(name){               //构造函数
    this.name=name;
}

Person.prototype.printName=function() //原型对象
{
    alert(this.name);
}

var person1=new Person('Byron');//实例化对象

console.log(person1.__proto__=== Person.prototype); //true  实例和构造函数的prototype
console.log(person1.constructor); //构造函数
console.log(Person.prototype);    //指向原型对象Person

 var person2=new Person('Frank');

```
Person的实例person1中包含了name属性，同时自动生成一个__proto__属性，该属性指向Person的prototype，可以访问到prototype内定义的printName方法，大概就是这个样子的:

![image](http://note.youdao.com/yws/public/resource/f063c3257d1eff57c9d293a7ebd0a3df/xmlnote/1AC53684CC36473B8F0138CC67FD9B63/2127)

==每个JavaScript函数都有prototype属性==，这个属性引用了一个对象，这个对象就是原型对象。原型对象初始化的时候是空的，我们可以在里面自定义任何属性和方法，这些方法和属性都将被该构造函数所创建的对象继承。

那么，现在问题来了。构造函数、实例和原型对象三者之间有什么关系呢？


## 构造函数、实例和原型对象的区别
==实例就是通过构造函数创建的。实例一创造出来就具有constructor属性（指向构造函数）和__proto__属性（指向原型对象），构造函数中有一个prototype属性，这个属性是一个指针，指向它的原型对象。==

原型对象内部也有一个指针（constructor属性）指向构造函数: Person.prototype.constructor = Person;

实例可以访问原型对象上定义的属性和方法。

在这里person1和person2就是实例，prototype是他们的原型对象。

再举个栗子：


```js
function Animal(name)   //基类构造函数
{
    this.name = name;//设置对象属性
}

Animal.prototype.behavior = function() //给基类构造函数的prototype添加behavior方法   原型对象上添加behavior
{  
    alert("this is a "+this.name);
}

var Dog = new Animal("dog");//创建Dog对象 
var Cat = new Animal("cat");//创建Cat对象

Dog.behavior();//通过Dog对象直接调用behavior方法
Cat.behavior();//output "this is a cat"

alert(Dog.behavior==Cat.behavior);//output true;
```
可以从程序运行结果看出，构造函数的prototype上定义的方法确实可以通过对象直接调用到，而且代码是共享的。（可以试一下将Animal.prototype.behavior 中的prototype属性去掉，看看还能不能运行。）在这里，prototype属性指向Animal对象。


## 数组对象实例

```js
var arr=[1,2,3]
console.log(arr)
```

![image](http://note.youdao.com/yws/public/resource/3051618508415837c12f78cabbdf1c30/xmlnote/40F974D481594DC2ABC9B8058AEF7DAE/2219)

观察上图可以看到 arr.__proto__指向Array.prototype。Array.prototype.__proto__指向最顶端Object



```
arr.push(4);
```

push这个方法来自于array1的__proto__成员指向对象的一个方法(==Array.prototye.push()==)。正是因为所有的数组对象（通过[]来创建的）都包含有一个指向同一个具有push,reverse等方法对象(Array.prototype)的__proto__成员，才使得这些数组对象可以使用push,reverse等方法。

## 函数对象实例

function Base() {  
    this.id = "base" 
}   

![image](http://note.youdao.com/yws/public/resource/3051618508415837c12f78cabbdf1c30/xmlnote/0E1C884B20F94A4FAC8C894991804C0A/2238)


```
var obj = new Base();
```

这样代码的结果是什么，我们在Javascript引擎中看到的对象模型是：
![image](http://note.youdao.com/yws/public/resource/3051618508415837c12f78cabbdf1c30/xmlnote/8BFA19B00513499F9B8F8B0919024757/2241)

new操作符具体干了什么呢?其实很简单，就干了三件事情。


```js
var obj  = {};  
obj.__proto__ = Base.prototype;  
Base.call(obj);
```

## 原型链

**原型链**：当从一个对象那里调取属性或方法时，如果该对象自身不存在这样的属性或方法，就会去自己关联的prototype对象那里寻找，如果prototype没有，就会去prototype关联的前辈prototype那里寻找，如果再没有则继续查找Prototype.Prototype引用的对象，依次类推，直到Prototype.….Prototype为undefined（Object的Prototype就是undefined）从而形成了所谓的“原型链”。



```js
function Shape(){
    this.name = "shape";
    this.toString = function(){
        return this.name;
    }
}
function TwoShape(){
    this.name = "2 shape";
}
function Triangle(side,height){
    this.name = "Triangle";
    this.side = side;
    this.height = height;
    this.getArea = function(){
        return this.side*this.height/2;
    }
}

TwoShape.prototype = new Shape();
Triangle.prototype = new TwoShape();
```
这里，用构造器Shape()新建了一个实体，然后用它去覆盖该对象的原型。

```js
function Shape(){
        this.name = "shape";
        this.toString = function(){
            return this.name;
        }
    }
    function TwoShape(){
        this.name = "2 shape";
    }
    function Triangle(side,height){
        this.name = "Triangle";
        this.side = side;
        this.height = height;
        this.getArea = function(){
            return this.side*this.height/2;
        }
    }
    
    TwoShape.prototype = new Shape();
    Triangle.prototype = new TwoShape();
    
    TwoShape.prototype.constructor = TwoShape;
    Triangle.prototype.constructor = Triangle;
    
    var my = new Triangle(5,10);
    my.getArea();
    my.toString();//Triangle
    my.constructor;//Triangle(side,height)
```

## 原型继承

原型继承：
在原型链的末端，就是Object构造函数prototype属性指向的那个原型对象。这个原型对象是所有对象的祖先，这个老祖宗实现了诸如toString等所有对象天生就该具有的方法。其他内置构造函数，如Function，Boolean，String，Date和RegExp等的prototype都是从这个老祖宗传承下来的，但他们各自又定义了自身的属性和方法，从而他们的子孙就表现出各自宗族的那些特征。

ECMAScript中，实现继承的方法就是依靠原型链实现的。



```
function Father(){             //被继承的函数叫做超类型（父类，基类）
    this.name = "Jack";
}

function Son(){          //继承的函数叫做子类型（子类，派生类）
    this.age = 10;
}
//通过原型链继承，赋值给子类型的原型属性
//new Father()会将father构造里的信息和原型里的信息都交给Son

Son.prototype = new Father();//Son继承了Father,通过原型，形成链条

var son = new Son();
alert(son.name);//弹出 Jack
```



原型链的问题：原型链虽然很强大，可以用它来实现继承，但它也存在一些问题。其中最主要的问题来自包含引用类型的值原型。包含引用类型的原型属性会被所有实例共享；而这也正是为什么要在构造函数中，而不是在原型对象中定义属性的原因。在通过原型来实现继承时，原型实际上回变成另一个类型的实例。于是，原先的实例属性也就变成了原型的属性。

在创建子类型的实例时，不能向超类型的构造函数中传递参数。实际上，应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。再加上刚刚讨论的由于原型中包含引用类型值所带来的问题，实践中很少会单独使用原型链。

再举个栗子：


```js
function Person(name)
    {
        this.name = name;//设置对象属性
    };
    
    Person.prototype.company = "Microsoft";//设置原型的属性
    Person.prototype.SayHello = function() //原型的方法
    {  
        alert("Hello,I'm "+ this.name+ " of " + this.company);
    };
    
    var BillGates = new Person("BillGates");//创建person对象
    BillGates.SayHello();//继承了原型的内容，输出"Hello,I'm BillGates of Microsoft"
    
    var Jobs = new Person("Jobs");
    Jobs.company = "Apple";//设置自己的company属性，掩盖了原型的company属性
    Jobs.SayHello = function()
    {
        alert("Hi,"+this.name + " like " + this.company);
    };
    Jobs.SayHello();//自己覆盖的属性和方法，输出"Hi,Jobs like Apple"
    BillGates.SayHello();//Jobs的覆盖没有影响原型，BillGates还是照样输出
```

## __ptoto__属性
__ptoto__属性（IE浏览器不支持）是实例指向原型对象的一个指针，它的作用就是指向构造函数的原型属性constructor，通过这两个属性，就可以访问原型里的属性和方法了。

Javascript中的对象实例本质上是由一系列的属性组成的，在这些属性中，有一个内部的不可见的特殊属性——__proto__，该属性的值指向该对象实例的原型，一个对象实例只拥有一个唯一的原型。


```js
function Box(){        //大写，代表构造函数
        Box.prototype.name = "trigkit4";//原型属性
        Box.prototype.age = "21";
        Box.prototype.run = function()//原型方法
        {  
            return this.name + this.age + 'studying';
        }
    }
    
    var box1 = new Box();
    var box2 = new Box();
    alert(box1.constructor);//构造属性，可以获取构造函数本身，
                            //作用是被原型指针定位，然后得到构造函数本身
```

__proto__属性和prototype属性的区别
prototype是function对象中专有的属性。 
__proto__是普通对象的隐式属性，在new的时候，会指向prototype所指的对象； 
__ptoto__实际上是某个实体对象的属性，而prototype则是属于构造函数的属性。__ptoto__只能在学习或调试的环境下使用。

## 原型模式的执行流程
1.先查找构造函数实例里的属性或方法，如果有，就立即返回。2.如果构造函数的实例没有，就去它的原型对象里找，如果有，就立即返回

### 原型对象的

```
function Box(){        //大写，代表构造函数
        Box.prototype.name = "trigkit4";//原型属性
        Box.prototype.age = "21";
        Box.prototype.run = function()//原型方法
        {  
            return this.name + this.age + 'studying';
        }
    }
    
    var box1 = new Box();
    alert(box1.name);//trigkit4,原型里的值
    box1.name = "Lee";
    alert(box1.name);//Lee,就进原则
    
    var box2 = new Box();
    alert(box2.name);//trigkit4,原型的值，没有被box1修改
```

### 构造函数的

```js
function Box(){                   
    this.name = "Bill";
}

Box.prototype.name = "trigkit4";//原型属性
Box.prototype.age = "21";
Box.prototype.run = function()//原型方法
{  
        return this.name + this.age + 'studying';
}

var box1 = new Box();
alert(box1.name);//Bill,原型里的值
box1.name = "Lee";
alert(box1.name);//Lee,就进原则
```

综上，整理一下：


```js
function Person(){};

Person.prototype.name = "trigkit4";
Person.prototype.say = function(){
    alert("￼Hi");
}

var p1 = new Person();//prototype是p1和p2的原型对象
var p2 = new Person();//p2为实例化对象，其内部有一个__proto__属性，指向Person的prototype

console.log(p1.prototype);//undefined,这个属性是一个对象，访问不到
console.log(Person.prototype);//Person
console.log(Person.prototype.constructor);//原型对象内部也有一个指针（constructor属性）指向构造函数
console.log(p1.__proto__);//这个属性是一个指针指向prototype原型对象
p1.say();//实例可以访问到在原型对象上定义的属性和方法

```

> - 构造函数.prototype = 原型对象
> - 原型对象.constructor = 构造函数(模板)
> - 原型对象.isPrototypeof(实例对象)   判断实例对象的原型 是不是当前对象

## 工厂模式

```
function createObject(name,age){
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    return obj;
}
```

工厂模式解决了实例化对象大量重复的问题，但还有一个问题，那就是根本无法搞清楚他们到底是哪个对象的实例。使用构造函数的方法，既解决了重复实例化的问题，又解决了对象识别的问题。

使用构造函数的方法和工厂模式的不同之处在于：

1. 构造函数方法没有显示的创建对象(new Object());
2. 直接将属性和方法赋值给this对象
3. 没有return 语句
 
当使用了构造函数，并且new 构造函数()，那么就在后台执行了new Object()；
函数体内的this代表了new Object()出来的对象

1. 判断属性是在构造函数的实例里，还是在原型里，可以使用`hasOwnProperty()`函数
2. 字面量创建的方式使用constructor属性不会指向实例，而会指向Object，构造函数创建的方式则相反
为什么指向Object？因为Box.prototype = {};这种写法其实就是创建了一个新对象。
而每创建一个函数，就会同时创建它的prototype，这个对象也会自动获取constructor属性
3. 如果是实例方法，不同的实例化，他们的方法地址是不一样的，是唯一的
4. 如果是原型方法，那么他们的地址的共享的


## 参考 
深入javascript——构造函数和原型对象
https://segmentfault.com/a/1190000000602050

Javascript中的对象和原型(三)
http://kb.cnblogs.com/page/144404/

JS原型对象通俗"唱法"
http://www.cnblogs.com/gnface/archive/2012/08/22/2651534.html


解读 JavaScript 构造函数和原型对象的区别
https://juejin.im/entry/58d36b4f570c350058c2742a

https://segmentfault.com/a/1190000000662547
