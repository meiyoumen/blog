[TOC]
# 并发基础
## 概念
==并发意味着程序在运行时有多个执行上下文，对应多个调用栈==。

## 并发与并行的区别

实现模型 | 说明 | 特点
---|---|---
多进程	 | 操作系统层面的并发模式    | 	处理简单，互不影响，但开销大
多线程   | 系统层面的并发模式		 | 有效，开销较大，高并发时影响效率
基于回调的非阻塞/异步IO		         | 多用于高并发服务器开发中		 | 编程复杂，开销小
协程	 | 用户态线程，不需要操作系统抢占调度，寄存于线程中          | 编程简单，结构简单，开销极小，但需要语言的支持

共享内存系统：线程之间采用共享内存的方式通信，通过加锁来避免死锁或资源竞争。  
消息传递系统：将线程间共享状态封装在消息中，通过发送消息来共享内存，而非通过共享内存来通信。


## 协程
执行体是个抽象的概念，在操作系统中分为三个级别：
- 进程（process），
- 进程内的线程（thread），
- 进程内的协程（coroutine，轻量级线程）。

==协程的数量级可达到上百万个==，进程和线程的数量级最多==不超过一万个==。

==Go语言中的协程叫goroutine==，Go标准库提供的调用操作，IO操作都会出让CPU给其他goroutine，==让协程间的切换管理不依赖系统的线程和进程，不依赖CPU的核心数量==。


## 并发通信
并发编程的难度在于协调，协调需要通过通信，并发通信模型分为共享数据和消息。  

共享数据即多个并发单元保持对同一个数据的引用，数据可以是内存数据块，磁盘文件，网络数据等。==数据共享通过加锁的方式来避免死锁和资源竞争==。

==Go语言则采取消息机制来通信==，每个并发单元是独立的个体，有独立的变量，不同并发单元间这些变量不共享，每个并发单元的输入输出只通过消息的方式。

## 并发与并行
- 并行是两个队列同时使用两台咖啡机
- 并发是两个队列交替使用一台咖啡机

普通解释：
- 并发：交替做不同事情的能力
- 并行：同时做不同事情的能力

专业术语：
- 并发：不同的代码块交替执行
- 并行：不同的代码块同时执行


# goroutine


```js
package main
import (
	"fmt"
	"time"
)

func newTask()  {
    // 死循环
	for {
		println("this is a  newTask")
		time.Sleep(time.Second)
	}
}

// 主协程
func main() {

	newTask() // 只能处理这一个循环，单任务，下面主程序for不会执行
	
	for {
		fmt.Println("this is a main goroutine")
		time.Sleep(time.Second) //延时1s
	}
}
```

```js
package main
import (
	"fmt"
	"time"
)

func newTask()  {
    // 死循环
	for {
		println("this is a  newTask")
		time.Sleep(time.Second)
	}
}

// 主协程
func main() {

    // 子协程
	go newTask() // 只能处理这一个循环，单任务，下面主程序for不会执行
	
	for {
		fmt.Println("this is a main goroutine")
		time.Sleep(time.Second) //延时1s
	}
}

// 输出结果
this is a  newTask
this is a main goroutine
this is a  newTask
this is a main goroutine
this is a main goroutine
this is a  newTask
this is a main goroutine
this is a  newTask
this is a main goroutine
this is a  newTask
this is a main goroutine
this is a  newTask

```
从上面结果可以看出 子协程中的代码 和 主协程中的代码 在交替执行

# channel
channel就像管道的形式，==是goroutine之间的通信方式==，是进程内的通信方式，跨进程通信建议用分布式系统的方法来解决，例如Socket或http等通信协议。

==channel是类型相关，即一个channel只能传递一种类型的值，在声明时指定==。

操作	 |    hnil channel  	| closed channel	|  not-closed non-nil channel
---|---|---|---
close     |	  panic     |	panic	|   成功 close
写 ch <-  |   一直阻塞	|   panic	|   阻塞或成功写入数据
读 <- ch  |	 一直阻塞	|   读取对应类型零值	|   阻塞或成功读取数据

## 基本语法

### channel声明，声明一个管道chanName，该管道可以传递的类型是ElementType

==管道是一种复合类型==，[chan ElementType],表示可以传递ElementType类型的管道[类似定语从句的修饰方法]

