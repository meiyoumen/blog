[TOC]

# 一 数据类型
JavaScript 中共有9种内置数据类型，数据类型可以分为原始类型以及引用类型。
- string
- number
- boolean
- null
- undefined
- symbol


- function
- object
- array

注意以上都是小写

### 原始类型(基本类型)

基本类型分为以下六种：

- string（字符串）
- boolean（布尔值）
- number（数字）
- null（空值）
- undefined（未定义）
- symbol（符号）

注意：
1. `string` , `boolean` ,`number` ,`null` ,`undefined` 这五种类型统称为==原始类型==（Primitive），==表示不能再细分==下去的基本类型;

2. `symbol`是ES6中新增的数据类型，symbol 表示==独一无二的值==，通过 Symbol 函数调用生成，由于生成的 symbol 值为原始类型，所以 ==Symbol 函数不能使用new 调用==；

3. null 和 undefined 通常被认为是特殊值，这两种类型的值唯一，就是其本身。

### 引用类型
- array
- function
- object

对象类型也叫==引用类型==，`array`和`function`是对象的子类型。对象在逻辑上是属性的无序集合，是存放各种值的容器。

==对象值存储的是引用地址==，所以和基本类型值不可变的特性不同，==对象值是可变的==。

### 包装类型
为了便于操作基本类型值，ECMAScript还提供了几个特殊的引用类型，他们==是基本类型的包装类型==：
- Boolean
- Number
- String
注意包装类型和原始类型的区别（使用了new操作符）：

```js
true === new Boolean(true);                 // false
123 === new Number(123);                    // false
'ConardLi' === new String('ConardLi');      // false

typeof new Number(123)          // object
typeof new String('ConardLi')   // object
typeof 'ConardLi'               // string
```
#### 主要区别：
1. 对象的生存期==，使用new操作符创建的引用类型的实例==，在执行流离开当前作用域之前都一直保存在内存中；
2. 基本类型则只存在于==一行代码==的==执行瞬间==，然后==立即被销毁==，这意味着我们不能在运行时为基本类型添加属性和方法。

```js
var name = 'ConardLi'
name.color = 'red';         // 执行后销毁
console.log(name.color);    // undefined
```
#### 装箱和拆箱
- 装箱转换：把基本类型转换为对应的包装类型
- 拆箱操作：把引用类型转换为基本类型

按上例，原始类型==不能扩展属性和方法==，那么我们是如何使用原始类型调用方法的呢？
```js
var name = "ConardLi";
var name2 = name.substring(2);
```
实际上发生了以下几个过程：
1. 创建一个String的包装类型实例
1. 在实例上调用substring方法
1. 销毁实例

使用基本类型调用方法，就会==自动进行装箱和拆箱操作==，相同的，我们使用Number和Boolean类型时，也会发生这个过程。

从引用类型到基本类型的转换，也就是拆箱的过程中，会遵循ECMAScript规范规定的toPrimitive原则，一般会调用引用类型的==valueOf==和==toString==方法，你也可以直接重写toPeimitive方法。

一般转换成不同类型的值遵循的原则不同，例如：
1. 引用类型转换为Number类型，先调用valueOf，再调用toString
2. 引用类型转换为String类型，先调用toString，再调用valueOf
3. 若valueOf和toString都不存在，或者没有返回基本类型，则抛出TypeError异常。


```js
const obj = {
  valueOf: () => { console.log('valueOf'); return 123; },
  toString: () => { console.log('toString'); return 'ConardLi'; },
}

console.log(obj - 1);           // valueOf   122
console.log(`${obj}ConardLi`);  // toString  ConardLiConardLi

const obj2 = {
  [Symbol.toPrimitive]: () => { console.log('toPrimitive'); return 123; },
};
console.log(obj2 - 1);   // valueOf   122

const obj3 = {
  valueOf: () => { console.log('valueOf'); return {}; },
  toString: () => { console.log('toString'); return {}; },
};
console.log(obj3 - 1);  
// valueOf  
// toString
// TypeError
```

