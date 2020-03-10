[TOC]
# 编译分析
typescript编译时，经常会生成一些工具函数，如
- __extends
- __decorate
- __matadata
- __param
- __awaiter

这些工具函数是用来执行一些typescript特性的，如装饰器、发射元数据、async/await等，下面是几个编译结果函数

## __extends

.ts 代码
```js
class Animal {
    name: string;

    constructor(theName: string) {
      this.name = theName
    }

    move(distanceInMeters: number = 0) {
      console.log(`${this.name} moved ${distanceInMeters}m.`)
    }
  }

  class Snake extends Animal {
    // 父类构造函数需要传参
    constructor(name: string) {
      super(name)
    }

    // 重写父类move方法
    move(distanceInMeters = 5) {
      console.log('Slithering....')

      // 调用父类move方法
      super.move(distanceInMeters)
    }
  }

  class Horse extends Animal {
    constructor(name: string) {
      super(name)
    }

    move(distanceInMeters) {
      console.log('Galloping...')
      super.move(distanceInMeters)
    }
  }


  let sam = new Snake("Sammy the Python")
  let tom: Animal = new Horse('Tommy the Palomino')
  sam.move()
  tom.move(34)

/*
  Slithering....
  Sammy the Python moved 5m.
  Galloping...
  Tommy the Palomino moved 34m.
*/

```

编译后的代码.js

```js
var __extends = (this && this.__extends) || (function () {

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array   && 
        function (d, b) { d.__proto__ = b })  ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p] }
        
    return function (d, b) {
        extendStatics(d, b)
        function __() { this.constructor = d }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
    }
    
})()


var Animal = /** @class */ (function () {

    function Animal(theName) {
        this.name = theName;
    }
    
    Animal.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 0; }
        console.log(this.name + " moved " + distanceInMeters + "m.")
    }
    return Animal
    
}());

var Snake = /** @class */ (function (_super) {

    __extends(Snake, _super)
    
    // 父类构造函数需要传参
    function Snake(name) {
        return _super.call(this, name) || this;
    }
    
    // 重写父类move方法
    Snake.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 5; }
        console.log('Slithering....');
        // 调用父类move方法
        _super.prototype.move.call(this, distanceInMeters);
    }
    
    return Snake
    
}(Animal))

var Horse = /** @class */ (function (_super) {
    __extends(Horse, _super)
    
    function Horse(name) {
        return _super.call(this, name) || this;
    }
    
    Horse.prototype.move = function (distanceInMeters) {
        console.log('Galloping...');
        _super.prototype.move.call(this, distanceInMeters);
    }
    return Horse
    
}(Animal));



var sam = new Snake("Sammy the Python")
var tom = new Horse('Tommy the Palomino')

sam.move()
tom.move(34)
/*
  Slithering....
  Sammy the Python moved 5m.
  Galloping...
  Tommy the Palomino moved 34m.
*/
```


