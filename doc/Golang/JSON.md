[TOC]
# 编码JSON
## 通过结构体生成json

使用`json.Marshal()`函数可以对一组数据进行JSON格式的编码。 

`json.Marshal()`函数的声明如下：

```js
func Marshal(v interface{}) ([]byte, error)
```

还有一个格式化输出：

```js
// MarshalIndent 很像 Marshal，只是用缩进对输出进行格式化
func MarshalIndent(v interface{}, prefix, indent string) ([]byte, error)
```



```js
package main

import (
	"encoding/json"
	"fmt"
)

//成员变量名首字母必须大写
//type IT struct {
//	Company  string
//	Subjects []string
//	IsOk     bool
//	Price    float64
//}

type IT struct {
	Company  string   `json:"-"`        // 此字段不会输出到屏幕
	Subjects []string `json:"subjects"` // 二次编码
	IsOk     bool     `json:"isOk"`
	Price    float64  `json:"price"`
}

func main() {
	//定义一个结构体变量，同时初始化
	s := IT{"itcast", []string{"Go", "C++", "Python", "Test"}, true, 666.666}

	//编码，根据内容生成json文本
	//{"Company":"itcast","Subjects":["Go","C++","Python","Test"],"IsOk":true,"Price":666.666}
	//buf, err := json.Marshal(s)
	buf, err := json.MarshalIndent(s, "", "	") //格式化编码
	if err != nil {
		fmt.Println("err = ", err)
		return
	}

	fmt.Println("buf = ", string(buf))
}

/*
buf =  {
	"subjects": [
		"Go",
		"C++",
		"Python",
		"Test"
	],
	"isOk": true,
	"price": 666.666
}
*/
```

### struct tag
```
{
    "company": "itcast",
    "subjects": [
        "Go",
        "C++",
        "Python",
        "Test"
    ],
    "isok": true,
    "price": 666.666
}
```
我们看到上面的输出字段名的首字母都是大写的，如果你想用小写的首字母怎么办呢？把结构体的字段名改成首字母小写的？

JSON输出的时候必须注意，==只有导出的字段(首字母是大写)才会被输出==，如果修改字段名，那么就会发现什么都不会输出，所以必须通过struct tag定义来实现。

针对JSON的输出，我们在定义struct tag的时候需要注意的几点是：
- 字段的tag是"`-`"，==那么这个字段不会输出到JSON==
- tag中带有自定义名称，那么这个自定义名称会出现在JSON的字段名中
- tag中如果带有"omitempty"选项，那么如果该字段值为空，就不会输出到JSON串中
- 如果字段类型是bool, string, int, int64等，而tag中带有",string"选项，那么这个字段在输出到JSON的时候会把该字段对应的值转换成JSON字符串


## 通过map生成json
```js
package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	//创建一个map
	m := make(map[string]interface{}, 4)
	
	m["company"] = "itcast"
	m["subjects"] = []string{"Go", "C++", "Python", "Test"}
	m["isok"] = true
	m["price"] = 666.666

	//编码成json
	//result, err := json.Marshal(m)
	result, err := json.MarshalIndent(m, "", "	")
	if err != nil {
		fmt.Println("err = ", err)
		return
	}
	fmt.Println("result = ", string(result))
}
```


# 解码JSON

可以使用json.Unmarshal()函数将JSON格式的文本解码为Go里面预期的数据结构。

json.Unmarshal()函数的原型如下：
```
func Unmarshal(data []byte, v interface{}) error
```
该函数
- 第一个参数是输入，即JSON格式的文本（比特序列）
- 第二个参数表示目标输出容器，用于存放解码后的值。

## JSON解析到结构体


```js
package main

import (
	"encoding/json"
	"fmt"
)

type IT struct {
	Company  string   `json:"company"`
	Subjects []string `json:"subjects"` //二次编码
	IsOk     bool     `json:"isok"`
	Price    float64  `json:"price"`
}

func main() {

	jsonBuf := `{
        "company": "itcast",
        "subjects": [
            "Go",
            "C++",
            "Python",
            "Test"
        ],
        "isok": true,
        "price": 666.666
    }`

	var tmp IT                                   //定义一个结构体变量
	err := json.Unmarshal([]byte(jsonBuf), &tmp) //第二个参数要地址传递
	if err != nil {
		fmt.Println("err = ", err)
		return
	}
	//fmt.Println("tmp = ", tmp)
	fmt.Printf("tmp = %+v\n", tmp)  // tmp = {Company:itcast Subjects:[Go C++ Python Test] IsOk:true Price:666.666}

	type IT2 struct {
		Subjects []string `json:"subjects"` //二次编码
	}

	var tmp2 IT2
	err = json.Unmarshal([]byte(jsonBuf), &tmp2) //第二个参数要地址传递
	if err != nil {
		fmt.Println("err = ", err)
		return
	}
	fmt.Printf("tmp2 = %+v\n", tmp2)  // tmp2 = {Subjects:[Go C++ Python Test]}

}
```

## 解析到interface

```js
package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	jsonBuf := `
	{
        "company": "itcast",
        "subjects": [
            "Go",
            "C++",
            "Python",
            "Test"
        ],
        "isok": true,
        "price": 666.666
    }`

	//创建一个map
	m := make(map[string]interface{}, 4)

	err := json.Unmarshal([]byte(jsonBuf), &m) //第二个参数要地址传递
	if err != nil {
		fmt.Println("err = ", err)
		return
	}
	fmt.Printf("m = %+v\n", m)

	//	var str string
	//	str = string(m["company"]) //err， 无法转换
	//	fmt.Println("str = ", str)

	var str string

	//类型断言, 值，它是value类型
	for key, value := range m {
		//fmt.Printf("%v ============> %v\n", key, value)
		switch data := value.(type) {
		case string:
			str = data
			fmt.Printf("map[%s]的值类型为string, value = %s\n", key, str)
		case bool:
			fmt.Printf("map[%s]的值类型为bool, value = %v\n", key, data)
		case float64:
			fmt.Printf("map[%s]的值类型为float64, value = %f\n", key, data)
		case []string:
			fmt.Printf("map[%s]的值类型为[]string, value = %v\n", key, data)
		case []interface{}:
			fmt.Printf("map[%s]的值类型为[]interface, value = %v\n", key, data)
		}
	}
}
```