除了程序中的自动拆箱和自动装箱，我们还可以手动进行拆箱和装箱操作。
我们可以直接调用包装类型的valueOf或toString，实现拆箱操作：

```js
var num =new Number("123");  
console.log( typeof num.valueOf() );  // number
console.log( typeof num.toString() ); // string
```

## 数据类型检测

```js
typeof 123;               // "number"
typeof "hfhan";           // "string"
typeof true;              // "boolean"
typeof null;              // "object"  独一份的与众不同
typeof undefined;         // "undefined"
typeof Symbol("hfhan");   // "symbol"
typeof function(){};      // "function"
typeof {};                // "object"
```

```js
/**
 * @desc 是否是 Undefined 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isUndefined(obj) {
    return obj === void 0;
}
/**
 * @desc 是否是 Null 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isNull(obj) {
    return obj === null;
}
/**
 * @desc 是否是 Boolean 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isBoolean(obj) {
    return typeof(obj) === 'boolean';
}
/**
 * @desc 是否是 Number 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isNumber(obj) {
    return typeof(obj) === 'number';
}
/**
 * @desc 是否是 String 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isString(obj) {
    return typeof(obj) === 'string';
}
/**
 * @desc 是否是 Object 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * @desc 是否是 Array 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isArray(obj){
    return Array.isArray?Array.isArray(obj):Object.prototype.toString.call(obj) === '[object Array]';
}
/**
 * @desc 是否是 Function 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isFunction(obj){
    return typeof(obj) === 'function';
}
/**
 * @desc 是否是 Date 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isDate(obj){
    return Object.prototype.toString.call(obj) === '[object Date]';
}
/**
 * @desc 是否是 RegExp 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isRegExp(obj){
    return Object.prototype.toString.call(obj) === '[object RegExp]';
}
/**
 * @desc 是否是 Error 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isError(obj){
    return Object.prototype.toString.call(obj) === '[object Error]';
}
/**
 * @desc 是否是 Arguments 类型检测
 * @param obj 待检测的数据
 * @return {Boolean} 布尔值
 */
function isArguments(obj){
    return Object.prototype.toString.call(obj) === '[object Arguments]';
}

```

## typeof运算符和instanceof运算符的区别
### typeof运算符
1. 用于判断原始类型
2. 语法结构不同——typeof 变量名称
3. 得到结果不同——原始类型的名称(小写)

### instanceof运算符
1. 用于判断引用类型(包装类型)
2. 语法结构不同——变量名称 instanceof 引用类型名称
3. 得到结果不同——布尔类型的值(true或false)
4. 在 MDN 上是这样描述 instanceof 的：
instanceof 运算符用于==测试构造函数的 prototype 属性是否出现在对象原型链中的任何位置==。
其实思路也很简单，无非就是一个沿原型链向上查找的过程

```js
var num = 100;
var boo = true;
var str = 'wuwenjia';

console.log(typeof num); // number  字面量声明
console.log(typeof boo); // boolean
console.log(typeof str); // string



var str = new String('wuwenjia');
var num = new Number(100);
var boo = new Boolean(true);

// typeof运算符只能判断原始类型
console.log(typeof str);  // object 因为new了，所以是object，也说明了typeof 并不以有完全判断类型
console.log(typeof num);  // object
console.log(typeof boo);  // object

// instanceof运算符用于判断引用类型(包装类型)
console.log(str instanceof String);// true
```

### Object.prototype.toString
==Object.prototype.toString== 最终会返回形式如 ==[object Class]== 的字符串，==Class== 指代的是其检测出的数据类型，这个是我们判断数据类型的关键。
```js
var num = new Number(100);          // num值是100，是一个Number类型
typeof num                          // "object"
Object.prototype.toString.call(num) // "[object Number]"
```

