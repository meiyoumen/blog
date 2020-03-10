# 前言

## 原始类型：
在javascript中有三种主要的原始类型，数值、字符串、布尔值，当使typeof操作符时分别返回`number`、`string`、`boolean`，还有另外两个是`undefined`和`null`,其余类型都是对象类型。

## 包装对象：
可以把原始类型的值包装成对象，三种原始类型的包装对象分别为==Number==、==String==、==Boolean==，当使用==new Number()==创建一个数字时，typeof操作会==返回'object'==而非number。

而通过调用==数字对象的valueOf方法==可以返回该数字对象的==原始类型的值==。

由于包装对象的存在，==原始类型也可以调用包装对象上的方法和参==数，调用时JavaScrip引擎会自动将原始类型的值转为包装对象实例，调用结束立即销毁实例。

# 一、概述
javascript 中几乎所有类型都具有toString和valueOf属性。几乎所有的类型对象比如Number,String,Boolean,Array,Function,Object,Date,RegExp的原型对象上都有各自的toString或valueOf方法的实现,故它们的实例化的对象自然就继承了这两个方法。下面看一下这些类型的原型对象上是否有这两个方法的实现：
代码示例：

```js
Number.prototype.hasOwnProperty('toString');     // 输出true
Number.prototype.hasOwnProperty('valueOf');      // 输出true

String.prototype.hasOwnProperty('toString');     //输出true
String.prototype.hasOwnProperty('valueOf');      //输出true

Boolean.prototype.hasOwnProperty('toString');    // 输出true
Boolean.prototype.hasOwnProperty('valueOf');     // 输出true

Object.prototype.hasOwnProperty('toString');     // 输出true
Object.prototype.hasOwnProperty('valueOf');      // 输出true

Date.prototype.hasOwnProperty('toString');       // 输出true
Date.prototype.hasOwnProperty('valueOf');        // 输出true

Array.prototype.hasOwnProperty('toString');      // 输出true
Array.prototype.hasOwnProperty('valueOf');       // 输出false 

Function.prototype.hasOwnProperty('toString');   // 输出true
Function.prototype.hasOwnProperty('valueOf');    // 输出false

RegExp.prototype.hasOwnProperty('toString');     // 输出true
RegExp.prototype.hasOwnProperty('valueOf');      // 输出false
```
>说明：hasOwnProperty用于查看某个对象本身是否具有某属性，只在对象本身查找不在该对象的原型链上查找

上面代码中，只有==Array==,==Function==,==RegExp==的原型上没有valueOf属性。
但是为什么==其实例化对象能调用该方法呢==？  
我们都知道上面所有列举的类型的原型(prototype)都是继承于Object的原型(prototype)的，当Array,Function,RegExp的==实例化对象==找不到某个属性时会沿着原型链往上找，直到找到或给出undefined。
==其实例对象调用的是Object原型上的valueOf==

## 二、toString的作用
1. 将值转换为字符串形式并返回，不同类型的toString方法各有不同

类型  |   toString()的作用
---|---
Number  |    返回文本表示，可接收一个参数表示输出的进制数，默认为十进制，注意：10..toString()会把第一个.当作小数点
String  |    直接返回原字符串值
Boolean |   返回文本表示'true'或'false'
Object  |   返回[object 类型名]，Object类型调用该方法时返回[object Object]
Array  |   将数组元素转换为字符串，用逗号拼接并返回
Function  |   直接返回函数的文本声明
Date    |   返回日期的文本表示, eg:'Sat Apr 21 2018 16:07:37 GMT+0800 (中国标准时间)'
RegExp  |   返回文本格式为'/pattern/flag',其中pattern是正则表达式,flag是匹配模式：g:全局匹配、i:不分大小写、m:多行匹配；eg:'/\[bc\]at/g'


2.判断对象的类型

```JS
var a = new Object();
a.toString();                           //"[object Object]"
a.toString.call(a);                     //"[object Object]"
Object.prototype.toString.call(a);      //"[object Object]"
Object.prototype.toString.call(Object); //"[object Function]"
Object.prototype.toString.call(Object.prototype);   //"[object Object]"
```
上面提到Object.prototype.toString()可以返回"[object调用该方法的对象类型]",


```JS
Object.prototype.toString.call(1);                  // "[object Number]"
Object.prototype.toString.call('2');                // "[object String]"
Object.prototype.toString.call(true);               // "[object Boolean]"
Object.prototype.toString.call([]);                 // "[object Array]"
Object.prototype.toString.call(function(){});       // "[object Function]"
Object.prototype.toString.call(new Date());         // "[object Date]"
Object.prototype.toString.call(/^hello world$/);    // "[object RegExp]"
```

## 三、valueOf的作用

类型    |      valueOf()的作用
---|---
Number    |      返回原始类型的数字值
String    |      返回原始类型的字符串值
Boolean    |      返回原始类型的Boolean
Object    |      返回对象本身
Array    |      方法继承于Object.prototype,返回原数组
Function    |      方法继承于Object.prototype,返回函数本身
Date    |      方法等同于getTime，返回时间戳
RegExp    |      方法继承于Object.prototype,返回值本身

## 四、toString和valueOf的关系
两者在类型转换中扮演着重要的角色，两者关系与javascript的类型转换息息相关，下面说下javascript的类型转换及其原则
### 1.强制转换: Number()、String()、Boolean()
示例：//原始类型的强制转换

