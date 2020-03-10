## 关键字

C语言的变量命名是很自由的，不同的系统有各自的规则，如UNIX主张用小写并用下划线分割意思（例：new_value）。Windows主张大小写混写（例：NewValue）。 中国主张尽可能用英文，而日本更喜欢用汉字的读音。甚至不同企业的命名规则也不一样，但不管什么风格，都必须遵守C语言的几点规则。
- 不能用纯数字命名，如“123”，“849”等。
- 不能有空格和运算符，如“new value”，“two+three”。
- 不能用C语言的关键字（参见下表）、扩充关键字。

-|-|-|-|     
---|---|---|---|---
auto    |	double   |	 int	   |    struct
break   |	else     |	 long	   |    switch
case	|	enum     |	 register  |    typedef
char	|   extern   |	 return    |	union
const	|   float    |	 short	   |    unsigned
continue| 	for      |	 signed	   |    void
default	|   goto     |	 sizeof	   |    volatile
do	    |   if	     |   static    |	while

## 定义常量
在 C 中，有两种简单的定义常量的方式：
- 使用 #define 预处理器。
- 使用 const 关键字。
>请注意，把常量定义为大写字母形式，是一个很好的编程实践。
### #define 预处理器  

下面是使用 #define 预处理器定义常量的形式：

#define identifier(标识符) value(值)

##  变量

> type variable_list;  
> type variable_list;=value;

变量定义要注意以下几方面：
1. 变量定义必须有一数据类型。
2. 变量定义时可以赋初值，也可以不赋初值。
3. 几个变量可以同时定义。
4. 不同类型的变量赋值时，小类型的变量可以直接赋给大的，大类型的变量赋给小类型的变量时必须强制转换


### 变量声明

1. 一种是需要建立存储空间的。例如：int a 在声明的时候就已经建立了存储空间。
2. 另一种是不需要建立存储空间的，通过使用extern关键字声明变量名而不定义它。 例如：extern int a 其中变量 a 可以在别的文件中定义的。
除非有extern关键字，否则都是变量的定义。


```
#include<stdlib.h>
#include<stdio.h>

#define RADIUS 100  // 宏定义 常量


int main()
{
	const int RADIUS2 = 100; //const 定义常量

	printf("%d\n", RADIUS);

	
	printf("%d\n", RADIUS2);

	// RADIUS2 = 200;const常量是不能修改的

	
	varibale();
	system("pause");
	
	return 0;
}

/*
type variable_list;
变量定义要注意以下几方面：
	1. 变量定义必须有一数据类型。
	2. 变量定义时可以赋初值，也可以不赋初值。
	3. 几个变量可以同时定义。
	4. 不同类型的变量赋值时，小类型的变量可以直接赋给大的，大类型的变量赋给小类型的变量时必须强制转换
*/

// 变量声明
/*
1、一种是需要建立存储空间的。例如：int a 在声明的时候就已经建立了存储空间。
2、另一种是不需要建立存储空间的，通过使用extern关键字声明变量名而不定义它。 例如：extern int a 其中变量 a 可以在别的文件中定义的。
除非有extern关键字，否则都是变量的定义。
*/
extern int a, b;
extern int c;
extern float f;
int varibale()
{
	/* 变量定义 */
	int a, b;
	int c;
	float f;

	int rmb = 1000000000;

	/* 初始化 */
	a = 10;
	b = 20;

	c = a + b;
	printf("value of c : %d \n", c);

	f = 70.0 / 3.0;
	printf("value of f : %f \n", f);

	printf("rmb=%d\n", rmb);
	return 0;
	
}
```