```js
 // 首先来看下这个(this && this.__extends) || ...的写法
  // 在js中，布尔运算可以用于任何类型，运算的结果取决于参与运算的变量被转成布尔型后的对应布尔值，
  // 当然这句话不说布尔运行的结果一定是布尔值，下面举一个例子
  // 分别对null和{}调用Boolean()转型函数，结果是false和true
  // var test = null || {}; test为{}，var test = {} && null ; test为null
  // 如果这段代码是在全局作用域的环境下执行的，this为全局对象，浏览器下即为window对象。
  // 全局作用域下定义的函数是作为全局对象的方法被创建的，
  // __extends函数在全局作用域中被第一次声明后，this.__extends即指向__extends函数。
  // 在存在多个写有继承的TS文件的时候，每个对应的js文件都会有这串代码，
  // 如果__extends已经作为全局变量的方法被定义过了。
  // 那么就不再为__extends变量重新指定新的函数对象。
  // 反之如果__extends函数尚未存在，就将||符号右边的值赋值给__extends变量，
  // (function(){})();的写法被称为IIFE（立即执行函数表达式）。
  var __extends = (this && this.__extends) || (function () {
    // 从这个函数的名字就可以看到它是实现静态的属性的继承的
    // 静态属性就是直接绑定在构造函数这个函数对象上的属性
    var extendStatics =
      // Object.setPrototypeOf能够接受两个参数，用法如下
      // var obj = {},proto = {x:10};
      // Object.setPrototypeOf(obj, proto);
      // console.log(obj.x); // 10
      // 上面代码将proto对象设为obj对象的原型，所以从obj对象可以读取proto对象的属性。
      // 具体可以参考阮一峰的ECMAScript 6 入门（http://es6.ruanyifeng.com/#docs/object）
      Object.setPrototypeOf ||
      // 如果浏览器不支持上面的Object.setPrototypeOf方法，则会跑到这里
      // {__proto__: []} instanceof Array用来判断浏览器是否支持__proto__属性，不支持则返回最后一项
      ({__proto__: []} instanceof Array && function (d, b) {
        // 效果和上面用Object.setPrototypeOf方法是一样的，这边更粗暴一点
        d.__proto__ = b;
      }) ||
      function (d, b) {
        // 老版本的编译器对于静态属性的继承是用这一块代码实现的，
        // 稍后将贴出老版本编译器生成的代码
        // 这块代码是将Sup函数对象的实例方法或者属性浅拷贝给Sub函数对象
        // （用hasOwnProperty排除了apply等从原型链上继承过来的方法）
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    // 这个是真正的__extends函数本体
    // 参数d为Sub,b为Sup
    return function (d, b) {
      // 这个最终返回的匿名函数作为闭包能够访问到外层函数作用域的extendStatics函数
      // 闭包的定义：有权访问另一个函数作用域中的变量的函数
      // 注意，是这个返回的匿名函数被称为闭包
      // 之所以采用这样的方式，一旦extendStatics通过第一次的布尔运算被确定下来，
      // 以后每次调用__extends函数的时候就可以用这个确定下来的extendStatics函数了
      extendStatics(d, b);
      function __() {
        // 因为下面要用这个构造函数的实例来重写Sub函数的原型对象，
        // 若不重新将原型对象的constructor属性指向Sub函数，
        // 则将直接指向Object构造函数，就不能通过constructor确定subObj对象的类型了。
        this.constructor = d;
      }

      // 当让Sub继承null即"class Sub extends null"的时候，
      // 会调用这个Object.create函数，
      // Object.create(null)会返回一个没有任何属性和方法的对象
      // 和用new Object()或对象字面量{}创建对象不同，
      // 后者会从Object原型上继承属性和方法。
      // "class Sub extends null"即表明Sub.prototype就是它所在原型链的开端
      // 接下来讨论extend后面跟的是个的类的时候
      // 将__函数的prototype指向Sup.prototype,然后将__函数的实例作为Sub的prototype
      // 本质上对Sup.prototype的一个浅拷贝，
      // 如果直接将Sup.prototype赋给Sub.prototype也可以实现原型继承
      // 但后者会导致在Sub.prototype上挂在属性和方法时影响到Sup。
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })()
```

