mac 默认shell为zsh

查看当前已安装shells：


```
cat /etc/shells

# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh

```


更改mac默认shell为zsh:


```
chsh -s /usr/local/bin/zsh
```


更改zsh配置文件：


```
vim ~/.zshrc
```


更改完配置记得运行：


```
source ~/.zshrc
```


还原默认shell：


```
chsh -s /bin/bash
```

