[TOC]
# 方法是什么

在 Go 语言中，`结构体` 就像是 `类的一种简化形式`，那么面向对象程序员可能会问：==类的方法在哪里呢==？

在 Go 中有一个概念，==它和方法有着同样的名字，并且大体上意思相同==：  
Go 方法是==作用在接收者（receiver）上的一个函数，接收者是某种类型的变量==。

因此方法是一种特殊类型的函数。

接收者类型可以是（几乎）任何类型，==不仅仅是结构体类型，任何类型都可以有方法，甚至可以是函数类型，可以是 int、bool、string 或数组的别名类型==。

==但是接收者不能是一个接口类型（参考 第 11 章），因为接口是一个抽象定义，但是方法却是具体实现==；如果这样做会引发一个编译错误：invalid receiver type…。

最后接收者不能是一个指针类型，但是它可以是任何其他允许类型的指针。

一个类型加上它的方法等价于面向对象中的一个类。

一个重要的区别是：在 Go 中，==类型的代码和绑定在它上面的方法的代码可以不放置在一起==，它们可以存在在不同的源文件，
唯一的要求是==：它们必须是同一个包的==。

`类型 T（或 *T）` 上的所有方法的集合叫做 `类型 T（或 *T）的方法集`。

因为方法是函数，所以同样的，==不允许方法重载==，即对于一个类型只能有一个给定名称的方法。

但是如果基于接收者类型，是有重载的：具有同样名字的方法可以在 2 个或多个不同的接收者类型上存在，==比如在同一个包里这么做是允许的==：


```js
func (a *denseMatrix) Add(b Matrix) Matrix
func (a *sparseMatrix) Add(b Matrix) Matrix
```

别名类型不能有它原始类型上已经定义过的方法。

定义方法的一般格式如下：


```js
func (recv receiver_type) methodName(parameter_list) (return_value_list) { ... }
```
在方法名之前，`func` 关键字之后的括号中指定 `receiver`。

- 如果 `recv` 是 `receiver` 的实例，Method1 是它的方法名，那么方法调用遵循传统的 `object.name `选择器符号：`recv.Method1()`。
- 如果 `recv` 一个指针，Go 会自动解引用。
- 如果方法不需要使用 `recv` 的值，可以用 `_ `替换它，比如：

```js
func (_ receiver_type) methodName(parameter_list) (return_value_list) { ... }
```

==`recv` 就像是面向对象语言中的 `this` 或 `self`，但是 Go 中并没有这两个关键字==。

随个人喜好，你可以使用 this 或 self 作为 receiver 的名字。

### 结构体上的简单方法的例子：
```js
package main

import "fmt"

type TwoInts struct {
    a int
    b int
}

func main() {
    two1 := new(TwoInts)
    
    two1.a = 12
    two1.b = 10

    fmt.Printf("The sum is: %d\n", two1.AddThem())                      // The sum is: 22
    fmt.Printf("Add them to the param: %d\n", two1.AddToParam(20))      // Add them to the param: 42

    two2 := TwoInts{3, 4}
    fmt.Printf("The sum is: %d\n", two2.AddThem())                      // The sum is: 7
}

func (tn *TwoInts) AddThem() int {
    return tn.a + tn.b
}

func (tn *TwoInts) AddToParam(param int) int {
    return tn.a + tn.b + param
}
```

### 非结构体类型上方法的例子


```js
package main

import "fmt"

type IntVector []int

func (v IntVector) Sum() (s int) {
    for _, x := range v {
        s += x
    }
    return
}

func main() {
    fmt.Println(IntVector{1, 2, 3}.Sum()) // 输出是6
}
```


## 函数和方法的区别
- 函数将变量作为参数：Function1(recv)
- 方法在变量上被调用：recv.Method1()
- 在接收者是指针时，方法可以改变接收者的值（或状态），这点函数也可以做到（当参数作为指针传递，即通过引用调用时，函数也可以改变参数的状态）。


## 指针或值 作为接收者

鉴于性能的原因，recv 最常见的是一个指向 receiver_type 的指针（因为我们不想要一个实例的拷贝，如果按值调用的话就会是这样），特别是在 receiver 类型是结构体时，就更是如此了。

==如果想要方法改变接收者的数据，就在接收者的指针类型上定义该方法。否则，就在普通的值类型上定义方法。==

