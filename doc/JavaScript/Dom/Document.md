## [原生DOM系列-Document对象](https://defed.github.io/%E5%8E%9F%E7%94%9FDOM%E7%B3%BB%E5%88%97-Element%E5%AF%B9%E8%B1%A1/)


> 本系列文章中所指的DOM，都是纯纯的HTML DOM，不包括XML DOM等
> 代表整个HTML文档
> Window对象的属性，可以通过docuemnt或window.document访问
> document对象可以方便我们通过js操作html

### document.all

- 获取文档中的所有HTML元素的引用
- 是一个类数组对象
- 已被document.getElementById()等API所取代，目前不常用项目中


```
document.all[i]
document.all[name]
document.all.tags[tagname]
```

### document.anchors

- 获取文档中所有锚点的引用
- 类数组对象
- 包含name属性的a元素会被返回


```
// html
<body>
    <a name="anchor1">anchor1</a>
    <a name="anchor2">anchor2</a>
    <a name="anchor3" href="xxx">anchor3</a>
    <a id="anchor4">anchor4</a>
</body>

// js
document.anchors                // [anchor1 DOM对象, anchor2 DOM对象, anchor3 DOM对象]
document.anchors['anchor1']     // anchor1 DOM对象
document.anchors[0]             // anchor1 DOM对象

```
### document.forms
- 返回文档中所有的form的DOM对象的引用
- 返回类数组对象
- 包含id或name属性的form元素会被返回


```
// html
<body>
    <form id="form1"></form>
    <form name="form2"></form>
    <form id="form2"></form>
</body>
// js
document.forms          // [form1 DOM对象, form2(name) DOM对象, form2(id) DOM对象]
document.forms['form2'] // 返回id为form2元素，id和name的值同名时，id的优先级更高
document.forms[1]       // name为form2 DOM对象
```

### document.links

- 返回文档中所有的a的DOM对象
- 返回类数组对象
- 既包含name属性，又包含href属性的a元素，既会被收集到links中，又会被收集到anchors中



```
// html
<body>
    <a name="anchor1"></a>
    <a name="anchor2" href="xxx"></a>
    <a id="link1" href="http://www.xxx.com"></a>
    <a name="link1" href="http://www.xxx.com"></a>
</body>

// js
document.links.length       // 3
document.links['link1']     // id为link1的a元素
```


### document.images

- 返回文档中的所有image元素的集合
- 类数组对象


```
// html
<body>
    <img src="">
    <img src="xxx">
    <img>
</body>
// js
document.images.length // 3
```

### document.scripts

- 返回当前文档中所有script元素的集合
- 只读属性


```
// html
<body>
    <script type="text/javascript"></script>
    <script src=""></script>
</body>
// body
document.scripts.length // 2
```

### document.body

- 返回当前文档的body元素
- 可读写


```
document.body // 返回当前文档的body元素
document.body = document.createElement('body')
document.body // 返回新创建的body元素
```

### document.cookie

- 返回与当前文档相关的所有cookie组成的字符串。如: a=1; b=2
- 可进行增删改查操作
- 和普通对象属性的读写操作不同


```
// 假设目前页面中存在如下cookie: `a=1; b=2`
// 增加cookie
document.cookie // 'a=1; b=2'
document.cookie = 'c=3' // 'c=3'
document.cookie // 'a=1; b=2; c=3'
// 修改cookie
let d = new Date()
d.setTime(Date.now() + 1 * 24 * 60 * 60 * 1000)
d.toUTCString()
document.cookie = 'c=4; expires=' + d // 设置10天之后过期
document.cookie // 'a=1; b=2; c=4'
// 读取cookie
let cookieName = 'c'
let cookieReg = new RegExp('(^| )' + cookieName + '=([^;]*)(;|$)')
document.cookie.match(cookieReg)[2] // 3
// 删除cookie
let n = new Date()
n.setTime(Date.now() - 1 * 24 * 60 * 60 * 1000)
n.toUTCString()
document.cookie = 'c=0; expires=' + n
document.cookie // 'a=1; b=2'

```

document.domain

```
返回文档的域名
可读可写，但写入是有限制的
一级域名相同的请求，但二级、或三级域名不同，可以通过设置domain来达到跨域的效果
```


```
// 假设当前页面的域名为http://a.b.c.com
docuemnt.domain // 'a.b.c.com'
document.domain = 'b.c.com'
document.domain // 'b.c.com'
document.domain = 'c.com'
document.domain // 'c.com'
document.domain = 'com' // 报错
document.domain = 'd.b.c.com' // 报错
document.domain = 'a.b.d.com' //报错
// a.b.com下面的a.html引入c.b.com下面的b.html
// html
<body>
    <iframe name="demo" src="http://c.b.com/b.html"></iframe>
</body>
// js
frames['demo'].document // 报跨域错误
// 在a.b.com下a.html和c.b.com下的b.html页面同时设置domain可以解除跨域限制
document.domain = 'b.com'
```


