## const基础知识（用法、含义、好处、扩展）
```
int main(){
const int a;  //
int const b;

const char *c;
char * const d; char buf[100]
const char *const e ;

return 0;
}
```

### 含义：
- 第一个第二个意思一样代表一个常整形数 通过指针可以修改
- 第三个 c是一个指向常整形数的指针(所指向的内存数据不能被修改，但是本身可以修改)
- 第四个 d 常指针（指针变量不能被修改，但是它所指向内存空间可以被修改）
- 第五个 e一个指向常整形的常指针（指针和它所指向的内存空间，均不能被修改）


### 记忆方法
- const 离变量名近就是用来 修饰 指针变量
- 离 变量名 远 就是用来 修饰 指针指向的数据
- 如果 近的和远的 都有，那么就 同时 修饰 指针变量 以及它 指向的数据



```
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

// 所指向的内存数据不能被修改，但是本身可以修改
void getmem201(const char *p)
{
	p = 1;
	p = 3;
	// p[1] = 'a'; // 错误内存数据不可以修改,但本身可以修改 表达式是必须可修改的左值
	return;
}

// 常指针（指针变量不能被修改，但是它所指向内存空间可以被修改）
void getmem202(char *const p)
{
	// p = 250; // 错误本身是不可以修改的 表达式是必须可修改的左值
	p[1] = 'a';
	return;
}

// 指针和它所指向的内存空间，均不能被修改
void getmen203(const char *const p)
{
	//p = 1;
	//p = 3;
	//p[1] = a;
	printf("%c", p[1]);
	return;
}

//结论C语言中的const修饰的变量 是假的 C语言中的const 是一个冒牌货
void constint()
{
	const int a = 10;
	//a = 11; error
	{
		int *p = &a;
		*p = 100;
		printf("a:%d\n", a);//a:100								
	}
}

int main()
{
	char *p1 = NULL;
	const char *p2 = NULL;
	constint();
	system("pause");
	return 0;
}
```



## Const好处 合理的利用const
1. 指针做函数参数，可以有效的提高代码可读性，减少bug；
1. 清楚的分清参数的输入和输出特性

## 结论
- 指针变量和它所指向的内存空间变量，是两个不同的概念。。。。。。
- 看const 是放在*的左边还是右边看const是修饰指针变量，还是修饰所指向的内存空变量