利用Object.prototype.toString精确判断类型
```js
Object.prototype.toString.call({})              // '[object Object]'
Object.prototype.toString.call([])              // '[object Array]'
Object.prototype.toString.call(() => {})        // '[object Function]'
Object.prototype.toString.call('seymoe')        // '[object String]'
Object.prototype.toString.call(1)               // '[object Number]'
Object.prototype.toString.call(true)            // '[object Boolean]'
Object.prototype.toString.call(Symbol())        // '[object Symbol]'
Object.prototype.toString.call(null)            // '[object Null]'
Object.prototype.toString.call(undefined)       // '[object Undefined]'

Object.prototype.toString.call(arg)             // '[object Arguments]'
Object.prototype.toString.call(new Error)       // '[object Error]'
Object.prototype.toString.call(/\./)            // '[object RegExp]'    
Object.prototype.toString.call(new Date())      // '[object Date]'
Object.prototype.toString.call(Math)            // '[object Math]'
Object.prototype.toString.call(new Set())       // '[object Set]'
Object.prototype.toString.call(new WeakSet())   // '[object WeakSet]'
Object.prototype.toString.call(new Map())       // '[object Map]'
Object.prototype.toString.call(new WeakMap())   // '[object WeakMap]'


```
![image](https://user-gold-cdn.xitu.io/2019/5/28/16afa4ee855cfa98?imageslim)

#### 封装成函数
可以通过以下方式封装成一个函数，语义更加清晰


```js
export function typeOf (param) {
  return Object.prototype.toString.call(param).match(/\s+(\w+)/)[1] //正则匹配
}

// Vue中可以定义成全局函数
//main.js
Vue.prototype.typeof = function (param) {
  return Object.prototype.toString.call(param).match(/\s+(\w+)/)[1]
}

// 组件中调用
this.typeof([])//Array

let class2type = {}
  let tpyes = "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " )
  tpyes.forEach((name, i) => {
    class2type[`[object ${name}]`] = name.toLowerCase()
  })

  function type (obj) {
    if (obj === null) {
      return obj + ''
    }
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[ Object.prototype.toString.call(obj)] || 'object' : typeof obj
  }

  function isFunction(obj) {
    return type(obj) === 'function'
  }

  console.log(type([]))
  console.log(type(function () {}))
  console.log(type("aaaaa"))
  console.log(type(123))
  console.log(type()) // undefined
```


## 类型转换

### if语句和逻辑语句
在if语句和逻辑语句中，如果只有单个变量，会先将变量转换为Boolean值，只有下面几种情况会转换成==false==，其余被转换成true：
```js
null
undefined
''
NaN
0
false
```

### 各种运数学算符
我们在对各种非Number类型运用数学运算符(- * /)时，会先将非Number类型转换为Number类型;

```js
1 - true        // 0  1-1
1 - null        // 1  1-0
1 * undefined   // NaN
2 * ['5'] //    10
```

注意==+==是个例外，执行==+==操作符时：

1. 当一侧为String类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型。
2. 当一侧为Number类型，另一侧为原始类型，则将原始类型转换为Number类型。
3. 当一侧为Number类型，另一侧为引用类型，将引用类型和Number类型转换成字符串后拼接。


```js
123 + '123'  // 123123   （规则1）
123 + null   // 123      （规则2）
123 + true   // 124      （规则2）
123 + {}     // 123[object Object]    （规则3）
```

### ==
1. 类型相同，使用\=\=时，则比较结果和===相同
2. 类型不同，发生隐式转换，使用==时发生的转换可以分为几种不同的情况（只考虑两侧类型不同）：

#### 1.NaN
NaN和其他任何类型比较永远返回false(包括和他自己)。
```js
NaN == NaN // false
```

#### 2.Boolean
Boolean和其他任何类型比较，==Boolean首先被转换为Number类型==。
```js
true == 1  // true 
true == '2'  // false
true == ['1']  // true
true == ['2']  // false
```
>这里注意一个可能会弄混的点：undefined、null和Boolean比较，虽然undefined、null和false都很容易被想象成假值，但是他们比较结果是false，原因是false首先被转换成0：

```js
undefined == false // false
null == false // false
```

#### 3.String和Number
String和Number比较，先将==String转换为Number类型==。
```js
123 == '123' // true
'' == 0 // true

+'45'       // 45
+new Date   // 1565865930527
```
#### 4.null和undefined

```js
undefined == undefined // true
null == undefined      // 比较结果是true，除此之外，null、undefined和其他任何结果的比较值  都为false。
null == undefined      // true
null == ''             // false
null == 0              // false
null == false          // false
undefined == ''        // false
undefined == 0         // false
undefined == false     // f  alse
```

#### 5.原始类型和引用类型

当原始类型和引用类型做比较时，对象类型会依照ToPrimitive规则转换为原始类型:

```js
'[object Object]' == {} // true
'1,2,3' == [1, 2, 3]    // true
```
看看下面这个比较：

```js
[] == ![] // true
```
==!的优先级高于====，==![]==首先会被转换为==false==，然后根据上面第二点，false转换成Number类型0，左侧==[]转换为0==，两侧比较相等。

```js
[null] == false         // true
[undefined] == false    // true
```
根据数组的ToPrimitive规则，==数组元素为null或undefined时==，该元素被当做==空字符串==处理，所以==[null]、[undefined]==都会被转换为==0==。
所以，说了这么多，推荐使用===来判断两个值是否相等...

### 一道有意思的面试题
一道经典的面试题，如何让：
```
a == 1 && a == 2 && a == 3
b===1 && b===2 && b===3
```
根据上面的拆箱转换，以及==的隐式转换，我们可以轻松写出答案：
#### 宽等于
```js
const a = {
   value:[3,2,1],
   valueOf: function () {return this.value.pop(); },
}

const a = {
i: 1,
valueOf: function () {
  return a.i++;
}
}
console.log(a == 1 && a == 2 && a == 3)
```
- 分析
1. a == 1 ， 1 是基本类型, JS引擎会尝试将 a 转换成 Number 类型
2. a.valueOf 被调用并且返回1(自增1并且返回自己)。
3. 在 a==2 和 a==3 发生了同样的类型转换并增加自己的值。

#### 严格等于
严格等于 valueOf/toString 将不会被JS引擎调用
```
var value = 0 // window.value
Object.defineProperty(window, 'b', {
    get: function() {
      return this.value += 1;
    }
});

console.log(b===1 && b===2 && b===3) // true
```
#### Array.prototype.toString 函数
在每个元素上调用 toString 并返回一个字符串，所有的输出用逗号分隔。
```js
const arr = [
  {},
  2,
  3
]

arr.toString() // "[object Object],2,3"
```
[1] + [2] – [3] === 9
我希望所有这些知识能帮助你揭开本文标题中问题的神秘面纱。让我们揭开它吧！

```js
[1] + [2]           // 这些转换应用 Array.prototype.toString 规则然后连接字符串。结果将是 "12" 。
[1,2] + [3,4]       // 结果是 "1,23,4" 。
12 - [3]            // 将导致 12 减 "3" 得 9
12 - [3,4]          // 因为 "3,4" 不能转成数字所以得 NaN
```


### 隐式类型转换
### 显示式类型转换

### 类型转换的区别：
#### 隐式类型转换
- 优点 - 性能好
- 缺点 - 可读性差

#### 显式类型转换
- 优点 - 可读性高
- 缺点 - 性能差

#### 参考：
- https://juejin.im/post/582a7adb8ac2470061881ee7#heading-6
- https://juejin.im/post/5cec1bcff265da1b8f1aa08f#heading-5
- https://juejin.im/post/5cec1bcff265da1b8f1aa08f
- https://juejin.im/post/5d030e03518825361817032f