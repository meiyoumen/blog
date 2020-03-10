[TOC]
# 概述
对于面向对象编程的支持Go 语言设计得非常简洁而优雅。因为， Go语言并没有沿袭传统面向对象编程中的诸多概念，比如继承(不支持继承，尽管匿名字段的内存布局和行为类似继承，但它并不是继承)、虚函数、构造函数和析构函数、隐藏的this指针等。

尽管Go语言中没有封装、继承、多态这些概念，但同样通过别的方式实现这些特性：
- 封装：通过方法实现
- 继承：通过匿名字段实现
- 多态：通过接口实现

# 匿名组合
## 匿名字段
一般情况下，定义结构体的时候是字段名与其类型一一对应，
实际上Go支持==只提供类型，而不写字段名的方式，也就是匿名字段，也称为嵌入字段==。

当匿名字段也是一个结构体的时候，那么这个结构体所拥有的全部字段都被隐式地引入了当前定义的这个结构体。

```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别
	age  int    //年龄
}

// 匿名字段 Person
type Student struct {
	Person  // 只有类型，没有名字，匿名字段，继承了Person的成员
	id     int
	addr   string
}

func main() {
	//顺序初始化
	var s1 Student = Student{Person{"mike", 'm', 18}, 1, "bj"}
	fmt.Println("s1 = ", s1)  // s1 =  {{mike 109 18} 1 bj}

	//自动推导类型
	s2 := Student{Person{"mike", 'm', 18}, 1, "bj"}
	//fmt.Println("s2 = ", s2)
	//%+v, 显示更详细
	fmt.Printf("s2 = %+v\n", s2) // s2 = {Person:{name:mike sex:109 age:18} id:1 addr:bj}

	//指定成员初始化，没有初始化的常用自动赋值为0
	s3 := Student{id: 1}
	fmt.Printf("s3 = %+v\n", s3) // s3 = {Person:{name: sex:0 age:0} id:1 addr:}

	s4 := Student{Person: Person{name: "mike"}, id: 1}
	fmt.Printf("s4 = %+v\n", s4) // s4 = {Person:{name:mike sex:0 age:0} id:1 addr:}

	//s5 := Student{"mike", 'm', 18, 1, "bj"} //err

}

```
## 成员操作
```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

type Student struct {
	Person //只有类型，没有名字，匿名字段，继承了Person的成员
	id     int
	addr   string
}

func main() {
	s1 := Student{Person{"mike", 'm', 18}, 1, "bj"}
	
	//给成员赋值

	s1.name = "yoyo"  // //等价于 s1.Person.name = "mike"
	s1.sex = 'f'
	s1.age = 22
	s1.id = 666
	s1.addr = "sz"

	fmt.Printf("s1 = %+v\n", s1)   // s1 = {Person:{name:yoyo sex:102 age:22} id:666 addr:sz}

	s1.Person = Person{"go", 'm', 18}
	
	fmt.Printf("s1 = %+v\n", s1)  // s1 = {Person:{name:go sex:109 age:18} id:666 addr:sz}

	fmt.Println(s1.name, s1.sex, s1.age, s1.id, s1.addr)  // go 109 18 666 sz
}
```

## 同名字段
就近原则

```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

type Student struct {
	Person //只有类型，没有名字，匿名字段，继承了Person的成员
	id     int
	addr   string
	name   string //和Person同名了
}

func main() {
	//声明（定义一个变量）
	var s Student

	//默认规则（纠结原则），如果能在本作用域找到此成员，就操作此成员
	//					如果没有找到，找到继承的字段
	s.name = "mike" //操作的是Student的name，还是Person的name?, 结论为Student的
	s.sex = 'm'
	s.age = 18
	s.addr = "bj"

	//显式调用
	s.Person.name = "yoyo" //Person的name

	fmt.Printf("s = %+v\n", s)  // s = {Person:{name:yoyo sex:109 age:18} id:0 addr:bj name:mike}

}

```

## 其它匿名字段

## 非结构体类型
所有的内置类型和自定义类型都是可以作为匿名字段的：

