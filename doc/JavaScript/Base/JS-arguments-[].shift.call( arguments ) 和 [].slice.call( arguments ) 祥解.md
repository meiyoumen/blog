[TOC]
# 目录
## arguments
### 简述
`arguments`是一个==类数组对象==，包含着传入==函数中的所有参数==，而且可以使用==length属性==来确定传递进来==多少个参数==。

直接调用`arguments.slice()`将返回一个`"Object doesn't support this property or method"`错误，因为`arguments`==不是==一个真正的==数组==。

```js
function test() {
	console.log(arguments)         // Arguments["Hello", callee: ƒ, Symbol(Symbol.iterator): ƒ] 
	console.log(arguments.length)  // 2 
	console.log(typeof arguments)  // object
}

test('Hello', 'World')
```
返回结果：
- 返回一个类数组对象
- 返回长度
- 类型为`object`


### 检测类型  
toString 会报告它是一种 [object Arguments] 类型的数据

```js
function test(){
    console.log(Object.prototype.toString.call(arguments)) //  [object Arguments]
}
test()
```

 ## [].slice.call( arguments ) && [].slice.apply( arguments ) 
 关于这个的解释网上有很多，大多是 “把==类数组对象==转为==数组对象==”.

```JS
[].slice.call( arguments )
// 等效于
Array.prototype.slice.call( arguments )
```
 Array.prototype.slice.call(arguments)的作用：函数传入的==参数转换为真正的的数组对象==。
 
### 原理
Array.prototype.slice.call()   方法能够将一个具有`length`==属性的对象转换为数组==。  
比如自定义一个具有==length==属性的对象（注意键值必须是数字）：
```JS
var a = { 
    0: 'bob', 
    1: '12', 
    2: 'male', 
    length: 3
}
console.log(Array.prototype.slice.call(a)); //  ["bob", "12", "male"]
```
这里会将{0:'bob', 1: '12', 2:'male' , length:1} 形成一个新数组（这里==属性名必须是0,1,2==....，而且==length属性不能少==，而且应该跟前面属性个数对应，这样就模拟了一个数组）。

 
另一方面也可推知`Arguments`对象和`Array`对象的亲缘关系。
 `Array`其他的原型方法也可以应用在`arguments`上比如：
- Array.prototype.shift.apply(arguments);  
`shift`也是`Array`的一个实例方法，用于获取并返回数组的第一个元素。  
当然如上的调用虽然可执行，但却纯属多余，不如直接调用arguments[0]来的简单直接。  
再推而广之，我们也可以对很多形似Array的Collection对象应用这个技巧，比如

```
Array.prototype.slice.apply(document.getElementsByTagName('div'));
```
不过很遗憾，==IE并不支持这样的调用==，Firefox和Opera则都能得到正确的结果。


#### 实现一个slice方法

```js
function slice(start, end) {
  let array = []
  start = start ? start : 0
  end = end ? end : this.length    // this-> 当对前对象 [1,2].slice() 
  
  for (let i = start, j = 0; i < end; i++, j++) {
     array[j] = this[i]
  }
  return array
}
```

```js
var array=[1]
array.slice()
```

说白了这个对象=={0: 1, length: 1}==在这种情况下可以看成[1]。
也就是说其实slice方法是没有传参数的那么start就是undefined。slice方法中如果没有设置start，start就是0，可通过如下证明
```js
[1,2].slice() // [1, 2]
```
end如果没有指定，就是当前对象的length属性的值，也就是1。
那么结果就是

```js
{0:1}.slice(0, 1); // 这是伪代码
```

返回一个新的数组，从对象中0开始，到1结束，也就是取对象下标为0的值。{0:1}[0] => 1;所以返回[1]。  
如果这样写Array.prototype.slice.apply({0:1, length:3})。结果就应该是[1, undefined, undefined]


因为`slice`内部实现是使用的==this代表调用对象==。  
那么当`[].slice.call()` 传入 ==arguments==对象的时候，通过 call函数改变原来slice方法的this指向，使其指向arguments，并对arguments进行复制操作，而后返回一个新数组。

至此便是完成了1arguments1类数组==转为数组==的目的！其实这可以理解为，让类数组调用数组的方法！



### 类似用法
#### 1. Array.from
上面的写法是es5中的写法，es6中提供了一个等价的方法实现上述功能Array.from(arguments)。

Array.from方法用于将==两类对象转为真正的数组==：
1. 类似数组的对象（array-like object）
2. 可遍历（iterable）的对象（包括 es6新增的数据结构Set 和 Map）。

```js
let bar = new Set(['a', 'b', 'c'])
Array.from(bar )    // ['a', 'b', 'c'];

function test() {
	console.log(arguments)              // Arguments(2) ["A", "B", callee: ƒ, Symbol(Symbol.iterator): ƒ]
	let arr = Array.from(arguments)
	console.log(arr)                    // ["A", "B"]
}
test('A', 'B')
```

#### 2. 扩展运算符(…)

```js
function foo(a,b,c,d) {
	console.log(Array.prototype.slice.call(arguments))   // ["a", "b", "c", "d"]
    console.log(Array.from(arguments))                   // ["a", "b", "c", "d"]
    console.log([...arguments])                          // ["a", "b", "c", "d"]
}
foo("a","b","c","d")
```

注意点：
1. 使用apply 时要注意：apply或call 只是切换了函数内部 this 的调用，但是执行的方法依然是原始对象上的方法， 即使你在 Array.prototype.slice.call（obj）的 obj 上 覆盖了slice 方法 ，依然会执行 Array 上的 slice 方法;
2. 由于apply方法（或者call方法）也可以绑定函数执行时所在的对象，但是会立即执行函数，因此不得不把绑定语句写在一个函数体内。建议使用函数改变this指向时使用 bind 方法。
3. bind方法每运行一次，就返回一个新函数，这会产生一些问题。比如，监听事件的时候，不能写成下面这样。
