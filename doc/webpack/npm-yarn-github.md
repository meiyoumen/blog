[TOC]
# 目录
## version
- npm view http-server version 当前最高版本
- npm ls http-server -g 当前安装的版本

## npm
- npm config set registry https://registry.npmjs.org

## yarn
- yarn config get registry 查看当前源
- yarn config set registry https://registry.npm.taobao.org
- yarn config set registry http://npm.hfjy.red:4873
- yarn config set registry https://registry.yarnpkg.com

## yarn的常用命令：
安装yarn
```
npm install -g yarn
```

安装成功后，查看版本号：

```
yarn --version
```
初始化项目

```
yarn init // 同npm init，执行输入信息后，会生成package.json文件
```

yarn的配置项：

```
yarn config list // 显示所有配置项
yarn config get <key> //显示某配置项
yarn config delete <key> //删除某配置项
yarn config set <key> <value> [-g|--global] //设置配置项
```

安装包：

```
yarn install //安装package.json里所有包，并将包及它的所有依赖项保存进yarn.lock
yarn install --flat //安装一个包的单一版本
yarn install --force //强制重新下载所有包
yarn install --production //只安装dependencies里的包
yarn install --no-lockfile //不读取或生成yarn.lock
yarn install --pure-lockfile //不生成yarn.lock
```

添加包（会更新package.json和yarn.lock）：

```
yarn add [package] // 在当前的项目中添加一个依赖包，会自动更新到package.json和yarn.lock文件中
yarn add [package]@[version] //
```
安装指定版本，这里指的是主要版本，如果需要精确到小版本，使用-E参数

```
yarn add [package]@[tag] // 安装某个tag（比如beta,next或者latest）
```

不指定依赖类型默认安装到dependencies里，你也可以指定依赖类型：

```
yarn add --dev/-D // 加到 devDependencies
yarn add --peer/-P // 加到 peerDependencies
yarn add --optional/-O // 加到 optionalDependencies
```


默认安装包的主要版本里的最新版本，下面两个命令可以指定版本：
```
yarn add --exact/-E // 安装包的精确版本。例如yarn add foo@1.2.3会接受1.9.1版，但是yarn add foo@1.2.3 --exact只会接受1.2.3版
yarn add --tilde/-T // 安装包的次要版本里的最新版。例如yarn add foo@1.2.3 --tilde会接受1.2.9，但不接受1.3.0
```

发布包

```
yarn publish
```

移除一个包

```
yarn remove <packageName>：移除一个包，会自动更新package.json和yarn.lock
```

更新一个依赖

```
yarn upgrade 用于更新包到基于规范范围的最新版本
```

运行脚本

```
yarn run 用来执行在 package.json 中 scripts 属性下定义的脚本
```

显示某个包的信息
```
yarn info <packageName> 可以用来查看某个模块的最新版本信息
```

缓存
```
yarn cache
yarn cache list # 列出已缓存的每个包
yarn cache dir # 返回 全局缓存位置
yarn cache clean # 清除缓存
```

## 访问github慢

1. 打开 http://github.com.ipaddress.com
2. 找到对应IP
3. 添加host