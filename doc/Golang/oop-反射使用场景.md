# reflect包的几个使用场景：

1. 遍历结构体字段名（避免代码的硬编码）
2. 调用结构体方法（自动映射）
3. 获取结构体的tag标记的值（json/xml转换）
4. // @todo更多的使用场景


```js
package main
import (
	"errors"
	"fmt"
	"reflect"
)


type Db struct {
	Port int
	Host string
	pw   string
}

type Conf struct {
	Op       *string `json:"jsonop" xml:"xmlOpName"`
	Charlist *string
	Length   *int
	Num      *int
	Output   *string
	Input    *string
	hidden   *string
	Db
}

func (this Conf) SayOp(subname string) string {
	return *this.Op + subname
}

func (this Conf) getDbConf() Db {
	return this.Db
}

// 场景1：遍历结构体字段名
func printStructField(t *reflect.Type) {
	fieldNum := (*t).NumField()
	for i := 0; i < fieldNum; i++ {
		fmt.Printf("conf's field: %s\n", (*t).Field(i).Name)
	}
	fmt.Println("")
}

// 场景2：调用结构体方法
func callMethod(v *reflect.Value, method string, params []interface{}) {
	// 字符串方法调用，且能找到实例conf的属性.Op
	f := (*v).MethodByName(method)
	if f.IsValid() {
		args := make([]reflect.Value, len(params))
		for k, param := range params {
			args[k] = reflect.ValueOf(param)
		}
		// 调用
		ret := f.Call(args)
		if ret[0].Kind() == reflect.String {
			fmt.Printf("%s Called result: %s\n", method, ret[0].String())
		}
	} else {
		fmt.Println("can't call " + method)
	}
	fmt.Println("")
}

// 场景3：获取结构体的tag标记
func getTag(t *reflect.Type, field string, tagName string) {
	var (
		tagVal string
		err    error
	)
	fieldVal, ok := (*t).FieldByName(field)
	if ok {
		tagVal = fieldVal.Tag.Get(tagName)
	} else {
		err = errors.New("no field named:" + field)
	}

	fmt.Printf("get struct[%s] tag[%s]: %s, error:%v\n", field, tagName, tagVal, err)
	fmt.Println("")
}

func main() {

	// 创建Conf实例
	conf := Conf{}

	opName := "create"
	conf.Op = &opName
	conf.Port = 3308

	fmt.Printf("conf.Port=%d\n\n", conf.Port)

	// 结构信息
	t := reflect.TypeOf(conf)
	// 值信息
	v := reflect.ValueOf(conf)

	printStructField(&t)

	callMethod(&v, "SayOp", []interface{}{" Db"})

	// panic: reflect: Call of unexported method
	//callMethod(&v, "getDbConf", []interface{}{})

	getTag(&t, "Op", "json")
	getTag(&t, "Op", "xml")
	getTag(&t, "nofield", "json")
}
```
