## 如何快速删除 node_modules
node_modules 目录及文件比较多，普通的删除操作（shift+delete）比较慢，使用命令的方式可以非常快的删除。

- windows
```
rmdir node_modules /s/q
```

## npx
npm v5.2.0 新增了 npx 命令。npx 主要用来快速使用命令行工具。一般我们需要全局安装才能全局使用命令。如果你想临时使用一些命令行工具，又不想全局安装，npx 正好满足你的需求。当你使用完后，临时安装的包会被删除掉。


```
npx http-server

# 相当于全局安装了 http-server，因此后面可以直接加 http-server 的参数
npx http-server -o
```


npx 零时安装的包一般放在C:\Users\用户名\AppData\Roaming\npm-cache\_npx

## 全局安装（-g）
查看全局安装的位置。


```
npm root -g
```

查看全局安装的包。


```
npm ls -g
```

Windows 下默认展示的是的全局安装的包的依赖树，因此不能只直观的看到安装了那些包，需要在命令后面增加参数。


```
npm ls -g --depth=0
```
## 查看安装版本

```
npm view http-server version 当前最高版本
npm ls http-server -g 当前安装的版本
```

## npm 配置镜像库
npm 默认镜像库为 http://registry.npmjs.org/ ，国外站点访问较慢，一般配置为淘宝的镜像地址。

```
npm config set registry https://registry.npmjs.org
npm config set registry=https://registry.npm.taobao.org
```


config 可以省略

```
npm set registry "https://registry.npm.taobao.org/"
```

查询当前镜像地址
```
npm config get registry
```


config 可以省略

```
npm get registry
```

查看当前全局配置


```
npm config list
```


## npm 安装包
初始化一个 package.json。

```
npm init
```
-y 可以省去输入一些 package.json 配置信息

```
npm init -y
```

默认安装的包放在 dependencies。
安装包的信息放到 devDependencies

```
npm install vue --save-dev
```


install 可以简写为 i，--save-dev 可以简写为 -D

```
npm i vue -D
```


安装的包的信息不放在 package.json 中

```
npm i vue --no-save
```
指定安装的镜像地址

```
npm i vue --registry=https://registry.npm.taobao.org/
```

默认安装的是包的最新版本。指定版本如下：

等同默认安装

```
npm i vue@latest
npm i vue@2.5.22
npm i vue@2
npm i vue@2.4
```
