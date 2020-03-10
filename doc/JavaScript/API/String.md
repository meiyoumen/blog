[TOC]
# 概述
String对象是 JavaScript 原生提供的三个包装对象之一，用来生成字符串对象。


```js
var s1 = 'abc';
var s2 = new String('abc');

typeof s1 // "string"
typeof s2 // "object"
```
s2.valueOf() // "abc"
上面代码中:
变量s1是==字符串==，s2是==对象==。
由于s2是字符串对象，s2.valueOf方法返回的就是它所对应的==原始字符串==。

字符串对象是一个类似数组的对象（很像数组，但不是数组）。
```js
new String('abc')
// String {0: "a", 1: "b", 2: "c", length: 3}
(new String('abc'))[1] // "b"
```
上面代码中，字符串abc对应的字符串对象，有数值键（0、1、2）和length属性，所以可以像数组那样取值。  

除了用作构造函数，String对象还可以当作工具方法使用，将任意类型的值转为字符串。


```js
String(true) // "true"
String(5)    // "5"
```

上面代码将布尔值ture和数值5，分别转换为字符串。


# 静态方法
- String.fromCharCode()  
String对象提供的静态方法（即定义在对象本身，而不是定义在对象实例的方法）。
主要是String.fromCharCode()。该方法的参数是一个或多个数值，代表 Unicode 码点，返回值是这些码点组成的字符串。


```js
String.fromCharCode()       // ""
String.fromCharCode(97)     // "a"
String.fromCharCode(104, 101, 108, 108, 111) // "hello"
```
上面代码中，String.fromCharCode方法的参数为空，就返回空字符串；否则，返回参数对应的 Unicode 字符串。 

注意，该方法不支持 Unicode 码点大于0xFFFF的字符，即传入的参数不能大于0xFFFF（即十进制的 65535）。  
```js
String.fromCharCode(0x20BB7) // "ஷ"
String.fromCharCode(0x20BB7) === String.fromCharCode(0x0BB7) // true
```
上面代码中，String.fromCharCode参数0x20BB7大于0xFFFF，导致返回结果出错。0x20BB7对应的字符是汉字𠮷，但是返回结果却是另一个字符（码点0x0BB7）。

这是因为String.fromCharCode发现参数值大于0xFFFF，就会忽略多出的位（即忽略0x20BB7里面的2）。  

这种现象的根本原因在于，码点大于0xFFFF的字符占用四个字节，而 JavaScript 默认支持两个字节的字符。这种情况下，必须把0x20BB7拆成两个字符表示。

```js
String.fromCharCode(0xD842, 0xDFB7) // "𠮷"
```

上面代码中，0x20BB7拆成两个字符0xD842和0xDFB7（即两个两字节字符，合成一个四字节字符），就能得到正确的结果。码点大于0xFFFF的字符的四字节表示法，由 UTF-16 编码方法决定。

# 实例属性
## String.prototype.length
字符串实例的length属性返回字符串的长度。

```js
'abc'.length // 3
```

# 常用实例方法
## String.prototype.charAt()
charAt方法返回指定位置的字符，参数是从0开始编号的位置。
```js
var s = new String('abc');
s.charAt(1)            // "b"
s.charAt(s.length - 1) // "c"
```
这个方法完全可以用数组下标替代。

```js
'abc'.charAt(1) // "b"
'abc'[1]        // "b"
```

如果参数为负数，或大于等于字符串的长度，charAt返回空字符串。

```js
'abc'.charAt(-1) // ""
'abc'.charAt(3) // ""
```

## String.prototype.charCodeAt()
charCodeAt方法返回字符串指定位置的 Unicode 码点（十进制表示），相当于String.fromCharCode()的逆操作。

charCodeAt(index) 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。

```js
"abcdef".charCodeAt(0) // 97
```


```js
'abc'.charCodeAt(1) // 98
```
上面代码中，abc的1号位置的字符是b，它的 Unicode 码点是98。

如果==没有任何参数==，charCodeAt返回==首字符==的 Unicode 码点。
```js
'abc'.charCodeAt() // 97
```

