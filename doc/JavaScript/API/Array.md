[TOC]
### 数组检查

第一种
```
Array.isArray([1,2,3])          // true
Array.isArray(Array.prototype)  // true
Array.isArray('123')            // false
```

第二种
```
Object.prototype.toString.call([1,2,3])  // [object Array]
```

### 数组查找

Array.indexOf() 
>找到则返回该元素的下标位置 找不到返回-1   

Array.lastIndexOf(a,atart)  
>与indexOf相反，lastIndexOf从末尾开始查找	返回a所在的索引值，如果没有查找到则返回-1

### 常用方法总结

方法 |	作用 | 返回值
---|------|---
Array.push(x,y,z) |	把xyz添加到数组末尾	|新数组长度
Array.pop()	 |移除数组最后一项 |	移除的最后一项
Array.shift() |	移除数组第一项 |	移除的第一项
Array.unshift(a,b,c) |	在数组前端添加a,b,c	 |新数组长度
Array.reverse() |	反转数组 |	反转后的新数组
Array.sort() |	对数组中每一项的字符串进行升序排列 |	重新排序后的数组
Array.concat(a,b,c) |	连接数组 |	返回连接好的新数组
Array.splice(i,h,..item1) |	i位置 h数量 item要添加的元素,空不添加 |	然后返回被删除的项目
Array.slice(1,n) |	截取数组，从1到n，1和n为索引值	 |返回截取的数组(在这里返回从1开始，到n之前结束)
Array.indexOf(a，start)	 |查找a的所在的位置，从start开始	 |返回a所在的索引值，如果没有查找到则返回-1
Array.lastIndexOf(a,atart) |	与indexOf相反，lastIndexOf从末尾开始查找 |	返回a所在的索引值，如果没有查找到则返回-1


### Array.prototype.forEach
>forEach为每个元素执行对应的方法 ==forEach是用来替换for循环的==

```js
var arr = [
    {city:'sh'},
    {city:'bj'},
    {city:'hf'}
];
 
// Uses the usual "for" loop to iterate
for(var i= 0, l = arr.length; i< l; i++){
    console.log(arr[i])
    /** 
    Object {city: "sh"} 
    Object {city: "bj"} 
    Object {city: "hf"} */
}
 
console.log("========================");
 
//Uses forEach to iterate
arr.forEach(function(item,index){
    console.log(item,index); //item元素 index索引
    
/** Object {city: "sh"} 0
    Object {city: "bj"} 1
    Object {city: "hf"} 2*/
});
```

### Array.prototype.map 有返回值
>map()对数组的每个元素进行一定操作（映射）后，会返回一个新的数组，
callback需要有return值，如果没有，返回的全是undefined

```js
var oldArr = [
    {first_name:"Colin",last_name:"Toh"},
    {first_name:"Addy",last_name:"Osmani"},
    {first_name:"Yehuda",last_name:"Katz"}
];
 
 // 不使用map
function getNewArr(){
  var newArr = [];
  for(var i= 0, l = oldArr.length; i< l; i++){
    var item = oldArr[i];
    item.full_name = [item.first_name,item.last_name].join(" ");
    newArr[i] = item;
  }
  return newArr;
}
 
console.log(getNewArr());

return oldArr.map(function(item,index){
    item.full_name = [item.first_name,item.last_name].join(" ");
    return item; //返回整个item
});

var users = [
  {name: "张含韵", "email": "zhang@email.com"},
  {name: "江一燕",   "email": "jiang@email.com"},
  {name: "李小璐",  "email": "li@email.com"}
];

var emails = users.map(function (user) { 
    return user.email;  //只返回email
});
console.log(emials)
// ["zhang@email.com", "jiang@email.com", "li@email.com"]

```


### Array.prototype.filter 有返回值

>该filter()方法创建一个新的匹配过滤条件的数组。   
语法：var new_array = arr.filter(callback[, thisArg])；
callback函数需要返回布尔值true或false. 如果为true则表示通过

