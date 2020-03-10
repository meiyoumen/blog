[TOC]
# 结构体(struct)
Go语言中提供了对struct的支持,struct,中文翻译称为结构体，与数组一样，==属于复合类型==，并非引用类型。

Go语言的struct，与C语言中的struct或其他面向对象编程语言中的类(class)类似，==可以定义字段(属性)和方法==，但也有很不同的地方，需要深入学习，才能区分他们之间的区别。

> 注意复合类型与引用类型之间的区别，这应该也是值传递和引用传递的区别吧。

## 定义
结构体是由一==系列称为字段（fields）的命名元素组成，每个元素都有一个名称和一个类型==。

字段名称可以 `显式指定`（IdentifierList）或 `隐式指定`（EmbeddedField），没有显式字段名称的字段称为匿名（内嵌）字段。

在结构体中，非空字段名称必须是唯一的。

### 结构体定义的一般方式如下：


```
type identifier struct {
    field1 type1
    field2 type2
    ...
}
```

结构体里的字段一般都有名字，像 field1、field2 等，如果字段在代码中从来也不会被用到，那么可以命名它为 `_`。


### 匿名结构体
```js
person:= struct {   // 匿名结构
    name string
    age int
}{name:"匿名", age:1}

f.Println("person:", person)
```

### 空结构体如下所示：
```
struct {}
```

==struct{}表示一个空的结构体==，注意，直接定义一个空的结构体并没有意义，但在并发编程中，channel之间的通讯，可以使用一个struct{}作为信号量。

```js
ch := make(chan struct{})
ch <- struct{}{}
```



具有6个字段的结构体：

```js
struct {
    x, y int
    u float32
    _ float32  // 填充
    A *[]int
    F func()
}
```

### 匿名字段
对于匿名字段，==必须将匿名字段指定为类型名称T或指向非接口类型名称* T的指针，并且T本身可能不是指针类型==。


```js
struct {
    T1        // 字段名 T1
    *T2       // 字段名 T2
    P.T3      // 字段名 T3
    *P.T4     // f字段名T4
    x, y int    // 字段名 x 和 y
}
```
## 初始化

### 内存分配
使用 new 函数给一个新的结构体变量分配内存，它返回指向已分配内存的指针：

```js
type S struct { a int; b float64 }
new(S)
```
new(S)为S类型的变量分配内存，并初始化（a = 0，b = 0.0），返回包含该位置地址的类型 `* S`的值。

我们一般的惯用方法是：

```js
t := new(T)
```

变量 t 是一个指向 T的指针，此时结构体字段的值是它们所属类型的零值。

也可以这样写：

```
var t T
```

也会给 t 分配内存，并零值化内存，但是这个时候 t 是类型T。
在这两种方式中，t 通常被称做类型 T 的一个实例（instance）或对象（object）。

### 结构体普通变量初始化
==这个使用方式并没有为字段赋初始值==，==因此所有字段都会被自动赋予自已类型的零值==  
比如name的值为空字符串""，age的值为0。

```js
type Member struct {
    id     int
    name   string
    email  string
    gender int
    age    int
}

// 直接定义变量
var m1 Member   //所有字段均为空值

var m2 = Member{1, "小明", "xiaoming@163.com", 1, 18} // 简短变量声明方式：m2 := Member{1,"小明","xiaoming@163.com",1,18}

var m3 = Member{id:2, "name":"小红"}                  //  简短变量声明方式：m3 := Member{id:2,"name":"小红"}
```

使用字面量创建变量，这种使用方式，可以在大括号中为结构体的成员赋初始值，有两种赋初始值的方式：
- 一种是按字段在结构体中的顺序赋值，==上面代码中m2就是使用这种方式，这种方式要求所有的字段都必须赋值==，因此如果字段太多，每个字段都要赋值，会很繁琐，

- 一种则使用字段名为指定字段赋值，==如上面代码中变量m3的创建，使用这种方式，对于其他没有指定的字段，则使用该字段类型的零值作为初始化值==。



### 初始化一个结构体实例
```js
type myStruct struct { i int }

var v myStruct    // v是结构体类型变量
var p *myStruct   // p是指向一个结构体类型变量的指针
v.i
p.i

type struct1 struct {
    i1  int
    f1  float32
    str string
}
```

#### new 初始化 (指针)
```js
// 此时ms的类型是 *struct1
ms := &struct1{10, 15.5, "Chris"}

// 等价于
ms := new(struct1)
ms.i1 = 10
ms.f1 = 15.5
ms.str= "Chris"
```

#### 结构体字面量初始化：
```js
var ms struct1
ms = struct1{10, 15.5, "Chris"}
```

