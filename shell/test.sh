# test 命令用于检查某个条件是否成立，它可以进行数值、字符和文件三个方面的测试。
# 参数	说明
# -eq	等于则为真
# -ne	不等于则为真
# -gt	大于则为真
# -ge	大于等于则为真
# -lt	小于则为真
# -le	小于等于则为真

num1=100
num2=100
string="hello"

#-----------------------------------------------------------

if test $[num1] -eq $[num2]
then
	echo '相等'
else
	echo '不相等'
fi
# 相等

#-----------------------------------------------------------

if test $num1 = $num2
then
	echo '相等'
else
	echo '不相等'
fi
# 相等

#-----------------------------------------------------------
# 文件测试
# 参数	说明
# -e 文件名	如果文件存在则为真
# -r 文件名	如果文件存在且可读则为真
# -w 文件名	如果文件存在且可写则为真
# -x 文件名	如果文件存在且可执行则为真
# -s 文件名	如果文件存在且至少有一个字符则为真
# -d 文件名	如果文件存在且为目录则为真
# -f 文件名	如果文件存在且为普通文件则为真
# -c 文件名	如果文件存在且为字符型特殊文件则为真
# -b 文件名	如果文件存在且为块特殊文件则为真

cd /bin
if test -e ./bash
then
    echo '文件已存在!'
else
    echo '文件不存在!'
fi

# 文件已存在!

#-----------------------------------------------------------
# 还提供了与( -a )、或( -o )、非( ! )三个逻辑操作符用于将测试条件连接起来
# 其优先级为："!"最高，"-a"次之，"-o"最低

cd /bin
if test -e ./notFile -o -e ./bash
then
    echo '有一个文件存在!'
else
    echo '两个文件都不存在'
fi
#有一个文件存在