```js
Number(123)         // 123
Number('123')       // 123
Number('a123b')     // NaN
Number('')          // 0
Number(true)        // 1
Number(false)       // 0
Number(undefined)   // NaN
Number(null)        // 0

String(123)         // "123"
String('abc')       // "abc"
String(true)        // "true"
String(undefined)   // "undefined"
String(null)        // "null"

//下面5种情况为false，其余情况为true
Boolean(undefined)  // false
Boolean(null)       // false
Boolean(0)          // false
Boolean(NaN)        // false
Boolean('')         // false
```

当Number()、String() 遇到对==对象==的==强制转换==时情况就不同了，这个时候就会用到==toString()==,==valueOf()==方法了。
#### Number(对象)
- 调用对象的valueOf方法，若返回原始类型的值，则遵照上面的"非对象强制转换规则",
- 若还是返回对象，则调用toString方法，若返回原始类型的值，则遵照上面的"非对象强制转换规则"，若返回对象则报错

#### String(对象)
- 调用对象的toString方法，若返回原始类型的值，则遵照上面的"非对象强制转换规则",
- 若还是返回对象，则调用valueOf方法，若返回原始类型的值，则遵照上面的"非对象强制转换规则"，若返回对象则报错

### 2.自动类型转换
- 情况一：两个不同类型的值进行数值运算  
- 情况二：对非Boolean类型进行Boolean运算  
- 情况三：对非数值类型使用一元运算符（+ 、-）  
 
规则：预期什么类型的值，就调用该类型的转换函数。  
若预期为String类型的值，那么就用String()来进行强转。  
如果该位置即可以是String，也可能是Number，那么默认为Number。  
==一般Number的优先级高于String==  

1. 二元运算符+若有一个参与运算的数值为==String则预期为String==

```JS
'3'+1;                    // 31
'3' + true               // "3true"
'3' + {}                 // "3[object Object]"   {}.toString
'3' + []                 // "3"                  [].toString() //''
'3' + function (){}      // "3function (){}"
'3' + undefined          // "3undefined"
'3' + null               // "3null"
```
2. 二元运算符 - 、* 、/ 预期一般为Number:

```js
'7' - '2'       // 5
'7' * '2'       // 14
true - 2        // -1
false - 1       // -1
'3' * []        // 0
false / '3'     // 0
'abcd' - 2      // NaN
null + 2        // 2
undefined + 1   // NaN
```

3. 一元运算符预期为Number:

```js
+'abcde' // NaN
-'abcde' // NaN
+true    // 1
-false   // 0
```

## 两者的共同点与不同点：

- 共同点：在 JavaScript 中，toString()方法和valueOf()方法，在==输出对象时会自动调用==。
- 不同点：二者并存的情况下：
    - 在数值运算中，优先调用了valueOf，
    - 字符串运算中，优先调用了toString。

注意用alert，console.log 会输出对象
```js
var obj = {}
obj.valueOf = function(){
 return 10;
}
obj.toString = function(){
 return "return value";
}
var result = obj + 1;   // var result = obj.valueOf() + 1;  数值运算
console.log(result)     // 11

alert(obj) // return value  字符串运算
console.log(obj.toString()) // return value 
```
```js
  let e2 = {
    n : 2,
    toString : function (){
      console.log('this is toString')
      return this.n
    },
    valueOf : function(){
      console.log('this is valueOf')
      return this.n*2
    }
  }
  alert(e2)          //  2  this is toString  无操作符，有限调用toString
  alert(+e2)         // 4 this is valueOf
  alert('' + e2)       // 4 this is valueOf
  alert(String(e2))  // 2 this is toString
  alert(Number(e2))  // 4 this is valueOf
  alert(e2 == '4')  // true  this is valueOf ==号会进行隐式转换，隐式转换时触发调用valueOf方法
  alert(e2 === 4)   //false ===操作符不进行隐式转换  
```

==在有运算操作符的情况下，valueOf的优先级高于toString==
```js
  let e3 = {
    n: 2,
    toString: function () {
      console.log('this is toString')
      return this.n
    }
  }
  alert(e3)         // 2 this is toString
  alert(+e3)        // 2 this is toString
  alert('' + e3)    // 2 this is toString
  alert(String(e3)) // 2 this is toString
  alert(Number(e3)) // 2 this is toString
  alert(e3 == '2')  // true  this is toString
  alert(e3 === 2)   //false  ===操作符不进行隐式转换

```

```js
 Object.prototype.toString = null
  let e4 = {
    n: 2,
    valueOf: function () {
      console.log('this is valueOf')
      return this.n * 2
    }
  }
  alert(e4)         // 4 this is valueOf
  alert(+e4)        // 4 this is valueOf
  alert('' + e4)    // 4 this is valueOf
  alert(String(e4)) // 4 this is valueOf
  alert(Number(e4)) // 4 this is valueOf
  alert(e4 == '4')  // true  this is valueOf
  alert(e4 === 4)   //false  === 操作符不进行隐式转换
```

总结：
- 进行对象转换时（console.log(e2)）,优先调用toString方法，如没有重写toString将调用valueOf方法，如果两方法都不没有重写，但按Object的toString输出。
- 进行强转字符串类型时将优先调用toString方法，强转为数字时优先调用valueOf。
- 在有运算操作符的情况下，valueOf的优先级高于toString。
- 

#### toString vs valueOf的差别:

- 返回值类型的差别：
  1. toString 一定将所有内容转为字符串
  2. valueOf 取出对象内部的值，不进行类型转换
- 用途的差别：
  1. valueOf 专用于算数计算和关系运算
  2. toString 专用于输出字符串
- 共同的缺点：无法获取null和undefined的值
 
原文：https://www.jianshu.com/p/91ffaf79de1c