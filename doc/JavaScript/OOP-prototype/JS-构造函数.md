了解元属性 - newTarget
从ECMAScript 2015（又名ES6）深入挖掘新目标 - “new.target”

该 `new.target`属性使您可以查==找是否使用new运算符调用了函数或构造函数==，还有助于查找被调用的构造函数。

在用new运算符实例化的构造函数和函数中，new.target返回对构造函数或函数的引用。

在正常的函数调用中，即没有new运算符，new.target是undefined。


```js
function Animal(type) {
    if(!new.target){
        throw new Error('Animal() must be called with new.');
    }
    this.type = type;  
}
```



```js
function Parent(){
    console.log('Value of newTarget in Parent', new.target); //undefined
    console.log('Is Target Parent?', new.target===Parent); //false
}

function Child(){
    console.log('Value of newTarget in Child', new.target); //function Child
    Parent.apply(this,arguments);
    console.log('Is Target Child?', new.target===Child);//true
}

Child.prototype = Object.create(Parent);
Child.prototype.constructor = Child;

var child = new Child();
```



考虑ES6类的情况

```js
class Parent {
    constructor() {
        // implicit (from the `super` call)
        // new.target = Child;
        // implicit (because `Parent` doesn't extend anything):
        // this = Object.create(new.target.prototype);
        console.log(new.target) // Child!
    }
}
class Child extends Parent {
    constructor() {
        // implicit (from the `new` call):
        // new.target = Child
        super();
        console.log(this);
    }
}
let child = new Child();
```



```js
class A {
    constructor() {
        console.log(new.target.name);
    }
}

class B extends A { constructor() { super(); } }

var a = new A(); // logs "A"
var b = new B(); // logs "B"

class C { constructor() { console.log(new.target); } }
class D extends C { constructor() { super(); } }

var c = new C(); // logs class C{constructor(){console.log(new.target);}}
var d = new D(); // logs class D extends C{constructor(){super();}}
```
