## javascript输出进制数据

```
//如十进制 11 
console.log(0b1011)   //二制进0b1011    打印出11
console.log(013)      //二制进013       打印出11
console.log(0xb)      //十六制进0xb    打印出11
```


## 语法说明
### parseInt()
#### 定义和用法
>parseInt() 函数可解析一个字符串，并返回一个整数。

#### 语法parseInt(string,radix)  
- string要被解析的字符串  
- radix可选。表示要解析的数字的基数。该值介于2-36之间。   
如果省略该参数或其值为 0，则数字将以 10 为基础来解析。   
如果它以 “0x” 或 “0X” 开头，将以 16 为基数。  
如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN。

### toString()
>toString()方法属于Object对象，JavaScript的许多内置对象都重写了该函数，以实现更适合自身的功能需要。


类型  | 行为描述
---|---
Array   | 将 Array 的每个元素转换为字符串，并将它们依次连接起来，两个元素之间用英文逗号作为分隔符进行拼接
Boolean | 如果布尔值是true，则返回"true"。否则返回"false"。
Date    | 返回日期的文本表示。
Error   | 返回一个包含相关错误信息的字符串。
Function | 返回如下格式的字符串，其中 functionname 是一个函数的名称，此函数的 toString 方法被调用： "function functionname() { [native code] }"
Number | 返回数值的字符串表示。还可返回以指定进制表示的字符串，请参考Number.toString()。
String | 返回 String 对象的值。
Object(默认) | 返回"[object ObjectName]"，其中 ObjectName 是对象类型的名称。


## 进制转换

### 十进制转其他进制  
110 转换成十进制 二进制 八进制 三十二进制 十六进制  
采用Number.toString()
```js
var x=110;  
console.log(x);                 // 10
console.log(x.toString(2));     // 1101110  64+32+8+4+2
console.log(x.toString(8));     // 156
console.log(x.toString(32));    // 3e
console.log(x.toString(16));    // 6e  6*16^1 + 14*16^0
```

### 其他转十进制 

```js
var x='110';  
console.log(parseInt(x,2));  //6=4+2                        =>以2进制解析110  
console.log(parseInt(x,8));  //72=1*8^2+1*8^1+0*8^0         =>以8进制解析110
console.log(parseInt(x,16)); //272=1*16^2+1*16^1+0*16^0     =>以16进制解析110
```


### 其他转其他
方法：先用==parseInt转成十进制==再用==toString转到目标进制==

```js
console.log(String.fromCharCode(parseInt(141,8)))  
console.log(parseInt('ff',16).toString(2));
```