```js
var chanName chan ElementType
var ch chan int                  // 声明一个可以传递int类型的管道
var m map[string] chan bool      // 声明一个map，值的类型为可以传递bool类型的管道
```

### 初始化
channel可以使用内置的make()函数来创建：

```js
make(chan Type) //等价于make(chan Type, 0)
make(chan Type, capacity)
```
- 当 `capacity = 0` 时，channel 是==无缓冲==阻塞读写的
- 当 `capacity > 0` 时，channel ==有缓冲、是非阻塞的==，直到写满 capacity个元素才阻塞写入。


```js
ch := make(chan int)              // make一般用来声明一个复合类型，参数为复合类型的属性
```

### 管道写入
把值想象成一个球，`<-` 的方向，表示球的流向，ch即为管道

channel通过操作符 `<-` 来 ==接收 和 发送 数据==，发送和接收数据语法：

```js
channel <- value       // 发送value到channel
<- channel             // 接收并将其丢弃
x := <-channel         // 从channel中接收数据，并赋值给x
x, ok := <-channel     // 功能同上，同时检查通道是否已关闭或者是否为空
```

默认情况下，channel接收和发送数据都是阻塞的，除非另一端已经准备好，这样就使得goroutine同步变的更加的简单，而不需要显式的lock。



### Go语言中的select是语言级内置 非堵塞
每个case必须是一个IO操作，面向channel的操作，只执行其中的一个case操作，一旦满足则结束select过程
==面向channel的操作无非三种情况==：
- 成功读出
- 成功写入
- 即没有读出也没有写入


```
select{

  case <-chan1:

  //如果chan1读到数据，则进行该case处理语句

  case chan2<-1:

  //如果成功向chan2写入数据，则进入该case处理语句

  default:

  //如果上面都没有成功，则进入default处理流程

}
```


### 示例代码
```js
func main() {
    c := make(chan int)

    go func() {
        defer fmt.Println("子协程结束")

        fmt.Println("子协程正在运行……")

        c <- 666 //666发送到c
    }()

    num := <-c //从c中接收数据，并赋值给num

    fmt.Println("num = ", num)
    fmt.Println("main协程结束")
}

// 子协程正在运行……
// 子协程结束
// num =  666
// main协程结束
```


## ==多任务资源竞争问题==
```js
package main

import (
	"fmt"
	"time"
)

//定义一个打印机，参数为字符串，按每个字符打印
//打印机属于公共资源
func Printer(str string) {
	for _, data := range str {
		fmt.Printf("%c", data)
		time.Sleep(time.Second)
	}
	fmt.Printf("\n")
}

func person1() {
	Printer("hello")
}

func person2() {
	Printer("world")
}

func main() {
	//新建2个协程，代表2个人，2个人同时使用打印机
	go person1()
	go person2()

    // 并没有按顺序打印出hello world    
    // hweorllldo 交叉打印 ，可以用channel现实同步

	// 特地不让主协程结束，死循环
	for {}
}

```
## 通过channel实现同步
==管道在没数据时会阻塞当前语句执行==
```js
package main

import (
	"fmt"
	"time"
)

//全局变量，创建一个channel
var ch = make(chan int)

//定义一个打印机，参数为字符串，按每个字符打印
//打印机属于公共资源
func Printer(str string) {
	for _, data := range str {
		fmt.Printf("%c", data)
		time.Sleep(time.Second)
	}
	fmt.Printf("\n")
}

func person1() {
	Printer("hello")
	ch <- 666 // 向管道写入一个数据
}


func person2() {
    <- ch     // 从管道取数据，如果管道没有数据就会阻塞
	Printer("world")
}


func main() {
	//新建2个协程，代表2个人，2个人同时使用打印机
	
	go person1()
	go person2()

    // hello
    // world

	// 特地不让主协程结束，死循环
	for {}
}
```
说明：
- 在执行person2时，有管道，但没有数据，这时候就会阻塞。
- 在person1执行完后，向管道写入数据666，person2开始执行

## 通过channel实现同步和数据交互