```js
var arr = [
  {"name":"apple", "count": 2},
  {"name":"orange", "count": 5},
  {"name":"pear", "count": 3},
  {"name":"orange", "count": 16},
];
   
var newArr = [];

//不用 filter()
for(var i= 0, l = arr.length; i< l; i++){
  if(arr[i].name === "orange" ){
    newArr.push(arr[i]);
  }
}
console.log("Filter results:",newArr); // [{"name":"orange", "count": 5}, {"name":"orange", "count": 16}]

//用了 filter() 把匹配的结果存放到newArr2数里
var newArr2 = arr.filter(function(item){
  return item.name === "orange";
});
 
console.log("Filter results:",newArr2);  // [{"name":"orange", "count": 5}, {"name":"orange", "count": 16}]


var data = [0, 1, 2, 3];
var arrayFilter = data.filter(function(item) {
    return item;
});
console.log(arrayFilter); // [1, 2, 3]
```

### Array.prototype.some 有返回值 true | false
some 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个“真值”（即可转换为布尔值 true 的值）。
如果找到了这样一个值，some 将会立即返回 true。否则，some 返回 false。结束遍历

callback 只会在那些”有值“的索引上被调用，不会在那些被删除或从来未被赋值的索引上调用。

callback 被调用时传入三个参数：元素的值，元素的索引，被遍历的数组。

如果为 some 提供了一个 thisArg 参数，将会把它传给被调用的 callback，作为 this 值。否则，在非严格模式下将会是全局对象，严格模式下是 undefined。

some 被调用时不会改变数组。

==我们自然可以使用forEach进行判断，不过，相比some,不足在于，some只有有true即返回不再执行了==。

   

```js
var some1 = [6, 12, 8, 1, 4].some((element, index) => {
    console.log(element, index)
    return element > 10 //遍历到12就会中断循环
})

console.log(some1)

var someValue = [12, 5, 8, 1, 4].some((element, index, array) => {
    return element > 10;
});

console.log(someValue)
```

==some意指“某些”，指是否“某些项”合乎条件。与下面的every算是好基友，every表示是否“每一项”都要靠谱。用法如下：==


### Array.prototype.every  有返回值 true | false 
>只要有一个不符合，便利中断


```js
var some1 = [6, 12, 8, 1, 4].every((element, index) => {
    console.log(element, index)
    return element > 10 //遍历到6就会中断循环  只要有一个不符合，便利中断
})

console.log(some1)
```




### Array.prototype.reduce
>reduce()可以实现一个累加器的功能，将数组的每个值（从左到右）将其降低到一个值。  
>说实话刚开始理解这句话有点难度，它太抽象了。  
>场景： 统计一个数组中有多少个不重复的单词
不使用reduce时


```js
var arr = ["apple","orange","apple","orange","pear","orange"];
 
function getWordCnt(){
  var obj = {};
   
  for(var i= 0, l = arr.length; i< l; i++){
    var item = arr[i];
    obj[item] = (obj[item] +1 ) || 1;
  }
   
  return obj;
}
 
console.log(getWordCnt());

apple: 2
orange: 3
pear: 1
```

使用reduce()后


```js
var arr = ["apple","orange","apple","orange","pear","orange"];
 
function getWordCnt(){
  return arr.reduce(function(prev,next){
    // 第一次执行 prev= {}, next = "apple"
    // 2 prev= {apple: 1}, next ="orange"
    // 3 prev= {apple: 1, orange: 1}, next ="apple"
    prev[next] = (prev[next] + 1) || 1;
    return prev;
  },{});
}
 
console.log(getWordCnt());
apple: 2
orange: 3
pear: 1
```
让我先解释一下我自己对reduce的理解。  
reduce(callback, initialValue)会传入两个变量。  
回调函数(callback)和初始值(initialValue)。假设函数它有个传入参数，prev和next,index和array。  
prev和next你是必须要了解的。
一般来讲prev是从数组中第一个元素开始的，next是第二个元素。但是当你传入初始值(initialValue)后，第一个prev将是initivalValue，next将是数组中的第一个元素。
比如：

