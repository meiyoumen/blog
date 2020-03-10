
- 反射使用TypeOf和ValueOf函数从接口中获取目标对象信息
- 反身会将匿名字段作为独立字段（匿名字段本质）
- 想要利用反射修改对象状态，前提是interface.data是settable,即pointer-interface
- 通过反射可以“动态”调用方法

```js
package main

import (
	"reflect"
	"fmt"
)

type NotknownType struct {
	S1 string
	S2 string
	S3 string
}

func (n NotknownType) string() string  {
	return n.S1 + " & " + n.S2 + " & " + n.S3
}

var secret interface{} = NotknownType{"Go", "C", "Python"}

func main()  {
	value := reflect.ValueOf(secret)
	fmt.Println(value)   // {Go C Python}

	typ := reflect.TypeOf(secret)
	fmt.Println(typ)     // main.NotknownType

    //Kind() //数据是什么类型：slice切面.Struct对象
	knd := value.Kind()
	fmt.Println(knd)    // struct

	for i:=0;i<value.NumField();i++{
		fmt.Printf("Field %d: %v\n", i, value.Field(i))
		/**
    		Field 0: Go
    		Field 1: C
    		Field 2: Python
		 */
	}

}
```

## 反射对象 Value 和 Type

```js
package main

import (
	"fmt"
	"reflect"
)

type user struct {
	//User字段
	Id   int
	Name string
	Age  int
}

//User方法
func (u user) Hello() {
	fmt.Println("hello world")
}

// 反射的基本操作
func info(o interface{}) {
	//取类型
	t := reflect.TypeOf(o)
	fmt.Println("Type: ", t.Name())  // Type:  user

	if k := t.Kind(); k != reflect.Struct {
		fmt.Println("类型错误")
		return
	}

	//取值
	v := reflect.ValueOf(o)
	fmt.Println("Fields:")

	// 打印字段
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)               //取到字段
		val := v.Field(i).Interface() //取到字段对应的值
		fmt.Printf("%6s: %v = %v \n", f.Name, f.Type, val)
	}

	/**
	Type:  User
	Fields:
		Id: int = 1
	    Name: string = ok
	    Age: int = 12
	*/

	// 打印方法
	for i := 0; i < t.NumMethod(); i++ {
		m := t.Method(i)
		fmt.Printf("%6s: %v\n", m.Name, m.Type) // Hello: func(reflection.User)
	}

}

func main() {
	u := user{1, "ok", 12}
	info(u)
	info(100) //类型错误
}

// info(u)
// Type:  user
// Fields:
//     Id: int = 1 
//   Name: string = ok 
//    Age: int = 12 
//  Hello: func(main.user)
//  

//	info(100) //类型错误
// Type:  int
// 类型错误
```

## 字段

```js
package main

import (
	"fmt"
	"reflect"
)

type User2 struct {
	//User字段
	Id int
	Name string
	Age int
}

type Manager struct {
	User2
	title string
}

func main()  {
	m:=Manager{User2: User2{1, "ok", 12}, title:"123"}
	t:=reflect.TypeOf(m)

	fmt.Printf("%#v\n", t.Field(0)) //User2
	//reflect.StructField{Name:"User2", PkgPath:"", Type:(*reflect.rtype)(0x4b7080), Tag:"", Offset:0x0, Index:[]int{0}, Anonymous:true}
	
	fmt.Printf("%#v\n", t.Field(1)) //title
	//reflect.StructField{Name:"title", PkgPath:"gostudy/reflection", Type:(*reflect.rtype)(0x4a8a40), Tag:"", Offset:0x20, Index:[]int{1}, Anonymous:false}

	// 取出User2中当的Name
	fmt.Printf("%#v\n", t.FieldByIndex([]int{0,1}))
	//reflect.StructField{Name:"Name", PkgPath:"", Type:(*reflect.rtype)(0x4a8b40), Tag:"", Offset:0x8, Index:[]int{1}, Anonymous:false}

}
```


## 