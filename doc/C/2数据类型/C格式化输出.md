## 常见格式符号


格式字符  |	类 型|	输出格式
---|---|---
c	| int 或win_t	        |   以字符方式输出。
C	| int 或win_t	        |   用在printf()函数中时，以双字节字符显示；用在wprintf()函数中时，以单字节字符显示。
==d==	| int		            |   以整型输出。
i	| int		            |   以整型输出。
==o==	| int		            |   以八进制无符号整型输出。
==u==	| int		            |   以十进制无符号整型输出。
==x==	| int		            |   以十六进制小写输出(abcdef)。
==X==	| int		            |   以十六进制小写输出(ABCDEF)。
e	| double		        |   以科学计数法表示float和double型数据。(其中e用小写) double型的参数以指数形式打印，有一个数字会在小数点前，六位数字在小数点后，而在指数部分会以小写的e来表示。
E	| double		        |   以科学计数法表示float和double型数据。(其中E用大写)
==f==	| double		        |   以小数表示float和double型数据。double 型的参数会被转成十进制数字，并取到小数点以下六位，四舍五入。
g	| double		        |   自动地将能显示的很小或很大的数转换成%f，不能直接显示的数则转换成%e。
G	| double		        |   自动地将能显示的很小或很大的数转换成%f，不能直接显示的数则转换成%E。
n	| Pointer to integer	|  	Number of characters successfully written so far to the stream or buffer; this value is stored in the integer whose address is given as the argument.
p	| Pointer to void	    |  	内存地址，以十六进制表示。
==s==	| String	            |  	以字符串输出。
S	| String		        |   用在printf()函数中时，以双字节字符串显示；用在wprintf()函数中时，以单字节字符串显示。

%d称为格式控制符，它指明了以何种形式输出数据。  
格式控制符均以%开头，后跟其他字符。%d 表示以十进制形式输出一个整数。  
除了 %d，printf 支持更多的格式控制  
例如：  
%c：输出一个字符。c 是 character 的简写。  
%s：输出一个字符串。s 是 string 的简写。  
%f：输出一个小数。f 是 float 的简写。  

## 格式说明字符
字符 | 说明
---|---|--
字母I | 用于长整型整数，可加在格式符d,o,x,u
m(代表一个正整数) | 用十进制整数来表示输出的最少位数。 若实际位数多于定义的宽度，则按实际位数输出， 若实际位数少于定义的宽度则补以空格或0。
m(代表一个正整数) | 对实数（浮点）表示输出n位小数；对字符串表示截取的字符个数
- |输出的数字或字符串在域内向左靠

## 标志

标志字符为 -、+、# 和空格四种，其意义下表所示：

标 志	|   意义 | eg
---|---|---
-	| 结果左对齐，右边填空格 | *931  *
+	| 输出符号(正号或负号),有符号的值若为正，则显示带加号的符号；若为负则带减号的符号；| +931 -931
空格|	输出值为正时冠以空格，为负时冠以负号
#	|对c、s、d、u类无影响；
&nbsp;|对o类，在输出时加前缀o；
&nbsp;|对x类，在输出时加前缀0x；
&nbsp;|对e、g、f 类当结果有小数时才给出小数点。

## 格式输出『printf()』

```
#include <stdio.h>

int main(void)
{
    int days = 360;

    //“劝学网”三字的ASCII码是“C8B0”“D1A7”“CDF8”
    printf("\xC8\xB0\xD1\xA7\xCD\xF8\t小雅\n");   //显示：劝学网{TAB}小雅

    printf("北京奥运还有: %d天\n", days);
    printf("\a\a");          //“嘟嘟”

    //以下三行写在同一行
    printf("%s", "这是C语言")
    printf("教程\t");
    printf("作者：%s\n","小雅");

    //360分别以整数、小数、科学计数法显示
    printf("整数:%d\n小数:%f\n科学:%e\n",days,(float)days,(double)days);

    //以下控制字节长度
    printf("360用5个字节表示：[%5d]\n",days);   //[...]中共5字节
    printf("3.6保留2位整数2位小数：[%5.2f]\n",(float)days/100);   //[...]中2位整数2位小数，
                                                                  //外加小数点共5字节
    return 0;
}
```
## 格式输入『scanf()』

```
#include <stdio.h>
int main(void)
{
    int age;         //年龄
    char name[20];    //姓名

    printf("请输入你的年龄：");
    scanf("%d", &age);      //&age表示变量age的地址

    printf("请输入你的姓名：");
    scanf("%s", name);      //name单独使用就表示变量name的地址

    printf("\n姓名=%s\t年龄=%d\n",name,age);

    return 0;
}
```
