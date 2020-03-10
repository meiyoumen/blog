[toc]
# 目录
## 什么是装饰器
`装饰器` 是一种特殊类型的声明，它能够==被附加到类声明，方法， 访问符，属性或参数上==。 

## 装饰器使用 
==`@expression`== 这种形式，`expression` ==求值后必须为一个函数==，==它会在运行时被调用==，被装饰的声明信息做为参数传入。

通俗的理解可以认为就是在原有代码外层包装了一层处理逻辑。
个人认为装饰器是一种解决方案，而并非是狭义的 `@Decorator`，后者仅仅是一个语法糖罢了。

在TypeScript中装饰器还属于实验性语法，你必须在 `命令行` 或 `tsconfig.jso` n里启用 ==`experimentalDecorators`== 编译器选项：

- 命令行:
```
tsc --target ES5 --experimentalDecorators
```

- tsconfig.json:

```
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

装饰器在身边的例子随处可见，一个简单的例子

> 水龙头上边的起泡器就是一个装饰器，在装上以后就会把空气混入水流中，掺杂很多泡泡在水里。  
 但是起泡器安装与否对水龙头本身并没有什么影响，即使拆掉起泡器，也会照样工作，水龙头的作用在于阀门的控制，至于水中掺不掺杂气泡则不是水龙头需要关心的。

## 为什么要用装饰器

可能有些时候，我们会对 `传入参数的类型判断`、`对返回值的排序`、`过滤`，`对函数添加节流`、`防抖或其他的功能性代码`，`基于多个类的继承`，`各种各样的与函数逻辑本身无关的、重复性的代码`。  
所以，对于装饰器，可以简单地理解为是 ==非侵入式的行为修改== 。

## 如何定义装饰器

==装饰器本身其实就是一个函数==，理论上忽略参数的话，任何函数都可以当做装饰器使用。
helloword.ts

```js
function helloWord(target: any) {
    console.log('hello Word!');
}

@helloWord
class HelloWordClass {

}

// 编译后输出
//hello Word!
```

## 装饰器执行时机

修饰器对类的行为的改变，==是代码编译时发生的==（不是TypeScript编译，而是js在执行机中编译阶段），而不是在运行时。

这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。

在Node.js环境中模块一加载时就会执行

但是实际场景中，有时希望向装饰器传入一些参数, 如下：

```js
@Path("/hello", "world")
class HelloService {}
```

==此时上面装饰器方法就不满足了（VSCode编译报错），这是我们可以借助JavaScript中 `函数柯里化特性`==
```js
function Path(p1: string, p2: string) {
    return function (target) { //  这才是真正装饰器
        // do something 
    }
}
```

## 装饰器类型
装饰器的类型有：
- 类装饰器
- 访问器装饰器
- 属性装饰器
- 方法装饰器
- 参数装饰器

但是没有函数装饰器(function)

### 1. 类装饰器
应用于类构造函数，其参数是类的构造函数。
注意 `class` 并不是像Java那种强类型语言中的类，而是JavaScript构造函数的语法糖。


```js
function addAge(args: number) {
    return function (target: Function) {
        target.prototype.age = args;
    };
}

@addAge(18)
class Hello {
    name: string;
    age: number;
    constructor() {
        console.log('hello');
        this.name = 'yugo';
    }
}

console.log(Hello.prototype.age)    // 18
let hello = new Hello()

console.log(hello.age)              // 18
```


### 2. 方法装饰器
它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。

==方法装饰会在运行时传入下列3个参数==：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 成员的属性描述符{value: any, writable: boolean, enumerable: boolean, configurable: boolean}。


```js
function addAge(constructor: Function) {
  constructor.prototype.age = 18;
}

function method(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   console.log(target);
   console.log("prop " + propertyKey);
   console.log("desc " + JSON.stringify(descriptor) + "\n\n");
};

@addAge
class Hello{
  name: string;
  age: number;
  constructor() {
    console.log('hello');
    this.name = 'yugo';
  }

  @method
  hello(){
    return 'instance method';
  }

  @method
  static shello(){
    return 'static method';
  }
}
```

我们得到的结果是：

```js
Hello { hello: [Function] }
prop hello
desc {"writable":true,"enumerable":true,"configurable":true}


