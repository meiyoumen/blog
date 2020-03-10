## 问题
exec: "gcc": executable file not found in %PATH%

## mingw 64
MinGW全称Minimalist GNU For Windows，是个精简的Windows平台C/C++、ADA及Fortran编译器

相比Cygwin而言，体积要小很多，使用较为方便。

MinGW提供了一套完整的开源编译工具集，以适合Windows平台应用开发，且不依赖任何第三方C运行时库

MinGW包括：
- 一套集成编译器，包括C、C++、ADA语言和Fortran语言编译器
- 用于生成Windows二进制文件的GNU工具的（编译器、链接器和档案管理器）
- 用于Windows平台安装和部署MinGW和MSYS的命令行安装器（mingw-get）
- 用于命令行安装器的GUI打包器（mingw-get-inst）

MinGW分为较早开发的MinGW32和之后为编译64位程序开发的MinGW-w64
- MinGW32只能编译32位的程序，
- 而mingw64不仅能编译64位程序，也能编译32位程序，还能进行交叉编译，即在32位主机上编译64位程序，在64位主机上编译32位程序

## 下载
- 腾飞微云 x86_64-8.1.0-release-posix-seh-rt_v6-rev0.7z
- https://download.csdn.net/download/qq_17472959/11612070

## 通过压缩包安装
- 下载压缩包，解压到C:\mingw64目录下

![image](https://images2015.cnblogs.com/blog/10966/201610/10966-20161013211207453-1042788760.png)

- 在cmd窗口下

```
C:\mingw64\bin
gcc -v
```
![image](https://images2015.cnblogs.com/blog/10966/201610/10966-20161013211209359-931023283.png)

- env
安装成功后，如何让go编译器调用gcc呢？
需要设置环境变量path，如下添加

```
C:\mingw64\bin
```


## 考考
- https://www.cnblogs.com/zsy/p/5958170.html
- golang cgo windows mingw64 环境搭建 https://www.jishuwen.com/d/2tCf