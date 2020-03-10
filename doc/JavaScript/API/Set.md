[TOC]
# 目录
## Set
> ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。  
Set 本身是一个构造函数，用来生成 Set 数据结构。


```javascript
const s = new Set()

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x))
for(let i of s) {
    console.log(i) // 2 3 5 4
}


// 例一
const set = new Set([1, 2, 3, 4, 4]);
/*
Set(4) {1, 2, 3, 4}
[[Entries]]
    0: 1
    1: 2
    2: 3
    3: 4
    size: (4)
*/

[...set]
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三
function divs () {
  return [...document.querySelectorAll('div')];
}

const set = new Set(divs());
set.size // 56

// 类似于
divs().forEach(div => set.add(div));
set.size // 56

```

上面代码通过add方法向 Set 结构加入成员，结果表明 Set 结构不会添加重复的值。

Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

上面代码中，也展示了一种去除数组重复成员的方法。


```
// 去除数组的重复成员
[...new Set(array)]
```

### Set 去重的算法
向Set加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。  
    Set内部判断两个值是否不同，使用的算法叫做“==Same-value equality==”，它类似于精确相等运算符（===）。  
    主要的区别是NaN等于自身，而精确相等运算符认为NaN不等于自身。
    
    
```
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

set.add({});
set.size // 1

set.add({});
set.size // 2
```
上面代码向 Set 实例添加了两个NaN，但是只能加入一个。这表明，在 Set 内部，两个NaN是相等。

另外，两个对象总是不相等的。
    

### Set 实例的属性和方法

1. Set 结构的实例有以下属性。

- Set.prototype.constructor：构造函数，默认就是Set函数。
- Set.prototype.size：返回Set实例的成员总数。


2. Set 实例的方法分为两大类：
>操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

#### 操作方法
- add(value)：添加某个值，返回Set结构本身。
- delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- has(value)：返回一个布尔值，表示该值是否为Set的成员。
- clear()：清除所有成员，没有返回值。

```
var set = new Set()

set.add('A')
set.add('B')
set.add('c')

set.size //3

set.has('B') // true

set.delete('c') //true

set.clear() 

set.size // 0
```


#### 遍历操作
Set 结构的实例有四个遍历方法，可以用于遍历成员。

- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

keys()，values()，entries()  

keys方法、values方法、entries方法返回的都是遍历器对象（详见《Iterator 对象》一章）。  
由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。


```
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]


// for of遍历

let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
// red
// green
// blue

// forEachr没有返回值
let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(value * 2) )
// 2
// 4
// 6
```

#### 遍历的应用
扩展运算符（...）内部使用for...of循环，所以也可以用于 Set 结构。


```
var set1 = new Set(['red', 'green', 'blue']);
var colors = ['white', 'black']
var arr = [...set1, ...colors];
console.log(arr) // ["red", "green", "blue", "white", "black"]
```

而且，数组的map和filter方法也可以用于 Set 了。


```
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```

因此使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。


```
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用Array.from方法。


```
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```
