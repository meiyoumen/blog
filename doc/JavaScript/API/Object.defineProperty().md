[TOC]
# 概述
JavaScript 提供了一个内部数据结构，用来描述对象的属性，控制它的行为，比如该属性是否可写、可遍历等等。这个内部数据结构称为“属性描述对象”（attributes object）。每个属性都有自己对应的属性描述对象，保存该属性的一些元信息。

下面是属性描述对象的一个例子。

```js
{
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false,
  get: undefined,
  set: undefined
}
```


## Object.defineProperty() 
方法会直接==在一个对象==上==定义==一个==新属性==，或者==修改==一个对象的==现有属性==，== 并返回这个对象==。
`Object.defineProperty` 方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的对象，它的用法如下。

### 语法节
```
Object.defineProperty(obj, prop, descriptor)
```

### 参数节
- obj：       必需，需要被定义（或修改）属性的那个对象
- prop：      必需，需要被定义（或修改）的属性名
- descriptor：必需，定义（或修改）的属性prop的描述

### 返回值节
- 被传递给函数的对象。

### 描述
- 该方法允许精确添加或修改对象的属性。  
- 通过赋值操作添加的普通属性是可枚举的，能够在属性枚举期间呈现出来（for...in 或 Object.keys 方法）， 这些属性的值可以被改变，也可以被删除。
- 这个方法允许修改默认的额外选项（或配置）。
- ==默认情况下，使用 Object.defineProperty() 添加的属性值是不可修改的==。


### 属性描述符
对象里目前存在的属性描述符有两种主要形式：==数据描述符和存取描述符==。
- 数据描述符是一个具有值的属性，该值可能是可写的，也可能不是可写的。
- 存取描述符是由 ==`getter-setter` 函数对描述的属性==。

==描述符必须是这两种形式之一；不能同时是两者。==

数据描述符和存取描述符均具有以下可选键值(默认值是在使用Object.defineProperty()定义属性的情况下)：

#### 数据描述符
##### configurable (是否可以修改)
当且仅当该属性的 ==configurable== 为 ==true== 时，该属性描述符==才能够被改变==，同时该属性也能从对应的对象上被删除。==默认为 false==

==这个属性起到两个作用：==
- 目标属性是否可以使用delete删除
- 目标属性是否可以再次设置特性

