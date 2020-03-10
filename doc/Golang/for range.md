[TOC]
# for

```js
package main 

import "fmt"

func main() {

	//for 初始化条件 ;  判断条件 ;  条件变化 {
	//}
	//1+2+3 …… 100累加

	sum := 0

	//1) 初始化条件  i := 1
	//2) 判断条件是否为真， i <= 100， 如果为真，执行循环体，如果为假，跳出循环
	//3) 条件变化 i++
	//4) 重复2， 3， 4
	for i := 1; i <= 100; i++ {
		sum = sum + i
	}
	fmt.Println("sum = ", sum)
}
```



# range
Go语言的range关键字用于在for语句中遍历 `数组Array`, `Slice`, `Map` 和 `Channel` 中的元素

两个返回值：
- 第一个值是元素的索引
- 另一个值是元素的数据

```js
package main 

import "fmt"

func main() {

	str := "abc"

	//通过for打印每个字符
	for i := 0; i < len(str); i++ {
		fmt.Printf("str[%d]=%c\t", i, str[i])   // str[0]=a	str[1]=b	str[2]=c	
	}

	fmt.Println()

	//迭代打印每个元素，默认返回2个值: 一个是元素的位置，一个是元素本身
	for i, data := range str {
		fmt.Printf("str[%d]=%c\t", i, data)  // str[0]=a	str[1]=b	str[2]=c
	}

	fmt.Println()

	for i := range str { //第2个返回值，默认丢弃，返回元素的位置(下标)
		fmt.Printf("str[%d]=%c\t", i, str[i]) // str[0]=a	str[1]=b	str[2]=c
	}

	fmt.Println()
	
	for i, _ := range str { //第2个返回值，默认丢弃，返回元素的位置(下标)
		fmt.Printf("str[%d]=%c\t", i, str[i]) // str[0]=a	str[1]=b	str[2]=c
	}
}

```

## 遍历Array

```js
package main

import "fmt"

func main() {
	// 定义一个array
	arr := [4]string {"a", "b", "c", "d"}
	
	// 遍历array
	for i, v := range arr {
		fmt.Println(i, v)
	}

}
0 a
1 b
2 c
3 d
```

## 遍历Slice

```js
package main

import "fmt"

func main() {
	// 定义一个slice
	arr := []string {"a", "b", "c", "d"}
	// 遍历array
	for i, v := range arr {
		fmt.Println(i, v)
	}

}
执行结果:

0 a
1 b
2 c
3 d
```



## 遍历Map

```js
package main

import "fmt"

func main() {
	// 定义一个map
	m := map[string]string{"k1": "polarsnow", "k2": "larry", "k3": "lyu"}
	
	// 遍历array
	for k, v := range m {
		fmt.Println(k, v)
	}

}


k1 polarsnow
k2 larry
k3 lyu
```