如果参数为负数，或大于等于字符串的长度，charCodeAt返回NaN。
```js
'abc'.charCodeAt(-1) // NaN
'abc'.charCodeAt(4)  // NaN

```
注意，charCodeAt方法返回的 Unicode 码点不会大于65536（0xFFFF），也就是说，只返回两个字节的字符的码点。如果遇到码点大于 65536 的字符（四个字节的字符），必需连续使用两次charCodeAt，不仅读入charCodeAt(i)，还要读入charCodeAt(i+1)，将两个值放在一起，才能得到准确的字符。

## String.prototype.fromCharCode() 
可接受一个指定的 Unicode 值，然后返回一个字符串。

```js
String.fromCharCode(65,66,67) // A B C
String.fromCharCode(97) // a
```




## String.prototype.concat()
concat方法用于连接两个字符串，==返回一个新字符串，不改变原字符串==。
```js
var s1 = 'abc';
var s2 = 'def';

s1.concat(s2) // "abcdef"
s1            // "abc"
```
该方法可以接受多个参数。
```js
'a'.concat('b', 'c') // "abc"
```

如果参数不是字符串，concat方法会将其先转为字符串，然后再连接。


```js
var one = 1;
var two = 2;
var three = '3';

''.concat(one, two, three) // "123"
one + two + three // "33"
```

上面代码中，concat方法将参数先转成字符串再连接，所以返回的是一个三个字符的字符串。作为对比，加号运算符在两个运算数都是数值时，不会转换类型，所以返回的是一个两个字符的字符串。

## String.prototype.slice()
slice方法用于从原字符串==取出子字符串并返回，不改变原字符串==。
它的第一个参数是子字符串的==开始位置==，第二个参数是子字符串的==结束位置==（不含该位置）。


```js
'JavaScript'.slice(0, 4) // "Java"
```
如果省略第二个参数，则表示子字符串一直到原字符串结束。


```js
'JavaScript'.slice(4) // "Script"
```

如果参数是负值，表示从结尾开始倒数计算的位置，即该负值加上字符串长度。
```js
'JavaScript'.slice(-6)     // "Script"
'JavaScript'.slice(0, -6)  // "Java"
'JavaScript'.slice(-2, -1) // "p"
```

如果第一个参数大于第二个参数，slice方法返回一个空字符串。

```js
'JavaScript'.slice(2, 1) // ""
```
## String.prototype.substring()
substring方法用于从原字符串==取出子字符串并返回，不改变原字符串==，跟slice方法很相像。它的第一个参数表示子字符串的开始位置，第二个位置表示结束位置（返回结果不含该位置）。


```
'JavaScript'.substring(0, 4) // "Java"
```

如果省略第二个参数，则表示子字符串一直到原字符串的结束。


```
'JavaScript'.substring(4) // "Script"
```

如果第一个参数大于第二个参数，substring方法会自动更换两个参数的位置。


```
'JavaScript'.substring(10, 4) // "Script"
// 等同于
'JavaScript'.substring(4, 10) // "Script"
```

上面代码中，调换substring方法的两个参数，都得到同样的结果。

如果参数是负数，substring方法会自动将负数转为0。


```
'Javascript'.substring(-3) // "JavaScript"
'JavaScript'.substring(4, -3) // "Java"
```

上面代码中，第二个例子的参数-3会自动变成0，等同于'JavaScript'.substring(4, 0)。由于第二个参数小于第一个参数，会自动互换位置，所以返回Java。

由于这些规则违反直觉，==因此不建议使用substring方法，应该优先使用slice==。

## String.prototype.substr()
substr方法用于从原字符串==取出子字符串并返回，不改变原字符串==，跟slice和substring方法的作用相同。  

substr方法的第一个参数是子字符串的开始位置（从0开始计算），第二个参数是子字符串的长度。  
```
'JavaScript'.substr(4, 6) // "Script"
```

如果省略第二个参数，则表示子字符串一直到原字符串的结束。


```js
'JavaScript'.substr(4) // "Script"
```

如果第一个参数是负数，表示倒数计算的字符位置。如果第二个参数是负数，将被自动转为0，因此会返回空字符串。


```js
'JavaScript'.substr(-6) // "Script"
'JavaScript'.substr(4, -1) // ""
```

