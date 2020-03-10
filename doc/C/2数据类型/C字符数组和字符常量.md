## 一、字符数组和字符串的重定义
字符数组就是字符串吗？有人说是，因为书上这么写，教师也这么教的。小雅不敢说书上或教师们错了，但至少可以说许多初学者都混淆了这两个概念。因此，在这此将这2个概念再明确一下。
1. 字符数组，完整地说叫字符类型的数组。字符数组不一定是字符串。
1. 字符串是最后一个字符为NULL字符的字符数组。字符串一定是字符数组。
1. 字符数组的长度是固定的，其中的任何一个字符都可以为NULL字符。
1. 字符串只能以NULL结尾，其后的字符便不属于该字符串。
1. strlen()等字符串函数对字符串完全适用，对不是字符串的字符数组不适用。


```
#include <stdio.h>
#include <string.h>

int main(void)
{
    //这是字符数组赋初值的方法
    char cArr[] = {'Q','U','A','N','X','U','E'};
    //这是字符串赋初值的方法
    char sArr[] = "quanxue";

    //用sizeof()求长度
    printf("cArr的长度=%d\n", sizeof(cArr));   //长度为7
    printf("sArr的长度=%d\n", sizeof(sArr));   //长度为8，最后一位是NULL

    //用printf的%s打印内容
    printf("cArr的内容=%s\n", cArr);   //不能正确显示
    printf("sArr的内容=%s\n", sArr);   //可以正确显示

    //用strlen()求长度
    printf("cArr的长度=%d\n", strlen(cArr));   //不正确的结果
    printf("sArr的长度=%d\n", strlen(sArr));   //NULL不在计算范围

    return 0;
}
```
 ![image](http://www.quanxue.cn/jc_clanguage/CLang/clang10.gif)

从上面例子看来，还要注意以下几点：
1. char sArr[] = "quanxue";这种方式，编译时会自动在末尾增加一个NULL字符。
1. NULL字符也就是'\0'，在ASCII表中排在第一个，用16进制表示为0x00。
1. sizeof()运算符求的是字符数组的长度，而不是字符串长度。
1. strlen()函数求的是字符串长度，而不是字符数组。它不适用于字符串以外的类型。
1. char sArr[] = "quanxue";也可以写成char sArr[8] = "quanxue";（注意：是8而不是7）
2. 

## 二、字符串数组
字符串数组是二维字符数组，同样道理，二维字符数组不一定是字符串数组。


```
#include <stdio.h>

int main(void)
{
    int  i;

    //这是字符数组赋初值的方法，维数：4Ｘ2
    char cArr[][2] = {{'Q','U'},
                     {'A','N'},
                     {'X','U'},
                     {'E','\0'}};
    //这是字符串数组赋初值的方法，维数：4Ｘ3
    char sArr[][3] = {"qu","an","xu","e"};

    //用sizeof()求长度
    for (i=0; i<4; i++) {
        printf("%d: %d  %d\n", i, sizeof(cArr[i]), sizeof(sArr[i]));
        printf("[%s] [%s]\n", cArr[i], sArr[i]);
    }

    return 0;
}
```

从上面可以看出，cArr[i]的长度为2，sArr[i]的长度为3，因为多了一个NULL字符。输出cArr[i]时，因为中间没有NULL字符，所以一直显示到有NULL为止。

![image](http://www.quanxue.cn/jc_clanguage/CLang/clang10_3.gif)

## 三、字符数组和字符串数组的转化
字符数组中插入一个NULL字符，NULL字符前面（包括NULL字符）就成了字符串，一般NULL字符插在有效字符的最后。


```
#include <stdio.h>
#include <string.h>

int main(void)
{
    //因为最后有NULL，所以这就变成了字符串
    char cArr[] = {'Q', 'U', 'A', 'N', 'X', 'U', 'E', '\0'};
    //因为少定义了一位，最后无NULL，所以这就变成了字符数组
    char sArr[7] = "quanxue";
    //最后一个元素未赋值
    char tArr[16] = "www.quanxue.cn";

    //用sizeof()求长度
    printf("cArr: %2d ,%2d\n", strlen(cArr), sizeof(cArr));
    printf("sArr: %2d ,%2d\n", strlen(sArr), sizeof(sArr));
    printf("tArr: %2d ,%2d\n", strlen(tArr), sizeof(tArr));

    //将tArr的最后一个元素赋值，字符串就成了字符数组
    tArr[15] = '!';

    //作为字符数组，将显示16个字符
    for (i=0; i<16; i++) printf("%c", tArr[i]);  //字符数组的显示方法
    //作为字符串，将显示14个字符。
    printf("\n%s\n", tArr);     //字符串的显示方法

    return 0;
}
```
![image](http://www.quanxue.cn/jc_clanguage/CLang/clang10_3.gif)

## 总结

- strlen只对字符串有用str[]="AB"，对字符数组无用 str[]={'A','B'}
-  cahr *pstr="hello" 以这种方式定义的叫字符串常量，只能读取不能写入 cahr *pstr="hello" pstr[1]='c' //是错误的
- 内存中存诸的位置不同,
    - 字符数组存储在全局数据区或栈区,全局数据区和栈区的字符串（也包括其他数据）==有读取和写入的权限==  
    - 字符串常量存储在常量区，而常量区的字符串（也包括其他数据）==只有读取权限，没有写入权限==。
