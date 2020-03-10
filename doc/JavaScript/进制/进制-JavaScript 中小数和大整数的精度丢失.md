
## Math.pow(x,y) 
方法返回 x 的 y 次幂。  
Math.pow(4,3); //返回 4 的 3 次幂 (4*4*4):

### JavaScript 中的数字是用"IEEE 754 双精度64 位浮点数"来存储 
其格式为：==s * m * 2^e==

- s 是符号位，表示正负。 
- m 是尾数，有 52 bits。
- e 是指数，有 11 bits。

在 ECMAScript 规范 里有给出 e 的范围为 [-1074, 971]。

Number.MAX_VALUE = 1 x (2^53 - 1) x 2^971 = 1.7976931348623157e+308  
Number.MIN_VALUE = 1 x 1 x 2^(-1074) = 5e-324


```js
//使用如下js查看Number.MAX_VALU与Number.MIN_VALUE
console.log(Number.MAX_VALUE);  //1.7976931348623157e+308
console.log(Number.MIN_VALUE);  //5e-324
```

所以JS能存储的数值是非常大的。

但是使用如下测试语句：

```js
var x = Math.pow(2, 53) - 10;
while (x != x + 1) x++;
console.log(x);  //9007199254740992=2^53。
```


结果看似死循环的程序，跳出了，x的最终结果为9007199254740992=2^53。  
也就是说，  
当 x 小于等于 2^53 时，可以确保 x 的精度不会丢失，  
当 x 大于 2^53 时，x 的精度有可能会丢失。  

显然，这和 2^53 的存储是一样的。  
按照上面的思路可以推出，  
对于 2^53 + 2, 其二进制为 100000…0010（中间 51 个 0），也是可以精确存储的。  

最后结论：  
当 x 大于 2^53 且二进制有效位数大于 53 位时，就会存在精度丢失。  


使用如下测试代码：

```js
var num = 13111111111111111;
for (var i = 0; i < 100; i++) {
    console.warn(i);
    console.info(num + i);
}
```


```js
//x 为 2^53 + 1 时，其二进制表示为：
10000000000...001 （中间共有 52 个 0）
//用双精度浮点数存储时：
e = 1; m = 10000..00（共 52 个 0，其中 1 是 hidden bit）
```

原文：http://blog.sina.com.cn/s/blog_82f2fc280101j7dg.html

## 问题
```js
console.log(11.1+13.2)  //24.299999999999997
//二进制的浮点数不能正确的处理十进制的小数，导致了出现浮点数溢出了
//解决方法
console.log((11.1*100+13.2*100)/100)  //24.3
```
[彻底理解0.1 + 0.2 === 0.30000000000000004的背后](http://demon.tw/copy-paste/javascript-precision.html)

[0.1 + 0.2 === 0.30000000000000004](http://0.30000000000000004.com/)

JavaScript小数在做四则运算时，精度会丢失，这会在项目中引起诸多不便，先请看下面脚本：


```js
console.log(1/3);                       //弹出: 0.3333333333333333   
console.log(0.09999999 + 0.00000001);   //弹出: 0.09999999999999999    
console.log(-0.09999999 - 0.00000001);  //弹出: -0.09999999999999999   
console.log(0.012345 * 0.000001);       //弹出: 1.2344999999999999e-8   
console.log(0.000001 / 0.0001);         //弹出: 0.009999999999999998
```
按正常计算的话，除第一行外(因为其本身就不能除尽)，其他都应该要得到精确的结果，从弹出的结果我们却发现不是我们想要的正确结果。

为了解决浮点数运算不准确的问题，在运算前我们把参加运算的数先升级(10000的X的次方)到整数，等运算完后再降级(0.1的X的次方)。现收集并整理贴于此，以备后用。



```js
//加法   
Number.prototype.add = function(arg){   
    var r1,r2,m;   
    try{r1=this.toString().split(".")[1].length}catch(e){r1=0}   
    try{r2=arg.toString().split(".")[1].length}catch(e){r2=0}   
    m=Math.pow(10000,Math.max(r1,r2))   
    return (this*m+arg*m)/m   
}   
 
//减法   
Number.prototype.sub = function (arg){   
    return this.add(-arg);   
}   
 
//乘法   
Number.prototype.mul = function (arg)   
{   
    var m=0,s1=this.toString(),s2=arg.toString();   
    try{m+=s1.split(".")[1].length}catch(e){}   
    try{m+=s2.split(".")[1].length}catch(e){}   
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)   
}   
 
//除法   
Number.prototype.div = function (arg){   
    var t1=0,t2=0,r1,r2;   
    try{t1=this.toString().split(".")[1].length}catch(e){}   
    try{t2=arg.toString().split(".")[1].length}catch(e){}   
    with(Math){   
        r1=Number(this.toString().replace(".",""))   
        r2=Number(arg.toString().replace(".",""))   
        return (r1/r2)*pow(10,t2-t1);   
    }   
}
```
测试

```js
console.log(Number(0.09999999).add(0.00000001));//弹出: 0.1   
//注意，如果是负数，一定要先使用Number转型，否则结果不正确   
console.log(Number(-0.09999999).sub(0.00000001));//弹出: -0.1   
console.log(Number(0.012345).mul(0.000001));//弹出: 1.2345e-8   
console.log(Number(0.000001).div(0.0001));//弹出: 0.01
```