{ [Function: Hello] shello: [Function] }
prop shello
desc {"writable":true,"enumerable":true,"configurable":true}
```
- 修饰的是 `hello` 这个实例方法，第一个参数将是原型对象，也就是 `Hello.prototype`。

- 修饰的 shello 这个静态方法，则第一个参数是构造器 constructor。

- 第二个参数分别是属性名，第三个参数是属性修饰对象。


### 3. 访问器装饰器
访问器装饰器 应用于访问器的==属性描述符，可用于观察，修改或替换访问者的定义==。   
访问器装饰器 不能在声明文件中使用，也不能在任何其他环境上下文中使用（例如在声明类中）。

> 注意: TypeScript==不允许为单个成员装饰get和set访问器==。相反，该成员的所有装饰器必须应用于按文档顺序指定的第一个访问器。这是因为装饰器适用于属性描述符，它结合了get和set访问器，而不是单独的每个声明。

访问器装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

- ==对于静态成员来说是类的构造函数==，==对于实例成员是类的原型对象==。
- 成员的名字。
- 成员的属性描述符。


如果访问器装饰器返回一个值，它会被用作方法的属性描述符。

下面是使用了 `访问器装饰器（@configurable）` 的例子，应用于Point类的成员上：
```js
class Point {
    private _x: number;
    private _y: number;
    
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() { return this._x; }

    @configurable(false)
    get y() { return this._y; }
}
```

我们可以通过如下函数声明来定义 `@configurable` 装饰器：


```js
function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}
```


### 方法参数装饰器
参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 参数的名字。
3. 参数在函数参数列表中的索引。


```js
const parseConf = []

class Modal {
    @parseFunc
    public addOne(@parse('number') num) {
        console.log('num:', num);
        return num + 1;
    }
}

// 在函数调用前执行格式化操作
function parseFunc(target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        for (let index = 0; index < parseConf.length; index++) {
            const type = parseConf[index];
            console.log(type);
            switch (type) {
                case 'number':
                    args[index] = Number(args[index]);
                    break;
                case 'string':
                    args[index] = String(args[index]);
                    break;
                case 'boolean':
                    args[index] = String(args[index]) === 'true';
                    break;
            }
            return originalMethod.apply(this, args);
        }
    };
    return descriptor;
}

// 向全局对象中添加对应的格式化信息
function parse(type) {
    return function (target, name, index) {
        parseConf[index] = type;
        console.log('parseConf[index]:', type);
    };
}
let modal = new Modal();
console.log(modal.addOne('10')); // 11
```

### 属性装饰器
属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。


```js
function log(target: any, propertyKey: string) {
    let value = target[propertyKey];
    // 用来替换的getter
    const getter = function () {
        console.log(`Getter for ${propertyKey} returned ${value}`);
        return value;
    }
    // 用来替换的setter
    const setter = function (newVal) {
        console.log(`Set ${propertyKey} to ${newVal}`);
        value = newVal;
    };
    // 替换属性，先删除原先的属性，再重新定义属性
    if (delete this[propertyKey]) {
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}

class Calculator {
    @log
    public num: number;
    square() {
        return this.num * this.num;
    }
}

let cal = new Calculator();
cal.num = 2;
console.log(cal.square());
// Set num to 2
// Getter for num returned 2
// Getter for num returned 2
// 4
```

## 装饰器加载顺序
1. 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器 应用到每个==实例==成员
2. 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器 应用到每个==静态==成员
3. 参数装饰器 应用到构造函数
4. 类装饰器 应用到类



```js
function ClassDecorator() {
    return function (target) {
        console.log("I am class decorator");
    }
}
function MethodDecorator() {
    return function (target, methodName: string, descriptor: PropertyDescriptor) {
        console.log("I am method decorator");
    }
}
function Param1Decorator() {
    return function (target, methodName: string, paramIndex: number) {
        console.log("I am parameter1 decorator");
    }
}
function Param2Decorator() {
    return function (target, methodName: string, paramIndex: number) {
        console.log("I am parameter2 decorator");
    }
}
function PropertyDecorator() {
    return function (target, propertyName: string) {
        console.log("I am property decorator");
    }
}

@ClassDecorator()
class Hello {
    @PropertyDecorator()
    greeting: string;


    @MethodDecorator()
    greet( @Param1Decorator() p1: string, @Param2Decorator() p2: string) { }
}
```


输出结果：
```
I am property decorator
I am parameter2 decorator
I am parameter1 decorator
I am method decorator
I am class decorator
```

从上述例子得出如下结论：

有多个参数装饰器时：从最后一个参数依次向前执行

方法和方法参数中参数装饰器先执行。

类装饰器总是最后执行。

方法和属性装饰器，谁在前面谁先执行。因为参数属于方法一部分，所以参数会一直紧紧挨着方法执行。

上述例子中属性和方法调换位置，输出如下结果：


```
I am parameter2 decorator
I am parameter1 decorator
I am method decorator
I am property decorator
I am class decorator
```

## 参考：
- https://www.jianshu.com/p/afef44d449bd