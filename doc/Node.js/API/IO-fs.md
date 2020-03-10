[TOC]
# 概述
在 NodeJS 中，所有与文件操作都是通过 fs 核心模块来实现的，包括文件目录的创建、删除、查询以及文件的读取和写入。

在 fs 模块中，所有的方法都分为同步和异步两种实现，具有 sync 后缀的方法为同步方法，不具有 sync 后缀的方法为异步方法，在了解文件操作的方法之前有一些关于系统和文件的前置知识，如文件的权限位 mode、标识位 flag、文件描述符 fd 等，所以在了解 fs 方法的之前会先将这几个概念明确。


# 标识位 flag

NodeJS 中，标识位代表着对文件的操作方式，如可读、可写、即可读又可写等等，在下面用一张表来表示文件操作的标识位和其对应的含义。

符号 | 含义
---|---
r   |   读取文件，如果文件不存在则抛出异常。
r+  | 	读取并写入文件，如果文件不存在则抛出异常。
rs  | 	读取并写入文件，指示操作系统绕开本地文件系统缓存。
w   | 	写入文件，文件不存在会被创建，存在则清空后写入。
wx  | 	写入文件，排它方式打开。
w+  | 	读取并写入文件，文件不存在则创建文件，存在则清空后写入。
wx+	|   和 w+ 类似，排他方式打开。
a   |   追加写入，文件不存在则创建文件。
ax  |   与 a 类似，排他方式打开。
a+  |   读取并追加写入，不存在则创建。
ax+	|   与 a+ 类似，排他方式打开。

上面表格就是这些标识位的具体字符和含义，但是 flag 是不经常使用的，不容易被记住，所以在下面总结了一个加速记忆的方法。
- r：读取
- w：写入
- s：同步
- +：增加相反操作
- x：排他方式

`r+` 和 `w+` 的区别，当文件不存在时，`r+` 不会创建文件，而会抛出异常，但`w+` 会创建文件；如果文件存在，`r+` 不会自动清空文件，但 `w+` 会自动把已有文件的内容清空。


# 文件描述符 fd

操作系统会为每个打开的文件分配一个名为文件描述符的数值标识，文件操作使用这些文件描述符来识别与追踪每个特定的文件，Window 系统使用了一个不同但概念类似的机制来追踪资源，为方便用户，NodeJS 抽象了不同操作系统间的差异，为所有打开的文件分配了数值的文件描述符。

在 NodeJS 中，每操作一个文件，文件描述符是递增的，文件描述符一般从 ==3== 开始，因为前面有 ==0、1、2==三个比较特殊的描述符，分别代表 
- process.stdin（标准输入）
- process.stdout（标准输出）
- process.stderr（错误输出）

# 文件操作的基本方法
文件操作中的基本方法都是对文件进行整体操作，即整个文件数据直接放在内存中操作，如读取、写入、拷贝和追加，由于计算机的内存容量有限，对文件操作需要考虑性能，所以这些方法只==针对操作占用内存较小的文件==。

## 文件读取
###   readFileSync 
readFileSync 有两个参数：
- 第一个参数为读取文件的路径或文件描述符；
- 第二个参数为 options，默认值为 null，其中有 encoding（编码，默认为 null）和 flag（标识位，默认为 r），也可直接传入 encoding；
- ==返回值为文件的内容==，如果没有 encoding，返回的文件内容为 Buffer，如果有按照传入的编码解析。

### readFile
异步读取方法 readFile 与 readFileSync 的前两个参数相同，==最后一个参数为回调函数，函数内有两个参数 err（错误）和 data（数据）==

==该方法没有返回值，回调函数在读取文件成功后执行==。



```js
//  1.txt，内容为 “Hello”

const fs = require("fs");

// 同步读取 readFileSync
let buf = fs.readFileSync("1.txt")
let data = fs.readFileSync("1.txt", "utf8")

console.log(buf)    // <Buffer 48 65 6c 6c 6f>
console.log(data)   // Hello


// 异步读取
fs.readFile("1.txt", "utf8", (err, data) => {
    console.log(err)    // null
    console.log(data)   // Hello
})

```