```js
package main

import (
	"fmt"
	"time"
)

func main() {
	//创建channel
	ch := make(chan string)

	defer fmt.Println("主协程也结束")

	go func() {
		defer fmt.Println("子协程调用完毕")

		for i := 0; i < 2; i++ {
			fmt.Println("子协程 i = ", i)
			time.Sleep(time.Second)
		}

		// 上面执行完了，才会向管道写数据
		ch <- "我是子协程，工作完毕"

	}()

	str := <-ch //没有数据前，阻塞
	fmt.Println("str = ", str)
}
```
- 如果 内部 匿名函数 for 循环执行完，不向管道写入数据，就出会报错，死锁，因为下面管道没有数，就会阻塞
- 解决 在for 循环后向管道写入数据 `ch <- "我是子协程，要工作完毕"`

```
子协程 i =  0
子协程 i =  1
子协程调用完毕
fatal error: all goroutines are asleep - deadlock!

goroutine 1 [chan receive]:
main.main()
	E:/gocode/src/gostudydemo/6-并发编程/09_通过channel实现同步和数据交互.go:27 +0x112

Process finished with exit code 2


子协程 i =  0
子协程 i =  1
子协程调用完毕
str =  我是子协程，要工作完毕
主协程也结束
```
## channel的3种操作
每个channel都有3种操作：send、receive和close
- send：表示 `sender端` 的 goroutine  `向channel中投放数据`
- receive：表示 `receiver端` 的goroutine   `从channel中读取数据`
- close：表示 `关闭channel`
    - 关闭channel后，send操作将导致painc
    - 关闭channel后，recv操作将返回对应类型的0值以及一个状态码false
    - close并非强制需要使用close(ch)来关闭channel，==在某些时候可以自动被关闭==
    - ==如果使用close()，建议条件允许的情况下加上defer==
    - ==只在sender端上显式使用close()关闭channel==。因为关闭通道意味着没有数据再需要发送


```js
val, ok := <- ch
if ok {
    fmt.Println(val)
}
```

因为关闭通道也会让recv成功读取(只不过读取到的值为类型的空值)，使得原本阻塞在recv操作上的goroutine变得不阻塞，借此技巧可以实现goroutine的执行先后顺序。

```js
package main

import (
    "fmt"
    "time"
)

// A首先被a阻塞，A()结束后关闭b，使b可读
func A(a, b chan struct{}) {
    <-a
    fmt.Println("A()!")
    time.Sleep(time.Second)
    close(b)
}

// B首先被a阻塞，B()结束后关闭b，使b可读
func B(a, b chan struct{}) {
    <-a
    fmt.Println("B()!")
    close(b)
}

// C首先被a阻塞
func C(a chan struct{}) {
    <-a
    fmt.Println("C()!")
}

func main() {
    x := make(chan struct{})
    y := make(chan struct{})
    z := make(chan struct{})

    go C(z)
    go A(x, y)
    go C(z)
    go B(y, z)
    go C(z)
    
    // 关闭x，让x可读
    close(x)
    time.Sleep(3 * time.Second)
}

A()!
B()!
C()!
C()!
C()!
```

## 关闭 channel
channel 可以通过 built-in 函数 close() 来关闭。

```js
ch := make(chan int)

// 关闭
close(ch)
```

关于关闭 channel 有几点需要注意的是：

- 重复关闭 channel 会导致 panic。
- 向关闭的 channel 发送数据会 panic。
- 从关闭的 channel 读数据不会 panic，读出 channel 中已有的数据之后再读就是 channel 类似的默认值，比如 chan int 类型的 channel 关闭之后读取到的值为 0。

对于上面的第三点，我们需要区分一下：channel 中的值是默认值还是 channel 关闭了。可以使用 ok-idiom 方式，这种方式在 map 中比较常用。


```js
ch := make(chan int, 10)
...
close(ch)

// ok-idiom 
val, ok := <-ch
if ok == false {
    // channel closed
}
```

## channel的两种分类
channel分为两种：unbuffered channel和buffered channel

### 无缓冲
发送和接收动作是同时发生的。如果没有 goroutine 读取 `channel （<- channel）`，则发送者 `(channel <-)` 会一直阻塞。

