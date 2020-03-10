
## 从自身延原型链向上查找的方式 
访问对==象object.xxx==的属性时,如果==object==自己没==有xxx==属性,则向上延原型链查找,==如果找到则输出==,==没找到则输出undefined==  

>PS: 因为每个对象和原型都有一个原型(注:原型也是一个对象 )，对象的原型指向对象的父，而父的原型又指向父的父，我们把这种通过原型层层连接起来的关系撑为原型链。这条链的末端一般总是默认的对象原型。


现在我们思想一下,在原型链上,是靠什么来找到原型链的上一个结点的呢??
查询资料后,得出:  
==每个对象都有一个__proto__属性,原型链上的对象正是依靠这个__proto__属性连结在一起的!==


```js
var Person = function()  {  };  
  
//Person.prototype 是一个仅含一个方法的对象  
Person.prototype.getInfo = function()  {  
    alert("username: "+this.username);    
};  
  
//建一个person实例  
var person = new Person();  
person.username = "zhangsan";  
  
person.getInfo();   //username: zhangsan
  
  
//判断__proto__是否引用 Person.prototype  
if(person.__proto__ == Person.prototype)  
{  
    alert("__proto__的确是指向其原型对象的引用!");   //__proto__的确是指向其原型对象的引用!
}
```
![image](http://hi.csdn.net/attachment/201202/27/0_1330315303r5dH.gif)

### 结论: 
==[实例].__proto__是指向其原型对象的引用!==