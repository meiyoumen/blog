[TOC]
# 目录
## JSON.parse()和JSON.stringify()使用介绍

### JSON.parse(text[, reviver])
- 方法解析一个JSON字符串，构造由字符串描述的JavaScript值或对象。可以提供可选的reviver函数以在返回之前对所得到的对象执行变换。

#### 参数

- text  要被解析成JavaSctipt值的字符串，查看 JSON 对象学习的JSON 语法的说明。

- reviver 可选
如果是一个函数，则规定了原始值如何被解析改造，在被返回之前。

#### 返回值   
Object对应给定的JSON文本。

```js
var str = '{"name":"huangxiaojian","age":"23"}'
JSON.parse(str)
//Object {name: "huangxiaojian", age: "23"}
```
==注意==：单引号写在{}外，==每个属性名都必须用双引号==，否则会抛出异常。


```
JSON.parse('{}');              // {}
JSON.parse('true');            // true
JSON.parse('"foo"');           // "foo"
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
JSON.parse('null');            // null
```

#### 使用 reviver 函数
如果指定了 reviver 函数，则解析出的 JavaScript 值（解析值）会经过一次转换后才将被最终返回（返回值）。更具体点讲就是：解析值本身以及它所包含的所有属性，会按照一定的顺序（从最最里层的属性开始，一级级往外，最终到达顶层，也就是解析值本身）分别的去调用 reviver 函数，在调用过程中，当前属性所属的对象会作为 this 值，当前属性名和属性值会分别作为第一个和第二个参数传入 reviver 中。如果 reviver 返回 undefined，则当前属性会从所属对象中删除，如果返回了其他值，则返回的值会成为当前属性新的属性值。

当遍历到最顶层的值（解析值）时，传入 reviver 函数的参数会是空字符串 ""（因为此时已经没有真正的属性）和当前的解析值（有可能已经被修改过了），当前的 this 值会是 {"": 修改过的解析值}，在编写 reviver 函数时，要注意到这个特例。（译者按：这个函数的遍历顺序按深度优先遍历）


```js
JSON.parse('{"p": 5}', function (key, value) {
    if(key === '') return value;     // 如果到了最顶层，则直接返回属性值，
    return value * 2;              // 否则将属性值变为原来的 2 倍。
});                            // { p: 10 }

JSON.parse('{"1": 1, "2": 2,"3": {"4": 4, "5": {"6": 6}}}', function (k, v) {
    console.log(k); // 输出当前的属性名，从而得知遍历顺序是从内向外的，
                    // 最后一个属性名会是个空字符串。
    return v;       // 返回原始属性值，相当于没有传递 reviver 参数。
});

// 1
// 2
// 4
// 6
// 5
// 3 
// ""
```


### JSON.stringify(value[, replacer [, space]])
- 方法将一个JavaScript值转换为一个JSON字符串，如果指定了一个replacer函数，则可以替换值，或者如果指定了一个replacer数组，可选地仅包括指定的属性。

#### 参数

- value  
 将要序列化成 一个JSON 字符串的值。


- replacer 可选
如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果该参数为null或者未提供，则对象所有的属性都会被序列化；关于该参数更详细的解释和示例，请参考使用原生的 JSON 对象一文。

- space 可选
指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为10。改值若小于1，则意味着没有空格；如果该参数为字符串(字符串的前十个字母)，该字符串将被作为空格；如果该参数没有提供（或者为null）将没有空格。

#### 返回值 

一个表示给定值的JSON字符串。	

```js
var a = {a:1,b:2}
JSON.stringify(a)   // "{"a":1,"b":2}"
```


#### 描述

==关于序列化，有下面五点注意事项：==

- 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
- 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
- undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。
- 所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
- 不可枚举的属性会被忽略


