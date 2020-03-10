[TOC]
# 相关基础
在进行更加详细的了解之前，我们需要重新温习一下Go语言相关的一些特性，所谓温故知新，从这些特性中了解其反射机制是如何使用的。

特点 |	说明
---|---
go语言是静态类型语言。	|   编译时类型已经确定，比如对已基本数据类型的再定义后的类型，反射时候需要确认返回的是何种类型。
空接口interface{}	    |   go的反射机制是要通过接口来进行的，而类似于Java的Object的空接口可以和任何类型进行交互，因此对基本数据类型等的反射也直接利用了这一特点



# 反射标准库
反射是使用库 `reflect` 来实现，使用的时候需要将reflect库import进来

项目   |  	详细
---|---
反射标准库	| reflect
文档	    | https://golang.org/pkg/reflect/
反射类型	| reflect.Type 和 reflect.Value
常用函数	| reflect.TypeOf 和 reflect.ValueOf

reflect.TypeOf 和 reflect.ValueOf的定义如下：


```JS
[root@liumiaocn goprj]# go doc reflect.TypeOf
func TypeOf(i interface{}) Type
    TypeOf returns the reflection Type that represents the dynamic type of i. If
    i is a nil interface value, TypeOf returns nil.

[root@liumiaocn goprj]# go doc reflect.ValueOf
func ValueOf(i interface{}) Value
    ValueOf returns a new Value initialized to the concrete value stored in the
    interface i. ValueOf(nil) returns the zero Value.

[root@liumiaocn goprj]#
```

# 反射定律
go语言使用时，有三条定律，简单整理如下

项番	| 详细	|  E文
---|---|---
No.1	|  反射可以将“接口类型变量”转换为“反射类型对象”。	|  Reflection goes from interface value to reflection object.
No.2	|  反射可以将“反射类型对象”转换为“接口类型变量”。	|  Reflection goes from reflection object to interface value.
No.3	|  如果要修改“反射类型对象”，其值必须是“可写的”。	|  To modify a reflection object, the value must be settable.

## No.1: “接口类型变量”=>“反射类型对象”

```JS
package main

import . "fmt"
import "reflect"

func main() {
        var circle float64 = 6.28
        var icir interface{}

        icir = circle
        Println("Reflect : circle.Value = ", reflect.ValueOf(icir))  // Reflect : circle.Value =  6.28
        Println("Reflect : circle.Type  = ", reflect.TypeOf(icir))   // Reflect : circle.Type  =  float64
}
```
可以看到ValueOf和TypeOf的参数都是空接口，因此，这说明可以直接使用变量传进取，比如：


```js
import . "fmt"
import "reflect"

func main() {
    var circle float64 = 6.28
    Println("Reflect : circle.Value = ", reflect.ValueOf(circle))  // Reflect : circle.Value =  6.28
    Println("Reflect : circle.Type  = ", reflect.TypeOf(circle))   // Reflect : circle.Type  =  float64
}
```

## No.2: “反射类型对象”=>“接口类型变量

此为No.1的反向过程，简单例子代码如下：

```js
import . "fmt"
import "reflect"

func main() {
    var circle float64 = 6.28
    var icir interface{}

    icir = circle
    Println("Reflect : circle.Value = ", reflect.ValueOf(icir))  // Reflect : circle.Value =  6.28
    Println("Reflect : circle.Type  = ", reflect.TypeOf(icir))   // Reflect : circle.Type  =  float64

    valueref := reflect.ValueOf(icir)
    Println(valueref)               // 6.28
    Println(valueref.Interface())   // 6.28

    y := valueref.Interface().(float64) 
    Println(y)                      // 6.28
}
```

## No.3: 修改“反射类型对象”
第三条定律不容易理解，让我们从一个简单的错误开始, 代码如下：

```js
package main

import . "fmt"
import "reflect"

func main() {
    var circle float64 = 6.28

    value := reflect.ValueOf(circle)
    Println("Reflect : value = ", value)  // 6.28
    
    value.SetFloat(3.14)                  // 报错
}
```
通过go doc reflect.Value我们可以看到

```
func (v Value) SetFloat(x float64)
```

是可行的，但是为什么会出错呢？
  
其实仔细想一下就能大体知道原因，value变量之所以是不可写的，==因为其所指向的是一个副本，因此不具有可写性==。

因此找到“本尊”是非常重要的，不过go中和特意提供了一个 `CanSet函数` 可以进行确认是否是` settable` 的，稍微有些麻烦，使用如下方式即可进行设定：

```js
package main

import . "fmt"
import "reflect"

func main() {
    var circle float64 = 6.28

    value := reflect.ValueOf(circle)
    Println("Reflect : value = ", value)                // Reflect : value =  6.28
    Println("Settability of value : ", value.CanSet())  // Settability of value :  false

    value2 := reflect.ValueOf(&circle)
    Println("Settability of value : ", value2.CanSet()) // Settability of value :  false

    value3 := value2.Elem()
    Println("Settability of value : ", value3.CanSet()) // Settability of value :  true

    value3.SetFloat(3.14)
    Println("Value of value3: ", value3)  // Value of value3:  3.14
    Println("value of circle: ", circle)  // value of circle:  3.14
}
```


# 参考
- https://www.jianshu.com/p/726e413f7de4