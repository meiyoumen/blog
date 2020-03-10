
Interface类型可以定义一组方法，但是这些不需要实现。并且interface不能包含任何变量。
interface类型默认是一个指针。
 
```js
package gointerface

import "fmt"

// 定义汽车接口
type Car interface {
	NameGet() string
	Run(n int)
	Stop()
}

// 宝马
type BMW struct {
	Name string
}

// 宝马类型的中方法
func (this *BMW) NameGet() string  {
	return this.Name
}

func (this *BMW) Run(n int)  {
	fmt.Printf("BMW is running of num is %d \n", n)
}

func (this *BMW) Stop()  {
	fmt.Println("BMW is stop \n")
}

func (this *BMW) ChatUp() {
	fmt.Printf("ChatUp \n")
}

// 奔驰
type Benz struct {
	Name string
}

func (this *Benz) NameGet() string {
	return this.Name
}
func (this *Benz) Run(n int) {
	fmt.Printf("Benz is running of num is %d \n", n)
}
func (this *Benz) Stop() {
	fmt.Printf("Benz is stop \n")
}
func (this *Benz) ChatUp() {
	fmt.Printf("ChatUp \n")
}


func init()  {
	var car Car
	fmt.Println(car) 		//<nil>

	// 多态 一种事物的多种形态，都可以按照统一的接口进行操作
	
	var bmw BMW = BMW{Name:"宝马"}
	
	car = &bmw
	fmt.Println(car.NameGet())	// 宝马
	car.Run(1)				    // BMW is running of num is 1
	car.Stop()					// BMW is stop

	benz := &Benz{Name:"大奔"}
	car = benz
	fmt.Println(car.NameGet())	// 大奔
	car.Run(2)				    // Benz is running of num is 2
	car.Stop()					// Benz is stop

	//car.ChatUp() //ERROR: car.ChatUp undefined (type Car has no field or method ChatUp)
	benz.ChatUp() // ChatUp
}
```