```js
package main

import "fmt"

type mystr string //自定义类型，给一个类型改名

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

type Student struct {
	Person // 结构体匿名字段
	int    // 基础类型的匿名字段
	mystr
}

func main() {
	s := Student{Person{"mike", 'm', 18}, 666, "hehehe"}
	fmt.Printf("s = %+v\n", s)  // s = {Person:{name:mike sex:109 age:18} int:666 mystr:hehehe}

	s.Person = Person{"go", 'm', 22}

	fmt.Println(s.name, s.age, s.sex, s.int, s.mystr)  // go 22 109 666 hehehe
	fmt.Println(s.Person, s.int, s.mystr)              // {go 109 22} 666 hehehe
}
```

## 结构体指针类型

```js
package main

import "fmt"

type Person struct {
	name string // 名字
	sex  byte   // 性别, 字符类型
	age  int    // 年龄
}

type Student struct {
	*Person     // 匿名字段，结构体指针类型
	id      int
	addr    string
}

func main() {
    
    // 初始化 指针类型取址
	s1 := Student{&Person{"mike", 'm', 18}, 666, "bj"}
	
	fmt.Println(s1.name, s1.sex, s1.age, s1.id, s1.addr)  // mike 109 18 666 bj

	//先定义变量
	var s2 Student
	s2.Person = new(Person) //分配空间
	s2.name = "yoyo"
	s2.sex = 'm'
	s2.age = 18
	s2.id = 222
	s2.addr = "sz"
	fmt.Println(s2.name, s2.sex, s2.age, s2.id, s2.addr)  // yoyo 109 18 222 sz

}

```

# 面向过程和对象函数的区别

```js
package main

import "fmt"

//实现2数相加
//面向过程
func Add01(a, b int) int {
	return a + b
}

//面向对象，方法：给某个类型绑定一个函数
type long int
type mylong int

//tmp叫接收者，接收者就是传递的一个参数
func (tmp long) Add02(other long) long {
	return tmp + other
}

func (tmp mylong) Add03(other mylong) mylong  {
	return  tmp + other
}

func main() {
	var result int
	result = Add01(1, 1) //普通函数调用方式
	fmt.Println("result = ", result)

	//定义一个变量
	var a long = 2
	//调用方法格式： 变量名.函数(所需参数)
	r := a.Add02(3)
	fmt.Println("r = ", r)

	//面向对象只是换了一种表现形式
	var b mylong = 5
	r2 := b.Add03(10)
	fmt.Println("r2=", r2)

}


```

# 方法
## 概述
在面向对象编程中，一个对象其实也就是一个简单的值或者一个变量，==在这个对象中会包含一些函数，这种带有接收者的函数，我们称为方法(method)==。 

本质上，==一个方法则是一个和特殊类型关联的函数==。

一个面向对象的程序会用方法来表达其属性和对应的操作，这样使用这个对象的用户就不需要直接去操作对象，而是借助方法来做这些事情。

在Go语言中，可以给任意自定义类型（包括内置类型，但不包括指针类型）添加相应的方法。

==方法总是绑定对象实例，并隐式将实例作为第一实参 (receiver)==，方法的语法如下：

```
func (receiver ReceiverType) funcName(parameters) (results)
```

- 参数 receiver 可任意命名。如方法中未曾使用，可省略参数名。
- 参数 receiver 类型可以是 T 或 *T。==基类型 T 不能是接口或指针==。
- 不支持重载方法，也就是说，不能定义名字相同但是不同参数的方法。

## 为 ==`类型`==  ==`添加方法`==

### 基础类型作为接收者

```js
type MyInt int //自定义类型，给int改名为MyInt

// 在函数定义时，在其名字之前放上一个变量，即是一个方法
func (a MyInt) Add(b MyInt) MyInt { //面向对象
    return a + b
}

// 传统方式的定义
func Add(a, b MyInt) MyInt { //面向过程
    return a + b
}

func main() {
    var a MyInt = 1
    var b MyInt = 1

    //调用func (a MyInt) Add(b MyInt)
    fmt.Println("a.Add(b) = ", a.Add(b))   //a.Add(b) =  2

    //调用func Add(a, b MyInt)
    fmt.Println("Add(a, b) = ", Add(a, b)) //Add(a, b) =  2
}
```

