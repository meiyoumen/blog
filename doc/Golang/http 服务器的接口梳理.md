# Handle
- Hanlde, HandleFunc
- Handler, HandlerFunc

```js
// Handle registers the handler for the given pattern
// in the DefaultServeMux.
// The documentation for ServeMux explains how patterns are matched.

// Handle 函数将pattern和对应的handler注册进DefaultServeMux
func Handle(pattern string, handler Handler) { DefaultServeMux.Handle(pattern, handler) }

// HandleFunc registers the handler function for the given pattern
// in the DefaultServeMux.
// The documentation for ServeMux explains how patterns are matched.
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	DefaultServeMux.HandleFunc(pattern, handler)
}

```

```js

type Handler interface {
	ServeHTTP(ResponseWriter, *Request)
}

// The HandlerFunc type is an adapter to allow the use of
// ordinary functions as HTTP handlers. If f is a function
// with the appropriate signature, HandlerFunc(f) is a
// Handler that calls f.

// HandlerFunc能够将一个普通的处理函数转化为Handler
type HandlerFunc func(ResponseWriter, *Request)

// ServeHTTP calls f(w, r).
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
	f(w, r)
}
```


- `HandleFunc` 仅接受一个 `func` 为参数，相对于简洁些。
- `Handle` 则需要传入一个带有ServeHTTP的结构体，因此控制逻辑可以灵活些。

## Handle的例子

```js
package main

import (
    "fmt"
    "log"
    "net/http"
    "sync"
)

type countHandler struct {
    mu  sync.Mutex // guards n
    n   int
}

func (h *countHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    h.mu.Lock()
    defer h.mu.Unlock()
    h.n++
    fmt.Fprintf(w, "count is %d\n", h.n)
}

func main() {
    http.Handle("/count", new(countHandler))
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```
## HandleFunc的例子


```js
h1 := func(w http.ResponseWriter, _ *http.Request) {
    io.WriteString(w, "Hello from a HandleFunc #1!\n")
}
h2 := func(w http.ResponseWriter, _ *http.Request) {
    io.WriteString(w, "Hello from a HandleFunc #2!\n")
}

http.HandleFunc("/", h1)
http.HandleFunc("/endpoint", h2)

log.Fatal(http.ListenAndServe(":8080", nil))
```

## ListenAndServe

```js
// 监听TCP然后调用handler对应的Serve去处理请求。handler默认为nil，则使用DefaultServeMux

func ListenAndServe(addr string, handler Handler) error {
	server := &Server{Addr: addr, Handler: handler}
	return server.ListenAndServe()
}
```


# ServeMux
路由调度器，根据请求url调用handler去处理。实现了Handle，HandleFunc方法。

## 新建 NewServeMux
```js
type ServeMux struct {
	mu    sync.RWMutex
	m     map[string]muxEntry
	es    []muxEntry // slice of entries sorted from longest to shortest.
	hosts bool       // whether any patterns contain hostnames
}

type muxEntry struct {
	h       Handler
	pattern string
}

// NewServeMux allocates and returns a new ServeMux.
// 新建
func NewServeMux() *ServeMux { return new(ServeMux) }

// DefaultServeMux is the default ServeMux used by Serve.
var DefaultServeMux = &defaultServeMux

var defaultServeMux ServeMux
```

## ServeMux方法

```js
func (mux *ServeMux) ServeHTTP(w ResponseWriter, r *Request)
func (mux *ServeMux) Handle(pattern string, handler Handler)
func (mux *ServeMux) HandleFunc(pattern string, handler func(ResponseWriter, *Request))
func (mux *ServeMux) Handler(r *Request) (h Handler, pattern string)


// e.g.
mux := http.NewServeMux()
mux.Handle("/api/", apiHandler{})
mux.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
    // The "/" pattern matches everything, so we need to check
    // that we're at the root here.
    if req.URL.Path != "/" {
        http.NotFound(w, req)
        return
    }
    fmt.Fprintf(w, "Welcome to the home page!")
})
```

# Server 类型


```js
type Server struct {
    Addr    string  // TCP address to listen on, ":http" if empty
    Handler Handler // handler to invoke, http.DefaultServeMux if nil
    TLSConfig *tls.Config
    ReadTimeout time.Duration
    ReadHeaderTimeout time.Duration
    WriteTimeout time.Duration
    IdleTimeout time.Duration
    MaxHeaderBytes int
    TLSNextProto map[string]func(*Server, *tls.Conn, Handler)
    ConnState func(net.Conn, ConnState)
    ErrorLog *log.Logger
    // contains filtered or unexported fields
}

// 方法
func (srv *Server) Close() error
func (srv *Server) ListenAndServe() error
func (srv *Server) ListenAndServeTLS(certFile, keyFile string) error
func (srv *Server) RegisterOnShutdown(f func())
func (srv *Server) Serve(l net.Listener) error
func (srv *Server) ServeTLS(l net.Listener, certFile, keyFile string) error
func (srv *Server) SetKeepAlivesEnabled(v bool)
func (srv *Server) Shutdown(ctx context.Context) error
```

可以通过Server类型来改变默认的Server配置，如改变监听端口等。


```js
package main

import (
	"log"
	"net/http"
)

func index(w http.ResponseWriter, r *http.Request)  {
	w.Write([]byte("bye bye, this is v1 httpServer"))
}

func main(){
    http.HandleFunc("/", index)

    server := &http.Server{
        Addr: ":8000",
        ReadTimeout: 60 * time.Second,
        WriteTimeout: 60 * time.Second,
    }
    server.ListenAndServe()
}


// 自定义的serverMux对象也可以传到server对象中。
func main() {

    mux := http.NewServeMux()
    mux.HandleFunc("/", index)

    server := &http.Server{
        Addr: ":8000",
        ReadTimeout: 60 * time.Second,
        WriteTimeout: 60 * time.Second,
        Handler: mux,
    }
    server.ListenAndServe()
}
```