## 文件写入
### writeFileSync
writeFileSync 有三个参数：
- 第一个参数为写入文件的路径或文件描述符；
- 第二个参数为写入的数据，类型为 String 或 Buffer；
- 第三个参数为 options，默认值为 null，其中有 encoding（编码，默认为 utf8）、 flag（标识位，默认为 w）和 mode（权限位，默认为 0o666），也可直接传入 encoding。

### writeFile 
- writeFile异步写入方法 与 writeFileSync 的前三个参数相同  
- ==最后一个参数为回调函数，函数内有一个参数 err（错误），回调函数在文件写入数据成功后执行==。

```js
// 2.txt，内容为 “12345

const fs = require("fs");

// 同步写入 writeFileSync
fs.writeFileSync("2.txt", "Hello world");
let data = fs.readFileSync("2.txt", "utf8");

console.log(data); // Hello world

// 异步写入 writeFile
fs.writeFile("2.txt", "Hello world", err => {
    if (!err) {
        fs.readFile("2.txt", "utf8", (err, data) => {
            console.log(data); // Hello world
        })
    }
})
```

## 文件追加写入
###  appendFileSync
appendFileSync 有三个参数：
- 第一个参数为写入文件的路径或文件描述符；
- 第二个参数为写入的数据，类型为 String 或 Buffer；
- 第三个参数为 options，默认值为 null，其中有 encoding（编码，默认为 utf8）、 flag（标识位，默认为 a）和 mode（权限位，默认为 0o666），也可直接传入 encoding。

### appendFile
异步追加写入方法 appendFile 与 appendFileSync 的前三个参数相同==，最后一个参数为回调函数，函数内有一个参数 err（错误），回调函数在文件追加写入数据成功后执行==。

```js
// 3.txt，内容为 “Hello”
const fs = require("fs");

// 同步
fs.appendFileSync("3.txt", " world");
let data = fs.readFileSync("3.txt", "utf8");

console.log(data); // Hello world

// 异步
fs.appendFile("3.txt", " world", err => {
    if (!err) {
        fs.readFile("3.txt", "utf8", (err, data) => {
            console.log(data); // Hello world
        })
    }
})
```

## 文件拷贝写入
### copyFileSync
同步拷贝写入方法 copyFileSync 有两个参数
- 第一个参数为被拷贝的源文件路径
- 第二个参数为拷贝到的目标文件路径，如果目标文件不存在，则会创建并拷贝。

### copyFile
异步拷贝写入方法 copyFile 和 copyFileSync 前两个参数相同，最后一个参数为回调函数，在拷贝完成后执行。

现在将上面 3.txt 的内容拷贝到 4.txt 中：同步拷贝
```js
const fs = require("fs")

fs.copyFileSync("3.txt", "4.txt");
let data = fs.readFileSync("4.txt", "utf8");

console.log(data)       // Hello world

fs.copyFile("3.txt", "4.txt", () => {
    fs.readFile("4.txt", "utf8", (err, data) => {
        console.log(data) // Hello world
    })
})
```
### 模拟同步、异步拷贝写入文件
使用 readFileSync 和 writeFileSync 可以模拟同步拷贝写入文件，使用 readFile 和 writeFile 可以模拟异步写入拷贝文件，代码如下：
```js
const fs = require("fs");

// 同步
function copy(src, dest) {
    let data = fs.readFileSync(src);
    fs.writeFileSync(dest, data);
}

// 拷贝
copy("3.txt", "4.txt");

let data = fs.readFileSync("4.txt", "utf8");
console.log(data); // Hello world


// 异步
function copy(src, dest, cb) {
    fs.readFile(src, (err, data) => {
        // 没错误就正常写入
        if (!err) fs.writeFile(dest, data, cb);
    });
}

// 拷贝
copy("3.txt", "4.txt", () => {
    fs.readFile("4.txt", "utf8", (err, data) => {
        console.log(data); // Hello world
    });
});
```
# 文件操作的高级方法
## 打开文件 open
- open 方法有四个参数：
- path：文件的路径；
- flag：标识位；
- mode：权限位，默认 0o666；
- callback：回调函数，有两个参数 err（错误）和 fd（文件描述符），打开文件后执行。

