[TOC]
# 概述
现在很多现代的编程语言中其实都有 ==用于在作用域结束之后执行函数的关键字==。  

Go 语言中的 defer 就可以用来实现这一功能，它的主要作用：==就是在当前函数或者方法返回之前调用一些用于收尾的函数==

例如:
- 关闭文件描述符
- 关闭数据库连接
- 解锁资源。

在这一节中我们就会深入 Go 语言的源代码介绍 defer 关键字的实现原理，相信阅读完这一节的读者都会对 defer 的结构、实现以及调用过程有着非常清晰的认识和理解。

作为一个编程语言中的关键字，defer 的实现一定是由==编译器和运行时共同完成的==。

不过在深入源码分析它的实现之前我们还是需要了解一些 defer 关键字的常见使用场景以及一些使用时的注意事项。

==注意，defer语句只能出现在函数或方法的内部。==



```js
func main() {
    defer fmt.Println("this is a defer") // main 结束前调用
    fmt.Println("this is a test")
   
    /*
        运行结果：
        this is a test
        this is a defer
    */
}
```

# 一些结论

## 多个defer的执行顺序
若函数中有多个 defer，其执行顺序为 先进后出，可以理解为栈。==先进后出==

```js
package main //必须

import "fmt"

func test(x int) {
	result := 100 / x

	fmt.Println("result = ", result)
}


func init() {
    for i := 0; i < 5; i++ {
        defer fmt.Println(i)
    }
    
// 4
// 3
// 2
// 1
// 0
}


/**
栈： 后进先出
ccccccccccccccc
result =  100
bbbbbbbbbbbbbb
aaaaaaaaaaaaaa
 */
func main() {

	defer fmt.Println("aaaaaaaaaaaaaa")  // 1 进栈  (栈底)

	defer fmt.Println("bbbbbbbbbbbbbb")  // 2 进栈

	//调用一个函数，导致内存出问题
	defer test(0) // 0除数有问题         // 3 进栈

	defer fmt.Println("ccccccccccccccc") //4 进栈 (栈顶)
}
```

## return 会做几件事
1. 给返回值赋值
1. 调用 defer 表达式
1. 返回给调用函数


```js
package main

import "fmt"

func main() {
    fmt.Println(increase(1))
}

func increase(d int) (ret int) {
  defer func() {
    ret++
  }()

  return d
}
  
Output:
// 2
```


## 闭包与匿名函数
- 匿名函数：没有函数名的函数。
- 闭包：可以使用另外一个函数作用域中的变量的函数。

在实际开发中，defer 的使用经常伴随着闭包与匿名函数的使用。小心踩坑哦：

```js
package main

import "fmt"

func main() {
    for i := 0; i < 5; i++ {
    // 没用defer
       func() {
            fmt.Println(i)
        }()
    }
}

// Output:
// 0
// 1
// 2
// 3
// 4
```

```js
package main

import "fmt"

func main() {
    for i := 0; i < 5; i++ {
        defer func() {
            fmt.Println(i)
        }()
    }
}

// Output:
// 5
// 5
// 5
// 5
// 5
```

玩过JS的都知道闭包有个坑...

解释一下，defer 表达式中的 i 是对 for 循环中 i 的引用。到最后，i 加到 5，故最后全部打印 5。

如果将 i 作为参数传入 defer 表达式中，在传入最初就会进行求值保存，只是没有执行延迟函数而已。

```js
for i := 0; i < 5; i++ {
    defer func(idx int) {
        fmt.Println(idx)
    }(i) // 传入的 i，会立即被求值保存为 idx
}
```


```js
package main

import "fmt"

func main() {
	a := 10
	b := 20

	//	defer func(a, b int) {
	//		fmt.Printf("a = %d, b = %d\n", a, b)
	//	}(a, b) //()代表调用此匿名函数, 把参数传递过去，已经先传递参数，只是没有调用

	defer func(a, b int) {
		fmt.Printf("a = %d, b = %d\n", a, b)
	}(10, 20) //()代表调用此匿名函数, 把参数传递过去，已经先传递参数，只是没有调用

	a = 111
	b = 222
	fmt.Printf("外部：a = %d, b = %d\n", a, b)
}

func main01() {
	a := 10
	b := 20

	defer func() {
		fmt.Printf("a = %d, b = %d\n", a, b)
	}() //()代表调用此匿名函数

	a = 111
	b = 222
	fmt.Printf("外部：a = %d, b = %d\n", a, b)
}
```