### document.lastModified

- 返回文档最后被修改的日期和时间
- 字符串

### document.referrer

- 返回加载当前文档的文档的URL
- 如果不是通过其他文档加载的当前文档，比如从地址栏中直接输入，则referrer为空字符串


```
// 假设从http://a.b.com/a.html页面打开了http://c.d.com/b.html页面
// 在http://c.d.com/b.html中获取referrer
document.referrer // http://a.b.com/a.html
```


### document.title

- 返回当前文档的标题
- 可读可写


```
// 假设当前页面的title为'我是一个document demo'
document.title // '我是一个document demo'
document.title = '123' // 标签上的title显示为123
document.title // '123'
```

### document.URL

- 返回当前文档的实际URL
- 和location.href的区别


document.URL     |      location.href
              ---|---
只读             |      可读写
重定向之后的url  |      未重定向之前的url


### document.getElementById(id)

- 返回对拥有指定ID的第一个对象的引用

### document.getElementsByName(name)

- 返回带有指定name属性的对象的集合

### document.getElementsByTagName(tagname)

- 返回指定标签名的对象集合
- 传入特殊字符串*将返回文档中所有元素的集合
-  tagname不区分大小写

### document.characterSet

- 返回用于渲染当前文档的字符编码类型
- 
### document.charset

- characterSet的别名，同characterSet


### document.contentType

- 返回当前文档的Content-Type(MIME)类型
- 该属性的返回值是浏览器检测到的,不一定是直接读取HTTP响应头中的或者HTML中meta标签指定的值

### document.doctype

- 返回当前文档关联的文档类型定义的对象
- 如果文档没有设置DTD(文档类型定义)，则该属性返回null
- 只读


```
// 假设文档设置<!DOCTYPE html>
document.doctype // <!DOCTYPE html>
document.doctype.name // html

```
### document.documentElement

- 只读属性
- 返回文档的根元素，如HTML文档的html元素


```
document.documentElement === document.children[0]
```

### document.documentURI

- 返回文档地址字符串
- 只读属性
- DOM4规范


document.URL | document.documentURI
          ---|---
只用于html文档 |用于所有类型的文档

### document.implementation

### document.styleSheets

- 只读属性
- 返回一个由StyleSheet对象组成的StyleSheetList
- 类数组对象


```
document.styleSheets.item(0) === document.styleSheets[0]

```

### document.styleSheetSets
- 返回目前可用的样式表集合
 
### document.children

- 返回document的所有直接子元素节点
- 不包含DTD、注释、纯文本等
- 只读属性


```
// html
<!Doctype html>
<!--comments-->
<html>
</html>
<!--comments-->
// js
document.children // [html DOM]

```
### document.firstElementChild && document.lastElementChild

- 只读属性
- 返回document的第一个&&最后一个子元素节点
- 所有的元素节点都有此属性


```
// html
<!Doctype html>
<!--comments-->
<html>
</html>
<!--comments-->
// js
document.firstElementChild // html DOM
document.lastElementChild // html DOM

```

### document.activeElement
- 返回页面中获得焦点的元素
- 只读属性
- 大部分情况下返回input||textarea元素


```
// 获取输入框中被选中的文字
let ele = document.activeElement
ele.value.substring(ele.selectionStart, selectionEnd) // 返回输入框中被选中的文本
```

### document.defaultView

- 返回当前document对象所关联的window对象

```
document.defaultView === window

```
### document.designMode

- 控制整个文档是否可编辑
- 默认为’off’

```
// html
<body>
    i am editable
</body>
document.designMode = 'on' // 整个文档可编辑
```

### document.dir

- 返回文档中html元素上dir属性指定的文字的朝向，如果没指定，则返回空字符串
- ‘ltr’ || ‘rtl’
- 可读写


```
// html
<html dir="ltr">
</html>
// js
document.dir // 'ltr'
document.dir = 'rtl' // 文字变成从右向左排版

```

### document.head
- 返回文档中的head元素
- 只读属性

### document.location

- 返回一个location对象
- 同window.location
- 

### document.readyState

- 状态列表


header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2


状态 |	描述
---|---
loading	    | 文档加载
interactive	| 文档结束渲染但在加载内嵌资源
complete	| 文档加载完成时


```
document.onreadystatechange = function(){
    // 模拟DOMContentLoaded
    if(document.readyState === 'interactive'){
        domContentLoadedCallback()
    // 模拟onload
    }else if(document.readState === 'complete'){
        onloadCallback()
    }
}
```


### document.onreadystatechange

- 事件
- 当document.readyState属性发生变化时触发
### document.createAttribute()

- 创建并返回一个新的属性节点


```
// html
<body
    <p id="demo">i am a demo</p>
</body>
// js
let p = document.getElementById('demo')
let attr = document.createAttribute('test')
attr.nodeValue = 'haha'
p.setAttributeNode(attr)
p.getAttribute('test') // 'haha'

```

### document.createComment()
- 创建并返回一个注释节点


