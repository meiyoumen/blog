### char
char , unsigned char , signed char 是三种不同的基本类型。  
只有char是专用于放字符的，后面的一般只当1字节的整数用。  

char可以有负数，但ASCI码中没有对应字符；  
而无符号char，即unsigned char，对应是的ASCI码表中0-126，如果你赋值-100，你看看会有什么结果，它是无符号的，会转成无符号数的

```
#include<stdio.h>
#include<stdlib.h>
int main() {
	unsigned char a; // 用有符号来打印，则容易溢出
	for (a = 0; a <128; a++)
	{
		printf("%d-->%c\t\t", a, a);
		if (a % 8 == 0)
			printf("\n");
	}

	system("pause");
	return 0;
}

```
