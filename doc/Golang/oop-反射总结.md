[TOC]

# golang反射机制的三个定律

1. 反射可以从接口类型到反射类型对象
2. 反射可以从反射类型对象到接口类型
3. 修改反射类型变量的内部值需要保证其可设置性

# reflect的基本使用
- reflect.ValueOf(obj) 返回obj的Value(如果要对obj进行修改的话传入变量地址)
- reflect.TypeOf(obj) 返回obj的对象类型
- reflect.Indirect(value) 返回Value获取了该指针指向的值
- reflect.New(typ Type) 返回一个新的type类型的对象

## 对象类型的基本操作

```js
dataStruct := reflect.Indirect(reflect.ValueOf(obj)) // 获取对象的Value对象
dataStruct.Kind()                                    // 数据是什么类型：slice切面.Struct对象
dataStruct.NumField()                                // 属性的个数
dataStruct.FieldByName("")                           // 利用属性名获取属性
dataStruct.Field(1)                                  // 获取第几个属性
reflect.New(dataStruct.Type())                       // 创建一个新的对象
dataStruct.Type()                                    // 对象的类型
```

## 属性的操作

```js
dataStruct.FieldByName("")       // 利用属性名获取属性
dataStruct.Field(1)              // 获取第几个属性
fieldName := field.Name          // 属性的名称
fieldValue：=field.Interface()   // 获取属性值
bb := field.Tag                  // 获取属性的标记
columnTag := bb.Get("column")    // 获取表中列的标记
field.Set(sliceValue)            // 给属性重新赋值
```

## 切片类型的基本操作


```js
reflect.TypeOf(slice).Elem()                  // 获取切片的Struct类型
reflect.New(reflect.TypeOf(slice).Elem())     // 创建一个新的切面包含对象类型
sliceValue := reflect.ValueOf([]int{1, 2, 3}) // 这里将slice转成reflect.Value类型
```

## reflect的内置对象

### Value

#### Value       表示一个Go对象的值
```js
  value.CanSet()返回值能否更改
  value.MethodByName("name")//根据方法名查找方法返回Value
  value.FieldByName("name")//根据属性名查找属性返回Value
  
  func (v Value) CanAddr() Value///这个方法是设置值的方法的基础，使用ValueOf()生成一个Value时，参数是值传递的，因此设置这个参数一点意义也没有。正确的方法是传入一个指针，然后调用Elem()方法来生成其指向的元素对应的Value对象
  func (v Value) Addr() Value//获得其地址  如果CanAddr()返回false，那么这个调用会panic
  func (v Value) UnsafeAddr() uintptr//和Addr()方法有同样的要求
  func (v Value) CanSet() bool//是否可以修改其值，一个值必须是可以获得地址且不能通过访问结构的非导出字段获得，方可被修改
  func (v Value) Set(x Value) //设置值   如果CanSet()返回false，那么panic
  func (v Value) Convert(t Type) Value//转换为其他类型的值 如果无法使用标准Go转换规则来转换，那么panic
  func (v Value) Iterface{} interface{}//以空接口类型获得值  如果Value是通过访问结构的非导出字段获得，panic
  func (v Value) IsValid() bool // 是否是一个合法的Value对象   只有零值才会返回false
  func (v Value) Kind() Kind      //* 所属的类型分类   零值会返回Invalid
  func (v Value) String() string//* 字符串格式   返回值的格式为<类型 值>
  func (v Value) Type() Type//类型
```

#### 方法集和方法
```js
  func (v Value) NumMethod() int
  func (v Value) Method(index int) Value
  func (v Value) MethodByName(name string) Value
  //Type类型定义了同名方法，但是返回的是类型信息，这里返回的是值信息。Method()方法，如果v没有任何方法集，或者index越界，那么panic。MethodByName()方法，如果没有找到名为name的方法，那么返回一个零值
```