==异步打开文件==
```js
const fs = require("fs");

fs.open("4.txt", "r", (err, fd) => {
    console.log(fd);
    fs.open("5.txt", "r", (err, fd) => {
        console.log(fd);
    });
})


// 3
// 4
```

## 关闭文件 close
close 方法有两个参数
- 第一个参数为关闭文件的文件描述符 fd
- 第二参数为回调函数，回调函数有一个参数 err（错误），关闭文件后执行。

异步关闭文件

```js
const fs = require("fs")

fs.open("4.txt", "r", (err, fd) => {
    fs.close(fd, err => {
        console.log("关闭成功");
    })
})

// 关闭成功
```

## 读取文件 read （大文件）
read 方法与 readFile 不同。==read 一般针对于文件太大，无法一次性读取全部内容到缓存中或文件大小未知的情况，都是多次读取到 Buffer 中==。

- read 方法中有六个参数：
- fd：文件描述符，需要先使用 open 打开；
- buffer：要将内容读取到的 Buffer；
- offset：整数，向 Buffer 写入的初始位置；
- length：整数，读取文件的长度；
- position：整数，读取文件初始位置；
- callback：回调函数，有三个参数 err（错误），bytesRead（实际读取的字节数），buffer（被写入的缓存区对象），读取执行完成后执行。


## 同步磁盘缓存 fsync
fsync 方法有两个参数，
- 第一个参数为文件描述符 fd，
- 第二个参数为回调函数，回调函数中有一个参数 err（错误），在同步磁盘缓存后执行。

==在使用 write 方法向文件写入数据时，由于不是一次性写入，所以最后一次写入在关闭文件之前应先同步磁盘缓存，fsync 方法将在后面配合 write 一起使用==。

## 写入文件 write
==write 方法与 writeFile 不同，是将 Buffer 中的数据写入文件，Buffer 的作用是一个数据中转站，可能数据的源占用内存太大或内存不确定，无法一次性放入内存中写入，所以分段写入，多与 read 方法配合==

- write 方法中有六个参数：
- fd：文件描述符，需要先使用 open 打开；
- buffer：存储将要写入文件数据的 Buffer；
- offset：整数，从 Buffer 读取数据的初始位置；
- length：整数，读取 Buffer 数据的字节数；
- position：整数，写入文件初始位置；
- callback：回调函数，有三个参数 err（错误），bytesWritten（实际写入的字节数），buffer（被读取的缓存区对象），写入完成后执行。下面将一个 Buffer 中间的两个字写入文件 

6.txt，原内容为 “你好
```js
const fs = require("fs");
let buf = Buffer.from("你还好吗");

// 打开文件
fs.open("6.txt", "r+", (err, fd) => {
    // 读取 buf 向文件写入数据
    fs.write(fd, buf, 3, 6, 3, (err, bytesWritten, buffer) => {
        // 同步磁盘缓存
        fs.fsync(fd, err => {
            // 关闭文件
            fs.close(fd, err => {
                console.log("关闭文件");
            });
        });
    });
});

// 这里为了看是否写入成功简单粗暴的使用 readFile 方法
fs.readFile("6.txt", "utf8", (err, data) => {
    console.log(data)
})

// 你还好
```

## ==针对大文件实现 copy==
之前我们使用 readFile 和 writeFile 实现了一个 copy 函数，那个 copy 函数是将被拷贝文件的数据一次性读取到内存，一次性写入到目标文件中，==针对小文件==。

如果是一个大文件一次性写入不现实，所以需要多次读取多次写入，接下来使用上面的这些方法针对大文件和文件大小未知的情况实现一个 copy 函数。