上面代码中，第二个例子的参数-1自动转为0，表示子字符串长度为0，所以返回空字符串。


## String.prototype.indexOf()，String.prototype.lastIndexOf()
### indexOf方法用于确定一个字符串在另一个字符串中==第一次出现的位置，返回结果是匹配开始的位置==。==如果返回-1，就表示不匹配==。

```js
'hello world'.indexOf('o') // 4
'JavaScript'.indexOf('script') // -1
```

indexOf方法还可以接受第二个参数，表示从该位置开始向后匹配。
```js
'hello world'.indexOf('o', 6) // 7
```

### lastIndexOf
lastIndexOf方法的用法跟indexOf方法一致，主要的区别是lastIndexOf从尾部开始匹配，indexOf则是从头部开始匹配。
```js
'hello world'.lastIndexOf('o') // 7
```

另外，lastIndexOf的第二个参数表示从该位置起向前匹配。
```
'hello world'.lastIndexOf('o', 6) // 4
```

## String.prototype.trim()
trim方法用于去除字符串两端的空格，返回一个新字符串，不改变原字符串。
```
'  hello world  '.trim()
// "hello world"
```

该方法去除的不仅是空格，还包括制表符（\t、\v）、换行符（\n）和回车符（\r）。
```
'\r\nabc \t'.trim() // 'abc'
```
相关还有trimLeft(),trimRight(),trimEnd()等

## String.prototype.toLowerCase()，String.prototype.toUpperCase()
toLowerCase方法用于将一个字符串全部转为小写，toUpperCase则是全部转为大写。它们都返回一个新字符串，不改变原字符串。
```js
'Hello World'.toLowerCase() // "hello world"
'Hello World'.toUpperCase() // "HELLO WORLD"
```

## String.prototype.match()
match方法用于确定原字符串是否==匹配某个子字符串==，返回一个数组，成员为匹配的第一个字符串。如果没有找到匹配，则返回null。
```js
'cat, bat, sat, fat'.match('at') // ["at"]
'cat, bat, sat, fat'.match('xt') // null
```

返回的数组还有index属性和input属性，分别表示匹配字符串开始的位置和原始字符串。
```js
var matches = 'cat, bat, sat, fat'.match('at');
matches.index // 1
matches.input // "cat, bat, sat, fat"
```
match方法还可以使用正则表达式作为参数，详见《正则表达式》一章。

## String.prototype.search()，String.prototype.replace()
search方法的用法基本等同于match，但是返回值为匹配的第一个位置。如果没有找到匹配，则返回-1。
```js
'cat, bat, sat, fat'.search('at') // 1
```

search方法还可以使用正则表达式作为参数，详见《正则表达式》一节。  

replace方法用于==替换匹配的子字符串==，一般情况下==只替换第一个匹配==（除非使用带有g修饰符的正则表达式）。  

```js
'aaa'.replace('a', 'b') // "baa"
```

replace方法还可以使用正则表达式作为参数，详见《正则表达式》一节。

## String.prototype.split()
split方法按照==给定规则分割字符串==，返回一个由分割出来的==子字符串组成的数组==。

```js
'a|b|c'.split('|') // ["a", "b", "c"]
```

如果分割规则为空字符串，则返回数组的成员是原字符串的每一个字符。
```js
'a|b|c'.split('') // ["a", "|", "b", "|", "c"]
```

如果==省略参数==，则返回数组的唯一成员就是==原字符串==。
```
'a|b|c'.split() // ["a|b|c"]
```

如果满足分割规则的两个部分紧邻着（即两个分割符中间没有其他字符），则返回数组之中会有一个空字符串。

```js
'a||c'.split('|') // ['a', '', 'c']
```

如果满足分割规则的部分处于字符串的开头或结尾（即它的前面或后面没有其他字符），则返回数组的第一个或最后一个成员是一个空字符串。
```js
'|b|c'.split('|') // ["", "b", "c"]
'a|b|'.split('|') // ["a", "b", ""]
```

split方法还可以接受第二个参数，限定返回数组的最大成员数。

```js
'a|b|c'.split('|', 0) // []
'a|b|c'.split('|', 1) // ["a"]
'a|b|c'.split('|', 2) // ["a", "b"]
'a|b|c'.split('|', 3) // ["a", "b", "c"]
'a|b|c'.split('|', 4) // ["a", "b", "c"]
```

