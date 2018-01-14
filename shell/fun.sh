#!/bin/bash

init(){
	echo "This is my first function!"
}

echo "-----run init----"
init
echo "-----run done----"

# result:
# -----run init----
# This is my first function!
# -----run done----

#-----------------------------------------------------------

fun(){
	echo $1  # first parameter
	echo $2	
	echo $*	 # all parameters
	echo $#  # length
}

fun 1000 "function"

# 1000
# function
# 1000 function
# 2


# 注意，$10 不能获取第十个参数，获取第十个参数需要${10}。当n>=10时，需要使用${n}来获取参数。
# 参数处理	说明
# $#	传递到脚本的参数个数
# $*	以一个单字符串显示所有向脚本传递的参数
# $$	脚本运行的当前进程ID号
# $!	后台运行的最后一个进程的ID号
# $@	与$*相同，但是使用时加引号，并在引号中返回每个参数。
# $-	显示Shell使用的当前选项，与set命令功能相同。
# $?	显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。