混合字面量语法（composite literal syntax）`&struct1{a, b, c}` 是一种简写，==底层仍然会调用 new ()==，==这里值的顺序必须按照字段顺序来写==。

在下面的例子中能看到可以通过在值的前面放上字段名来初始化字段的方式。

==表达式 new(Type) 和 &Type{} 是等价的==。


时间间隔（开始和结束时间以秒为单位）是使用结构体的一个典型例子：


```js
type Interval struct {
    start int
    end   int
}
```



初始化方式：


```js
intr := Interval{0, 3}            (A)
intr := Interval{end:5, start:1}  (B)
intr := Interval{end:5}           (C)
```

- （A）中，值必须以字段在结构体定义时的==顺序给出==，& 不是必须的。
- （B）显示了另一种方式，字段名加一个冒号放在值的前面，这种情况下值的==顺序不必一致，并且某些字段还可以被忽略掉==，就像（C）中那样。


```js
package main
import (
    "fmt"
    "strings"
)

type Person struct {
    firstName   string
    lastName    string
}

func upPerson(p *Person) {
    p.firstName = strings.ToUpper(p.firstName)
    p.lastName = strings.ToUpper(p.lastName)
}

func main() {
    // 1-struct as a value type:
    var pers1 Person
    
    pers1.firstName = "Chris"
    pers1.lastName = "Woodward"
    
    upPerson(&pers1)
    fmt.Printf("The name of the person is %s %s\n", pers1.firstName, pers1.lastName)

    // 2—struct as a pointer:
    pers2 := new(Person)
    
    pers2.firstName = "Chris"
    pers2.lastName = "Woodward"
    (*pers2).lastName = "Woodward"  // 这是合法的
    
    
    upPerson(pers2)
    fmt.Printf("The name of the person is %s %s\n", pers2.firstName, pers2.lastName)

    // 3—struct as a literal:
    pers3 := &Person{"Chris","Woodward"}
    
    upPerson(pers3)
    fmt.Printf("The name of the person is %s %s\n", pers3.firstName, pers3.lastName)
}

// output

// The name of the person is CHRIS WOODWARD
// The name of the person is CHRIS WOODWARD
// The name of the person is CHRIS WOODWARD
```





#### 访问字段
通过变量名，==使用逗号`.`==，可以访问结构体类型中的：
- 字段
- 为字段赋值
- 对字段进行取址(&)操作


```js
fmt.Println(m2.name)    // 输出：小明

m3.name = "小花"
fmt.Println(m3.name)    // 输出：小花

age := &m3.age
*age = 20
fmt.Println(m3.age)     // 20
```

### 结构体指针变量初始化
==结构体与数组一样，都是值传递==
- 比如当把数组或结构体作为实参传给函数的形参时，会复制一个副本，所以为了提高性能，一般不会把数组直接传递给函数，而是使用切片(引用类型)代替
- 而把结构体传给函数时，可以使用指针结构体。

指针结构体，即一个指向结构体的指针,声明结构体变量时，在结构体类型前加*号，便声明一个指向结构体的指针，如：

注意，指针类型为引用类型，声明结构体指针时，如果未初始化，则初始值为nil,只有初始化后，才能访问字段或为字段赋值。

```js
var m1 *Member
m1.name = "小明"    // 错误用法，未初始化,m1为nil

m1 = &Member{}
m1.name = "小明"    // 初始化后，结构体指针指向某个结构体地址，才能访问字段，为字段赋值。
```

```js
package main 

import "fmt"

//定义一个结构体类型

type Student struct {
	id   int
	name string
	sex  byte //字符类型
	age  int
	addr string
}


type View struct {
	Id 		int
	Ip		string
	Title	string
}


func TestViewP(p *View)  {
	p.Ip = "192.168.1.1"
}

func TestView(p View)  {
	p.Ip = "192.168.1.1"
}

func init()  {

    // 结构体指针 
	pView := &View{
		Id: 	1001,
		Ip: 	"127.0.0.1",
		Title: "Hello",
	}
	
	fmt.Println(pView)  // &{1001 127.0.0.1 Hello}
	
	TestViewP(pView)    // 传的是地址 引用
	fmt.Println(pView)  // &{1001 192.168.1.1 Hello}



	// 普通结构体 
	myView := View{
		Id: 	1001,
		Ip: 	"180.0.0.1",
		Title: "World",
	}

	fmt.Println(myView)  // {1001 180.0.0.1 World}
	
	//值传递
	TestView(myView)
	fmt.Println(myView)  // {1001 180.0.0.1 World}

    //引用传递
	TestViewP(&myView)	
	fmt.Println(myView) // {1001 192.168.1.1 World}
}

func main() {
	//顺序初始化，每个成员必须初始化, 别忘了&
	var p1 *Student = &Student{1, "mike", 'm', 18, "bj"}
	fmt.Println("p1 = ", p1)                  //  p1 =  &{1 mike 109 18 bj}

	//指定成员初始化，没有初始化的成员，自动赋值为0
	p2 := &Student{name: "mike", addr: "bj"}
	fmt.Printf("p2 type is %T\n", p2)         // p2 type is *main.Student
	fmt.Println("p2 = ", p2)                  // p2 =  &{0 mike 0 0 bj} 
}

// &{1001 127.0.0.1 Hello}
// &{1001 192.168.1.1 Hello}
// {1001 180.0.0.1 World}
// {1001 180.0.0.1 World}
// {1001 192.168.1.1 World}
// p1 =  &{1 mike 109 18 bj}
// p2 type is *main.Student
// p2 =  &{0 mike 0 0 bj}
```