大文件拷贝
```js
// copy 方法
function copy(src, dest, size = 16 * 1024, callback) {
    // 打开源文件
    fs.open(src, "r", (err, readFd) => {
        // 打开目标文件
        fs.open(dest, "w", (err, writeFd) => {
            let buf = Buffer.alloc(size);
            let readed = 0; // 下次读取文件的位置
            let writed = 0; // 下次写入文件的位置

            (function next() {
                // 读取
                fs.read(readFd, buf, 0, size, readed, (err, bytesRead) => {
                    readed += bytesRead;

                    // 如果都不到内容关闭文件
                    if(!bytesRead) fs.close(readFd, err => console.log("关闭源文件"));

                    // 写入
                    fs.write(writeFd, buf, 0, bytesRead, writed, (err, bytesWritten) => {
                            // 如果没有内容了同步缓存，并关闭文件后执行回调
                            if (!bytesWritten) {
                                fs.fsync(writeFd, err => {
                                    fs.close(writeFd, err => return !err && callback());
                                });
                            }
                            writed += bytesWritten;

                            // 继续读取、写入
                            next();
                        }
                    );
                });
            })();
        });
    });
}
```
在上面的 copy 方法中，我们手动维护的下次读取位置和下次写入位置，如果参数 readed 和 writed 的位置传入 null，NodeJS 会自动帮我们维护这两个值。

现在有一个文件 6.txt 内容为 “你好”，一个空文件 7.txt，我们将 6.txt 的内容写入 7.txt 中。  
验证大文件拷贝


```js
const fs = require("fs")
// buffer 的长度
const BUFFER_SIZE = 3

// 拷贝文件内容并写入
copy("6.txt", "7.txt", BUFFER_SIZE, () => {
    fs.readFile("7.txt", "utf8", (err, data) => {
        // 拷贝完读取 7.txt 的内容
        console.log(data) // 你好
    })
})
```


==在 NodeJS 中进行文件操作，多次读取和写入时，一般一次读取数据大小为 64k，写入数据大小为 16k==

# 文件目录操作方法
下面的这些操作文件目录的方法有一个共同点，就是传入的第一个参数都为文件的路径，如：a/b/c/d，也分为同步和异步两种实现

## 查看文件目录操作权限
### (1) 同步查看操作权限方法 accessSync

accessSync 方法传入一个目录的路径，检查传入路径下的目录是否可读可写。

当有操作权限的时候没有返回值，没有权限或路径非法时抛出一个 Error 对象，所以使用时多用 ==try...catch... 进行异常捕获==。

```js
const fs = require("fs");

// 同步查看操作权限
try {
    fs.accessSync("a/b/c");
    console.log("可读可写");
} catch (err) {
    console.error("不可访问");
}
```


### (2) 异步查看操作权限方法 access

access 方法与第一个参数为一个目录的路径，最后一个参数为一个回调函数，回调函数有一个参数为 err（错误），在权限检测后触发，如果有权限 err 为 null，没有权限或路径非法 err 是一个 Error 对象。

```js
const fs = require("fs")

// 异步查看操作权限
fs.access("a/b/c", err => {
    if (err) {
        console.error("不可访问")
    } else {
        console.log("可读可写")
    }
})
```

## 获取文件目录的 Stats 对象
文件目录的 Stats 对象存储着关于这个文件或文件夹的一些重要信息，如创建时间、最后一次访问的时间、最后一次修改的时间、文章所占字节和判断文件类型的多个方法等等。

### (1) 同步获取 Stats 对象方法 statSync

statSync 方法参数为一个目录的路径，==返回值为当前目录路径的 Stats 对象==，现在通过 Stats 对象获取 a目录下的 b 目录下的 c.txt 文件的字节大小，文件内容为 “你好”

```js
const fs = require("fs");
// 同步获取 Stats 对象
let statObj = fs.statSync("a/b/c.txt");
console.log(statObj.size); // 6
```

### 异步获取 Stats 对象方法 stat

stat 方法的第一个参数为目录的路径，最后一个参数为回调函数，回调函数有两个参数 err（错误）和 Stats 对象，在读取 Stats 后执行


```
// 异步获取 Stats 对象

const fs = require("fs");

fs.stat("a/b/c.txt", (err, statObj) => {
    console.log(statObj.size); // 6
});
```

### state对象

```js
const fs = require('fs')

fs.stat('./mkdirs.js', (err, stats) => {
  console.log(stats)
  console.log(stats.size)                         // 获取文件的大小；
  console.log(stats.atime.toLocaleString())       // 获取文件最后一次访问的时间；
  console.log(stats.birthtime.toLocaleString())   // 文件创建的时间；
  console.log(stats.mtime.toLocaleString())       // 文件最后一次修改时间；
  console.log(stats.ctime.toLocaleString())       // 状态发生变化的时间；
  console.log(stats.isFile())                     // 判断是否是文件；是返回true、不是返回false；
  console.log(stats.isDirectory())                // 判断是否是目录；是返回true；不是返回false；
})
```

