[TOC]
# 概述
在Go语言中
- ==接口(interface)是一个自定义类型==
- 接口类型具体==描述了一系列方法的集合==。

==接口类型是一种抽象的类型==，它不会暴露出它所代表的对象的内部值的结构和这个对象支持的基础操作的集合，==它们只会展示出它们自己的方法==。

==因此接口类型不能将其实例化==。

Go通过接口实现了鸭子类型(duck-typing)：“当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子”。

我们并不关心对象是什么类型，到底是不是鸭子，==只关心行为==。

#  接口的使用
##  接口定义

```JS
type Humaner interface {
    SayHi()
}
```

- 接口命名习惯以 er 结尾
- 接口只有方法声明，没有实现，没有数据字段
- 接口可以匿名嵌入其它接口，或嵌入到结构中

## 接口实现
接口是用来定义行为的类型。  
==这些被定义的行为不由接口直接实现，而是通过方法由用户定义的类型实现==，

一个==实现了这些方法的具体类型== 是这个==接口类型的实例==。

如果用户 `定义的类型实现` 了某个 `接口类型声明的一组方法` ，那么这个用户定义的类型的值就可以赋给这个接口类型的值。

这个赋值会把用户定义的类型的值存入接口类型的值。

```js
package main

import "fmt"

//定义接口类型
type Humaner interface {
	//方法，只有声明，没有实现，由别的类型（自定义类型）实现
	sayhi()
}

type Student struct {
	name string
	id   int
}

//Student 实现了此方法
func (tmp *Student) sayhi() {
	fmt.Printf("Student[%s, %d] sayhi\n", tmp.name, tmp.id)
}

type Teacher struct {
	addr  string
	group string
}

//Teacher 实现了此方法
func (tmp *Teacher) sayhi() {
	fmt.Printf("Teacher[%s, %s] sayhi\n", tmp.addr, tmp.group)
}

type MyStr string

//MyStr实现了此方法
func (tmp *MyStr) sayhi() {
	fmt.Printf("MyStr[%s] sayhi\n", *tmp)
}

//定义一个普通函数，函数的参数为接口类型
//只有一个函数，可以有不同表现，多态
func WhoSayHi(i Humaner) {
	i.sayhi()
}

func main() {
	s := &Student{"mike", 666}
	t := &Teacher{"bj", "go"}
	var str MyStr = "hello mike"

	//调用同一函数，不同表现，多态，多种形态
	WhoSayHi(s)
	WhoSayHi(t)
	WhoSayHi(&str)

	//创建一个切片
	x := make([]Humaner, 3)
	x[0] = s
	x[1] = t
	x[2] = &str

	//第一个返回下标，第二个返回下标所对应的值
	for _, i := range x {
		i.sayhi()
	}

}

func main01() {
	//定义接口类型的变量
	var i Humaner

	//只是实现了此接口方法的类型，那么这个类型的变量（接收者类型）就可以给i赋值
	s := &Student{"mike", 666}
	i = s
	i.sayhi()

	t := &Teacher{"bj", "go"}
	i = t
	i.sayhi()

	var str MyStr = "hello mike"
	i = &str
	i.sayhi()

}

```

## 接口组合(接口继承)

### 接口嵌入
如果一个 `interface1` 作为 `interface2` 的一个嵌入字段，那么 `interface2` 隐式的包含了`interface1`里面的方法。

```js
package main

import "fmt"

type Humaner interface { //子集
	sayhi()
}

type Personer interface { // 超集
	Humaner //匿名字段，继承了sayhi()
	sing(lrc string)
}

type Student struct {
	name string
	id   int
}

//Student实现了sayhi()
func (tmp *Student) sayhi() {
	fmt.Printf("Student[%s, %d] sayhi\n", tmp.name, tmp.id)
}

func (tmp *Student) sing(lrc string) {
	fmt.Println("Student在唱着：", lrc)
}

func main() {
	//定义一个接口类型的变量
	var i Personer
	s := &Student{"mike", 666}
	i = s

	i.sayhi() //继承过来的方法
	i.sing("学生哥")
}
```

### 接口转换
`超集接口对象` 可转换为 `子集接口` ，反之出错：

```js
package main

import "fmt"

type Humaner interface { //子集
	sayhi()
}

type Personer interface { // 超集
	Humaner //匿名字段，继承了sayhi()
	sing(lrc string)
}

type Student struct {
	name string
	id   int
}

//Student实现了sayhi()
func (tmp *Student) sayhi() {
	fmt.Printf("Student[%s, %d] sayhi\n", tmp.name, tmp.id)
}

func (tmp *Student) sing(lrc string) {
	fmt.Println("Student在唱着：", lrc)
}

func main() {
	//超集可以转换为子集，反过来不可以
	var iPro Personer // 超集
	iPro = &Student{"mike", 666}

	var i Humaner //子集

	//iPro = i //err
	i = iPro   // 可以，超集可以转换为子集
	i.sayhi()

}

```

## 空接口
空接口(`interface{}`)不包含任何的方法，正因为如此，所有的类型都实现了空接口，因此空接口可以存储任意类型的数值。它有点类似于C语言的void *类型。


```js
var v1 interface{} = 1     // 将int类型赋值给interface{}
var v2 interface{} = "abc" // 将string类型赋值给interface{}
var v3 interface{} = &v2   // 将*interface{}类型赋值给interface{}
var v4 interface{} = struct{ X int }{1}
var v5 interface{} = &struct{ X int }{1}
```

当函数可以接受任意的对象实例时，我们会将其声明为interface{}，最典型的例子是标准库fmt中PrintXXX系列的函数，例如：
  
```js
func Printf(fmt string, args ...interface{})
func Println(args ...interface{})
```

```js
package main

import "fmt"

func xxx(arg ...interface{}) {

}

func main() {
	//空接口万能类型，保存任意类型的值
	var i interface{} = 1
	fmt.Println("i = ", i)

	i = "abc"
	fmt.Println("i = ", i)
}

```


# 参考
- https://blog.biezhi.me/2019/01/learn-golang-interfaces.html