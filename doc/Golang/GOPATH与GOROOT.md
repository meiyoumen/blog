[TOC]
# 目录
## go env
```
λ go env
set GO111MODULE=
set GOARCH=amd64
set GOBIN=
set GOCACHE=C:\Users\Administrator\AppData\Local\go-build
set GOENV=C:\Users\Administrator\AppData\Roaming\go\env
set GOEXE=.exe
set GOFLAGS=
set GOHOSTARCH=amd64
set GOHOSTOS=windows
set GONOPROXY=
set GONOSUMDB=
set GOOS=windows
set GOPATH=C:\Users\Administrator\go
set GOPRIVATE=
set GOPROXY=https://goproxy.io,direct
set GOROOT=c:\go
set GOSUMDB=sum.golang.org
set GOTMPDIR=
set GOTOOLDIR=c:\go\pkg\tool\windows_amd64
set GCCGO=gccgo
set AR=ar
set CC=gcc
set CXX=g++
set CGO_ENABLED=1
set GOMOD=
set CGO_CFLAGS=-g -O2
set CGO_CPPFLAGS=
set CGO_CXXFLAGS=-g -O2
set CGO_FFLAGS=-g -O2
set CGO_LDFLAGS=-g -O2
set PKG_CONFIG=pkg-config
set GOGCCFLAGS=-m64 -mthreads -fno-caret-diagnostics -Qunused-arguments -fmessage-length=0 -fdebug-prefix-map=C:\Users\ADMINI~1\AppData\Local\Temp\go-build
489684870=/tmp/go-build -gno-record-gcc-switches
```

## GOROOT
GOROOT 就是go的安装路径，需要添加到环境变量中
GOROOT: go的安装路径,官方包路径根据这个设置自动匹配

### go mod
==go mod 下载的第三方包都会下载到 `GOROOT下pkg/mod` 目录下==

## GOPATH
默认在 GOPATH=C:\Users\Administrator\go

`go install` / `go get` 和 go的工具等会用到GOPATH环境变量.

GOPATH 是作为 编译后二进制的存放目的地和import包时的搜索路径 (其实也是你的工作目录, 你可以在src下创建你自己的go源文件, 然后开始工作)。

GOPATH之下主要包含三个目录：
- bin  目录主要存放可执行文件
- pkg  目录存放编译好的库文件, 主要是*.a文件
- src  目录下主要存放go的源文件

GOPATH可以是一个目录列表, ==go get下载的第三方库, 一般都会下载到列表的第一个目录里面==


==不要把GOPATH设置成go的安装路径==

### 自建gopath
可以自己在用户目录下面创建一个目录, 如gopath

操作如下:


```
cd ~
mkdir gopath

```

在~/.bash_profile中添加如下语句:
```
GOPATH=/Users/username/gopath
```
