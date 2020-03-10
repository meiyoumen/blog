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

参考：
函数的arguments，注入及高阶函数  
http://www.moye.me/2014/09/02/%E5%87%BD%E6%95%B0%E7%9A%84arguments%EF%BC%8C%E6%B3%A8%E5%85%A5%E5%8F%8A%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0/