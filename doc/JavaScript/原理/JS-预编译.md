## 一些应该掌握的知识点
- JavaScript运行三部曲
    - 语法分析
    - 预编译
    - 解释执行
- Imply Global，暗示全局变量，即：任何变量，如果变量未经声明就赋值，此变量就为全局对象所有(也可理解为成为全局对象下面的一个属性)

- 只要在全局范围内，不管是声明的一个变量，还是不声明就创建的一个暗示变量，都会成为window下的一个属性，即成为全局变量；一切声明的全局变量，全是window属性

- 变量声明提升和函数声明整体提升
    - 函数声明整体提升(相当于提升到程序的最前面)
    - 一个变量被声明后，变量声明提升(相当于把变量声明语句放到最前，赋值不变)
    - JavaScript的函数作用域是指在函数内声明的所有变量在函数体内始终是有定义的，也就是说变量在声明之前已经可用， 所有这种特性称为声明提前（hoisting），即JavaScript函数里的所有声明（只是声明，但不涉及赋值）都被提前到函 数体的顶部，而变量赋值操作留在原来的位置
    - 函数声明整体提升，函数声明语句将会被提升到外部脚本或者外部函数作用域的顶部
    - 声明了一个变量，同时又声明了一个同名函数，则会先执行变量声明提升，再进行函数声明整体提升
    - 注：以上结论并不完全正确，在复杂情况下上述结论会失效

- JavaScript的预编译
    - 全局变量在全局都拥有定义，而局部变量只能在函数内有效
    - 执行期上下文，英文名Activation Object，简称AO
    - 全局对象，英文名Global Object，简称GO
    - AO和GO都是一种对象
    - 预编译发生在JS代码执行前，同时大部分发生在函数执行前
    - 函数执行前会进行预编译，产生AO
    - 全局变量在执行前也会有预编译，产生GO
    - 函数执行前的JS预编译四部曲
        - 创建AO对象
        - 查找形参和变量声明，将变量和形参名作为AO属性名，值为undefined
        - 将实参和形参统一
        - 在函数体里面查找函数声明，值赋予函数体
    - JS全局预编译(代码块执行前)
        - 创建GO对象
        - 查找全局变量声明（包括隐式全局变量声明，省略var声明），变量名作全局对象的属性，值为undefined
        - 查找函数声明，函数名作为全局对象的属性，值为函数引用
    - 函数外部未声明变量不会影响到函数的AO内的同名形参
    - JavaScript预编译原理详细分析的一篇博客参考： accelerator：JavaScript预编译原理分析
- 实参与形参
    - 实参即arguments，全称为"实际参数"，是在调用时传递给函数的参数。实参可以是常量、变量、表达式、函数等，无论实参是何种类型的量，在进行函数调用时，它们都必须具有确定的值，以便把这些值传送给形参。因此应预先用赋值，输入等办法使实参获得确定值
    - 形参即parameter，全称为"形式参数"，由于它不是实际存在变量，所以又称虚拟变量，是在定义函数名和函数体的时候使用的参数，目的是用来接收调用该函数时传入的参数。在调用函数时，实参将赋值给形参。因而，必须注意实参的个数和类型应与形参一一对应，并且实参必须要有确定的值
    - 形参出现在函数定义中，在整个函数体内都可以使用，离开该函数则不能使用
    - 调用函数时传递的实参数目可以大于形参数目，但是最好不要小于形参数目

## 一些案例分析
#### 案例一

```js
//预编译：GO -> {fn: function () {}}
//解释执行：{fn()}
function fn (a) {
//执行函数fn前预编译：AO -> {a: function () {}, b: undefined[因为函数b()为函数表达式]，d: function () {}}
      console.log(a); //控制台显示function a () {}
      var a = 123;
      console.log(a); //控制台显示123
      function a () {};
      console.log(a); //控制台显示123
      console.log(b); //控制台显示undefined
      var b = function () {};
      console.log(b); //控制台显示function () {}
      console.log(d); //控制台显示function d () {}
      function d () {};
  }
  fn(1);
```

#### 案例二

```js
//预编译：GO -> {test: functiong () {}}
//解释执行：{test()}
 function test (a, b) {
//执行函数test前预编译：AO -> {a: 1[因为外部实参传入], b: function () {},d:function () {}}
    console.log(a); //控制台显示1
    a = 3;
    console.log(b); //控制台显示function b () {}
    b = 2;
//解释执行函数test：{b: 2}
    console.log(b); //控制台显示2
    function b () {};
    function d () {};
    console.log(b);  //控制台显示2，因为b已是变量并被赋值
//解释执行函数test：{d: function () {}}
    console.log(d);
}
test(1);
```

案例三

```js
//预编译：GO -> {glob: undefined, test: function () {}}
var glob = 100;
//解释执行：｛glob = 100; test()｝
function test () {
var glob = 100;
function test () {
//执行函数test前开始预编译：AO -> {glob = function () {}}
    console.log(glob); //控制台显示function glob () {};
    glob = 200
    function glob() {};
//解释执行函数test：{glob = 200}
    console.log(glob); //控制台显示200
    var glob;
    console.log(glob); //原理同4，控制台显示200
}
test();
```

#### 案例四：两道百度笔试题
题1

```js
//预编译：GO -> {bar: function () {}}
//解释执行：{bar()}
  function bar () {
//执行函数bar()前预编译：AO -> {foo: function () {}}
      return foo;
//解释执行函数bar()：{foo()}
      foo = 10;
      function foo () {}
      var foo = 11;
  }
  console.log(bar());//控制台显示function foo () {}
```

题2

```js
//预编译：GO -> {bar: function () {}}
//解释执行：{bar()}
  function Bar () {
//执行函数bar()前预编译：AO -> {foo: function () {}}
      foo = 10;
//解释执行函数bar()：{foo: 10}
      function foo () {}
      var foo = 11;
//解释执行函数bar()：{foo: 11}
      return foo;
  }
  console.log(Bar());  //控制台显示11
```


## 总结：JS运行过程
全局预编译(脚本代码块script执行前) 

- 查找全局变量声明（包括隐式全局变量声明，省略var声明），变量名作全局对象的属性，值为undefined  
- 查找函数声明，函数名作为全局对象的属性，值为函数引用。
- 从上往下依次执行代码，遇到函数体时，进行函数体预编译。

### 函数体预编译（函数执行前）

- 创建AO对象（Active Object） 
- 查找函数形参及函数内变量声明，形参名及变量名作为AO对象的属性，值为undefined 
- 实参形参相统一，实参值赋给形参 
- 查找函数声明，函数名作为AO对象的属性，值为函数引用
- 函数体预编译后，继续往下执行代码。

参考及原文：
- 5分钟读懂JavaScript预编译流程 https://segmentfault.com/a/1190000018001871
- JS----预编译及变量提升详解 https://juejin.im/post/5aa6693df265da23884cb571