通过上面的例子可以看出，==面向对象只是换了一种语法形式来表达==。  

方法是函数的语法糖，因为receiver其实就是方法所接收的第1个参数。

注意：==虽然方法的名字一模一样，但是如果接收者不一样，那么方法就不一样==。


### 结构体作为接收者
方法里面可以访问接收者的字段，调用方法通过点( `. `)访问，就像struct里面访问字段一样：


```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

// 带有接收者的函数叫方法
func (tmp Person) PrintInfo() {
	fmt.Println("tmp = ", tmp)
}

//通过一个函数，给成员赋值
func (p *Person) SetInfo(n string, s byte, a int) {
	p.name = n
	p.sex = s
	p.age = a
}


func main() {
	//定义同时初始化
	p := Person{"mike", 'm', 18}
	p.PrintInfo()   // tmp =  {mike 109 18}

	//定义一个结构体变量
	var p2 Person
	(&p2).SetInfo("yoyo", 'f', 22)
	p2.PrintInfo()  // tmp =  {yoyo 102 22}

}
```

## 值语义和引用语义


```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

//修改成员变量的值

//值作为接收者，值语义，一份拷贝
func (p Person) SetInfoValue(n string, s byte, a int) {
	p.name = n
	p.sex = s
	p.age = a
	fmt.Println("p = ", p)                      // p =  {mike 109 18}
	fmt.Printf("SetInfoValue &p = %p\n", &p)    // SetInfoValue &p = 0xc0000044e0
}

//指针作为接收者，引用语义
func (p *Person) SetInfoPointer(n string, s byte, a int) {
	p.name = n
	p.sex = s
	p.age = a

	fmt.Printf("SetInfoPointer p = %p\n", p) // SetInfoPointer p = 0xc0000044a0
}

func main() {
    // 初始化
	s1 := Person{"go", 'm', 22}
	fmt.Printf("&s1 = %p\n", &s1) //打印地址  &s1 = 0xc0000044a0

	//值语义（不是引用传递） s1 还是初始化的值
	s1.SetInfoValue("mike", 'm', 18)
	fmt.Println("s1 = ", s1)  // s1 =  {go 109 22}

	//引用语义
	(&s1).SetInfoPointer("mike", 'm', 18)
	fmt.Println("s1 = ", s1)  // s1 =  {mike 109 18}
}
```

## 方法集
类型的方法集是指可以被该类型的值调用的所有方法的集合。

用实例实例 `value` 和 `pointer` 调用方法（含匿名字段）不受方法集约束，编译器编总是查找全部方法，并自动转换 receiver 实参。


## 类型 `*T` 方法集
一个指向==自定义类型的值的指针==，它的方法集由该类型定义的所有方法组成，无论这些方法接受的是一个值还是一个指针。

如果在指针上调用一个接受值的方法，==Go语言会聪明地将该指针解引用==，并将指针所指的底层值作为方法的接收者。

类型 `*T` 方法集包含全部 `receiver T + *T` 方法：

### 类型 *T 方法集 (指针变量的方法集)


```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

func (p Person) SetInfoValue() {
	fmt.Println("SetInfoValue")
}

func (p *Person) SetInfoPointer() {
	fmt.Println("SetInfoPointer")
}

func main() {
	//结构体变量是一个指针变量，它能够调用哪些方法，这些方法就是一个集合，简称方法集
	p := &Person{"mike", 'm', 18}
	//p.SetInfoPointer() //func (p *Person) SetInfoPointer()
	
	(*p).SetInfoPointer() //把(*p)转换层p后再调用，等价于上面

	//内部做的转换， 先把指针p， 转成*p后再调用
	//(*p).SetInfoValue()
	p.SetInfoValue()

}
```

### 类型 T 方法集 (普通变量的方法集)
一个自定义类型值的方法集则由为该类型定义的接收者类型为值类型的方法组成，但是不包含那些接收者类型为指针的方法。

