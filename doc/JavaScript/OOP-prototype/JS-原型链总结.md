
## __ proto__和prototype
```js
function Foo(y){
    this.y=y;
}

Foo.prototype.x=10;

Foo.prototype.calculate=function(z){
    console.log(this.x+this.y+z);
}

// new干了三件事
var b=new Foo(20);
var c=new Foo(30);

b.calculate(30);
c.calculate(40)


b.__proto__==Foo.prototype,//true
c.__proto__==Foo.prototype,//true

b.constructor==Foo,//true
c.constructor==Foo,//true

Foo.prototype.constructor===Foo,                //true

b.calculate === b.__proto__.calcluate,          //true
b.__proto__.calculate==Foo.prototype.calculate //true

//给b添加一个新的方法 c是无法访问的
b.increment=function(){
    console.log(1)
}

//b实例中有了calculate方法就不会沿着原型链向上查找
b.calculate=function(){
    console.log("覆盖了原型对象中的方法")
}

```

1. new干了三件事 var b=new Foo(20)

```js
var b={}
b.__proto__=Foo.prototype
Foo.call(b)
```
 
    
1. 实例的 __ proto__ 指向构造函数的prototype  如 b.__ proto__==Foo.prototype
2. 实例的 constructor 指向构造函数  如 b.constructor==Foo
3. 实例的中的方法 先从自身成员属性查找再到 原型中__proto__去查找 如果没有再到原型对象中查找 如：  
    b.calculate === b.__proto__.calcluate  
    b.__proto__.calculate==Foo.prototype.calculate

4. prototype对象有一个constructor属性，默认指向prototype对象所在的构造函数            Foo.prototype.constructor===Foo,  


## __proto__属性：指向该对象原型链的上一端

```
console.log((Object.prototype).__proto__);              // null
console.log((Function.prototype).__proto__);            // Object {}
console.log(Object.__proto__);                          // function()
console.log(Function.__proto__);                        // function()

console.log(String.__proto__);                        // function()
// function对象Company的prototype属性所指的对象处于实例对象的原型链上
var Company = function(name){
    this.name = name;
};
var c1 = new Company("IBM");
var c2 = new Company("Alibaba");
console.log(c1.__proto__ == Company.prototype); // true
console.log(c2.__proto__ == Company.prototype); // true
```



## prototype属性：

1. 一般只有function对象拥有  

2. 内置对象也有  Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String, Map, Set, WeakMap , WeakSet



```js
onsole.log((new Object).prototype);                     // undefined
console.log([].prototype);                              // undefined
console.log((new Function).prototype);                  // anonymous {}

                                                        // Function, Object, Array是function对象
console.log(Function.prototype);                        // function()
console.log(Object.prototype);                          // Object {}
console.log(Array.prototype);                           // []
console.log(String.prototype);                          //String
console.log(Number.prototype);                          //NumberString

// 2) __proto__属性：指向该对象原型链的上一端
console.log((Object.prototype).__proto__);              // null
console.log((Function.prototype).__proto__);            // Object {}
console.log(Object.__proto__);                          // function()
console.log(Function.__proto__);                        // function()

console.log(String.__proto__);                        // function()
// function对象Company的prototype属性所指的对象处于实例对象的原型链上
var Company = function(name){
    this.name = name;
};
var c1 = new Company("IBM");
var c2 = new Company("Alibaba");
console.log(c1.__proto__ == Company.prototype); // true
console.log(c2.__proto__ == Company.prototype); // true


// 原型链的顶端
console.log((Object.prototype).__proto__);                                      // null
console.log(Function.prototype.__proto__ == Object.prototype);                  // true
console.log(Object.__proto__            == Function.prototype);                 // true
console.log(Function.__proto__          == Function.prototype);                 // true
console.log(Array.__proto__             == Function.prototype);                 // true
console.log(Company.__proto__           == Function.prototype);                 // true
console.log(Object.__proto__            == Function.prototype);                 // true
console.log(Company.prototype.__proto__ == Object.prototype);                   // true
console.log(c1.__proto__                == Company.prototype);                  // true
console.log("----------------")
console.log(Function.__proto__===Object.__proto__)
console.log(Function.__proto__)
console.log(Object.__proto__)

console.log(Function.prototype)

console.log(Array.prototype)

var o={}

console.log(Object.prototype) //Object
console.log((Object.prototype).__proto__);   null
```
```js
function Animal(){

  }
  var  anim = new Animal();

  console.log('***********Animal anim proto*****************');
  console.log('typeof Animal.prototype:' +typeof Animal.prototype);  //object
  console.log('anim.__proto__===Animal.prototype:'+(anim.__proto__===Animal.prototype));  //true
  console.log('Animal.__proto__===Function.prototype:'+(Animal.__proto__===Function.prototype));  //true
  console.log('Animal.prototype.__proto__===Object.prototype:'+(Animal.prototype.__proto__===Object.prototype));  //true

  console.log('***********Function proto*****************');
  console.log('typeof Function.prototype:'+typeof Function.prototype);  //function
  console.log('typeof Function.__proto__:'+typeof Function.__proto__);  //function
  console.log('typeof Function.prototype.prototype:'+typeof Function.prototype.prototype); //undefined
  console.log('typeof Function.prototype.__proto__:'+typeof Function.prototype.__proto__);   //object
  console.log('Function.prototype===Function.__proto__:'+(Function.prototype===Function.__proto__)); //true

  console.log('***********Object proto*****************');
  console.log('typeof Object.prototype:'+typeof Object.prototype);  //object
  console.log('typeof Object.__proto__:'+typeof Object.__proto__);  //function
  console.log('Object.prototype.prototype:'+Object.prototype.prototype);  //undefied
  console.log('Object.prototype.__proto__===null:'+(Object.prototype.__proto__===null));  //null

  console.log('***********Function Object  proto关系*****************');
  console.log('Function.prototype===Object.__proto__:'+(Function.prototype===Object.__proto__));   //true
  console.log('Function.__proto__===Object.__proto__:'+(Function.__proto__===Object.__proto__));   //true
  console.log('Function.prototype.__proto__===Object.prototype:'+(Function.prototype.__proto__===Object.prototype));   //true

  /********************* 系统定义的对象Array、Date ****************************/
  console.log('**************test Array、Date****************');
  var array = new Array();
  var date = new Date();
  console.log('array.__proto__===Array.prototype:'+(array.__proto__===Array.prototype));   //true
  console.log('Array.__proto__===Function.prototype:'+(Array.__proto__===Function.prototype));  //true
  console.log('date.__proto__===Date.prototype:'+(date.__proto__===Date.prototype));    //true
  console.log('Date.__proto__===Function.prototype:'+(Date.__proto__===Function.prototype));     //true
```