```js

"use strict";
/* 获取{} */
console.log(this)
/* 如果__decorate未定义则定义它，var声明函数自动为this下成员 
第一个参数为装饰器数组，第二个参数为装饰器目标，key为元数据键。desc为方法的描述符*/

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    /* 获取参数长度，当参数长度小于3,说嘛目标就是target，否则目标为方法描述符，描述符不存在时，通过key从target获取，即认为key是方法名 */
    
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    
    /* 
        如果Reflect的decorate方法存在，则调用这个方法为目标调用装饰器方法数组，这个方法在reflect-matadata包中实现 
    */
    
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
   
    /* 
        如果Reflect.decorate方法不存在，则手动调用装饰方法，注意是倒序调用
        如果参数长度小于3说明是类装饰器，直接将类传递给装饰器方法
        如果参数长度等于3说明是类装饰器，但是key参数存在，与类一同传递给装饰器方法
        如果参数长度大于3说明是方法装饰器，将类、key、方法描述符传递给装饰器方法
        同时获取装饰器方法执行完毕的target给r，如果装饰器方法执行完毕没有返回值，则使用之前的r 
    */
    
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    
    /* 
        返回r，参数小于3时为类对象，参数大于3时为方法描述符
        当为描述符时需要重新将其定义到target上 
    */
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
 
/* 装饰器工厂，可以获取在类上定义指定键值对的装饰器，一般用来定义emitDecoratorMetadata */
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
 
/* 参数装饰器工厂，用来获取参数装饰器，第一个参数为参数下标，第二个参数为装饰器 */
var __param = (this && this.__param) || function (paramIndex, decorator) {
    /* 返回参数装饰器，参数为类、属性名、属性下标 */
    return function (target, key) { decorator(target, key, paramIndex); }
};
 
/* 生成器函数的执行器，原有的async函数会被转换为生成器函数，前三个参数为this、void、void
这个函数在编译目标为ES2016时依然存在，ES2017时即支持原生的async/await */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    /* 生成器函数重新包裹为Promise */
    return new (P || (P = Promise))(function (resolve, reject) {
        /* 满足函数，用来递归的执行遍历器的下一个结果 */
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        /* 拒绝函数，用来使遍历器抛出异常 */
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        /* 处理遍历器的下一个结果，即next结果
        如果状态为done直接resolve 
        如果状态不是done，返回新的Promise，通过fulfilled函数再次获取遍历器的下一个next值*/
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        /* 获取生成器函数的遍历器 */
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

Object.defineProperty(exports, "__esModule", { value: true })
```


## _decorate

执行装饰器的函数，被执行的装饰器分为四类，类装饰器、参数装饰器、方法装饰器，还有一类特殊的装饰器是ts编译选项emitDecoratorMetadata生成的装饰器，用来定义一些特殊元数据design:paramtypes等，这些特殊元数据可以获取编译之前的类型信息

## __metadata
类装饰器工厂，获取的装饰器会将指定键值对与类关联起来

## __param
参数装饰器工厂，根据参数下标、参数装饰器、获取最终的装饰器，并且将参数下标传递给装饰器_

## __awaiter
生成器函数执行器，主要是针对async/await的，在es2017之前都不支持async/await的，需要转化为generate函数,通过遍历器、yield等执行，但是其内部采用Promise来实现

另外，当编译选项中 `emitDecoratorMetadata` 为true时，编译生成的js文件中会设置一些特殊的元数据，如

```js
__decorate(
    [
        graphql_1.Mutation("deletePropertyValue"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], 
    
    PropertyValueResolver.prototype, 
    "deletePropertyValue",
    null
)

PropertyValueResolver = __decorate(
    [
        graphql_1.Resolver("PropertyValue"),
        __param(0, common_1.Inject(property_value_service_1.PropertyValueService)),
        __metadata("design:paramtypes", [property_value_service_1.PropertyValueService])
    ], 
    PropertyValueResolver
)
```

可以看到在方法上使用装饰器时，额外定义了
- design:type
- design:paramtypes
- design:returntype
这三个元数据，分别代表了方法的类型Function、方法的参数类型、方法的返回类型，这些都是从编译前的ts文件获取的在类上使用装饰器时，额外定义了design:paramtypes这个元数据，即构造函数的参数类型

```js
__decorate(
    [
        typeorm_1.Column({
            name: "name",
            type: "varchar",
            length: 20
        }),
        __metadata("design:type", String)
    ], 
    GoodsProperty.prototype, 
    "name",
    void 0
)
```

可以看到在属性上使用装饰器时，额外定义了 `design:type` 元数据，代表了属性类型

说明 `emitDecoratorMetadata` 会让编译ts文件时将构造函数的参数类型、类属性类型、类方法类型、方法参数类型、方法返回值类型这些类型信息在js文件中通过元数据的形式注入


##  参考：
- 详解Typescript中继承的实现
    - https://blog.csdn.net/qq_19300203/article/details/72566136
- javascript – 理解typescript生成的__extends函数？
    - https://codeday.me/bug/20180902/241971.html
- https://blog.csdn.net/qq_27868061/article/details/79912054 