## 创建文件目录
### (1) 同步创建目录方法 mkdirSync

mkdirSync 方法参数为一个目录的路径，==没有返回值==，在创建目录的过程中，==必须保证传入的路径前面的文件目录都存在，否则会抛出异常==。
同步创建文件目录

```js
const fs = require("fs");

// 假设已经有了 a 文件夹和 a 下的 b 文件夹
try {
    fs.mkdirSync("a/b/c");
} catch(e) {}
```

### 异步创建目录方法 mkdir
mkdir 方法的
- 第一个参数为目录的路径
- 最后一个参数为回调函数，回调函数有一个参数 err（错误），在执行创建操作后执行，同样需要路径前部分的文件夹都存在。

异步创建文件目录

```js
const fs = require("fs");
// 假设已经有了 a 文件夹和 a 下的 b 文件夹
fs.mkdir("a/b/c", err => {
    if (!err) console.log("创建成功");
});

// 创建成功
```

## 读取文件目录
### (1) 同步读取目录方法 readdirSync

readdirSync 方法有两个参数：
- 第一个参数为目录的路径，传入的路径前部分的目录必须存在，否则会报错；
- 第二个参数为 options，其中有 encoding（编码，默认值为 utf8），也可直接传入 encoding；
- ==返回值为一个存储文件目录中成员名称的数组==。

假设现在已经存在了 a 目录和 a 下的 b 目录，b 目录中有 c 目录和 index.js 文件，下面读取文件目录结构。

```js
const fs = require("fs");

let data = fs.readdirSync("a/b");
console.log(data); // [ 'c', 'index.js' ]
```

### (2) 异步读取目录方法 readdir
readdir 方法的前两个参数与 readdirSync 相同，==第三个参数为一个回调函数==，回调函数有两个参数 err（错误）和 data（存储文件目录中成员名称的数组），在读取文件目录后执行。

上面案例异步的写法：异步读取目录

```js
const fs = require("fs");

fs.readdir("a/b", (err, data) => {
    if (!err) console.log(data);
});

// [ 'c', 'index.js' ]
```
## 删除文件目录
无论同步还是异步，==删除文件目录时必须保证文件目录的路径存在==，==且被删除的文件目录为空==，即不存在任何文件夹和文件。

### (1) 同步删除目录方法 rmdirSync
rmdirSync 的参数为要删除目录的路径，现在存在 a 目录和 a 目录下的 b 目录，删除 b 目录。同步删除目录

```js
const fs = require("fs");

fs.rmdirSync("a/b");
```


### (2) 异步删除目录方法 rmdir

rmdir 方法的第一个参数与 rmdirSync 相同，最后一个参数为回调函数，函数中存在一个参数 err（错误），在删除目录操作后执行。异步删除目录
```js
const fs = require("fs");

fs.rmdir("a/b", err => {
    if (!err) console.log("删除成功");
});

// 删除成功
```

## 删除文件操作
### (1) 同步删除文件方法 unlinkSync

unlinkSync ==的参数为要删除文件的路径==，现在存在 a 目录和 a 目录下的 index.js 文件，删除 index.js 文件。

同步删除文件


```js
const fs = require("fs");

fs.unlinkSync("a/inde.js");
```


### (2) 异步删除文件方法 unlink

unlink 方法的第一个参数与 unlinkSync 相同，==最后一个参数为回调函数==，函数中存在一个参数 err（错误），在删除文件操作后执行。

异步删除文件
```js
const fs = require("fs")
fs.unlink("a/index.js", err => {
    if (!err) console.log("删除成功");
});

// 删除成功
```

## 实现递归创建目录
我们创建一个函数，参数为一个路径，按照路径一级一级的创建文件夹目录。

1、同步的实现递归删除文件目录 —— 同步