```
let comment = document.createComment('我是一条注释')
document.body.appendChild(comment) // 会在文档body结束标签之前插入一条注释
```


### document.createDocumentFragment()

- 返回一个空文档片段对象的引用
- 不是DOM树的一部分
- 通常的使用场景是创建一个文档片段，然后将创建的DOM元素插入到文档片段中，最后把文档片段插入到DOM树中。在DOM树中，文档片段会被替换为它所有的子元素
- 因为文档片段存在与内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流(reflow)(对元素位置和几何上的计算)。因此，使用文档片段document fragments 通常会起到优化性能的作用(better performance)


```
let docfrag = document.createDocumentFragment()
let pEle = document.createElement('p')
pEle.textContent = 'I am from fragment'
docfrag.appendChild(pEle)
document.body.appendChild(docfrag) // body结束标签之前插入一个p标签，内容为'I am from fragment'

```

### document.createElement()
- 创建并返回一个指定的HTML元素
- 如果创建一个未指定的元素时，返回HTMLUnkownElement

### document.createRange()

- 返回一个Range对象

```
let range = document.createRange()
range.setStart(startNode, startOffset)
range.setEnd(endNode, endOffset)
```

### document.createTextNode()

- 创建并返回一个文本节点

```
let textNode = document.createTextNode('创建了一个文本节点')
document.body.appendChild(textNode) // body结束标签之前插入这行文字
```

### document.createEvent(type)

- type string，代表被创建的事件的类型。
- 可能的参数有：’UIEvents’/‘MouseEvents’/‘MutationEvents’/‘HTMLEvents’

```
//html
<body>
    <p id="demo">text</p>
</body>
// js
let demo = document.getElementById('demo')
demo.addEventListener('alert', function(){
    alert('自定义事件')
}, false)
let event = document.createEvent('HTMLEvents')
event.initEvent('alert', false, false)
demo.dispatchEvent(event) // 页面中alert弹出'自定义事件'
```

### document.elementFromPoint()

- 返回当前文档上处于指定坐标位置最顶层的元素。最顶层的元素一定是html啊，哥有点惶恐
- 坐标是相对于包含该文档的浏览器窗口的左上角为原点来计算的, 通常 x 和 y 坐标都应为正数


```
let ele = document.elementFromPoint()
ele.style.backgroundColor = 'red' // html被整个添加红色背景
```

### document.getElementsByClassName()

- 返回一个类数组对象
- 包含所有指定class名称的元素


```
// html
<body>
    <a class="demo">link</>
    <p class="demo">p</p>
    <div class="demo1">div</p>
</body>
// js
document.getElementsByClassName('demo') // [a DOM, p DOM]
```

### document.getElementsByTagName()

- 返回一个包括所有给定标签名称的元素的HTMLCollection
- 返回的HTMLCollection是实时的
- 可以指定特殊字符*获取所有元素
### document.importNode(externalNode, deep)

- externalNode 外部文档的节点
- deep 是否深度拷贝节点，默认我true
- 节点不会从外部文档中删除，返回的是一个拷贝节点


```
let node = frames['frame'].document.getElementsByTagName('p')[0] // 获取名为frame的iframe中的第一个p元素
let copy = document.importNode(node) // 将元素导入当前window对象中
document.body.appendChild(copy) // 将带入的元素插入文档
```

### document.getElementById(id)

- id 大小写敏感的字符串，代表了所要查找的元素的唯一ID

### document.querySelector(selectors)

- selectors 一个或多个CSS选择器字符串，如果多个则以逗号分隔
- 返回当前文档中第一个匹配特定选择器的元素
- 如果没有匹配到，返回null
- 如果匹配到多个，则返回第一个元素
- CSS 伪类不会返回任何元素
- 如果要匹配的ID或选择器不符合CSS语法（比如不恰当地使用了冒号或者空格），你必须用反斜杠将这些字符转义


```
// html
<body>
<div id="foo\bar"></div>
<div class="foo:bar"></div>
</body>
// js
document.querySelector('#foo\bar') // 匹配不到元素
document.querySelector('#foo\\\\bar') // 匹配'#foo\bar'
document.querySelector('#foo:bar') // 匹配不到元素
document.querySelector('.foo\\:bar') // 匹配'.foo:bar'
```

### document.querySelectorAll(selectors)

- selectors 同querySelector
- 同querySelector不同的是：返回所有匹配到的元素

### document.getElementsByName(name)

- name 元素的name属性
- 返回一个所有匹配到的元素的集合

### document.getSelection()

- 同window.getSelection()
- 返回一个Selection对象，表示用户选择的文本



```
let selection = document.getSelection()
selection.toString() // 返回被选中的字符串
```

### document.hasFocus()

- 返回一个布尔值，表明当前文档或者当前文档的子节点是否获得了焦点
- 该方法可以用来判断当前文档中的活动元素是否获得了焦点
- 在浏览器中查看当前文档是，返回true；查看其它文档，或者浏览器在后台运行时返回false
