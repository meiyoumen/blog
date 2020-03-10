### 1.关于原型对象的重要知识点

首先要知道一个很重要的知识点,一句话:==所有对象都有原型对象==.

 

### 2. 对比其他语言的理解

原型对象,就是其它语言中的类中的静态属性和静态方法,总是是静态-static就对了.原理是:== 内存中只有一份==.


### 3. 在内存中的形象图:

首先,在产生js对象之前,我们需要创造一个构造函数(这都不知道,那就不要往下看了),如下:


```js
function Person(name_, age_) {
    this.name = name_;
    this.age = age_;
}
```


下面new三个(Person)对象,"张三" "李雷" "韩梅梅",他们来自同一个构造函数Person:

![image](http://note.youdao.com/yws/public/resource/3051618508415837c12f78cabbdf1c30/xmlnote/94C07B5F794F49D0B28C834BC175E06F/2175)

内存中就这样了,每个对象都有自己的 name, age内存  
这里new了多少个对象,就要开辟多少块name, age内存.

 

看到这,应该还是比较好理解的. 下面我们添加一条属性.location属性,如下:

```js
function Person(name_, age_) {
    this.name = name_;
    this.age = age_;
    
    //添加了一个新属性location    
    this.location = "地球";
}
```

内存图如下：  
![image](http://note.youdao.com/yws/public/resource/3051618508415837c12f78cabbdf1c30/xmlnote/180C412C83D943588B5C46B57AB5E0A3/2177)

这里我们看,==三个对象都有一个"地球"的内存空间==.  这里你要动动大脑了, 三个人都有地球的内存,我们是不是可以这样呢?

![image](http://images.cnblogs.com/cnblogs_com/gnface/201208/201208222155359271.png)

你看这样好不好呢?  这样只需要一个地球，大家都可以用了。   
==公用的那个空间如果是个对象的话==，就是所谓的==原型对象==了。

 
`原型对象`最重要的作用就是把==常量==和==方法====独立到自身里==，  供给其它 "自己的对象" 使用。
最后如图:

![image](http://note.youdao.com/yws/public/resource/3051618508415837c12f78cabbdf1c30/xmlnote/67CEA3F819134B1EBC97E34AF4131E88/2181)
//  三个具体的对象

```js

function Person(name, age) {
    this.name = name
    this.age = age
}

var zhangsan = new Person("zhangsan", 21);
var lilei = new Person("lilei", 21);
var hanmeimei = new Person("hanmeimei", 21);

// 他们的原型对象是：`Person.prototype`
Person.prototype.location = "地球";

Person.prototype.killPerson = function() {
    return "杀人";
};
```

这里有一个问题，我们知道原型对象，可是我们怎么访问到原型对象里的属性呢？      
就是我们如何获取到location ,和用killPerson方法呢?

```js
cosnole.log(zhangsan.location);
cosnole.log(zhangsan.killPerson());
```
==这样就可以访问到了,不过前提是，你的对象属性里面,没有定义location和killPerson.不然会把原对象的覆盖掉.==

这里面涉及到原型问题即 :
在访问`zhangsan.location`，首先检查`zhangsan`实例对象本身，从图中我们知道,`zhangsan`有 name, age 和prototype指针属性。、

并没有`location`，找不到以后，它会继续搜索原型对象(Person.prototype)里面，能否找到`location`属性，如果有就调用原对象的属性。
即向原型链上查找。所以:

```js
console.log(zhangsan.location)      //会输出   "地球"
console.log(zhangsan.killPerson() ) //会输出   "杀人"
```