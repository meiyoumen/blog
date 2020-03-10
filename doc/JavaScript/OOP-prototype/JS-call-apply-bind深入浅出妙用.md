## 深入浅出妙用 Javascript 中 apply、call、bind

### 语法

> fun.call(thisArg[, arg1[, arg2[, ...]]])  

> fun.apply(thisArg[, argsArray])

### 参数
**thisArg**

> 在fun函数运行时指定的this值。需要注意的是，指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于非严格模式下，则指定为null和undefined的this值会自动指向全局对象(浏览器中就是window对象)，同时值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象。

**arg1, arg2, ...**  
> 指定的参数列表。

**argsArray**   
> 一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 fun 函数。如果该参数的值为null 或 undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。浏览器兼容性请参阅本文底部内容。

==如果第一个参数为null,则this指向window(在node环境中则指向global)==


```
function hello(s){
       console.log(s) // 123
 }
 hello.call(null,123) //this --> window
```



### 栗子

在 javascript 中，==call== 和 ==apply== 都是为了改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部 this 的指向。

JavaScript 的一大特点是，函数存在这样的概念：
1. 定义时上下文
1. 运行时上下文
1. 上下文是可以改变的

先来一个栗子：

```
function fruits() {}
 
fruits.prototype = {
    color: "red",
    say: function() {
        console.log("My color is " + this.color);
    }
}
 
var apple = new fruits;
apple.say();    //My color is red

```

但是如果我们有一个对象

```
banana= {color : “yellow”}
```

我们不想对它重新定义 say 方法，那么我们可以通过 call 或 apply 用 apple 的 say 方法：


```
apple.say.call(banana)  //My color is yellow
apple.say.call(banana)  //My color is yellow
```

可以看出 call 和 apply 是为了动态改变 this 而出现的。  
当一个 object 没有某个方法（本栗子中banana没有say方法），但是其他的有（本栗子中apple有say方法），我们可以借助call或apply用其它对象的方法来操作。


> call/apply的第一个参数如果为null。this指向window

### apply、call 的区别

对于 apply、call 二者而言，作用完全一样，只是接受参数的方式不太一样。  
例如，有一个函数定义如下


```
var func = function(arg1, arg2) {
 
};

func.call(this,arg1,arg2)
func.apply(this,[arg1,arg2])
```

其中 ==this==是你想指定的上下文，他可以是任何一个 JavaScript 对象(JavaScript 中一切皆对象)  
call 需要把参数按顺序传递进去;  
apply 则是把参数放在数组里。


JavaScript 中，某个函数的参数数量是不固定的，因此要说适用条件的话，当你的参数是明确知道数量时用 call 。  
而不确定的时候用 apply，然后把参数 push 进数组传递进去。  
当参数数量不确定时，函数内部也可以通过 arguments 这个数组来遍历所有的参数。  
为了巩固加深记忆，下面列举一些常用用法：

**1、数组之间追加**


```
var array1 = [12 , "foo" , {name "Joe"} , -2458]; 
var array2 = ["Doe" , 555 , 100]; 

Array.prototype.push.apply(array1, array2); 

/* array1 值为  [12 , "foo" , {name "Joe"} , -2458 , "Doe" , 555 , 100] */
```


```
var array1 = [12 , "foo" , {name "Joe"} , -2458]; 
var array2 = ["Doe" , 555 , 100]; 
Array.prototype.push.apply(array1, array2); 
/* array1 值为  [12 , "foo" , {name "Joe"} , -2458 , "Doe" , 555 , 100] */
```


**2、获取数组中的最大值和最小值**

>number 本身没有 max 方法，但是 Math 有，我们就可以借助 call 或者 apply 使用其方法。

```
var  numbers = [5, 458 , 120 , -215 ]; 
var maxInNumbers = Math.max.apply(Math,numbers),         //458
    minInNumbers = Math.min.call(Math,5,458,120,-215);   //-215
```


**3、验证是否是数组（前提是toString()方法没有被重写过**）

```
functionisArray(obj){ 
    return Object.prototype.toString.call(obj) === '[object Array]' ;
}

```

**4、类（伪）数组使用数组方法**
>把NodeList集合转换成数组