```js
const fs = require("fs");
const path = require("path");

// 同步创建文件目录
function mkPathSync(dirPath) {
    // path.sep 文件路径分隔符（mac 与 window 不同）
    // 转变成数组，如 ['a', 'b', 'c']
    let parts = dirPath.split(path.sep);
    for(let i = 1; i <= parts.length; i++) {
        // 重新拼接成 a a/b a/b/c
        let current = parts.slice(0, i).join(path.sep);

        // accessSync 路径不存在则抛出错误在 catch 中创建文件夹
        try {
            fs.accessSync(current);
        } catch(e) {
            fs.mkdirSync(current);
        }
    }
}

// 创建文件目录
mkPathSync(path.join("a", "b", "c"));
```
同步代码就是利用 accessSync 方法检查文件路径是否存在，利用 try...catch... 进行错误捕获，如果路径不存在，则会报错，会进入 catch 完成文件夹的创建。


### 异步回调的实现

递归删除文件目录 —— 异步回调


```js
const fs = require("fs");
const path = require("path");

function mkPathAsync(dirPath, callback) {
    // 转变成数组，如 ['a', 'b', 'c']
    let parts = dirPath.split(path.sep);
    let index = 1;

    // 创建文件夹方法
    function next() {
        // 重新拼接成 a a/b a/b/c
        let current = parts.slice(0, index).join(path.sep);
        index++;

        // 如果路径检查成功说明已经有该文件目录，则继续创建下一级
        // 失败则创建目录，成功后递归 next 创建下一级
        fs.access(current, err => {
            if (err) {
                fs.mkdir(current, next);
            } else {
                next();
            }
        });
    }
    next();
}

// 创建文件目录
mkPathAsync(path.join("a", "b", "c"), () => {
    console.log("创建文件目录完成")
});

// 创建文件目录完成
```
上面方法中==没有通过循环实现每次目录的拼接，而是通过递归内部函数 next 的方式并维护 index 变量来实现的==，在使用 access 的时候成功说明文件目录已经存在，就继续递归创建下一级，如果存在 err 说明不存在，则创建文件夹。

### 异步 async/await 的实现
==上面两种方式，同步阻塞代码，性能不好==，异步回调函数嵌套性能好，但是维护性差，我们想要具备性能好，代码可读性又好可以使用现在 NodeJS 中正流行的 async/await 的方式进行异步编程

使用 async 函数中 await 等待的异步操作必须转换成 Promise，以前我们都使用 util 模块下的 promisify 方法进行转换，其实 promisify 方法的原理很简单，我们在实现递归创建文件目录之前先实现 promisify 方法。

promisify 原理

```js
// 将一个异步方法转换成 Promise
function promisify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn.call(null, ...args, err => err ? reject() : resolve());
        });
    }
}
```

其实 promisify 方法就是利用闭包来实现的，调用时传入一个需要转换成 Promise 的函数 fn，返回一个闭包函数，在闭包函数中返回一个 Promise 实例，并同步执行了 fn，通过 call 将闭包函数中的参数和回调函数作为参数传入了 fn 中，该回调在存在错误的时候调用了 Promise 实例的 reject，否则调用 resolve；

### ==递归删除文件目录 —— 异步 async/await==

```js
const fs = require("fs");
const path = require("path");

// 将 fs 中用到的方法转换成 Promise
const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);

// async/await 实现递归创建文件目录
async function mkPath(dirPath) {
    // 转变成数组，如 ['a', 'b', 'c']
    let parts = dirPath.split(path.sep);

    for(let i = 1; i <= parts.length; i++) {
        // 重新拼接成 a a/b a/b/c
        let current = parts.slice(0, i).join(path.sep);

        // accessSync 路径不存在则抛出错误在 catch 中创建文件夹
        try {
            await access(current);
        } catch(e) {
            await mkdir(current);
        }
    }
}


// 创建文件目录
mkPath(path.("a", "b", "c")).then(() => {
    console.log("创建文件目录完成");
});

// 创建文件目录完成
```

# 模块函数表
![image](https://note.youdao.com/yws/public/resource/95cb4324dfaf6d3230d55bbe4e26932f/xmlnote/C332182EC5B147C28904073C338B78C6/26047)

# 参考
- https://code.ziqiangxuetang.com/nodejs/nodejs-fs.html