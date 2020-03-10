[TOC]
# 前言
在阅读 `TypeScript` 文档的时候，经常会看到 `类的静态属`性 或者类的 `类的实例属性` 等名词，阅读其他篇章可能会出现另一个 `类的静态成员` 之类的名词。

把文档中的名词提取出来，分析后就可以发现：这些名词就是称呼多，理解起来还是很简单的。

> 版本说明
> - TypeScript 版本为：TypeScript 3.1；
> - 文章语法适用于 TypeScript，ES6 语法类似。但 ES6 规定，Class 内部只有静态方法，没有静态属性，但有一个 提案 提供了类的静态属性。


# 静态和实例

**静态和实例的名词有哪些**

- 我们可以简单把类中的成员分为： 静态成员 和 实例成员；
- 静态成员包含了：静态属性 和 静态方法；
- 实例成员包含了：实例属性 和 实例方法；

**静态和实例的区别在哪里**

- 静态成员 前面需要添加修饰符 `static`；
- 静态成员 使用 `类名` 来调用，实例成员 使用 `this` 来调用。
- 静态成员 ==不会被实例继承，只能通过类来调用==；

# 名词列举

## 实例属性

```JS
class Foo {
    str = 'Hello'; // 无修饰符 static
    constructor() {
        console.log(this.str); // 使用 this 来调用属性 str
    }
}

const foo = new Foo(); // 输出 Hello

class Bar extends Foo {
    constructor(){
        super();
    }
}

const bar = new Bar();
console.log(bar.str); // 输出 Hello ,实例属性可以被实例继承
```

以上代码可以看出，实例属性的特点：

- 无修饰符 `static`；
- 使用 `this` 来调用属性；
- ==实例属性可以被实例继承==。

## 静态属性
```JS
class Foo {
    static str = 'Hello'; // 有修饰符 static
    constructor() {
        console.log(Foo.str); // 通过类名来访问属性
    }
}

const foo = new Foo(); // Hello

class Bar extends Foo {
    constructor(){
        super();
        console.log(Bar.str); // 输出 Hello ，静态属性可以通过类名访问
    }
}
const bar = new Bar();
console.log(bar.str); // Error: Property 'str' is a static member of type 'Bar'；静态属性无法被实例继承
```
 
以上代码可以看出，静态属性的特点：

- 需要修饰符 `static`；
- 使用类名来访问属性；
- 静态属性无法被实例继承，只能通过类名(父类、子类)来调用。


## 实例方法

```js
class Foo {
    constructor() {
        this.classMethod(); // 使用 this 来调用实例方法
    }
    classMethod(){ // 没有修饰符 static
        console.log('hello');
    }
}

const foo = new Foo();

class Bar extends Foo {
    constructor(){
        super();
    }
}

const bar = new Bar();
bar.classMethod(); // 实例方法可以被实例继承
```

以上代码可以看出，实例方法的特点：

- 无修饰符 `static`；
- ==使用 `this` 来调用方法==；
- 实例方法可以被实例继承。

## 静态方法

```js
class Foo {
    constructor() {
        Foo.classMethod(); // 使用类名来调用静态方法
    }
    
    static classMethod(){ // 有修饰符 static
        console.log('hello');
    }
}

const foo = new Foo();

class Bar extends Foo {
    constructor(){
        super();
    }
}

const bar = new Bar();
bar.classMethod(); // Error: Property 'classMethod' is a static member of type 'Bar'；静态方法无法被实例继承

Bar.classMethod(); // 输出 Hello ，可以通过类名来调用静态方法
```

以上代码可以看出，静态方法的特点：

- 需要修饰符 static；
- 使用类名来访问方法；
- 静态方法无法被实例继承，只能通过类名来调用。

# 总结
- 通过修饰符 `static` 来定义成员为 静态成员 还是 实例成员；
- 静态成员 使用 `类名` 来调用，实例成员 使用 `this` 来调用；
- 静态成员 只能通过类来调用，==不会被`实例`继承==。

# 参考
- https://juejin.im/post/5cb92fa9518825324f68cfc7#heading-6