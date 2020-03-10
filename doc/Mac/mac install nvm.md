### nvm 安装
首先要确认使用的是zsh还是bash
- bash 使用的是.bash_profile
- zsh .zshrc

首先打开终端，进入当前用户的home目录中。

```
cd ~
```

然后使用ls -a显示这个目录下的所有文件（夹）（包含隐藏文件及文件夹），查看有没有.bash_profile这个文件。

```
ls -a
```

如果没有，则新建一个。


```
touch ~/.bash_profile
```

如果有或者新建完成后，我们通过官方的说明在终端中运行下面命令中的一种进行安装：

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | zsh  #this
```

上面命令执行完后会在 .bash_profile 中写入

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

然后在命令行中手工导入


```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

### vm 常用命令
- nvm install stable  安装最新稳定版 node
- nvm install <version>  安装指定版本，如：安装v4.4.0，nvm install v4.4.0
- nvm uninstall <version>  删除已安装的指定版本，语法与install类似
- nvm use <version>  切换使用指定的版本node
- nvm ls  列出所有安装的版本
- nvm alias default <version>  如： nvm alias default v11.1.0