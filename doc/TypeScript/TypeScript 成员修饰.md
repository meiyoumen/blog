[toc]
# 继承
```js
namespace c1 {
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

}

```
这个例子展示了一些上面没有提到的特性。 这一次，我们使用 `extends` 关键字创建了 `Animal` 的两个子类： `Horse` 和 `Snake`。

==派生类包含了一个构造函数，它必须调用 `super()`，它会执行基类的构造函数。==  
而且，在构造函数里访问 `this` 的属性之前，我们 一定要调用 `super(`)。  
这个是TypeScript强制执行的一条重要规则。

==这个例子演示了如何在子类里可以重写父类的方法==。 `Snake类` 和 `Horse类` 都创建了 `move` 方法，它们重写了从 `Anima`l 继承来的 `move`方法，使得 `move`方法根据不同的类而具有不同的功能。 

注意，==即使 `tom` 被声明为 `Animal类型` ，但因为它的值是 `Horse`，调用 `tom.move(34)`时，它会调用 `Horse`里重写的方法==。

# 公共，私有与受保护的修饰符
在上面的例子里，我们可以自由的访问程序里定义的成员。

如果你对其它语言中的类比较了解，就会注意到我们在之前的代码里并没有使用。
## 默认为 public
 `public `来做修饰；例如，C#要求必须明确地使用 public指定成员是可见的。  
 ==在TypeScript里，成员都默认为 public==。

你也可以明确的将一个成员标记成 `public`。 我们可以用下面的方式来重写上面的 Animal类：

```js
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

## 理解 private
当成员被标记成 `private` 时，它就==不能在声明它的类的外部访问==。比如：

```js
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 错误: 'name' 是私有的.
```

TypeScript使用的是结构性类型系统。 当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。

然而，当我们比较带有 `private` 或 `protected` 成员的类型的时候，情况就不同了。

==如果其中一个类型里包含一个 `private` 成员，那么只有当另外一个类型中也存在这样一个 `private`成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的==

对于 `protected` 成员也使用这个规则。

下面来看一个例子，更好地说明了这一点：


```js
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

// 继承Animal
class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    // name 和 Animal中成员name 不是同一处
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat")
let rhino = new Rhino();

let employee = new Employee("Bob");

animal = rhino;
animal = employee; // 错误: Animal 与 Employee 不兼容.
```

- 这个例子中有 `Animal` 和 `Rhino` 两个类，`Rhino` 是 `Animal`类的子类。
- 还有一个 Employee类，其类型看上去与 Animal是相同的。 



我们创建了几个这些类的实例，并相互赋值来看看会发生什么。 
- 因为 `Animal` 和 `Rhino` 享了来自 `Animal` 里的私有成员定义 `private name: string`，因此它们是兼容的。 

- 然而 `Employee` 却不是这样。当把 `Employee` 赋值给 `Animal` 的时候，得到一个错误，说它们的类型不兼容。 尽管 `Employee` 里也有一个私有成员 `name`，但它明显不是 `Animal` 里面定义的那个。


## 理解 protected
`protected` 修饰符与 `private` 修饰符的行为很相似，但有一点不同，== `protected` 成员在派生类中仍然可以访问==。例如：


```js
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales")

console.log(howard.getElevatorPitch())
console.log(howard.name); // 错误 属性'name'受到保护，只能在类'Person'及其子类中访问。
```
注意，我们不能在 `Person` 类外使用 `name`，但是我们仍然可以通过 `Employee`类的实例方法访问，因为 `Employee`是由` Person` 派生而来的。

### 构造函数也可以被标记成 protected
这意味着==这个类不能在包含它的类外被实例化==，但是能被继承。比如，

```js
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee 能够继承 Person
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");

let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
```

## readonly修饰符
你可以使用 `readonly` 关键字将属性设置为==只读的==。 ==只读属性必须在 声明时 或 构造函数 里被初始化==。

```js
class Octopus {
    readonly name: string;

    // 声明时初始化
    readonly numberOfLegs: number = 8;
    
    constructor (theName: string) {
        // 构造函数中初始化
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
```

## 参考java访问权限修饰符
作用域  | 	当前类	|  同一package	|  子孙类 | 	其他package
---|---|---|---|---
public	     | 	√  |  √  | 	√ | √
protected	 | 	√  |  √  |	√ |	×
friendly	 | 	√  |  √  |	× |	×
private	     | 	√  |  ×  |	× | ×