# 巩固一下
```js
// 例1
func f() (result int) {
    defer func() {
        result++
    }()
    return 0
}

// 例1，比较简单，参考结论2，将 0 赋给 result，defer 延迟函数修改 result，最后返回给调用函数。正确答案是 1。

// 例2 返回值r int类型
func f() (r int) {
    t := 5
    defer func() {
        t = t + 5
    }()
    return t
}
// 例2，defer 是在 t 赋值给 r 之后执行的，而 defer 延迟函数只改变了 t 的值，r 不变。正确答案 5。

// 例3
func f() (r int) {
    defer func(r int) {
        r = r + 5
    }(r)
    return 1
}
// 例3，这里将 r 作为参数传入了 defer 表达式。故 func (r int) 中的 r 非 func f() (r int) 中的 r，只是参数命名相同而已。正确答案 1。

// 例4
type Test struct {
    Max int
}

func (t *Test) Println() {
    fmt.Println(t.Max)
}

func deferExec(f func()) {
    f()
}

func call() {
    var t *Test
    defer deferExec(t.Println)

    t = new(Test)
}
// 例4，这里将发生 panic。将方法传给 deferExec，实际上在传的过程中对方法求了值。而此时的 t 任然为 nil。
```

## 面试题

```js
package main 

import "fmt"

func defer_call() {
	defer func() { fmt.Println("打印前") }()
	defer func() { fmt.Println("打印中") }()
	defer func() { fmt.Println("打印后") }()

	panic("触发异常")
}

func main() {
	defer_call()
}

// 打印后
// 打印中
// 打印前
// panic: 触发异常
```


## 常见使用
首先要介绍的就是使用 defer 最常见的场景，也就是在 defer 关键字中完成一些收尾的工作，例如在 defer 中回滚一个数据库的事务：

```js
func createPost(db *gorm.DB) error {
    tx := db.Begin()
    
    defer tx.Rollback()

    if err := tx.Create(&Post{Author: "Draveness"}).Error; err != nil {
        return err
    }

    return tx.Commit().Error
}
```

在使用数据库事务时，我们其实可以使用如上所示的代码，在创建事务之后就立刻调用 `Rollback` 保证事务一定会回滚，哪怕事务真的执行成功了，那么在调用 tx.Commit() 之后再执行 tx.Rollback() 其实也不会影响已经提交的事务。

## 作用域
当我们在一个 for 循环中使用 defer 时也会在退出函数之前执行其中的代码，下面的代码总共调用了五次 defer 关键字：

```js
func main() {
    for i := 0; i < 5; i++ {
        defer fmt.Println(i) // 4 3 2 1 0
    }
}
```
运行上述代码时其实会==倒序执行所有向 defer 关键字中传入的表达式==，最后一次 defer 调用其实使用了 `fmt.Println(4)` 表达式，所以会被优先执行并打印；

我们可以通过另一个简单的例子，来强化理解一下 defer 执行的时机：


```js
func main() {
    {
        defer fmt.Println("defer runs")
        fmt.Println("block ends")
    }

    fmt.Println("main ends")
}
// block ends
// main ends
// defer runs
```
从上述代码的输出我们会发现，defer 并不是在退出当前代码块的作用域时执行的，==defer 只会在当前函数和方法返回之前被调用==。

## 传值
Go ==语言中所有的函数调用其实都是值传递的==，defer 虽然是一个关键字，但是也继承了这个特性，假设我们有以下的代码，在运行这段代码时会打印出 0：


```js
type Test struct {
    value int
}

func (t Test) print() {
    println(t.value) // 0
}

func main() {
    test := Test{}
    
    defer test.print()
    test.value += 1
}
```
这其实表明当 defer 调用时其实会对函数中引用的==外部参数进行拷贝==，所以 test.value += 1 操作并没有修改被 defer 捕获的 test 结构体。

不过如果我们修改 print 函数签名的话，其实结果就会稍有不同：

```js
type Test struct {
    value int
}

// 指针
func (t *Test) print() {
    println(t.value) // 1
}

func main() {
    test := Test{}
    defer test.print()
    test.value += 1
}
```