但这种限制通常并不像这里所说的那样，因为如果我们只有一个值，仍然可以调用一个接收者为指针类型的方法，这可以借助于Go语言传值的地址能力实现。



```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

func (p Person) SetInfoValue() {
	fmt.Println("SetInfoValue")
}

func (p *Person) SetInfoPointer() {
	fmt.Println("SetInfoPointer")
}

func main() {
	p := Person{"mike", 'm', 18}
	p.SetInfoPointer() //func (p *Person) SetInfoPointer()
	//内部，先把p, 转为为&p再调用， (&p).SetInfoPointer()

	p.SetInfoValue()
}
```

## 匿名字段

### 方法的继承
如果`匿名字段` 实现了一个方法，==那么包含这个匿名字段的struct也能调用该方法==。

```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

//Person类型，实现了一个方法
func (tmp *Person) PrintInfo() {
	fmt.Printf("name=%s, sex=%c, age=%d\n", tmp.name, tmp.sex, tmp.age)
}

//有个学生，继承Person字段，成员和方法都继承了
type Student struct {
	Person //匿名字段
	id     int
	addr   string
}

func main() {
	s := Student{Person{"mike", 'm', 18}, 666, "bj"}
	s.PrintInfo()  // name=mike, sex=m, age=18
}
```


### 方法的重写
两个结构体类型定义了同名方法
```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

//Person类型，实现了一个方法
func (tmp *Person) PrintInfo() {
	fmt.Printf("name=%s, sex=%c, age=%d\n", tmp.name, tmp.sex, tmp.age)
}

//有个学生，继承Person字段，成员和方法都继承了
type Student struct {
	Person //匿名字段
	id     int
	addr   string
}

//Student也实现了一个方法，这个方法和Person方法同名，这种方法叫重写
func (tmp *Student) PrintInfo() {
	fmt.Println("Student: tmp = ", tmp)
}

func main() {
	s := Student{Person{"mike", 'm', 18}, 666, "bj"}
	//就近原则：先找本作用域的方法，找不到再用继承的方法
	s.PrintInfo() //到底调用的是Person， 还是Student， 结论是Student

	//显式调用继承的方法
	s.Person.PrintInfo()
}

```

## 表达式
类似于我们可以对函数进行赋值和传递一样，方法也可以进行赋值和传递。

根据调用者不同，方法分为两种表现形式：
- 方法值
- 方法表达式。

两者都可像普通函数那样赋值和传参，区别在于
- 方法值绑定实例，
- 方法表达式则须显式传参

### 方法值
==隐藏了接收者==
```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

func (p Person) SetInfoValue() {
	fmt.Printf("SetInfoValue: %p, %v\n", &p, p)
}

func (p *Person) SetInfoPointer() {
	fmt.Printf("SetInfoPointer: %p, %v\n", p, p)
}

func main() {
	p := Person{"mike", 'm', 18}
	fmt.Printf("main: %p, %v\n", &p, p)

	p.SetInfoPointer() //传统调用方式

	//保存方式入口地址
	pFunc := p.SetInfoPointer //这个就是方法值，调用函数时，无需再传递接收者，隐藏了接收者
	pFunc()                   //等价于 p.SetInfoPointer()

	vFunc := p.SetInfoValue
	vFunc() //等价于 p.SetInfoValue()

}
```

### 方法表达式
```js
package main

import "fmt"

type Person struct {
	name string //名字
	sex  byte   //性别, 字符类型
	age  int    //年龄
}

func (p Person) SetInfoValue() {
	fmt.Printf("SetInfoValue: %p, %v\n", &p, p)
}

func (p *Person) SetInfoPointer() {
	fmt.Printf("SetInfoPointer: %p, %v\n", p, p)
}

func main() {
	p := Person{"mike", 'm', 18}
	fmt.Printf("main: %p, %v\n", &p, p)

	//方法值   f := p.SetInfoPointer //隐藏了接收者
	//方法表达式
	f := (*Person).SetInfoPointer
	f(&p) //显式把接收者传递过去 ====》 p.SetInfoPointer()

	f2 := (Person).SetInfoValue
	f2(p) //显式把接收者传递过去 ====》 p.SetInfoValue()
}

```