下面的例子：  
- change() 接受一个指向 B 的指针，并改变它内部的成员；
- write() 接受通过拷贝接受 B 的值并只输出 B 的内容。

注意 Go 为我们做了探测工作，我们自己并没有指出是否在指针上调用方法，Go 替我们做了这些事情。==b1 是值而 b2 是指针，方法都支持运行了==。

```JS
package main

import (
    "fmt"
)

type B struct {
    thing int
}

func (b *B) change() { b.thing = 1 }

func (b B) write() string { return fmt.Sprint(b) }

func main() {
    var b1 B    // b1是值
    
    b1.change()
    fmt.Println(b1.write())

    b2 := new(B) // b2是指针
    b2.change()
    fmt.Println(b2.write())
}

/* 输出：
{1}
{1}
*/
```


##  内嵌类型的方法和继承

当一个 `匿名类型` 被 `内嵌` 在 `结构体中时`，==匿名类型的可见方法也同样被内嵌==，这在效果上等同于外层类型 `继承` 了这些方法：==将父类型放在子类型中来实现亚型==。


这个机制提供了一种简单的方式来模拟经典面向对象语言中的子类和继承相关的效果，也类似 Ruby 中的混入（mixin）。

假定有一个 Engine 接口类型，一个 Car 结构体类型，它包含一个 Engine 类型的匿名字段：


```js
type Engine interface {
    Start()
    Stop()
}

type Car struct {
    Engine
}
```


```js
func (c *Car) GoToWorkIn() {
    // get in car
    c.Start()
    // drive to work
    c.Stop()
    // get out of car
}
```

看一个完整的例子


```js
package main

import (
    "fmt"
    "math"
)

type Point struct {
    x, y float64
}

func (p *Point) Abs() float64 {
    return math.Sqrt(p.x*p.x + p.y*p.y)
}

type NamedPoint struct {
    Point
    name string
}

func main() {
    n := &NamedPoint{Point{3, 4}, "Pythagoras"}
    fmt.Println(n.Abs()) // 打印5
}
```
内嵌将一个已存在类型的字段和方法注入到了另一个类型里：匿名字段上的方法 “晋升” 成为了外层类型的方法。当然类型可以有只作用于本身实例而不作用于内嵌 “父” 类型上的方法


##  如何在类型中嵌入功能

- A：聚合（或组合）：包含一个所需功能类型的具名字段。
- B：内嵌：内嵌（匿名地）所需功能类型


为了使这些概念具体化，假设有一个 `Customer` 类型，我们想让它通过 `Log` 类型来包含日志功能，Log 类型只是简单地包含一个累积的消息（当然它可以是复杂的）。

如果想让特定类型都具备日志功能，你可以实现一个这样的 Log 类型，然后将它作为特定类型的一个字段，并提供 Log()，它返回这个日志的引用。

方式 A 可以通过如下方法实现

```js
package main

import (
    "fmt"
)

type Log struct {
    msg string
}

type Customer struct {
    Name string
    log  *Log
}

func main() {
    c := new(Customer)
    c.Name = "Barak Obama"
    
    c.log = new(Log)
    c.log.msg = "1 - Yes we can!"
    
    // shorter
    c = &Customer{"Barak Obama", &Log{"1 - Yes we can!"}}
    
    // fmt.Println(c) &{Barak Obama 1 - Yes we can!}
    c.Log().Add("2 - After me the world will be a better place!")
    
    //fmt.Println(c.log)
    fmt.Println(c.Log())

}

func (l *Log) Add(s string) {
    l.msg += "\n" + s
}

func (l *Log) String() string {
    return l.msg
}

func (c *Customer) Log() *Log {
    return c.log
}

// 1 - Yes we can!
// 2 - After me the world will be a better place!
```

相对的方式 B 可能会像这样：


```js
package main

import (
    "fmt"
)

type Log struct {
    msg string
}

type Customer struct {
    Name string
    Log
}

func main() {
    c := &Customer{"Barak Obama", Log{"1 - Yes we can!"}}
    c.Add("2 - After me the world will be a better place!")
    fmt.Println(c)

}

func (l *Log) Add(s string) {
    l.msg += "\n" + s
}

func (l *Log) String() string {
    return l.msg
}

func (c *Customer) String() string {
    return c.Name + "\nLog:" + fmt.Sprintln(c.Log)
}
```