## 成员访问

### 普通变量
```js
package main 

import "fmt"

//定义一个结构体类型
type Student struct {
	id   int
	name string
	sex  byte //字符类型
	age  int
	addr string
}

func main() {

	//定义一个结构体普通变量
	var s Student

	//操作成员，需要使用点(.)运算符
	s.id = 1
	s.name = "mike"
	s.sex = 'm' //字符
	s.age = 18
	s.addr = "bj"
	
	fmt.Println("s = ", s) // s =  {1 mike 109 18 bj}
	fmt.Println(s.age)     // 18
}

```

### 指针变量
```js
package main

import "fmt"

//定义一个结构体类型
type Student struct {
	id   int
	name string
	sex  byte //字符类型
	age  int
	addr string
}

func main() {
	//1、指针有合法指向后，才操作成员
	//先定义一个普通结构体变量
	var s Student
	
	//在定义一个指针变量，保存s的地址
	var p1 *Student
	p1 = &s

	//通过指针操作成员  p1.id 和(*p1).id完全等价，只能使用.运算符
	p1.id = 1
	(*p1).name = "mike"
	p1.sex = 'm'
	p1.age = 18
	p1.addr = "bj"
	fmt.Println("p1 = ", p1)

	//2、通过new申请一个结构体
	p2 := new(Student)
	p2.id = 1
	p2.name = "mike"
	p2.sex = 'm'
	p2.age = 18
	p2.addr = "bj"
	fmt.Println("p2 = ", p2)

}

```


## 字段标记
在定义结构体字段时，除字段名称和数据类型外，还可以使用反引号为结构体字段声明元信息，这种元信息称为Tag。
用于编译阶段关联到字段当中,如我们将上面例子中的结构体修改为：

```js
type Member struct {
    Id     int    `json:"id,-"`
    Name   string `json:"name"`
    Email  string `json:"email"`
    Gender int    `json:"gender,"`
    Age    int    `json:"age"`
}
```

上面例子演示的是使用 `encoding/json` 包编码或解码结构体时使用的Tag信息。

Tag由反引号括起来的一系列用空格分隔的 `key:"value"` 键值对组成，如：

```
Id int `json:"id" gorm:"AUTO_INCREMENT"`
```


结构体中的字段除了有名字和类型外，还可以有一个可选的标签（tag）：它是一个附属于字段的字符串，可以是文档或其他的重要标记。

==标签的内容不可以在一般的编程中使用，只有包 reflect 能获取它==。

使用 reflect 包，它可以在运行时自省类型、属性和方法，比如：在一个变量上调用 reflect.TypeOf() 可以获取变量的正确类型，如果变量是一个结构体类型，就可以通过 Field 来索引结构体的字段，然后就可以使用 Tag 属性。


```js
package main

import (
    "fmt"
    "reflect"
)

type TagType struct { // tags
    field1 bool   "An important answer"
    field2 string "The name of the thing"
    field3 int    "How much there are"
}

func main() {
    tt := TagType{true, "Barak Obama", 1}
    for i := 0; i < 3; i++ {
        refTag(tt, i)
    }
}

func refTag(tt TagType, ix int) {
    ttType := reflect.TypeOf(tt)
    ixField := ttType.Field(ix)
    fmt.Printf("%v\n", ixField.Tag)
}

// An important answer
// The name of the thing
// How much there are
```


## 参考
- https://juejin.im/post/5ca2f37ce51d4502a27f0539#heading-0
- https://learnku.com/index.php/docs/the-way-to-go/107-type-string-method-and-formatted-descriptor/3641