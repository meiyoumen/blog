## C常见基本数据类型
![image](http://f12.baidu.com/it/u=4248919874,3024551144&fm=170&s=5AA8346259DEC4CE0AF5A1DA0000C0B1&w=443&h=395&img.GIF&access=215967316)


## 带符号与无符号类型 signed和unsigned
- int、stort  long  都默认为带符号整型 
- signed    代表有符号，包括==正数、负数和0==，取值范围是-32768~32767
- unsigned  代表无符号，只包==括正数和0==，取值范围是0~65535，要获得无符号类型必须指定该类型为unsigned，比如unsigned long。  
- signed、unsigned也可以修饰char，long还可以修饰double

```
unsigned char c1 = 10;
signed char c2 = -10;
long double d1 = 12.0;
```


>当然不同的编译器有不同的取值范围，其实signed和unsigned的区别就是它们的==最高位是否要当做符号位==，并不会像short和long那样改变数据的长度，即所占的字节数

## 不同编译器环境下基本数据类型的存储长度(字节)


```
#include<stdio.h>
#include<stdlib.h>
int main() {
	printf("char \t\t size = %d\n", sizeof(char));
	printf("short \t\t size = %d\n", sizeof(short));
	printf("int \t\t size = %d\n", sizeof(int));
	printf("long\t\t size = %d\n", sizeof(long int));
	printf("long long\t size = %d\n", sizeof(long long));
	printf("float \t\t size = %d\n", sizeof(float));
	printf("double \t\t size = %d\n", sizeof(double));
	printf("long double\t size = %d\n", sizeof(long double));

	/*
	char             size = 1
	short            size = 2
	int              size = 4
	long             size = 4
	long long        size = 8
	float            size = 4
	double           size = 8
	long double      size = 8
	*/

	system("pause");
	return 0;
}

```


类型  | 32位 | 64位 | 取值范围 | 有效保留数字
---|---|---|---|---|---
==char==              | 1 | 1 | -128 ~ 127                              |
==void*（指针变量）== | 4 | 8 |
short                 | 2 | 2 | -32768~32767，即 -2^15^~(2^15^-1)
unsigned short        | 2 | 2 | 0~65535，即 0~(2^16^-1)
unsigned int          | 4 | 4 | 0~4294967295，即 0~ (2^32^-1)
==int==               | 4 | 4 | -2147483648 ~ 2147483647 ， 即 -2^31^~(2^31^-1)
==float==             | 4 | 4 | 1.17549e-38 ~ 3.40282e+38                     | 6~7位
==double==            | 8 | 8 | 1.79769e+308 ~ 2.22507e-308         | 15~16位
long double           | - | 16 |1.18973e+4932 ~ 3.3621e-4932	 | 18~19位
==long==              | 4 | 8 | -9223372036854775808  ~ 9223372036854775807	
unsigned long         | 4 | 8 | 0  ~ 18446744073709551615

- int、unsigned、long、unsigned long 、double的数量级最大都只能表示为10亿，即它们表示十进制的位数不超过10个，即可以保存所有9位整数。
- short只是能表示5位；

- 另外对于浮点说而言：使用double类型基本上不会有错。
> 在float类型中隐式的精度损失是不能忽视的，二双精度计算的代价相对于单精度可以忽略。    
事实上，在有些机器上，double类型比float类型的计算要快得多。  
float型只能保证6位有效数字，而double型至少可以保证15位有效数字（小数点后的数位），long double型提供的精度通常没有必要，而且还要承担额外的运行代价。    
double是8字节共64位，其中小数位占52位，2-^52=2.2204460492503130808472633361816e-16，量级为10^-16，故能够保证2^-15的所有精度。   
在有些机器上，用long类型进行计算所付出的运行时代价远远高于用int类型进行同样计算的代价，所以算则类型前要先了解程序的细节并且比较long类型与int类型的实际运行时性能代价。

```
//c++ 
#include<iostream>  
#include<string>  
#include <limits>  
using namespace std;  
  
int main()  
{  
    cout << "type: \t\t" << "************size**************"<< endl;  
    cout << "bool: \t\t" << "所占字节数：" << sizeof(bool);  
    cout << "\t最大值：" << (numeric_limits<bool>::max)();  
    cout << "\t\t最小值：" << (numeric_limits<bool>::min)() << endl;  
    cout << "char: \t\t" << "所占字节数：" << sizeof(char);  
    cout << "\t最大值：" << (numeric_limits<char>::max)();  
    cout << "\t\t最小值：" << (numeric_limits<char>::min)() << endl;  
    cout << "signed char: \t" << "所占字节数：" << sizeof(signed char);  
    cout << "\t最大值：" << (numeric_limits<signed char>::max)();  
    cout << "\t\t最小值：" << (numeric_limits<signed char>::min)() << endl;  
    cout << "unsigned char: \t" << "所占字节数：" << sizeof(unsigned char);  
    cout << "\t最大值：" << (numeric_limits<unsigned char>::max)();  
    cout << "\t\t最小值：" << (numeric_limits<unsigned char>::min)() << endl;  
    cout << "wchar_t: \t" << "所占字节数：" << sizeof(wchar_t);  
    cout << "\t最大值：" << (numeric_limits<wchar_t>::max)();  
    cout << "\t\t最小值：" << (numeric_limits<wchar_t>::min)() << endl;  
    cout << "short: \t\t" << "所占字节数：" << sizeof(short);  
    cout << "\t最大值：" << (numeric_limits<short>::max)();  
    cout << "\t\t最小值：" << (numeric_limits<short>::min)() << endl;  
    cout << "int: \t\t" << "所占字节数：" << sizeof(int);  
    cout << "\t最大值：" << (numeric_limits<int>::max)();  
    cout << "\t最小值：" << (numeric_limits<int>::min)() << endl;  
    cout << "unsigned: \t" << "所占字节数：" << sizeof(unsigned);  
    cout << "\t最大值：" << (numeric_limits<unsigned>::max)();  
    cout << "\t最小值：" << (numeric_limits<unsigned>::min)() << endl;  
    cout << "long: \t\t" << "所占字节数：" << sizeof(long);  
    cout << "\t最大值：" << (numeric_limits<long>::max)();  
    cout << "\t最小值：" << (numeric_limits<long>::min)() << endl;  
    cout << "unsigned long: \t" << "所占字节数：" << sizeof(unsigned long);  
    cout << "\t最大值：" << (numeric_limits<unsigned long>::max)();  
    cout << "\t最小值：" << (numeric_limits<unsigned long>::min)() << endl;  
    cout << "double: \t" << "所占字节数：" << sizeof(double);  
    cout << "\t最大值：" << (numeric_limits<double>::max)();  
    cout << "\t最小值：" << (numeric_limits<double>::min)() << endl;  
    cout << "long double: \t" << "所占字节数：" << sizeof(long double);  
    cout << "\t最大值：" << (numeric_limits<long double>::max)();  
    cout << "\t最小值：" << (numeric_limits<long double>::min)() << endl;  
    cout << "float: \t\t" << "所占字节数：" << sizeof(float);  
    cout << "\t最大值：" << (numeric_limits<float>::max)();  
    cout << "\t最小值：" << (numeric_limits<float>::min)() << endl;  
    cout << "size_t: \t" << "所占字节数：" << sizeof(size_t);  
    cout << "\t最大值：" << (numeric_limits<size_t>::max)();  
    cout << "\t最小值：" << (numeric_limits<size_t>::min)() << endl;  
    cout << "string: \t" << "所占字节数：" << sizeof(string) << endl;  
    // << "\t最大值：" << (numeric_limits<string>::max)() << "\t最小值：" << (numeric_limits<string>::min)() << endl;  
    cout << "type: \t\t" << "************size**************"<< endl;  
    return 0;  
} 
```

macOS输出结果：
```
type: 		************size**************
bool: 		所占字节数：1	最大值：1		最小值：0
char: 		所占字节数：1	最大值：	     	        最小值：\200
signed char: 	所占字节数：1	最大值：		        最小值：\200
unsigned char: 	所占字节数：1	最大值：\377		最小值：
wchar_t: 	所占字节数：4	最大值：2147483647		最小值：-2147483648
short: 		所占字节数：2	最大值：32767		最小值：-32768
int: 		所占字节数：4	最大值：2147483647	最小值：-2147483648
unsigned: 	所占字节数：4	最大值：4294967295	最小值：0
long: 		所占字节数：8	最大值：9223372036854775807	最小值：-9223372036854775808
unsigned long: 	所占字节数：8	最大值：18446744073709551615	最小值：0
double: 	所占字节数：8	最大值：1.79769e+308	最小值：2.22507e-308
long double: 	所占字节数：16	最大值：1.18973e+4932	最小值：3.3621e-4932
float: 		所占字节数：4	最大值：3.40282e+38	最小值：1.17549e-38
size_t: 	所占字节数：8	最大值：18446744073709551615	最小值：0
string: 	所占字节数：24
type: 		************size**************
sh: pause: command not found
Program ended with exit code: 0
```
## 数据类型转换

### 自动转换
自动转换发生在不同数据类型的量混合运算时，由编译系统自动完成。自动转换遵循以下规则：

1. 若参与运算量的类型不同，则先转换成同一类型，然后进行运算。
2. 转换按数据长度增加的方向进行，以保证精度不降低。如int型和long型运算时，先把int量转成long型后再进行运算。
3. 所有的浮点运算都是以双精度进行的，即使仅含float单精度量运算的表达式，也要先转换成double型，再作运算。
4. char型和short型参与运算时，必须先转换成int型。
5. 在赋值运算中，赋值号两边量的数据类型不同时，赋值号右边量的类型将转换为左边量的类型。如果右边量的数据类型长度比左边长时，将丢失一部分数据，这样会降低精度，丢失的部分按四舍五入向前舍入。

下图表示了类型自动转换的规则:


```
graph TD
A[char  shot]-->B
B[int]-->C
C[unsigned]-->D
D[long]-->Double
```

```
#include<stdio.h>
int main(){
    float PI=3.14159;
    int s,r=5;
    s=r*r*PI;
    printf("s=%d\n",s);
    return 0;
}
```

本例程序中，PI为实型；s，r为整型。在执行s=r*r*PI语句时，r和PI都转换成double型计算，结果也为double型。但由于s为整型，故赋值结果仍为整型，舍去了小数部分。

### 实型变量
在程序运行过程中可以改变其值的实型量被称为实型变量，实型变量分为：
- 单精度(float)
- 双精度(double)
- 长双精度(long double)

## 强制类型转换
强制类型转换是通过类型转换运算来实现的。其一般形式为：

```
(类型说明符)  (表达式)
```

其功能是把表达式的运算结果强制转换成类型说明符所表示的类型。

例如：


```
(float) a; /* 把a转换为实型 */
(int)(x+y); /* 把x+y的结果转换为整型 */
```


在使用强制转换时应注意以下问题：

- 类型说明符和表达式都必须加括号（单个变量可以不加括号），如把(int)(x+y)写成(int)x+y则成了把x转换成int型之后再与y相加了。
- 无论是强制转换或是自动转换，都只是为了本次运算的需要而对变量的数据长度进行的临时性转换，而不改变数据说明时对该变量定义的类型。


```
#include<stdio.h>
int main(void){
    float f=5.75;
    printf("(int)f=%d,f=%f\n",(int)f,f);
    return 0;
}
```
本例表明，f虽强制转为int型，但只在运算中起作用，是临时的，而f本身的类型并不改变。因此，(int)f的值为 5（删去了小数）而f的值仍为5.75。