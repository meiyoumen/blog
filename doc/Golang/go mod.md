[TOC]
# 目录
## 初始化.go mod

在你常用的工作区新建一个目录,如果你有github的项目,可以直接clone下来.


```
go mod init $MODULE_NAME
```

在刚刚新建的项目的根目录下,使用上述命令来初始化.go mod.该命令会在项目根目录下新建一个go.mod的文件.

如果你的项目是从github上clone下来的,`$MODULE_NAME`这个参数就不需要了.它会默认为`github.com/$GITHUB_USER_NAME/$PROJECT_NAME`.

例如本项目就是`github.com/detectiveHLH/go-backend-starter`；如果是在本地新建的项目,则必须要加上最后一个参数.否则就会遇到如下的错误.


```
go: cannot determine module path for source directory /Users/hulunhao/Projects/go/test/src (outside GOPATH, no import comments
)
```
初始化完成之后的go.mod文件内容如下.

```
module github.com/detectiveHLH/go-backend-starter

go 1.12
```


## 设置Module GOPROXY代理
国内用户可以使用的两个GOPROXY;

- 阿里云镜像代理: http://mirrors.aliyun.com/goproxy/
- https://goproxy.io
- https://goproxy.cn

现在,当你构建或运行你的应用时,Go 将会通过 GOPROXY 获取依赖

- Jetbrains Goland 快速配置(强烈推荐)  
Preferences -> Go -> Go modules(vgo)

## 构建模块
当我们使用 `go build`、`go test` 以及 `go list` 时,Go 会自动更新 go.mod 文件,并且将依赖关系写入其中.


```
$ go build ./...
go: finding github.com/sirupsen/logrus v1.0.6
go: finding golang.org/x/crypto v0.0.0-20180820150726-614d502a4dac
go: finding golang.org/x/sys v0.0.0-20180828065106-d99a578cf41b
go: downloading github.com/sirupsen/logrus v1.0.6
go: downloading golang.org/x/crypto v0.0.0-20180820150726-614d502a4dac
go: downloading golang.org/x/sys v0.0.0-20180828065106-d99a578cf41b
```

可以看到 `go` 自动查找了依赖并完成下载,但是下载的依赖包==并不是下载到了 $GOPATH 中==,== 而是在 $GOPATH/pkg/mod 目录下==,且多个项目可以共享缓存的 module
- go build
- go tidy

## go mod命令
```
download    download modules to local cache (下载依赖的module到本地cache))
edit        edit go.mod from tools or scripts (编辑go.mod文件)
graph       print module requirement graph (打印模块依赖图))
init        initialize new module in current directory (再当前文件夹下初始化一个新的module, 创建go.mod文件))
tidy        add missing and remove unused modules (增加丢失的module,去掉未用的module)
vendor      make vendored copy of dependencies (将依赖复制到vendor下)
verify      verify dependencies have expected content (校验依赖)
why         explain why packages or modules are needed (解释为什么需要依赖)
```


## go get 升级
- 运行 go get -u 将会升级到最新的次要版本或者修订版本(x.y.z, z是修订版本号, y是次要版本号)
- 运行 go get -u=patch 将会升级到最新的修订版本
- 运行 go get package@version 将会升级到指定的版本号version

## go mod vendor
go mod vendor 会复制modules下载到vendor中, 貌似只会下载你代码中引用的库,而不是go.mod中定义全部的module.


## 使用vendor目录
golang一直提供了工具选择上的自由性，如果你不喜欢go mod的缓存方式，你可以使用`go mod vendor`回到godep或govendor使用的vendor目录进行包管理的方式。

当然这个命令并不能让你从godep之类的工具迁移到go modules，它只是单纯地把go.sum中的所有依赖下载到vendor目录里，如果你用它迁移godep你会发现vendor目录里的包回合godep指定的产生相当大的差异，所以请务必不要这样做。

我们举第一部分中用到的项目做例子，使用go mod vendor之后项目结构是这样的：


```
tree my-module

my-module
├── go.mod
├── go.sum
├── main.go
└── vendor
    ├── github.com
    │   ├── mattn
    │   │   └── go-gtk
    │   │       └── glib
    │   │           ├── glib.go
    │   │           └── glib.go.h
    │   └── mqu
    │       └── go-notify
    │           ├── LICENSE
    │           ├── README
    │           └── notify.go
    └── modules.txt
```

可以看到依赖被放入了vendor目录。

接下来使用 `go build -mod=vendor` 来构建项目，因为在` go modules` 模式下==` go build` 是屏蔽vendor机制的==，所以需要特定参数重新开启vendor机制:


