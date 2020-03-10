## 介绍
> ==非标准==  该特性是非标准的，请尽量不要在生产环境中使用它！

console 对象提供对浏览器控制台的接入（如：Firefox 的 Web Console）。不同浏览器上它的工作方式是不一样的，但这里会介绍一些大都会提供的接口特性。
 
Console对象可以在任何全局对象中访问，如 Window，WorkerGlobalScope 以及通过属性工作台提供的特殊定义。
它被浏览器定义为 Window.console，也可被简单的 console 调用。例如：


```
console.log("Failed to open the specified link")
```


下面介绍对象可用的方法以及对应方法的使用示例。
```
console.dir(console)
```
![image](http://note.youdao.com/yws/public/resource/f063c3257d1eff57c9d293a7ebd0a3df/xmlnote/C6110CA40BEB433A892865B651E057CA/3047)

# 方法

Console.assert()  
判断第一个参数是否为真，false的话抛出异常并且在控制台输出相应信息。

Console.clear()  
清空控制台。

Console.count()  
以参数为标识记录调用的次数，调用时在控制台打印标识以及调用次数。

Console.debug()  
console.log方法的别称，使用方法可以参考Console.log()

Console.dir()   
打印一条以三角形符号开头的语句，可以点击三角展开查看对象的属性。

Console.dirxml()   
如果可以，打印 XML/HTML 元素表示的指定对象，或者 JavaScript 对象视图。

Console.error()  
打印一条错误信息，使用方法可以参考 string substitution。

Console._exception()     
error方法的别称，使用方法参考 Console.error()

Console.group()  
打印树状结构，配合groupCollapsed以及groupEnd方法;

Console.groupCollapsed()  
创建一个新的内联 group。使用方法和group相同，不同的是groupCollapsed打印出来的内容默认是折叠的。

Console.groupEnd()  
结束当前Tree

Console.info()  
打印以感叹号字符开始的信息，使用方法和log相同

Console.log()  
打印字符串，使用方法比较类似C的printf格式输出，可参考 string substitution 。

Console.profile()  
可以以第一个参数为标识，开始javascript执行过程的数据收集。和chrome控制台选项开Profiles比较类似，具体可参考chrome profiles

Console.profileEnd()  
配合profile方法，作为数据收集的结束。 

Console.table()  
将数据打印成表格。Console.table [en-US]

Console.time()   
计时器，接受一个参数作为标识。

Console.timeEnd()  
接受一个参数作为标识，结束特定的计时器。

Console.timeStamp() 
添加一个标记到浏览器的 Timeline 或 Waterfall 工具.

Console.trace()  
打印stack trace.

Console.warn()  
打印一个警告信息，使用方法可以参考 string substitution。


## 用法
### 格式化打印

Gecko 9.0 (Firefox 9.0 / Thunderbird 9.0 / SeaMonkey 2.6) 首次发布对string substitutions的支持.你可以在传递给console的方法的时候使用下面的字符以期进行参数的替换。

Substitution string	| Description
---|---
%o	    |打印javascript对象，可以是整数、字符串以及JSON数据
%d or %i|	打印整数
%s	    |打印字符串
%f	    |打印浮点数


```js
console.log("%i",2017)                      // 2017
console.log("%d年%d月%d日",2017,4,12)       // 2017年4月12日
console.log("你好，%s","上海")              // 你好，上海
console.log("我是一个对象",{city:"上海"})   // {city: "上海"}
console.log("%f",2017.04)                   // 2017.04
```


### 为console定义样式


```js
console.log("%cMy stylish message", "color: red; font-style: italic");
```
![image](https://mdn.mozillademos.org/files/7739/console-style.png)

### 定时器


```
console.time("answer time")

for(var i=0;i<1000;i++){
   console.log('down')
}

console.timeEnd("answer time") //answer time: 71.5ms
```

### 堆栈跟踪

打印当前执行位置到console.trace()的路径信息.。


```
foo();

function foo() {
  function bar() {
    console.trace();
  }
  bar();
}
```

The output in the console looks something like this:  
![image](https://mdn.mozillademos.org/files/7167/api-trace2.png)

## 推荐
- 14个你可能不知道的JavaScript调试技巧 
https://www.zcfy.cc/article/the-14-javascript-debugging-tips-you-probably-didnt-know-raygun-4480.html

- 14个你可能不知道的 JavaScript 调试技巧 
https://linux.cn/article-9070-1.html