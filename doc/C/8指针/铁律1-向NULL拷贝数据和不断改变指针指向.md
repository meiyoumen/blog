## 向NULL拷贝数据问题
C语言中NULL是0，0的地址是 0x00000000 受操作系统保护  
所以直接向NULL拷贝是有问题的。要有合法的地址才行
```
#define _CRT_SECURE_NO_WARNINGS
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

void main1()
{
	char *p1 = NULL; // p1默认地址是0x00000000 受操作系统保护
	/*
	0x0FBD0A19 (ucrtbased.dll)处(位于 指针铁律1.exe 中)引发的异常: 0xC0000005: 写入位置 0x00000000 时发生访问冲突。
	如有适用于此异常的处理程序，该程序便可安全地继续运行。
	*/
	strcpy(p1, "abcdef123"); 
	printf("p1:%s\n", p1);
	system("pause");
	return 0;
}

void main2()
{
	char *p1 = NULL; // p1默认地址是0x00000000 受操作系统保护
/*
0x0F9A0A19 (ucrtbased.dll)处(位于 指针铁律1.exe 中)引发的异常: 0xC0000005: 写入位置 0x00000077 时发生访问冲突。
如有适用于此异常的处理程序，该程序便可安全地继续运行。
*/
	p1 = 0x00077;
	strcpy(p1, "abcdef123"); 
	printf("p1:%s\n", p1);
	system("pause");
	return 0;
}

// 正确的方式
void main()
{
	char *p1 = NULL; // p1默认地址是0x00000000 受操作系统保护							
	p1 = (char *)malloc(100);
	strcpy(p1, "abcdef123"); 
	printf("p1:%s\n", p1); // p1:abcdef123
	system("pause");
	return 0;
}
```
## 不断改变指针指向

==C语言的精华==

```
void main()
{
	int i;
	char buf[128];    // 在栈上分配内存
	char *p1 = NULL;  // 在栈上
	char *p2 = NULL;  // 在栈上

	p1 = &buf[0];     // 不断改变指针指向
	p1 = &buf[1];
	p1 = &buf[2];

	for (i = 0; i < 10; i++) {
		p1 = buf[i];
	}

	p2 = (char *)malloc(100);
	strcpy(p2, "abcde123654");

	for (i = 0; i < 10; i++) {
		p1 = p2+i;
		printf("%c ", *p1); // a b c d e 1 2 3 6 5
	}

	system("pause");
	return 0;
}
```
![image](https://note.youdao.com/yws/public/resource/40eb0f2a2bbd5ae78eb3afb88ee1c19d/xmlnote/57F0AA4B21B3443D95215DA47AC7F009/7684)