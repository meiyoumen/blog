/*
 Math.random()   返回0到1之间的伪随机数.
 Math.round(x)   返回四舍五入后的整数.
 Math.ceil()     返回x向上取整后的值.
 Math.floor()    返回x向下取整后的值.

 Math.random()生成指定范围数值的随机数   http://www.111cn.net/wy/js-ajax/57062.htm
 Math.random()   0.0 ~ 1.0 之间的一个伪随机数。eg:   0.15246391076246546
 Math.random()*5  //3.3078285218129686 返回一个小于5的数


 parseInt(string, radix);
 string
 要被解析的值。如果参数不是一个字符串，则将其转换为字符串。字符串开头的空白符将会被忽略。
 radix
 一个2到36之间的整数值，用于指定转换中采用的基数。比如参数"10"表示使用我们通常使用的十进制数值系统。
 总是指定该参数可以消除阅读该代码时的困惑并且保证转换结果可预测。当忽略该参数时，不同的实现环境可能产生不同的结果。

 parseInt(Math.random()*5,10)+1;  //1-5 之间的数 10表示10进制
 parseInt(Math.random()*5,10);  //0-5
 */

//JS获取n至m随机整数
export function random(min, max) {
  if (max == null) {
    max = min
    min = 0
  }
  //Math.random()*(max-min+1) 返回一个小于max-min+1的数
  return Math.floor(min + Math.random() * (max - min + 1))
}



