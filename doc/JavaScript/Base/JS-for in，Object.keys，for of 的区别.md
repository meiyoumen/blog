# for in

- 遍历对象及其原型链上==可枚举的属性==；
- 如果用于遍历数组，处理遍历其元素外，==还会遍历开发者对数组对象自定义的可枚举属性及其原型链上的可枚举属性==；
- 遍历对象返回的属性名
- 遍历数组返回的索引都是 string 类型；
- 某些情况下，可能按随机顺序遍历数组元素；用它循环对象，循环出来的属性顺序并不可靠，所以不要在 for...in 中做依赖对象属性顺序的逻辑判断。

举个栗子：

```JS
Array.prototype.getLength = function() {
    return this.length;
}

var arr = ['a', 'b', 'c'];
arr.name = 'June'

Object.defineProperty(arr, 'age', {
    enumerable: true,
    value: 17,
    writable: true,
    configurable: true
})

for(var i in arr) {
    console.log(i); // 0,1,2,name,age,getLength
}

var city = 'SH'
undefined
for (let key in city) {
    console.log(key, city) // SH SH
}
```
综上考虑，不推荐在数组中使用 for in 遍历

## for in顺顾序不可靠的例子：

```js
et user = {
  name: "John",
  age: 30,
  isAdmin: true
};

for(let key in user) {
  console.log( key ); // name age isAdmin ← 是一样的啊
}

// 不信再写一个对象
let tom = {
  gender: 'male',
  hasGirlfriend: false,
  isFunny: true
};

for(let key in tom) {
  console.log( key ); // gender hasGirlfriend isFunny ← 还是一样的啊
}

// 不可靠的顺序
let codes = {
  "49": "Germany",
  "41": "Switzerland",
  "44": "Great Britain",
  "1": "USA"
};

for(let code in codes) {
  alert(code); // 1, 41, 44, 49
}
```
最终遍历出来的结果是：属性 1 先遍历出来， 49 最后遍历出来。

这里的 1、41、44 和 49 就是整数属性。


那什么是整数属性呢？我们可以用下面的比较结果说明：

```js
String(Math.trunc(Number(prop)) === prop
```

当上面的判断结果为 true，prop 就是整数属性，否则不是。
所以

- "49" 是整数属性，因为 String(Math.trunc(Number('49')) 的结果还是 "49"。
- "+49" 不是整数属性，因为 String(Math.trunc(Number('+49')) 的结果是 "49"，不是 "+49"。
- "1.2" 不是整数属性，因为 String(Math.trunc(Number('1.2')) 的结果是 "1"，不是 "1.2"。
- 
上面的例子中，如果想按照创建顺序循环出来，可以用一个 讨巧 的方法：

```js
let codes = {
  "+49": "Germany",
  "+41": "Switzerland",
  "+44": "Great Britain",
  // ..,
  "+1": "USA"
};

for(let code in codes) {
  console.log( +code ); // 49, 41, 44, 1
}
```
简单归结成一句话就是：  
==先遍历出整数属性（integer properties，按照升序==），然后其他属性按照创建时候的顺序遍历出来。


# Object.keys
- 返回对象自身可枚举属性组成的数组
- ==不会遍历对象原型链上的属性以及 Symbol 属性==
- 对数组的遍历顺序和 for in 一致

```JS
function Person() {
    this.name = 'June';
}
Person.prototype.getName = function() {
    return this.name;
}
var person = new Person();
Object.defineProperty(person, 'age', {
    enumerable: true,
    value: 17,
    writable: true,
    configurable: true
});
console.log(Object.keys(person));   // ['name', 'age']
```

# for of
- es6 中添加的循环遍历语法；
- 支持遍历数组，类数组对象（DOM NodeList），字符串，Map 对象，Set 对象；
- 不支持遍历普通对象；
- 遍历后输出的结果为数组元素的值；
- 可搭配实例方法 entries()，同时输出数组的内容和索引；

```JS
// 1. 不会遍历到对象属性及其原型属性
Array.prototype.getLength = function() {
    return this.length;
};
var arr = ['a', 'b', 'c'];
arr.name = 'June';
Object.defineProperty(arr, 'age', {
    enumerable: true,
    value: 17,
    writable: true,
    configurable: true
});
for(let i of arr) {
    console.log(i); // a,b,c
}

// 2. 如果要遍历对象，可与 Object.keys 配合
var person = {
    name: 'June',
    age: 17,
    city: 'guangzhou'
}

// 不支持遍历普通对象；
// for(let p of person) {console.log(p)}

console.log(Object.keys(person)) // ["name", "age", "city"]

for(var key of Object.keys(person)) {
    console.log(person[key]); // June, 17, guangzhou
}

// 3. 配合 entries 输出数组索引和值/对象的键值
var arr = ['a', 'b', 'c'];
for(let [index, value] of Object.entries(arr)) {
    console.log(index, ':', value);
    // 0:a, 1:b, 2:c
}
var obj = {name: 'June', age: 17, city: 'guangzhou'};
for(let [key, value] of Object.entries(obj)) {
    console.log(key, ':', value);
    // name:June,age:17,city:guangzhou
}
```


`Object.entries(obj)`
如果参数的数据结构具有键和值，则返回一个二元数组，数组的每个元素为参数的[key,value]数组；
此方法签名如下：

```js
Object.entries(value: any) : Array<[string: any]>
// Symbol 属性会被忽略
Object.entries({ [Symbol()]: 123, name: 'June', age: 17});
// [['name','June'], ['age', 17]]
```