```js
JSON.stringify({});                        // '{}'
JSON.stringify(true);                      // 'true'
JSON.stringify("foo");                     // '"foo"'
JSON.stringify([1, "false", false]);       // '[1,"false",false]'
JSON.stringify({ x: 5 });                  // '{"x":5}'

JSON.stringify({x: 5, y: 6});              
// "{"x":5,"y":6}"

JSON.stringify([new Number(1), new String("false"), new Boolean(false)]); 
// '[1,"false",false]'

JSON.stringify({x: undefined, y: Object, z: Symbol("")}); 
// '{}'

JSON.stringify([undefined, Object, Symbol("")]);          
// '[null,null,null]' 

JSON.stringify({[Symbol("foo")]: "foo"});                 
// '{}'

JSON.stringify({[Symbol.for("foo")]: "foo"}, [Symbol.for("foo")]);
// '{}'

JSON.stringify(
    {[Symbol.for("foo")]: "foo"}, 
    function (k, v) {
        if (typeof k === "symbol"){
            return "a symbol";
        }
    }
);


// undefined 

// 不可枚举的属性默认会被忽略：
JSON.stringify( 
    Object.create(
        null, 
        { 
            x: { value: 'x', enumerable: false }, 
            y: { value: 'y', enumerable: true } 
        }
    )
);

// "{"y":"y"}"
```


#### replacer参数

replacer参数可以是一个函数或者一个数组。作为函数，它有两个参数，键(key)值(value)都会被序列化。

- 如果返回一个 Number, 转换成相应的字符串被添加入JSON字符串。
- 如果返回一个 String, 该字符串作为属性值被添加入JSON。
- 如果返回一个 Boolean, "true" 或者 "false"被作为属性值被添加入JSON字符串。
- 如果返回任何其他对象，该对象递归地序列化成JSON字符串，对每个属性调用replaceer方法。除非该对象是一个函数，这种情况将不会被序列化成JSON字符串。
- 如果返回undefined，该属性值不会在JSON字符串中输出。
- 注意: 不能用replacer方法，从数组中移除值(values)，如若返回undefined或者一个函数，将会被null取代。
- 
例子(function)


```js
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined;
  }
  return value;
}

var foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
var jsonString = JSON.stringify(foo, replacer);  //JSON序列化结果为 {"week":45,"month":7}.
```

##### 例子(array)

如果replacer是一个数组，数组的值代表将被序列化成JSON字符串的属性名。


```js
var foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
JSON.stringify(foo, ['week', 'month']);  // '{"week":45,"month":7}', 只保留“week”和“month”属性值。
```

#### space 参数

space 参数用来控制结果字符串里面的间距。  

如果是一个数字, 则在字符串化时每一级别会比上一级别缩进多这个数字值的空格（最多10个空格）；如果是一个字符串，则每一级别会比上一级别多缩进用该字符串（或该字符串的前十个字符）。

```
JSON.stringify({ a: 2 }, null, " ");   // '{\n "a": 2\n}'
```
使用制表符（\t）来缩进：


```
JSON.stringify({ uno: 1, dos : 2 }, null, '\t')
// '{            \
//     "uno": 1, \
//     "dos": 2  \
// }'
```

## 使用 JSON.stringify 结合 localStorage 的例子

一些时候，你想存储用户创建的一个对象，并且，即使在浏览器被关闭后仍能恢复该对象。下面的例子是 JSON.stringify 适用于这种情形的一个样板：


```js
// 创建一个示例数据
var session = {
    'screens' : [],
    'state' : true
};
session.screens.push({"name":"screenA", "width":450, "height":250});
session.screens.push({"name":"screenB", "width":650, "height":350});
session.screens.push({"name":"screenC", "width":750, "height":120});
session.screens.push({"name":"screenD", "width":250, "height":60});
session.screens.push({"name":"screenE", "width":390, "height":120});
session.screens.push({"name":"screenF", "width":1240, "height":650});

// 使用 JSON.stringify 转换为 JSON 字符串
// 然后使用 localStorage 保存在 session 名称里
localStorage.setItem('session', JSON.stringify(session));

// 然后是如何转换通过 JSON.stringify 生成的字符串，该字符串以 JSON 格式保存在 localStorage 里
var restoredSession = JSON.parse(localStorage.getItem('session'));

// 现在 restoredSession 包含了保存在 localStorage 里的对象
console.log(restoredSession);
```

## 参考
- http://www.haorooms.com/post/js_escape_encodeURIComponent
- http://fe.meituan.com/promise-insight.html
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify