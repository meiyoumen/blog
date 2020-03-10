[TOC]
# `module.filename、__filename、__dirname、process.cwd()和require.main.filename`
- module.filename：开发期间，该行代码所在的文件。
- `__dirname`：    获得当前执行文件所在目录的完整目录名,  总是返回被执行的 js 所在文件夹的绝对路径
- `__filename`：   获得当前执行文件的带有完整绝对路径的文件名, 总是返回被执行的 js 的绝对路径
- process.cwd()：获得当前执行node命令时候的文件夹目录名 , 总是返回运行 node 命令时所在的文件夹的绝对路径
- `./`：           文件所在目录, 跟 process.cwd() 一样，返回 node 命令时所在的文件夹的绝对路径
- require.main.filename：用node命令启动的module的filename, 如 node xxx，这里的filename就是这个xxx。

执行 path-test.js
```js
console.log('*** app start ***');

console.log('***      module.filename = ' + module.filename + ' ***');
console.log('***           __filename = ' + __filename + ' ***');
console.log('***            __dirname = ' + __dirname + ' ***');
console.log('***        process.cwd() = ' + process.cwd() + ' ***');
console.log('*** require.main.filename= ' + require.main.filename + ' ***');

console.log('*** app end ***');


// "D:\Program Files\JetBrains\WebStorm 2018.2.4\bin\runnerw.exe" D:\nodeconfig\nodejs\node.exe F:\coding\ES\Node\path-test.js
// *** app start ***
// ***      module.filename = F:\coding\ES\Node\path-test.js ***
// ***           __filename = F:\coding\ES\Node\path-test.js ***
// ***            __dirname = F:\coding\ES\Node ***
// ***        process.cwd() = F:\coding\ES\Node ***
// *** require.main.filename= F:\coding\ES\Node\path-test.js ***
// *** app end ***
```


`__dirname` 指的是==当前模块所在的绝对路径名称==，它的值会==自动根据当前的绝对路径变化==，等同于`path.dirname(__filename)`的结果。

## Windows 与 POSIX
- POSIX，Portable Operating System Interface。是UNIX系统的一个设计标准，很多类UNIX系统也在支持兼容这个标准，如Linux。

`path` 模块的默认操作因 Node.js 应用程序运行==所在的操作系统而异==。 具体来说，当在 Windows 操作系统上运行时， path 模块将假定正在==使用 Windows 风格的路径==。

要在任何操作系统上使用 POSIX 文件路径时获得一致的结果，则使用 path.posix：

在 POSIX 和 Windows 上:
```js
path.posix.basename('/tmp/myfile.html');
// 返回: 'myfile.html'
```



# path
path模块主要用来对文件路径进行处理，比如提取路径、后缀，拼接路径等。

path的使用


```js
const path = require('path')

const str = '/root/a/b/1.txt'

console.log(path.dirname(str))  // 获取文件目录：/root/a/b
console.log(path.basename(str)) // 获取文件名：1.txt
console.log(path.extname(str))  // 获取文件后缀：.txt
console.log(path.resolve(str, '../c', 'build', 'strict')) // 将路径解析为绝对路径：C:\root\a\b\c\build\strict
console.log(path.resolve(str, '../c', 'build', 'strict', '../..', 'assets')) // 将路径解析为绝对路径：C:\root\a\b\c\assets
console.log(path.resolve(__dirname, 'build')) // 将路径解析为绝对路径：C:\projects\nodejs-tutorial\lesson12\build
```
## path.basename(path[, ext])
- path <string>
- ext <string> 可选的文件扩展名。
- 返回: <string>
path.basename() 方法返回 path 的最后一部分，类似于 Unix 的 basename 命令。 尾部的目录分隔符将被忽略，参阅 path.sep。

```js
path.posix.basename('/foo/bar/baz/asdf/quux.html');
// 返回: 'quux.html'

path.posix.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'
```

如果 path 不是字符串或者给定了 ext 且不是字符串，则抛出 `TypeError`。


## path.delimiter
提供平台特定的==路径目录分隔符==：

- `;` 分号 用于 Windows
- `:` 冒号 用于 POSIX

在 Windows 上，以 `;` 分隔

```js
console.log(process.env.PATH);
// 打印: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// 返回: ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```


在 POSIX 上，以`:` 分隔

```js
console.log(process.env.PATH);
// 打印: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// 返回: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```

## path.sep
返回操作系统中，文件分隔符； window是 `\`, Unix是`/`。

```js
// POSIX 上：
'foo/bar/baz'.split(path.sep)    // 返回: ['foo', 'bar', 'baz']

//在 Windows 上：
'foo\\bar\\baz'.split(path.sep)  // 返回: ['foo', 'bar', 'baz']
```

在 Windows 上，正斜杠（/）和反斜杠（\）都被接受为路径片段分隔符。 但是， path 方法只添加反斜杠（\）。

## path.win32和path.posix
这两个均为属性。
- path：会根据当前操作系统来确定是使用windows的方式来操作路径，还是使用linux的方式来操作路径。
- path.win32：允许在任意操作系统上使用windows的方式来操作路径。
- path.posix：允许在任意操作系统上使用linux的方式来操作路径。
故在windows系统中，path==path.win32，而在linux系统当中，path==path.posix。


```js
console.log(path == path.win32); // true
console.log(path == path.posix); // false
```

## path.isAbsolute(path)#
- path <string>
- 返回: <boolean>

获取绝对路径，是一个绝对路径(比如 'E:/abc'或'E:\')，或者是以“/”或“\”开头的路径，二者都会返回true。

如果给定的 path 是零长度字符串，则返回 false。

```js
// 例如，在 POSIX 上：

path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false

// 在 Windows 上：

path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```

如果 path 不是字符串，则抛出 TypeError。

## path.resolve([...paths])
- `...paths <string>` 路径或路径片段的序列。
- `返回: <string>`

path.resolve() 方法将 ==路径 或路径片段==  的序列  ==解析为绝对路径==。

给定的路径序列 ==从右到左进行处理== ==，每个后续的 path 前置，直到构造出一个绝对路径==。   
例如，给定的路径片段序列：`/foo、 /bar、 baz`，调用 `path.resolve('/foo', '/bar', 'baz')` 将返回 `/bar/baz`。

如果在处理完所有给定的 path 片段之后==还未生成绝对路径，则再加上当前工作目录==。

生成的路径已规范化，并且除非将路径解析为根目录，否则将删除尾部斜杠。

零长度的 path 片段会被忽略。

如果==没有传入 path 片段==，则 path.resolve() 将==返回当前工作目录的绝对路径==。

path.resolve() 方法可以将多个路径解析为一个规范化的绝对路径。  
==其处理方式类似于对这些路径逐一进行cd操作，与cd操作不同的是，这引起路径可以是文件，并且可不必实际存在==（resolve()方法不会利用底层的文件系统判断路径是否存在，而只是进行路径字符串操作）。

==resolve 把`／`当成根目录==

### DOS 
- `cd /` 可以返回到要目录
- `cd go/../` 还是停留在当前目录
- `cd .. 与 cd ../` 返回上一级

```js
Microsoft Windows [版本 6.1.7601]
版权所有 (c) 2009 Microsoft Corporation。保留所有权利。

C:\Users\Administrator>cd go/../ 
C:\Users\Administrator>cd /
C:\>
```



```js
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif

```
如果任何参数不是字符串，则抛出 TypeError。

demo
目录：F:\coding\ES\Node\path-test.js
```js
const path = require('path')
console.log(__dirname)                             // F:\coding\ES\Node
console.log(path.resolve(__dirname, 'node/sql'))   // F:\coding\ES\Node\node\sql
console.log(path.resolve(__dirname, '/node/sql'))  // F:\node\sql

console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')) // F:\coding\ES\Node\wwwroot\static_files\gif\image.gif

console.log(path.resolve('/foo/bar', './baz'))      // F:\foo\bar\baz
console.log(path.resolve('foo/bar', './baz'))       // F:\coding\ES\Node\foo\bar\baz

console.log(path.resolve('/foo/bar', '/tmp/file/')) // F:\tmp\file
console.log(path.resolve('foo/bar', '/tmp/file/'))  // F:\tmp\file

console.log(path.resolve('/foo/bar', 'tmp/file/'))  // F:\foo\bar\tmp\file
console.log(path.resolve('foo/bar', 'tmp/file/'))   // F:\foo\bar\tmp\file

/*
 console.log(path.resolve(__dirname, '/node/sql'))  // F:\node\sql
 相当于
 cd F:\coding\es\node
 cd /
 cd node/sql
 所以 最终会返回 F:\node\sql
 */
 
console.log(path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')) //E:\tmp\subfile
//相当于：
// cd foo/bar
// cd /tmp/file/
// cd ..
// cd a/../subfile  

// cd a/../ 相当于进入a目录，但又返回了
```

## path.join([...paths])
- ...paths <string> 路径片段的序列。
- 返回: <string>

path.join() 方法用于连接路径，使用平台==特定的分隔符作为定界符将所有给定的 path 片段连接在一起==，然后==规范化生成的路径==。  
Unix系统是`/`，Windows系统是`\`。

- 零长度的 path 片段会被忽略。 
- 如果连接的路径字符串是零长度的字符串，则返回 '.'，表示当前工作目录。

path.join方法用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
// Unix    /foo/bar/baz/asdf
// Windows \foo\bar\baz\asdf

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```

### path.join()和path.resolve()区别
1. join 是把各个path片段连接在一起， resolve把`／`当成根目录
2. join ==直接拼接字段==，resolve ==解析路径并返回==


```js
// F:\coding\ES\Node\path-test.js

console.log(path.join('/a', '/b')  )  // \a\b
console.log(path.resolve('/a', '/b')) // F:\b

console.log(path.join('a', 'b1', '..', 'b2'))    // a\b2
console.log(path.resolve('a', 'b1', '..', 'b2')) // F:\coding\ES\Node\a\b2

console.log(path.join(__dirname,'/img/so'))  // F:\coding\ES\Node\img\so
console.log(path.join(__dirname,'./img/so')) // F:\coding\ES\Node\img\so

console.log(path.resolve(__dirname,'/img/so'))  // F:\img\so
console.log(path.resolve(__dirname,'./img/so')) // F:\coding\ES\Node\img\so
```


## path.parse(path)
- path <string>
- 返回: <Object>

path.parse() 方法返回一个对象，其属性表示 path 的重要元素。 尾部的目录分隔符将被忽略。
返回的对象将具有以下属性：

- dir <string>  目录
- root <string> 根目录
- base <string> 文件名 + 扩展名
- name <string> 文件名
- ext <string>  扩展名



```js
// POSIX
path.parse('/home/user/dir/file.txt')

// 返回:
// { 
//   root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' 
// }


// Windows
path.parse('C:\\path\\dir\\file.txt')

// 返回:
// { 
//   root: 'C:\\',
//   dir:  'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' 
// }
```


# 参考
- https://xianyulaodi.github.io/2017/05/07/nodejs%E4%B9%8Bpath%E6%A8%A1%E5%9D%97/
- https://segmentfault.com/a/1190000015271554
- http://www.css88.com/archives/4497