configurable(可配置性）返回一个布尔值，决定了是否可以修改属性描述对象。也就是说，configurable为false时，value、writable、enumerable和configurable都不能被修改了。
==这个比较狠！！！==
```js
var obj = Object.defineProperty({}, 'p', {
  value: 1,
  writable: false,
  enumerable: false,
  configurable: false
});

Object.defineProperty(obj, 'p', {value: 2})
// TypeError: Cannot redefine property: p

Object.defineProperty(obj, 'p', {writable: true})
// TypeError: Cannot redefine property: p

Object.defineProperty(obj, 'p', {enumerable: true})
// TypeError: Cannot redefine property: p

Object.defineProperty(obj, 'p', {configurable: true})
// TypeError: Cannot redefine property: p
```

上面代码中，obj.p的configurable为false。然后，改动value、writable、enumerable、configurable，结果都报错。

==注意，writable只有在false改为true会报错，true改为false是允许的。==

至于value，只要writable和configurable有一个为true，就允许改动。


```js
var o1 = Object.defineProperty({}, 'p', {
  value: 1,
  writable: true,
  configurable: false
});

Object.defineProperty(o1, 'p', {value: 2})
// 修改成功

var o2 = Object.defineProperty({}, 'p', {
  value: 1,
  writable: false,
  configurable: true
});

Object.defineProperty(o2, 'p', {value: 2})
// 修改成功
```

另外，configurable为false时，直接目标属性赋值，不报错，但不会成功。


```js
var obj = Object.defineProperty({}, 'p', {
  value: 1,
  configurable: false
});

obj.p = 2;
obj.p // 1
```


上面代码中，obj.p的configurable为false，对obj.p赋值是不会生效的。如果是严格模式，还会报错。

可配置性决定了目标属性是否可以被删除（delete）。

```js
var obj = Object.defineProperties({}, {
  p1: { value: 1, configurable: true },
  p2: { value: 2, configurable: false }
});

delete obj.p1 // true
delete obj.p2 // false

obj.p1 // undefined
obj.p2 // 2
```

上面代码中，
- `obj.p1` 的`configurable`是`true`，所以可以被删除。
- `obj.p2`就无法删除。

##### enumerable (是否可以枚举)
当且仅当该属性的 ==enumerable== 为==true==时，该属性才能够出现在对象的==枚举属性==中。==默认为 false==

enumerable（可遍历性）返回一个布尔值，表示目标属性是否可遍历。

JavaScript 的早期版本，for...in循环是基于in运算符的。我们知道，in运算符不管某个属性是对象自身的还是继承的，都会返回true。

```js
var obj = {};
'toString' in obj // true
```
上面代码中，==`toString`不是`obj`对象自身的属性，但是in运算符也返回true，这导致了toString属性也会被for...in循环遍历==

这显然不太合理，后来就引入了“可遍历性”这个概念。只有可遍历的属性，才会被for...in循环遍历，同时还规定toString这一类实例对象继承的原生属性，都是不可遍历的，这样就保证了for...in循环的可用性。

具体来说，==如果一个属性的enumerable为false==，下面三个操作==不会取到该属性==。
```js
for..in循环
Object.keys方法
JSON.stringify方法
```




##### value
value属性是目标属性的值，==默认为 undefined==
```js
var obj = {};
obj.p = 123;

Object.getOwnPropertyDescriptor(obj, 'p').value
// 123

Object.defineProperty(obj, 'p', { value: 246 });
obj.p // 246
```


##### writable
当且仅当该属性的 ==writable== 为 ==true== 时，==value才能被赋值运算符改变==。==默认为 false==

```js
var obj = {};

Object.defineProperty(obj, 'a', {
  value: 37,
  writable: false
});

obj.a // 37
obj.a = 25;
obj.a // 37
```
上面代码中，obj.a的writable属性是false。然后，改变obj.a的值，不会有任何效果。

#### 存取描述符同时具有以下可选键值：


除了直接定义以外，属性还可以用存取器（accessor）定义。其中:
- 存值函数称为setter，使用属性描述对象的set属性；
- 取值函数称为getter，使用属性描述对象的get属性。

一旦对目标属性定义了存取器，那么存取的时候，都将执行对应的函数。利用这个功能，可以实现许多高级特性，比如某个属性禁止赋值。

```js
var obj = Object.defineProperty({}, 'p', {
  get: function () {
    return 'getter';
  },
  set: function (value) {
    console.log('setter: ' + value);
  }
});

obj.p       // "getter"
obj.p = 123 // "setter: 123"
```

上面代码中，`obj.p` 定义了==get和set属性==。obj.p取值时，就会调用get；赋值时，就会调用set。

JavaScript 还提供了存取器的另一种写法。
```js
let obj = {
  get p() {
    return 'getter'
  },
  set p(value) {
    console.log('setter: ' + value)
  }
}
```

上面的写法与定义属性描述对象是等价的，而且使用更广泛。

注意，取值函数get不能接受参数，存值函数set只能接受一个参数（即属性的值）。

==存取器往往用于，属性的值依赖对象内部数据的场合==。

```js
var obj ={
  $n : 5,
  get next() { return this.$n++ },
  set next(n) {
    if (n >= this.$n) this.$n = n;
    else throw new Error('新的值必须大于当前值');
  }
};

obj.next // 5

obj.next = 10;
obj.next // 10

obj.next = 5;
// Uncaught Error: 新的值必须大于当前值
```
上面代码中，next属性的存值函数和取值函数，都依赖于内部属性$n。


```js
let person = {};
let n = 'gjf';
Object.defineProperty(person, 'name', { 
    configurable: true,  
    enumerable: true, 
    get() {    
        //当获取值的时候触发的函数    
        return n  
    },  
    set(val) {    
        //当设置值的时候触发的函数,设置的新值通过参数val拿到    
        n = val;  
    }
});
console.log(person.name) //gjf
person.name = 'newGjf'
console.log(person.name) //newGif
```




##### get
- 一个给属性提供 ==getter== 的方法，如果==没有 getter== ==则为undefined==
- ==当访问该属性时，该方法会被执行，==方法执行时没有参数传入==，但是会传入this对象==（由于继承关系，这里的this并不一定是定义该属性的对象）。默认为 undefined。

##### set
- 一个给属性提供 ==setter== 的方法，==如果没有 setter 则为 undefined==
- ==当属性值修改时，触发执行该方法==。该方法==将接受唯一参数==，即==该属性新==的==参数值==。默认为 undefined。

#### 数据描述符 & 存取描述符 默认值
属性名         |                 默认值 
---|---
value          |     undefined 
get            |     undefined 
set            |     undefined 
writable       |     false 
enumerable     |     false 
configurable   |     false


#### 查看默认属性 Object.getOwnPropertyDescriptor()
使用 getOwnPropertyDescriptor 可以查看对象属性描述。

- ==声明一个对象时，`configurable` , `enumerable` , `writable`  默认值为true==

```js
let obj = {city: 'SH'}
Object.getOwnPropertyDescriptor(obj, 'city')
    {value: "SH", writable: true, enumerable: true, configurable: true}
        configurable: true
        enumerable: true
        value: "SH"
        writable: true
        __proto__: Object
```

- ==使用defineProperty定义属性时，`configurable` , `enumerable` , `writable`  默认值为false==

```js
let myObj = Object.defineProperty({}, 'city', {value: 'SZ'})

myObj
    {city: "SZ"}
        city: "SZ"
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
            
            
Object.getOwnPropertyDescriptor(myObj, 'city')

{value: "SZ", writable: false, enumerable: false, configurable: false}
    configurable: false
    enumerable: false
    value: "SZ"
    writable: false
    __proto__: Object
```

## 实际运用


看个最简单的vue例子，只是数据和dom节点的绑定

```html
<div>
    <p>你好，<span id='nickName'></span></p>
    <div id="introduce"></div>
</div>　　
```

```js
//视图控制器
var userInfo = {};

Object.defineProperty(userInfo, "nickName", {
    get: function(){
        return document.getElementById('nickName').innerHTML;
    },
    set: function(nick){
        document.getElementById('nickName').innerHTML = nick;
    }
});
Object.defineProperty(userInfo, "introduce", {
    get: function(){
        return document.getElementById('introduce').innerHTML;
    },
    set: function(introduce){
        document.getElementById('introduce').innerHTML = introduce;
    }
})

userInfo.nickName = "xxx";
userInfo.introduce = "我是xxx，我来自上海，..."
```


如在Express4.0中，该版本去除了一些旧版本的中间件。
为了让用户能够更好地发现，其有下面这段代码，通过修改==get属性方法==，让用户调用废弃属性时抛错并带上自定义的错误信息。
```js
[
  'json',
  'urlencoded',
  'bodyParser',
  'compress',
  'cookieSession',
  'session',
  'logger',
  'cookieParser',
  'favicon',
  'responseTime',
  'errorHandler',
  'timeout',
  'methodOverride',
  'vhost',
  'csrf',
  'directory',
  'limit',
  'multipart',
  'staticCache',
].forEach(function (name) {
  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
    },
    configurable: true
  })
})
```


## 参考
- https://javascript.ruanyifeng.com/stdlib/attributes.html#toc0
- https://javascript.ruanyifeng.com/oop/object.html#toc2