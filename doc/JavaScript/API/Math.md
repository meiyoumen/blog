可以使用Math方法对数字进行四舍五入或截断，例如：Math.round、Math.ceil、Math.floor和Math.trunc

Math.trunc会从小数点开始截取，而且不采用任何四舍五入方法。

Math.trunc(1.655)  
// 1
Math.trunc(0.000000006)  
// 0
对于不能使用ES6的浏览器，也可以采用下面的polyfill：

function ToInteger(v) {  
    if (v > 0) {
        return Math.floor(v);
    }
    return Math.ceil(v);
}

ToInteger(0.000000006) 
//0