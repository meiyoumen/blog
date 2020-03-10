## 一、instanceof 是如何工作的
下面我们举一个例子一步步来说明：


```js
console.log(new String('ABC') instanceof String);  // true

function Person() {} 
const p1 = new Person();

p1 instanceof Person; // true
```
1. 每一个构造函数都有一个 prototype 属性。
2. 这个 prototype 属性指向这个构造函数的原型对象
3. 通过 new 关键字，可以创建一个构造函数的实例(这里是 p1)，而实例上都有一个 \_\_proto\_\_ 属性
4. 实例上的 \_\_proto\_\_ 属性也指向构造函数的原型对象，这样我们就可以得到一张完整的关系图了
5. p1 instanceof Person ，检查 B(Person) 的 prototype 属性指向的原型对象，是否在对象 A(p1) 的原型链上。
![image](https://user-gold-cdn.xitu.io/2019/4/15/16a1ec1ab9688a9e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

经过我们的一步步分解，发现 ==B(Person)== 的 ==prototype 所指向的原型对象确实在 A(p1) 的原型链上==，所以我们可以确定 ==p1 instanceof Person 一定是为 true 的==。


我们再深入一点会发现，不仅仅 ==p1 instanceof Person 为 true====，==p1 instanceof Object 也为 true== ，这又是为什么呢？


其实，Person 的原型对象上也有一个 \_\_proto\_\_ 属性，而这个属性指向 Object 的 prototype 属性所指向的原型对象，我们可以在控制台打印一下：



```js
function Person() {} 
const p1 = new Person();
Person.prototype.__proto__ === Object.prototype // true
```
通过 Person 的例子，我们知道构造函数 Object 上的 prototype 属性会指向它的原型对象：
![image](https://user-gold-cdn.xitu.io/2019/4/15/16a1ec1ba426bde0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

现在，我们要判断 p1 instanceof Object 的真假，还记得上面的定义么？我们再来一遍：

>判断 B 的 prototype 属性指向的原型对象(B.prototype)是否在对象 A 的原型链上。
如果在，则为 true；如果不在，则为 false。

此时，我们发现 B(Object) 的 prototype 属性所指向的原型对象依然在 A(p1) 的原型链上，所以结果为 true 。

通过上面的例子我们可以知道，其实 ==instanceof== 的原理非常简单，就是一个==查找原型链的过程==，所以只要你理解了原型链的相关知识，理解 instanceof 的原理就不会再有问题了。

这里我们稍微总结两点与instanceof 有关的原型链知识：

- 所有 JavaScript 对象都有 __proto__ 属性，只有 Object.prototype.__proto__ === null ；
- 构造函数的 prototype 属性指向它的原型对象，而构造函数实例的 __proto__ 属性也指向该原型对象；

## 二、如何实现一个 instanceof ?
看了上面的过程，其实也很容易给出 instanceof 的实现方式：

```js
function instance_of(left, right) {
  const RP = right.prototype; // 构造函数的原型
  while(true) {
    if (left === null) {
      return false;
    }
    if (left === RP) { // 一定要严格比较
      return true;
    }
    left = left.__proto__; // 沿着原型链重新赋值
  }
}
```
```js
function Person() {}
const p1 = new Person();
p1 instanceof Object; // 用上面的代码解释它
```

**第一次赋值**

```
left = p1
right = Object
RP = Object.prototype
```

**第一次判断**  
left !== null  并且 left !== RP ，继续向上寻找 left 的原型链，准备新的赋值。

**第二次赋值**  

```
left = p1.__proto__ = Person.prototype
```


**第二次判断**  

```
left !== null 并且 left !== RP
```
继续向上寻找 left 的原型链，准备新的赋值。

**第三次赋值**  

```
left = p1.__proto__.__proto__ = Person.prototype.__proto__
```


**第三次赋值**  
left !== null ，此时 left === RP ，返回 true ，函数执行完毕。

原文：https://juejin.im/post/5cb3e7e0e51d456e896349d3
