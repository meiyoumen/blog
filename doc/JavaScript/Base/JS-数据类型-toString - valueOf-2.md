### valueOf 和 toString
> 基本上，javascript中所有数据类型都拥有valueOf和toString这两个方法，null除外。它们俩解决javascript值运算与显示的问题

```
var o={
    i:10,
    valueOf:function(){
      console.log('valueOf');
      return this.i+30;
    },
    toString:function(){
      console.log('toString');
      return this.valueOf()+30;
    }
}
  
console.log(o) //输出o对象

console.log(o>20) //true 先调用了valueOf方法 所以是true

console.log(o.valueOf()) //40 先调用了valueOf方法 所以是40

console.log(o.toString()) //70 toString > valueOf
```


### toString()

toString()函数的作用是返回object的字符串表示，JavaScript中object默认的toString()方法返回字符串”==[object Object]==“。  
定义类时可以实现新的toString()方法，从而返回更加具有可读性的结果。  
JavaScript对于数组对象、函数对象、正则表达式对象以及Date日期对象均定义了更加具有可读性的toString()方法：

1. array的toString()方法将返回以逗号分隔的数组成员。比如，[1,2,3].toString()会返回字符串”1,2,3″。
2. function的toString()方法将返回函数的文本定义。比如，
```
(function(x){
    return x*2;
}).toString() //会返回字符串'function(x){return x*2;}'
```
3. RegExp的toString()方法与function的toString()方法类似，将返回正则表达式的文本定义。比如，/\d+/g.toString()会返回字符串”/\\d+/g”。
4. Date的toString()方法将返回一个具有可读性的日期时间字符串。
5. 如果 Boolean 值是 true，则返回 “true”。否则，返回 “false”。

### valueOf()

valueOf()函数的作用是返回该object自身。与toString()一样，定义类时可以实现新的valueOf()方法，从而返回需要的结果。JavaScript对于Date对象定义了更加具有可读性的valueOf()方法：

1. Date的valueOf()方法将返回一个时间戳数值，该数值为Date对象与1970年1月1日零时的时间差(以毫秒为单位)。其他一律返回对象本身。



在js高程里面有一段代码：


```
var colors = ["red", "blue", "green"]; // 创建一个包含3 个字符串的数组  
alert(colors.toString()); // red,blue,green  
alert(colors.valueOf()); // red,blue,green  
alert(colors); // red,blue,green
```


三个输出全部一样，那么toString()和valueOf()区别到底是什么？看下一个我写的例子：


```
var arr = [1,2,3];  
alert(Array.isArray(arr.valueOf()));   //true
alert(Array.isArray(arr.toString()));  //false
```


结果是第一个是true而第二个是false，为什么呢，其实valueOf()调用完以后还是返回一个数组。  
这个数组被alert的时候会调用toString()函数，所以不是valueOf()和toString()函数相同，而是间接的调用了toString()函数！

进一步测试下：

```
var arr = [1,2,3];  
arr.toString = function () {  
    alert("你调用了toString函数");  
}  
alert(arr.valueOf()); //你调用了toString函数
```
 
结果就是我们会看到“你调用了toString函数”。


而对于数值，我们可以调用valueOf的时候直接可以获得数字进行计算，不必转化成字符串，所以不会调用toString。  
反言之，如果我们需要获得操作对象的字符串形式的时候就会调用其toString函数。


> 总结：valueOf偏向于运算，toString偏向于显示。
> - 在进行强转字符串类型时将优先调用toString方法，强转为数字时优先调用valueOf。
> - 在有运算操作符的情况下，valueOf的优先级高于toString。
 
### 一道面试题

* 首先要一个数记住每次的计算值，所以使用了闭包
* 在tmp中记住了x的值，第一次调用add(),初始化了tmp，
* 并将x保存在tmp的作用链中，然后返回tmp保证了第二次调用的是tmp函数，后面的计算都是在调用tmp,
* 因为tmp也是返回的自己，保证了第二次之后的调用也是调用tmp，而在tmp中将传入的参数与保存在作用链中x相加并付给sum，
* 这样就保证了计算；

 但是在计算完成后还是返回了tmp这个函数，这样就获取不到计算的结果了，  
 我们需要的结果是一个计算的数字那么怎么办呢  
 首先要知道JavaScript中，打印和相加计算，会分别调用toString或valueOf函数，  
 所以我们重写==tmp的toString和valueOf==方法，返回sum的值；
 

```
function add(x) {
    var sum = x;
    var tmp = function (y) {
        sum = sum + y;
        return tmp;
    };
    tmp.toString =tmp.valueOf= function () {
        return sum;
    };
    return tmp;
}
console.log(add(1)(2)(3).toString());  //6
```

 使用arguments.callee

```
function add(x) {
    return function(y) {
        if (typeof y !== 'undefined') {
            x = x + y;
            return arguments.callee;
        } else {
            return x;
        }
    };
}
console.log(add(1)(2)(3)())//6
```

==ES5 提示: 在严格模式下，arguments.callee 会报错 TypeError，因为它已经被废除了==