这里再调用 defer 关键字时其实也是进行的值传递，只是发生复制的是指向 test 的指针，我们可以将 test 变量理解成 print 函数的第一个参数，在上一段代码中这个参数的类型是结构体，所以会复制整个结构体，而在这段代码中，拷贝的其实是指针，所以当我们修改 test.value 时，defer 捕获的指针其实就能够访问到修改后的变量了。

## 实现原理
作者相信各位读者哪怕之前对 defer 毫无了解，到了这里也应该对它的使用、作用域以及常见问题有了一些基本的了解，这一节中我们将从三个方面介绍 defer 关键字的实现原理，它们分别是 defer 关键字对应的数据结构、编译器对 defer 的处理和运行时函数的调用。

### 结构
在介绍 defer 函数的执行过程与实现原理之前，我们首先来了解一下 defer 关键字在 Go 语言中存在的结构和形式，
```js
type _defer struct {
    siz     int32
    started bool
    sp      uintptr
    pc      uintptr
    fn      *funcval
    _panic  *_panic
    link    *_defer
}
```

在 `_defer` 结构中的 
- `sp `和 `pc` 分别指向==了栈指针和调用方的程序计数器==
- `fn` 存储的就是向 defer 关键字中传入的函数了。

### 编译期间
defer 关键字是在 Go 语言编译期间的 SSA 阶段才被 stmt 函数处理的，我们能在 stmt 中的 switch/case 语句中找到处理 ODEFER 节点的相关逻辑，可以看到这段代码其实调用了 call 函数，这表示 defer 在编译器看来也是一次函数调用，它们的处理逻辑其实也是差不多的。

```js
func (s *state) stmt(n *Node) {
    switch n.Op {
    case ODEFER:
        s.call(n.Left, callDefer)
    }
}
```
被调用的 call 函数其实负责了 Go 语言中所有函数和方法调用的 中间代码生成，它的工作主要包括以下内容：

- 获取需要执行的函数名、闭包指针、代码指针和函数调用的接收方；
- 获取栈地址并将函数或者方法的参数写入栈中；
- 使用 newValue1A 以及相关函数生成函数调用的中间代码；
- 如果当前调用的『函数』是 defer，那么就会单独生成相关的结束代码块；
- 最后会获取函数的返回值地址并结束当前方法的调用；
- 由于我们在这一节中主要关注的内容其实就是 defer 最终调用了什么方法，所以在这里删除了函数中不相关的内容：


```
func (s *state) call(n *Node, k callKind) *ssa.Value {
    //...
    var call *ssa.Value
    switch {
    case k == callDefer:
        call = s.newValue1A(ssa.OpStaticCall, types.TypeMem, deferproc, s.mem())
    // ...
    }
    call.AuxInt = stksize
    s.vars[&memVar] = call
    // ...
}
```

deferproc 就是 defer 关键字在运行期间会调用的函数，这个函数接收了两个参数，分别是参数的大小和闭包所在的地址。

除了将所有 defer 关键字的调用都转换成 deferproc 的函数调用之外，Go 语言的编译器其实还在 SSA 中间代码生成期间，为所有调用 defer 的函数末尾插入了调用 deferreturn 的语句，这一过程的实现其实分成三个部分

- 首先 walkstmt 函数在遇到 ODEFER 节点时会通过 Curfn.Func.SetHasDefer(true) 表达式设置当前函数的 hasdefer 属性；
- SSA 中间代码生成阶段调用的 buildssa 函数其实会执行 s.hasdefer = fn.Func.HasDefer() 语句更新 state 的 hasdefer 属性；
- 最后在 exit 中会插入 deferreturn 的函数调用；

```js
func (s *state) exit() *ssa.Block {
    if s.hasdefer {
        s.rtcall(Deferreturn, true, nil)
    }

    // ...
}
```

在 Go 语言的编译期间，编译器不仅将 defer 转换成了 deferproc 的函数调用，还在所有调用 defer 的函数结尾（返回之前）插入了 deferreturn，接下来我们就需要了解 Go 语言的运行时都做了什么。

- https://draveness.me/golang/keyword/golang-defer.html
- https://deepzz.com/post/how-to-use-defer-in-golang.html