```
go build -mod=vendor
./my-module
a notify!
```

构建成功。当发布时也只需要和使用godep时一样将vendor目录带上即可。



## 更新 modules
默认情况下，Go 不会自己更新模块，这是一个好事因为我们希望我们的构建是有可预见性（predictability）的。
如果每次依赖的包一有更新发布，Go 的 module 就自动更新，那么我们宁愿回到 Go v1.11 之前没有 Go module 的荒莽时代了。    
所以，==我们需要更新 module 的话，我们要显式地告诉 Go==。

我们可以使用我们的老朋友 ==`go get` 来更新 `module`==:

1. 运行 go get -u 将会升级到最新的次要版本或者修订版本（比如说，将会从 1.0.0 版本，升级到——举个例子——1.0.1 版本，或者 1.1.0 版本，如果 1.1.0 版本存在的话）
1. 运行 go get -u=patch 将会升级到最新的修订版本（比如说，将会升级到 1.0.1 版本，但不会升级到 1.1.0 版本）
1. 运行 go get package@version 将会升级到指定的版本号（比如说，github.com/robteix/testmod@v1.0.1）
(译注：语义化版本号规范把版本号如 v1.2.3 中的 1 定义为主要版本号，2 为次要版本号，3 为修订版本号 )

上述列举的情况，似乎没有提到如何更新到最新的主要版本的方法。这么做是有原因的，我们之后会说到。

因为我们的程序使用的是包 1.0.0 的版本，并且我们刚刚创建了 1.0.1 版本，下面任意一条命令都可以让我们程序使用的包更新到 1.0.1 版本：

```
$ go get -u
$ go get -u=patch
$ go get github.com/robteix/testmod@v1.0.1
```

运行完其中一个（比如说 go get -u）之后，我们的 go.mod 文件变成了：


```
module mod
require github.com/robteix/testmod v1.0.1
```


## goproxy
> https://goproxy.io/zh/

配合使用
```
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOPROXY=https://goproxy.io,direct
```


### 在 Linux 或 macOS 上面，需要运行下面命令：
```
# 启用 Go Modules 功能
export GO111MODULE=on
# 配置 GOPROXY 环境变量
export GOPROXY=https://goproxy.io
```

或者，可以把上面的命令写到 .bashrc 或 .bash_profile 文件当中。

在 Windows 上，需要运行下面命令：


```
PowerShell 
# 启用 Go Modules 功能
$env:GO111MODULE="on"
# 配置 GOPROXY 环境变量
$env:GOPROXY="https://goproxy.io"
```

现在，当你构建或运行你的应用时，Go 将会通过 goproxy.io 获取依赖。更多信息请查看 goproxy 仓库。

如果你使用的 Go 版本>=1.13, 你可以通过设置 GOPRIVATE 环境变量来控制哪些私有仓库和依赖(公司内部仓库)不通过 proxy 来拉取，直接走本地，设置如下：

Go version >= 1.13

```
go env -w GOPROXY=https://goproxy.io,direct
# 设置不走 proxy 的私有仓库，多个用逗号相隔
go env -w GOPRIVATE=*.corp.example.com
```

## Goproxy 中国
虽然下面的内容主要是讲解如何设置 `GOPROXY`，但是我们也推荐你在使用 Go 模块时将 `GO111MODULE` 设置为 `on` 而不是 `auto`。

### Go 1.13 及以上（推荐）

打开你的终端并执行：

```bash
$ go env -w GOPROXY=https://goproxy.cn,direct
```

完成。

### macOS 或 Linux

打开你的终端并执行：

```bash
$ export GOPROXY=https://goproxy.cn
```

或者

```bash
$ echo "export GOPROXY=https://goproxy.cn" >> ~/.profile && source ~/.profile
```

完成。

### Windows

打开你的 PowerShell 并执行：

```powershell
C:\> $env:GOPROXY = "https://goproxy.cn"
```

或者

```md
1. 打开“开始”并搜索“env”
2. 选择“编辑系统环境变量”
3. 点击“环境变量…”按钮
4. 在“<你的用户名> 的用户变量”章节下（上半部分）
5. 点击“新建…”按钮
6. 选择“变量名”输入框并输入“GOPROXY”
7. 选择“变量值”输入框并输入“https://goproxy.cn”
8. 点击“确定”按钮
```

完成。



## 参考
- https://mojotv.cn/2019/04/02/go-1.2-go-mod-tutorial
- https://www.cnblogs.com/apocelipes/p/10295096.html
- govendor https://shockerli.net/post/go-package-manage-tool-govendor/
- https://studygolang.com/articles/14389