#### 属性
```js
  func (v Value) NumField() int   //结构字段数量
  func (v Value) Field(i int) Value       //使用索引来访问字段，索引从0开始，如果越界将panic
  func (v Value) FieldByName(name string) Value       //使用名称来访问字段，如果未找到那么返回false
  func (v Value)FieldByNameFunc(match func(string) bool) Value        //访问名称使得match函数返回true的字段，在同一个内嵌层次上，只能有一个字段使得match返回true。如果同一层次上多个字段使得match返回true，
                                                                      那么这些字段都认为是不符合要求的
  func FieldByIndex(index []int) Value        //这个方法使得访问结构的内嵌字段成为可能。将访问各个层次的字段的索引排列起来，就形成了一个[]int，参数index不可越界，否则panic 
 ```
####  函数类型值
```js
  func (v Value) Call(in []Value)[]Value
  func (v Value) CallSlice(in []Value) []Value
          注：Call()方法用来调用函数(参数可变或者固定)，采用的是用户代码使用的调用格式。CallSlice()方法专门用于调用参数可变的函数，它采用了编译器使用的调用格式。这两种调用格式的区别在于:
              u 对于参数固定的函数，两种格式没有任何区别，都是按照位置，将实参赋予形参
              u 对于参数可变的函数，编译器格式会特别处理最后一个参数，将剩余的实参依次放入一个slice内，传递给可变形参的就是这个slice。
  func (v Value) Pointer() uintptr        //以uintptr返回函数的值，这个值并不能独一无二的识别一个函数，只是保证如果函数为nil，那么这个值为0
```
#### 类型信息
```js
  func ChanDir() ChanDir//判断通道的方向
  func Elem() Type//元素的类型
```
#### 通道值
```js
  func (v Value) IsNil() bool
  func (v Value) Pointer() uintptr    //以unitptr返回其值，没有使用unsafe.Pointer类型，所以不需要导入unsafe包
  func (v Value) Close()
  func (v Value) Len() int        //通道当前元素数量
  func (v Value) Cap() int        //通道的长度
  func (v Value) Send(x Value)         //发送一个值，x必表示一个可以赋值给通道元素类型的值
  func (v Value) TrySend(x Value) bool        //尝试以非阻塞的方式发送一个值，返回操作成功与否
  func (v Value) Recv() (Value,bool)      //接收一个值，如果通道已经关闭，返回一个Value零值。由于通道本身可能传输Value零值，所以必须额外使用一个布尔返回值来表示接收是否成功
  func (v Value) TryRecv() (Value,bool)       //尝试以非阻塞的方式接收一个值
```  
#### slice
```js
  func Elem() Type            //类型
  func (v Value) Len() int
  func (v Value) Cap() int
  func (v Value) IsNil() bool
  func (v Value) Pointer() uintptr
  func (v Value) Index(i int) Value   //访问某个元素
  func (v Value) Slice(i,j int) Value //访问某个子slice,下标必须合法
  func (v Value) Slice3(i,j,k) Value  //以Go1.3引入的3下标格式访问某个子slice，下标必须合法
  func (v Value) SetCap(i int)        //要求i必须在[v.Len(),v.Cap()]之间
  func (v Value) SetLen(i int)        //i必须在[0,v.Cap()]之间
```
#### 映射类型
```js
  func (v Value) Len() int
  func (v Value) IsNil() bool
  func (v Value) MapKeys() []Value//返回所有的键值
  func (v Value) MapIndex(key Value) Value
  func (v Value) SetMapIndex(key, x Value)//如果x是零值，那么表示删除一个元素
  func (v Value) Pointer() uintptr
```

#### 指针类型   Go语言提供了两种指针类型，一种是通过*和其他类型复合而成，另一种是unsafe.Pointer
```js 
  func Elem() Type    值
  func(v Value) IsNil() bool
  func(v Value) Elem() Value
  func(v Value) Pointer() uintptr
```

#### 数组
```js
  func Elem() Type
  func Len() int
  func(v Value) Len() int
  func(v Value) Slice(i,j int) Value
  func(v Value) Slice3(i, j, k int) Value//这两个方法要求v.CanAddr()返回true
```
#### 接口类型
 
