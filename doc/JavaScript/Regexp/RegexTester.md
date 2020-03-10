## RegexTester
是一款正则表达式测试器，支持单行模式、多行模式，经典的窗口设计，该工具允许你测试和分析正则表达式。正则表达式通常用于两种任务：1.验证，2.搜索/替换。用于验证时，通常需要在前后分别加上^和$，以匹配整个待验证字符串；搜索/替换时是否加上此限定则根据搜索的要求而定
下载地址：http://www.cr173.com/soft/88309.html



```
(\?|&)name([^&]*)(&|$)

start-teacher.html?age=100&name=hello&arg=123
```


![image](https://note.youdao.com/yws/public/resource/73ff5428ea13380ab61fc60a73ef7caa/xmlnote/BB5B3BB0B92740FA8DE141D0E996CB73/18765)




```js
const getStrParam = (str, name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = str.match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return '';
}
(^|&)" + name + "=([^&]*)(&|$)

start-teacher.html?age=100&name=hello&arg=123

匹配name:
group{1}: &
group{1}: hello
group{1}: &

[^&]排除以&开头的任意字符

(^|&)" + name + "=([^@]*)(&|$)

匹配age，并且换成@，结果如下：
group{1}: &
group{1}: 100&name=hello&arg=123
group{1}: &
```
