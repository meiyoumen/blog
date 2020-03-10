# v1最简单版

直接使用

```js
http.HandleFunc(partern, function(http.ResponseWriter, *http.Request){})
```
`HandleFunc` 接受两个参数
- 第一个为路由地址
- 第二个为处理方法。


```js
package main

import (
	"log"
	"net/http"
)

func sayBye(w http.ResponseWriter, r *http.Request)  {
	w.Write([]byte("bye bye, this is v1 httpServer"))
}

func main()  {
	http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		writer.Write([]byte("httpserver v1"))
	})
	
	http.HandleFunc("/bye", sayBye)

	log.Println("Starting v1 server ...")
	log.Fatal(http.ListenAndServe(":1210", nil))
}
```

# v2自定义Handler

查看标准库源码，v1版本实际上是调用了 `handle` 方法,传入的 `HandlerFunc` 实现了Handler的ServeHTTP方法，实际上是ServeHTTP在做http请求处理。

由此我们可以自定义自己的Handler，v2版本代码如下:


```js
package main

import (
	"log"
	"net/http"
)

type myHandlerHttp struct{}


func (*myHandlerHttp) ServeHTTP(w http.ResponseWriter, r *http.Request)  {
	w.Write([]byte("this is version 2"))
}


func sayByeV2(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("bye bye ,this is v2 httpServer"))
}


func main()  {
	mux := http.NewServeMux()
	mux.Handle("/", &myHandlerHttp{})

	mux.HandleFunc("/bye", sayByeV2)

	log.Println("Starting v2 httpserver")
	log.Fatal(http.ListenAndServe(":1210", mux))
}
```


# v3自定义server配置
前面对Handler开了一次刀，下面我们看看http.ListenAndServe()中有些什么秘密。

```js
// ListenAndServe listens on the TCP network address addr and then calls
// Serve with handler to handle requests on incoming connections.
// Accepted connections are configured to enable TCP keep-alives.
//
// The handler is typically nil, in which case the DefaultServeMux is used.
//
// ListenAndServe always returns a non-nil error.

func ListenAndServe(addr string, handler Handler) error {
	server := &Server{Addr: addr, Handler: handler}
	return server.ListenAndServe()
}
```

原来这里可以==自定义http服务器配置==，都在Server这个结构体中,这个对象能配置监听地址端口，配置读写超时时间，配置handler,配置请求头最大字节数...，所有稍微改造一下v2的程序得到v3版:


```js
package main

import (
	"log"
	"net/http"
	"time"
)

type myHandlerHttpV3 struct{}

func (*myHandlerHttpV3) ServeHTTP(w http.ResponseWriter, r *http.Request)  {
	w.Write([]byte("this is version 3"))
}


func sayByeV3(w http.ResponseWriter, r *http.Request) {
	time.Sleep(4 * time.Second)
	w.Write([]byte("bye bye ,this is v3 httpServer"))
}


func main()  {
	mux := http.NewServeMux()
	mux.Handle("/", &myHandlerHttpV3{})
	mux.HandleFunc("/bye", sayByeV3)
	
	// Server 结构体
	server := &http.Server{
		Addr:              ":1210",
		Handler:           mux,
		TLSConfig:         nil,
		ReadTimeout:       0,
		ReadHeaderTimeout: 0,
		WriteTimeout:      time.Second * 5,
		IdleTimeout:       0,
		MaxHeaderBytes:    0,
		TLSNextProto:      nil,
		ConnState:         nil,
		ErrorLog:          nil,
		BaseContext:       nil,
		ConnContext:       nil,
	}

	log.Println("Starting v3 httpserver")
	log.Fatal(server.ListenAndServe())
}
```


# 拓展一下(如何平滑关闭http服务)
在go1.8中新增了一个新特性，利用Shutdown(ctx context.Context) 优雅地关闭http服务。 文档中描述: Shutdown 将无中断的关闭正在活跃的连接，然后平滑的停止服务。处理流程如下：

- 首先关闭所有的监听;
- 然后关闭所有的空闲连接;
- 然后无限期等待连接处理完毕转为空闲，并关闭;
- 如果提供了 带有超时的Context，将在服务关闭前返回 Context的超时错误;

利用这个特性改造一下v3版本的程序，实现一个关闭http的提示

```js
package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

/**
1. 首先关闭所有的监听;
2. 然后关闭所有的空闲连接;
3. 然后无限期等待连接处理完毕转为空闲，并关闭;
4. 如果提供了 带有超时的Context，将在服务关闭前返回 Context的超时错误;
*/

// 主动关闭服务器
var server *http.Server

type myHandlerV4 struct{}

func (*myHandlerV4) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("this is version 3"))
}

// 关闭http
func sayByeV4(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("bye bye ,shutdown the server"))     // 没有输出

	err := server.Shutdown(nil)
	if err != nil {
		log.Println([]byte("shutdown the server err"))
	}
}

func main() {
	// 一个通知退出的chan
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)

	mux := http.NewServeMux()
	mux.Handle("/", &myHandlerV4{})
	mux.HandleFunc("/bye", sayByeV4)

	server = &http.Server{
		Addr:         ":1210",
		WriteTimeout: time.Second * 4,
		Handler:      mux,
	}

	go func() {
		// 接收退出信号
		<-quit
		if err := server.Close(); err != nil {
			log.Fatal("Close server:", err)
		}
	}()

	log.Println("Starting v3 httpserver")
	err := server.ListenAndServe()
	if err != nil {
		// 正常退出
		if err == http.ErrServerClosed {
			log.Fatal("Server closed under request")
		} else {
			log.Fatal("Server closed unexpected", err)
		}
	}
	log.Fatal("Server exited")

}

// 尝试访问http://localhost:1210/bye 在控制台会得到以下提示结果，平滑关闭http服务成功:

```
