[TOC]
# 代理与反射
![image](https://segmentfault.com/img/bVbfWra?w=1079&h=836)


## 代理是什么？
通过调用 ==`new Proxy()`== ，你可以创建一个==代理用来替代另一个对象==（被称之为目目标对象） ，==这个代理对目标对象进行了虚拟==，==因此该代理与该目标对象表面上可以被当作同一个对象来对待==。

==代理允许你拦截目标对象上的底层操==作，而这本来是JS引擎的内部能力，==拦截行为适用了一个能响应特定操作的函数（被称之为陷阱）==；

## 反射是什么？
被 `Reflect` 对象所代表的反射接口，是给底层操作提供默认行为的方法的集合，这些操作是能够被代理重写的。  
每个代理陷阱都有一个对应的反射方法，每个方法都与对应的陷阱函数同名，并且接收的参数也与之一致。


## 创建一个简单的代理
使用 `Proxy` 构建可以创建一个简单的代理对象，需要传递两个参数：
- 目标对象以及一个处理器，
- 定义一个或多个陷阱函数的对象。如果不定义陷阱函数，则依然使用目标对象的默认行为：

```js
let target = {}
let proxy = new Proxy(target, {})
proxy.name = "proxy"

console.log(proxy.name)  // "proxy"
console.log(target.name) // "proxy"

target.name = "target";
console.log(proxy.name)   // "target"
console.log(target.name)  // "target"
```

### 使用 set 陷阱函数验证属性值
假设你想要创建一个对象，并要求其属性值只能是数值，这就意味着该对象的每个新增属性都要被验证，并且在属性值不为数值类型时应当抛出错误。  
为此你需要定义 set 陷阱函数来重写设置属性值时的默认行为，该陷阱函数能接受四个参数：

- trapTarget ：将接收属性的对象（即代理的目标对象）；
- key ：       需要写入的属性的键（字符串类型或符号类型）；
- value ：     将被写入属性的值；
- receiver ：  操作发生的对象（通常是代理对象）。

- Reflect.set() 是 set 陷阱函数对应的反射方法，同时也是 set 操作的默认行为。
- Reflect.set() 方法与 set 陷阱函数一样，能接受这四个参数，让该方法能在陷阱函数内部被方便使用：


```js
let target = {
    name: "target"
}

let proxy = new Proxy(target, {
    set(trapTarget, key, value, receiver) {
    
        // 忽略已有属性，避免影响它们
        if (!trapTarget.hasOwnProperty(key)) {
            if (isNaN(value)) {
                throw new TypeError("Property must be a number.")
            }
        }
        
        // 添加属性
        return Reflect.set(trapTarget, key, value, receiver);
    }
})

// 添加一个新属性
proxy.count = 1
console.log(proxy.count)    // 1
console.log(target.count)   // 1

// 你可以为 name 赋一个非数值类型的值，因为该属性已经存在
proxy.name = "proxy";
console.log(proxy.name);    // "proxy"
console.log(target.name);   // "proxy"

// 抛出错误
proxy.anotherName = "proxy";
```


### 使用 get 陷阱函数进行对象外形验证
JS 语言有趣但有时却令人困惑的特性之一，就是读取对象不存在的属性时并不会抛出错误，而会把 undefined 当作该属性的值，例如：
```JS
let target = {}
console.log(target.name); // undefined
```

在多数语言中，试图读取 target.name 属性都会抛出错误，因为该属性并不存在；但 JS 语言却会使用 undefined 。
对象外形（ Object Shape ）指的是对象已有的属性与方法的集合，由于该属性验证只须在读取属性时被触发，因此只要使用 get 陷阱函数。该陷阱函数会在读取属性时被调用，即使该属性在对象中并不存在，它能接受三个参数：

- trapTarget ：将会被读取属性的对象（即代理的目标对象）；
- key ：需要读取的属性的键（字符串类型或符号类型）；
- receiver ：操作发生的对象（通常是代理对象）。

相应的Reflect.get()方法同样拥有这三个参数。进行对象外形验证的示例代码：


```JS
//import {color,sum,magicNumber} from "./export.js"
import * as example from "./export.js"
console.log(example.color)
console.log(example.magicNumber)

console.log(example.


    sum(76, 2))



let proxy = new Proxy({}, {
    get(trapTarget, key, receiver) {
        if (!(key in receiver)) {
            throw new TypeError("Property " + key + " doesn't exist.");
        }
        return Reflect.get(trapTarget, key, receiver);
    }
});
// 添加属性的功能正常
proxy.name = "proxy";
console.log(proxy.name); // "proxy"
// 读取不存在属性会抛出错误
console.log(proxy.nme); // 抛出错误
```

### 使用 has 陷阱函数隐藏属性
in运算符用于判断指定对象中是否存在某个属性，如果对象的属性名与指定的字符串或符号值相匹配，那么in运算符就会返回true。
无论该属性是对象自身的属性还是其原型的属性。 

has陷阱函数会在使用in运算符的情况下被调用，控制in运算符返回不同的结果，has陷阱函数会传入两个参数：

- trapTarget：代理的目标对象；
- key：属性键；

Reflect.has()方法接收相同的参数，并向in运算符返回默认的响应结果，用于返回默认响应结果。

```JS
let target = {
    name: "target",
    value: 42
};
let proxy = new Proxy(target, {
    has(trapTarget, key) {
        if (key === "value") {
            return false;
        } else {
            return Reflect.has(trapTarget, key);
        }
    }
});
console.log("value" in proxy); // false
console.log("name" in proxy); // true
console.log("toString" in proxy); // true
```