```js
func(v Value) IsNil() bool//判断接口是否为空
  func(v Value) Elem() Value//返回接口包含的真实值
  func(v Value) InterfaceData() [2]uintptr//这个方法的用法比较奇怪，还未能找到一个合适的例子
```

  
####  []byte类型
```js
  func (v Value)Bytes() []bytes
  func (v Value)SetBytes(x []bytes)
  字符串类型
  func (v Value) SetString(x string)//设置字符串的值
  func (v Value) Index(i int)Value//访问单个字节
  func (v Value) Len() int//字符串的长度
```

### Type

#### Type


```js
func Size() uinptr          //大小: 一个该类型的值存储所需要的内存大小，以字节为单位
func Name() string          //名称: 该类型在其定义包中的名称，有些类型没有名称(比如数组、slice、函数等等)，返回一个空字符串
func PkgPath() string           //定义位置: 该类型的定义位置，也就是导入该类型使用的import语句的参数。如果该类型是预定义的(string, error等)或者无名的,那么返回一个空字符串
func Kind() Kind                //种类: 该类型所属的种类，reflect包定义了Kind类型来表示各种类型。重命名一个类型并不会改变其种类
func NumMethod() int            //方法集: 该类型的方法集，Type类型提供了方法来返回方法数量，访问各个方法。reflect包定义了Method类型来表示一个方法
func Method(index int) Method   //使用索引来访问方法集，索引从0开始，如果越界，将panic
func MethodByName(name string) (Method, bool)//使用名称来访问某个方法，bool参数指示是否找到该方法
func Implements( u Type) bool   //判断是否使用了接口u,u必须表示一个接口类型
func ConvertibleTo(u Type) bool //是否可以使用标准转换语句，转换为其他类型
func AssignableTo(u Type) bool  //是否可以赋值给其他类型的变量
```

#### 函数类型

```js
func IsVariadic() bool//参数是否可变
func NumIn() int        //参数的数量，需要注意的是，可变参数单独作为slice计算
func NumOut() int       //返回值的数量，需要注意的是，可变参数单独作为slice计算
func In(i int) Type     //第i个参数，i从0开始
func Out(i int) Type    //第i个返回值，i从0开始
```

### StructField

结构的字段具有很多特殊信息，定义了StructField类型来表示一个字段

```js
func NumField() int     //结构字段数量
func Field(i int) StructField       //使用索引来访问字段，索引从0开始，如果越界将panic
func FieldByName(name string) (StructField,bool)        //使用名称来访问字段，如果未找到那么返回false
func FieldByNameFunc(match func(string) bool) (StructField,bool)        //访问名称使得match函数返回true的字段，在同一个内嵌层次上，只能有一个字段使得match返回true。如果同一层次上多个字段使得match返回true，
                                                                        那么这些字段都认为是不符合要求的
func FieldByIndex(index []int) StructField      //这个方法使得访问结构的内嵌字段成为可能。将访问各个层次的字段的索引排列起来，就形成了一个[]int，参数index不可越界，否则panic             

type StructField struct{
    Name string      //名称
    PkgPath string      //* 对于导出字段，为空字符串* 对于非导出字段，是定义该字段类型的包名
    Type        Type
    Tag         StructTag
    Offset uintptr     //在结构内的位移
    Index []int       //当使用Type.FieldByIndex()方法的参数
    Anonymous  bool        //是否为匿名字段
}
```

### StructTag 描述了结构字段的tag

```
tag格式为:
  * 由多个部分连接而成，部分之间有可选的空格
  * 部分格式为 key:value
  * key是非空的字符串，由非控制字符组成，并且不可以是空格、双引号、冒号
  * 值由双引号包围，遵循Go字符串字面值语法
      
  func (tag StructTag) Get(key string) string     //将一个tag看做映射，各个部分就是映射的元素
```


### Kind

reflect包使用Kind类型来表示类型所属的分类