```html
<ul>
  <li>新闻</li>
  <li>娱乐</li>
  <li>音乐</li>
</ul>

<script>
  var domNodes =document.getElementsByTagName('li');
  
  domNodes =Array.prototype.slice.call(li);
  
  domNodes.forEach(function (it) {
    console.log(it) 
     /* out put
     <li>新闻</li>
     <li>娱乐</li>
     <li>音乐</li>
    /*
  })
</script>

```



### 深入理解运用apply、call (console)

> Javascript中存在一种名为伪数组的对象结构。比较特别的是 arguments 对象，还有像调用 ==getElementsByTagName== , ==document.childNode==s 之类的，它们返回NodeList对象都属于伪数组。不能应用 Array下的 ==push== , ==pop== 等方法。
> 但是我们能通过==Array.prototype.slice.call== 转换为真正的数组的带有 length 属性的对象，这样 domNodes 就可以应用 Array 下的所有方法了。
> 


```
function log(){
  console.log.apply(console, arguments);
}

log(1);      //1
log(1,2);    //1 2
log("hello world");    //hello world

```
接下来的要求是给每一个 log 消息添加一个”(app)”的前辍，比如：

```
function log(){
  var args = Array.prototype.slice.call(arguments);
  args.unshift('(app)');
 
  console.log.apply(console, args);
};

log("hello world");    //(app)hello world

```

### bind

说完了 apply 和 call ，再来说说bind。  
bind() 方法与 apply 和 call 很相似，也是可以改变函数体内 this 的指向。

MDN的解释是：bind()方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this，传入 bind() 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

直接来看看具体如何使用，在常见的单体模式中，通常我们会使用 _this , that , self 等保存 this ，这样我们可以在改变了上下文之后继续引用到它。 像这样：


```
var foo = {
    bar : 1,
    eventBind: function(){
        var _this = this;
        $('.someClass').on('click',function(event) {
            /* Act on the event */
            console.log(_this.bar);     //1
        });
    }
}
```
由于 Javascript 特有的机制，上下文环境在 eventBind:function(){ } 过渡到 $(‘.someClass’).on(‘click’,function(event) { }) 发生了改变，上述使用变量保存 this 这些方式都是有用的，也没有什么问题。当然使用 bind() 可以更加优雅的解决这个问题：

```
var foo = {
    bar : 1,
    eventBind: function(){
        $('.someClass').on('click',function(event) {
            /* Act on the event */
            console.log(this.bar);      //1
        }.bind(this));
    }
}
```



```
varfoo = {
    x: 3
}
 
var bar = function(){
    console.log(this.x);
}
 
bar(); // undefined
var func = bar.bind(varfoo);
func(); // 3
```


有个有趣的问题，如果连续 bind() 两次，亦或者是连续 bind() 三次那么输出的值是什么呢？像这样：



```
var bar = function(){
    console.log(this.x);
}
var foo = {
    x:3
}
var sed = {
    x:4
}
var func = bar.bind(foo).bind(sed);
func(); //?
 
var fiv = {
    x:5
}
var func = bar.bind(foo).bind(sed).bind(fiv);
func(); //?
```
答案是，两次都仍将输出 3 ，而非期待中的 4 和 5 。原因是，在Javascript中，多次 bind() 是无效的。更深层次的原因， bind() 的实现，相当于使用函数在内部包了一个 call / apply ，第二次 bind() 相当于再包住第一次 bind() ,故第二次以后的 bind 是无法生效的。

### apply、call、bind比较


```
var obj = {
    x: 81,
};

var foo = {
    getX: function() {
        return this.x;
    }
}

console.log(foo.getX.bind(obj)());  //81
console.log(foo.getX.call(obj));    //81
console.log(foo.getX.apply(obj));   //81
```

三个输出的都是81，但是注意看使用 bind() 方法的，他后面多了对括号。

也就是说，区别是，当你希望改变上下文环境之后并非立即执行，而是回调执行的时候，使用 bind() 方法。而 apply/call 则会立即执行函数。

再总结一下：

- apply 、 call 、bind 三者都是用来改变函数的this对象的指向的；
- apply 、 call 、bind 三者第一个参数都是this要指向的对象，也就是想指定的上下文；
- apply 、 call 、bind 三者都可以利用后续参数传参；
- bind 是返回对应函数，便于稍后调用；apply 、call 则是立即调用 。

[原文](http://web.jobbole.com/83642/)