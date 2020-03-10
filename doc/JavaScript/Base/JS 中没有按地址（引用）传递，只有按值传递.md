千万不要认为，==在局部作用域中修改的对象会在全局作用域中反映出来就说参数是按引用传递的==。
为了证明是值传递，让我们再来看如下例子：
```js
function setName(obj){
    obj.name = "Hello";
    obj = new Object();
    obj.name = "admin";
}
var person = new Object()
setName(person)
console.log(person.name); // 结果依旧是 Hello

```
1. 在调用 `setName() `函数初时，`obj` 与 `person` ==引用的是同一对象==，所以首次的 name 属性赋值会对 person 有所影响。
2. 当 `obj` 被重新定义时(obj = new Object())，==其引用的对象已经与 person 不同==，所以后面设置的 name 属性，不会对 person 引用的对象有任何影响。

感觉上面的这个例子非常好，大家可以仔细体会一下，我也是看到了这个例子才决定从文中《javascript高级程序设计》摘抄(貌似没有摘，就是抄)的。

JS 中没有按地址（引用）传递，只有按值传递
http://www.cnblogs.com/youxin/p/3354903.html

在 Node.js 中看 Javascript 的引用
https://lellansin.wordpress.com/2017/04/07/%E5%9C%A8-node-js-%E4%B8%AD%E7%9C%8B-javascript-%E7%9A%84%E5%BC%95%E7%94%A8/