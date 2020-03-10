## Mac系统中常用快捷键
- 在启动时按下 option: 选择启动的系统
- `command + shift + .` 显示隐藏文件
- `command + space` 聚焦
- `command + space` 输入： 活动监视器
- `control + space` 选择输入法
- `control + option + sapce` 切换输入法 

##
- command + V + option 类似剪切
- command + V 粘贴
- command + C 复制

##
- command-W-option: 关闭一切窗口
- command-W: 关闭窗口
- command-Q: 退出应用程序

##
- command-Delete (Finder 菜单)：删除文件
- command-Delete-Shift (Finder 菜单): 倾倒废纸篓
- command-O (文件菜单): 打开文件
- command-S (文件菜单): 保存资料
- command-W (文件菜单): 关闭窗口
- command-I (Finder菜单): 打开“显示简介”
- command-M : 缩小窗口至 Dock
- command-D-option: 显示或隐藏 Dock
- command-tab: 更换应用程序

##
- command-Shift-3: 整个屏幕截图，将截图文件存于桌面
- command-Shift-3-Control: 整个屏幕截图，将截图内容存于剪切版中
- command-Shift-4: 将所选定的部分内容屏幕截图，将截图文件存于桌面
- command-Shift-4 并选定时按下 Control: 将所选定的部分内容屏幕截图，将截图文件存于剪切版中。


##
### 定制快捷键
1. 比如：chrome, 点击视图，找到刷新网页的标题（我的是“重新加载此页”）。
2. 系统偏好设置->键盘->快捷键->左边App快捷键->右边加号->按截图填写
3. 应用程序 -> chrome.app 
4. 菜单标题 -> 重新加载此页 
5. 快捷键：-> fn + F5





## 终端命令：
- `ls` 查看当前的目录信息
- `clear` 清除(作用是保持界面干净整洁)
- `cd 目录名称` 进入到某目录
- `cd ..` 返回上级目录(可以通过../../越级返回目录)
- `mkdir 目录名称` 创建目录
- `touch 文件名` 创建文件(记得确认后缀-文件类型)
- `rm -rf 文件名|目录名称(慎用)`  删除
- `pwd` 显示当前的路径信息
- `mv 原名称 新名称` 修改名称
- `open 应用名称` 打开应用


## 启动台图标调小
1. 终端运行命令：10代表一行显示10个图标，几个可以自定义

```
defaults write com.apple.dock springboard-columns -int 10
```

2. 设置完需要重新启动一下启动台，终端输入如下命令
```
killall Dock
```

## touch bar怎么设置一直显示F1~F12 
可以在打开某些软件的情况下一直显示f1-f12，如Chrome DevTools
系统偏好设置->键盘->快捷键->功能键-> 点加号加入应用程序

## 目录

```
HSD:/ daysun$ pwd
/
HSD:/ daysun$ ls -l
total 10
drwxrwxr-x+ 34 root  admin  1088  1  8 17:56 Applications
drwxr-xr-x  64 root  wheel  2048 12 18 13:03 Library
drwxr-xr-x@  8 root  wheel   256 10 29 14:50 System
drwxr-xr-x   5 root  admin   160  1  8 19:26 Users
drwxr-xr-x   9 root  wheel   288  1  8 17:55 Volumes
drwxr-xr-x@ 38 root  wheel  1216 12 18 13:01 bin
drwxr-xr-x   2 root  wheel    64  8 24 07:01 cores
dr-xr-xr-x   3 root  wheel  4664 12 23 14:45 dev
lrwxr-xr-x@  1 root  admin    11 10 29 16:52 etc -> private/etc
lrwxr-xr-x   1 root  wheel    25 12 23 14:45 home -> /System/Volumes/Data/home
drwxr-xr-x   2 root  wheel    64  8 24 07:04 opt
drwxr-xr-x   6 root  wheel   192 12 18 13:02 private
drwxr-xr-x@ 63 root  wheel  2016 12 18 13:01 sbin
lrwxr-xr-x@  1 root  admin    11 10 29 17:02 tmp -> private/tmp
drwxr-xr-x@ 11 root  wheel   352 10 29 17:02 usr
lrwxr-xr-x@  1 root  admin    11 10 29 17:02 var -> private/var
```

### Unix 通用目录
- /bin 传统 unix 命令的存放目录，如 ls，rm， mv 等
- /sbin 传统 unix 管理类命令存放目录，如 fdisk，ifconfig等
- /usr 第三方程序安装目录
- /usr/bin, /usr/sbin,/usr/lib, 其中/usr/lib目录中存放了共享库（动态链接库）
- /dev 设备文件存放目录，如 代表硬盘的 /dev/disk0
- /etc 标准unix系统配置文件存放目录，如用户密码文件 /etc/passwd。此目录实际指向 /private/etc 的链接
- /tmp 临时文件存放目录，其权限为所有人任意读写。此目录实际指向 /private/tmp 的链接
- /var 存放经常变化的文件，如日志文件。此目录实际指向 /private/var的链接

### mac OS 独有目录
- /Applications 应用程序目录，默认所有的GUI应用程序都安装在这里
- /Library 系统的数据文件、帮助文件、文档等等
- /Network 网络节点存放目录
- /System 只包含一个名为 Library 的目录，这个字目录中存放了系统的绝大部分组件，如各种framework，以及内核模块，字体文件等等
- /Users 存放用户的个人资料和配置。每个用户有自己的单独目录
- /Volumes 文件系统挂载点存放目录
- /cores 内核转储文件存放目录。当一个进程奔溃时，如果系统允许则会产生转储文件
- /private 里面的字目录存放了 /tmp，/var，/etc 等链接目录的目标目录


## 修改hosts

```
sudo vim /etc/hosts
```


https://zhuanlan.zhihu.com/p/89423923