[TOC]
# 描述
在需要兼容IE8以下的日子里，往往需要使用==eval()==来把后端传过来的==JSON串转==成可操作的==JSON对象==。

直到昨天在翻看jQuery源码时，才发现==jQuery.parseJSON==的兼容实现用的是==new Function()==。

## eval
==eval接受字符串参数，解析其中的js代码。 == 
如果编译失败，会抛出异常，否则执行其中的代码，计算返回值。
```JS
eval('2+2');  // 4
eval('console.log("ok")');  // ok
```

在实际应用中，通常这样转换JSON。
```JS
var jsonStr = '{ "age": 20, "name": "jack" }';
eval('(' + jsonStr + ')');
```

为什么要加括号呢？

因为js中 `{}` 通常是表示一个==语句块==，==eval只会计算语句块内的值进行返回==。  
==加上括号就变成一个整体的表达式==。

```JS
console.log( eval('{}') );      // undefind
console.log( eval('({})') );    // Object {}
```

使用 `eval` 需要注意执行作用域
```JS
var s = 1;
function a() {
    eval('var s=2');
    console.log(s);
}
a();                // 2
console.log(s);     // 1
```

在局部环境使用 `eval`便会创建局部变量。可以==显示指定eval调用者来改变上下文环境==。

```JS
var s = 'global';
function a() {
    eval('var s = "local"');
    console.log(s);                 // local
    console.log(eval('s'));         // local 显示指定eval 改变上下文环境
    console.log(window.eval('s'));  // global
}
```

## Function
在之前我对于Function的了解只限于“定义方法的一种非主流方式”。却忽略了Function与eval相同的字符串参数特性。

### 语法：
```
var func = new Function(arg1, arg2, ..., functionBody);
```


### 实例：
```JS
var add = new Function('a', 'b', 'return a+b;');
console.log( add(2, 3) );    // 5
```

由于其形参使用字符串的方式表示，也可以使用1个字符串来描述多个形参。
```JS
var add = new Function('a, b', 'return a+b;');
console.log( add(2, 3) );    // 5
```
### 转换JSON字符串
==在转换JSON的实际应用中，只需要这么做。==
```JS
var jsonStr = '{ "age": 20, "name": "jack" }',
    json = (new Function('return ' + jsonStr))();
```

`eval` 与 `Function` 都有着动态编译js代码的作用，但是在实际的编程中并不推荐使用。  
如果可以，请用更好的方法替代。

在一些特殊的运用场合，也有一些合理运用的实践。比如模板解析等。

### 那么为什么 `jQuery` 要用 `new Function`而不用`eval`呢？

看看老外做的两者以及原生方法的性能比较：
[JSON Performance comparison of eval, new Function and JSON](https://weblogs.asp.net/yuanjian/json-performance-comparison-of-eval-new-function-and-json)

原始链接：http://imys.net/20151222/eval-with-new-function.html