![image](https://note.youdao.com/yws/public/resource/5510d1d9cec30a7df8618606c08f7029/xmlnote/D86F4C98A86A4133A1EF0A0D2E0ACED3/26465)

### 缓冲
缓冲 channel 类似一个有容量的队列。当队列满的时候发送者会阻塞；当队列空的时候接收者会阻塞。

![image](https://note.youdao.com/yws/public/resource/5510d1d9cec30a7df8618606c08f7029/xmlnote/5C68194500814ED285140D5A5C9625CF/26468)


### unbuffered channel：阻塞、同步模式

- sender端向channel中send一个数据，然后阻塞，直到receiver端将此数据receive
- receiver端一直阻塞，直到sender端向channel发送了一个数据

### buffered channel：非阻塞、异步模式
- sender端可以向channel中send多个数据(只要channel容量未满)，容量满之前不会阻塞
- receiver端按照队列的方式(FIFO,先进先出)从buffered channel中按序receive其中数据

可以认为 ==阻塞和不阻塞是由channel控制的，无论是send还是recv操作，都是在向channel发送请求==：

- 对于unbuffered channel，sender发送一个数据，channel暂时不会向sender的请求返回ok消息，而是等到receiver准备接收channel数据了，channel才会向sender和receiver双方发送ok消息。在sender和receiver接收到ok消息之前，两者一直处于阻塞。

- 对于buffered channel，sender每发送一个数据，只要channel容量未满，channel都会向sender的请求直接返回一个ok消息，使得sender不会阻塞，直到channel容量已满，channel不会向sender返回ok，于是sender被阻塞。对于receiver也一样，只要channel非空，receiver每次请求channel时，channel都会向其返回ok消息，直到channel为空，channel不会返回ok消息，receiver被阻塞。

## buffered channel的两个属性
buffered channel有两个属性：容量和长度：和slice的capacity和length的概念是一样的

### capacity：表示bufffered channel最多可以缓冲多少个数据
### length：表示buffered channel当前已缓冲多少个数据

创建buffered channel的方式为make(chan TYPE,CAP)
unbuffered channel可以认为是容量为0的buffered channel，所以每发送一个数据就被阻塞。

==注意，不是容量为1的buffered channel，因为容量为1的channel，是在channel中已有一个数据，并发送第二个数据的时候才被阻塞。==

换句话说，send被阻塞的时候，==其实是没有发送成功的，只有被另一端读走一个数据之后才算是send成功==。

- ==对于unbuffered channel来说，这是send/recv的同步模式==。
- 而buffered channel则是在每次发送数据到通道的时候，(通道)都向发送者返回一个消息，容量未满的时候返回成功的消息，发送者因此而不会阻塞，容量已满的时候因为已满而迟迟不返回消息，使得发送者被阻塞。

实际上，当向一个channel进行send的时候，先关闭了channel，再读取channel时会发现错误在send，而不是recv。它会提示向已经关闭了的channel发送数据。

```js
func main() {
    counter := make(chan int)
    go func() {
        counter <- 32
    }()
    
    close(counter) // 关闭的太早
    
    fmt.Println(<-counter)
}

// panic: send on closed channel
```


### 无缓存
```js
package main

import (
	"fmt"
	"time"
)

func main() {
	//创建一个无缓存的channel
	ch := make(chan int, 0)

	//len(ch)缓冲区剩余数据个数， cap(ch)缓冲区大小
	fmt.Printf("len(ch) = %d, cap(ch)= %d\n", len(ch), cap(ch))  //len(ch) = 0, cap(ch)= 0 因为是无缓存，所以都是0
	//新建协程
	go func() {
		for i := 0; i < 3; i++ {
			fmt.Printf("子协程：i = %d\n", i)
			ch <- i //往chan写内容
		}
	}()

	//延时
	time.Sleep(2 * time.Second)

	for i := 0; i < 3; i++ {
		num := <-ch //读管道中内容，没有内容前，阻塞
		fmt.Println("num = ", num)
	}

}

// len(ch) = 0, cap(ch)= 0
// 子协程：i = 0
// num =  0
// 子协程：i = 1
// 子协程：i = 2
// num =  1
// num =  2
```

### 有缓冲
```js
package main

import (
	"fmt"
	"time"
)

func main() {
	//创建一个有缓存的channel
	ch := make(chan int, 3)

	//len(ch)缓冲区剩余数据个数， cap(ch)缓冲区大小
	fmt.Printf("len(ch) = %d, cap(ch)= %d\n", len(ch), cap(ch))  // len(ch) = 0, cap(ch)= 3 默认值为3

	//新建协程
	go func() {
		for i := 0; i < 10; i++ {
			ch <- i //往chan写内容
			fmt.Printf("子协程[%d]: len(ch) = %d, cap(ch)= %d\n", i, len(ch), cap(ch))
		}
	}()

	//延时
	time.Sleep(2 * time.Second)

	for i := 0; i < 10; i++ {
		num := <-ch //读管道中内容，没有内容前，阻塞
		fmt.Println("num = ", num)
	}

}


// len(ch) = 0, cap(ch)= 3
// 子协程[0]: len(ch) = 1, cap(ch)= 3
// 子协程[1]: len(ch) = 2, cap(ch)= 3
// 子协程[2]: len(ch) = 3, cap(ch)= 3
// num =  0
// 子协程[3]: len(ch) = 3, cap(ch)= 3
// num =  1
// num =  2
// num =  3
// num =  4

// 子协程[4]: len(ch) = 3, cap(ch)= 3
// 子协程[5]: len(ch) = 0, cap(ch)= 3
// 子协程[6]: len(ch) = 1, cap(ch)= 3
// 子协程[7]: len(ch) = 2, cap(ch)= 3
// 子协程[8]: len(ch) = 3, cap(ch)= 3

// num =  5
// num =  6
// num =  7
// num =  8
// num =  9

```

### 单方向的channel
==默认情况下，通道是双向的==，也就是，既可以往里面发送数据也可以同里面接收数据。

但是，我们经常见一个通道作为参数进行传递而值希望对方是单向使用的，要么只让它发送数据，要么只让它接收数据，这时候我们可以指定通道的方向。

单向channel变量的声明非常简单，如下：

```
var ch1 chan int       // ch1是一个正常的channel，不是单向的
var ch2 chan<- float64 // ch2是单向channel，只用于写float64数据
var ch3 <-chan int     // ch3是单向channel，只用于读取int数据
```


- `chan<-`  表示数据进入管道，要把数据写进管道，==`对于调用者就是输出`==。
- `<-chan`  表示数据从管道出来，对于调用者就是得到管道的数据，==当然就是输入==。

```js
package main

//"fmt"

func main() {
	//创建一个channel, 双向的
	ch := make(chan int)

	//双向channel能隐式转换为单向channel
	var writeCh chan<- int = ch  // 只能写，不能读
	var readCh  <-chan int = ch  // 只能读，不能写

	writeCh <- 666   // 写
	//<-writeCh      // err,  invalid operation: <-writeCh (receive from send-only type chan<- int)

	<-readCh         // 读
	// readCh <- 666 // 写， err,  invalid operation: readCh <- 666 (send to receive-only type <-chan int)

	// 单向无法转换为双向
	// var ch2 chan int = writeCh //cannot use writeCh (type chan<- int) as type chan int in assignment
}
```

### 单向channel的应用
```js
package main

import (
	"fmt"
)

//此通道只能写，不能读
func producer(out chan<- int) {
	for i := 0; i < 10; i++ {
		out <- i * i
	}
	close(out)
}

//此channel只能读，不能写
func consumer(in <-chan int) {
	for num := range in {
		fmt.Println("num = ", num)
	}
}

func main() {
	//创建一个双向通道
	ch := make(chan int)

	//生产者，生产数字，写入channel
	//新开一个协程
	go producer(ch) //channel传参，引用传递

	//消费者，从channel读取内容，打印
	consumer(ch)
}

// num =  0
// num =  1
// num =  4
// num =  9
// num =  16
// num =  25
// num =  36
// num =  49
// num =  64
// num =  81

```


参考
- https://draveness.me/golang-sync-primitives.html
- https://colobu.com/2019/04/28/gopher-2019-concurrent-in-action/
- https://jimmysong.io/posts/golang-concurrency-summary/#gogo语言并发编程总结
- http://ifeve.com/go-para-program-1/
- https://my.oschina.net/124259473/blog/1799821?utm_campaign=studygolang.com&utm_medium=studygolang.com&utm_source=studygolang.com
- https://segmentfault.com/a/1190000016466500
- https://colobu.com/2019/04/28/gopher-2019-concurrent-in-action/go-concurrency-in-action.png
- https://www.cnblogs.com/f-ck-need-u/p/9986335.html
- 一招教你无阻塞读写Golang channel http://lessisbetter.site/2018/11/03/Golang-channel-read-and-write-without-blocking/