上面代码中，split方法的第二个参数，决定了返回数组的成员数。

split方法还可以使用正则表达式作为参数，详见《正则表达式》一节。

## String.prototype.localeCompare()
localeCompare方法用于比较两个字符串。
它返回一个整数，如果小于0，表示第一个字符串小于第二个字符串；如果==等于0==，表示==两者相等==；如果==大于0==，表示==第一个字符串大于第二个字符串==。
```js
'apple'.localeCompare('banana') // -1
'apple'.localeCompare('apple') // 0
```
该方法的最大特点，就是会考虑自然语言的顺序。举例来说，正常情况下，大写的英文字母小于小写字母。

```js
'B' > 'a' // false
```

上面代码中，字母B小于字母a。因为 JavaScript 采用的是 Unicode 码点比较，B的码点是66，而a的码点是97。  

但是，localeCompare方法会考虑自然语言的排序情况，将B排在a的前面。

```js
'B'.localeCompare('a') // 1
```

上面代码中，localeCompare方法返回整数1，表示B较大。

localeCompare还可以有第二个参数，指定所使用的语言（默认是英语），然后根据该语言的规则进行比较。

```js
'ä'.localeCompare('z', 'de') // -1
'ä'.localeCompare('z', 'sv') // 1
```

上面代码中，de表示德语，sv表示瑞典语。德语中，ä小于z，所以返回-1；瑞典语中，ä大于z，所以返回1。


# String
## 属性
- constructor  构造函数
- length 字符串的长度
- _ proto_    String.prototype 原型对象，可向对象添加属性或方法



## 方法
### ES5
- charAt(index)返回指定位置的字符
- charCodeAt(index)返回指定位置字符的unicode编码
- concat(elements)链接两个或多个字符串，返回新的字符串
- indexOf(str)  lastIndexOf(str)返回指定字符在字符串首次出现的位置
- match(regexp)查找到正则表达式的匹配
- search(regexp)返回符合正则表达式的位置
- slice(start, end)截取字符串的片段并返回，左闭右开
- replace(searchValue, replaceValue)在字符串中查找匹配的字符串，替换为新的字符串并返回
- ==split(separator)==将字符串按传入字符分割成字符串数组
- substr(start, length)返回从起始位置开始指定数目的字符
- substring(start, end)截取字符串的片段并返回，左闭右开
- toLowerCase()  toUpperCase()  toLocalLowerCase()  toLocalUpperCase()将字符串转换为小/大写
- ==trim()  trimLeft()  trimRight()==去掉字符串两边的空白
- valueOf()  toString()返回字符串原始值
- localCompare(str) 用特定的顺序来比较两个字符串
- String.fromCharCode(codes)  String.fromCodePonit(codes) 将unicode编码转为字符

### ES6
- ==endsWith(searchSring, postion)startsWith(searchSring, postion)==判断字符串是否以给定字符串结尾
- ==includes(searchSring, postion)== 判断字符串是否包含另一个字符串
- repeat(count) 返回新的字符串，包含链接在一起指定数量的副本
- String.raw() 用来处理模板字符串
- normalize(form) 将字符串正规化


### ES8
- padEnd(targetLength, padString)  padStart(targetLength, padString) 将字符串填充到指定长度

# 实际运用

- 手机号码隐藏中间四位

```js
['13912345678'.substr(0, 3), '****', '13912345678'.substr(-4, 4)].join('') // 139****5678
```
- 去掉日期中的两个'-'

```js
let date = '2018-07-16';
let newDate = date.replace(/-/g, "");
this.date = newDate;  // 20180716
```
- 限制字数，超出部分用省略号'...'

```js
let val = '限制字数'
val.length > 3 ? val.substring(0, 3)+'...': val   // 限制字...
```



参考：
- https://javascript.ruanyifeng.com/stdlib/string.html#toc18
- https://juejin.im/post/5b8c08bdf265da4376205831
- https://juejin.im/post/5b46ffa06fb9a04f951d06da
- 字符串实用常操纪要 https://www.jeffjade.com/2016/11/24/116-JavaScript-string-operation/