```js
/*
   https://www.w3cplus.com/javascript/array-part-8.html
   reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终为一个值，是ES5中新增的又一个数组逐项处理方法，那reduce方法跟foreach、map等数组方法又有啥区别呢。

   arr.reduce(callback[, initialValue]) — More From MDN

   callback（一个在数组中每一项上调用的函数，接受四个函数：）
       previousValue（上一次调用回调函数时的返回值，或者初始值）
       currentValue（当前正在处理的数组元素）
       currentIndex（当前正在处理的数组元素下标）
       array（调用reduce()方法的数组）
   initialValue（可选的初始值。作为第一次调用回调函数时传给previousValue的值）

   场景： 统计一个数组中有多少个不重复的单词 不使用reduce时
   */

  let reduceArr = ["apple", "orange", "apple", "orange", "pear", "orange"]

  function test() {
    return reduceArr.reduce(((init, cur, i, arr) => {
    // 1 init= {}, cur = "apple"
    // 2 init= {apple: 1}, cur ="orange"
    // 3 init= {apple: 1, orange: 1}, cur ="apple"
      init[cur] = (init[cur] + 1) || 1
      return init
    }), {})
  }

  function test2() {
    
    return reduceArr.reduce((init, cur, i, arr) => {
      // 
      /*
      1 init = "apple" cur="orange" i=1
      2 init = "apple--|--orange" cur="apple"
      3 init = "apple--|--orange--|--apple" cur="orange"
      */
      return init + '--|--' + cur
    })
  }
  
  test2()
  // apple--|--orange--|--apple--|--orange--|--pear--|--orange


  /*
  让我先解释一下我自己对reduce的理解。
  reduce(callback, initialValue)会传入两个变量。
    回调函数(callback)和初始值(initialValue)。假设函数它有个传入参数，prev和next,index和array。
  prev和next你是必须要了解的。 一般来讲prev是从数组中第一个元素开始的，next是第二个元素。
    但是当你传入初始值(initialValue)后，第一个prev将是initivalValue，next将是数组中的第一个元素。 比如：
  */

  let arr = ["apple", "orange"]

  function noPassValue() {
    return arr.reduce(function (prev, next) {
      console.log("prev:", prev)
      console.log("next:", next)

      return prev + " " + next
    })
  }

  console.log("noPassValue:", noPassValue())

  /**
   prev: apple
   next: orange
   noPassValue: apple orange
   */


  function passValue() {
    return arr.reduce(function (prev, next) {
      console.log("prev:", prev)
      console.log("next:", next)

      prev[next] = 1
      return prev
    }, {})
  }


  console.log("----------------")
  console.log("With {} as an additional parameter:", passValue())
  /*
    prev: {} apple:
    rnext: apple
    prev: {apple: 1}
    next: orange
      
    With {} as an additional parameter: Object
    apple: 1
    orange: 1
  */


  let per = [
    {id: 1, name: 'apple'},
    {id: 2, name: 'apple'},
    {id: 3, name: 'apple'},
    {id: 4, name: 'orange'},
    {id: 5, name: 'pear'},
    {id: 6, name: 'banana'},
    {id: 7, name: 'pear'}
  ]

  function test4() {
    let obs = {}
    return per.reduce((init, cur, i) => {
      if (obs[cur.name]) {
        console.log('已存在', cur)
      } else {
        obs[cur.name] = cur.name
        init.push(cur)
      }
      return init
    }, [])
  }

  window.rpe = test4
  
  
/**
0: {id: 1, name: "apple"}
1: {id: 4, name: "orange"}
2: {id: 5, name: "pear"}
3: {id: 6, name: "banana"}
length: 4
*/
```



### Array.prototype.reduceRight



## filter 与map的区别

```js
var arr = [
  {"name":"apple", "count": 2},
  {"name":"orange", "count": 5},
  {"name":"pear", "count": 3},
  {"name":"orange", "count": 16},
];
   
var newArr = arr.filter(function(item){
  return item.name === "orange";
});
 
 
console.log("Filter results:",newArr);
// 反回过滤后的数组
// [{"name":"orange", "count": 5},{"name":"orange", "count": 16}]

var newArr2 = arr.map(function(item){
   item.city = 'sh'
   return item;
});
 
 
console.log("Filter results2:",newArr2); //返回数组 每个对象里添加一个属性city

  /**
   0: {name: "apple", count: 2, city: "sh"}
   1: {name: "orange", count: 5, city: "sh"}
   2: {name: "pear", count: 3, city: "sh"}
   3: {name: "orange", count: 16, city: "sh"}
   */ 
```


[更多参考](http://blog.csdn.net/zccz14/article/details/51582718)

[ES5中新增的Array方法详细说明](http://www.zhangxinxu.com/wordpress/2013/04/es5%E6%96%B0%E5%A2%9E%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95/?replytocom=312344)