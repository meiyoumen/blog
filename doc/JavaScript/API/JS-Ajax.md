[TOC]
# 目录
## 简单三步曲
```js
// 1. 创建对象
let xhr = new XMLHttpRequest();

// 2. 创建请求
xhr.open('POST', 'https://xue.hfjystudy.com/study/common/SystemController/getSystemDate')

// 3. 发送请求
xhr.send()
```
## XMLHttpRequest
XMLHttpRequest本身是一个构造函数，可以使用new命令生成实例。它没有任何参数。
下面是XMLHttpRequest对象简单用法的完整例子
```js
let xhr = new XMLHttpRequest();

// 最终request header中"X-Test"为: one, two
xhr.setRequestHeader('X-Test', 'one')
xhr.setRequestHeader('X-Test', 'two')

xhr.onreadystatechange = function(){
  // 通信成功时，状态值为4
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText)
    } else {
      console.error(xhr.statusText)
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText)
}

xhr.open('GET', 'https://xue.hfjystudy.com/study/common/SystemController/getSystemDate')
xhr.send(null)
```
## 实例属性
### readyState
XMLHttpRequest.readyState返回一个==整数==，表示实例对象的当前状态。==该属性只读==。它可能返回以下值。
- 0，表示 XMLHttpRequest 实例已经生成，但是实例的open()方法还没有被调用。
- 1，表示open()方法已经调用，但是实例的send()方法还没有调用，仍然可以使用实例的setRequestHeader()方法，设定 HTTP 请求的头信息。
- 2，表示实例的send()方法已经调用，并且服务器返回的头信息和状态码已经收到。
- 3，表示正在接收服务器传来的数据体（body 部分）。这时，如果实例的responseType属性等于text或者空字符串，responseText属性就会包含已经收到的部分信息。
- 4，表示服务器返回的数据已经完全接收，或者本次接收已经失败。

通信过程中，每当==实例对象发生状态变化==，它的==readyState属性的值==就会==改变==。
这个值每一次变化，都会触发==readyStateChange==事件。
```js
var xhr = new XMLHttpRequest();
if (xhr.readyState === 4) {
  // 请求结束，处理服务器返回的数据
} else {
  // 显示提示“加载中……”
}
```

上面代码中，xhr.readyState等于4时，表明脚本发出的 HTTP 请求已经成功。其他情况，都表示 HTTP 请求还在进行中。


### response
XMLHttpRequest.response属性表示服务器返回的数据体（即 HTTP 回应的 body 部分）。

它可能是任何数据类型，比如字符串、对象、二进制对象等等，具体的类型由XMLHttpRequest.responseType属性决定。该属性只读。

如果本次请求没有成功或者数据不完整，该属性等于null。但是，如果responseType属性等于text或空字符串，在请求没有结束之前（readyState等于3的阶段），response属性包含服务器已经返回的部分数据。

```js
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    handler(xhr.response);
  }
}
```

### responseType
XMLHttpRequest.responseType属性是一个字符串，表示服务器返回数据的类型。这个属性是可写的，可以在调用open()方法之后、调用send()方法之前，设置这个属性的值，告诉服务器返回指定类型的数据。如果responseType设为空字符串，就等同于默认值text。

XMLHttpRequest.responseType属性可以等于以下值。

- ”“（空字符串）：等同于text，表示服务器返回文本数据。
- “arraybuffer”：ArrayBuffer 对象，表示服务器返回二进制数组。
- “blob”：Blob 对象，表示服务器返回二进制对象。
- “document”：Document 对象，表示服务器返回一个文档对象。
- “json”：JSON 对象。
- “text”：字符串。

上面几种类型之中:
- text类型适合大多数情况，而且直接处理文本也比较方便。
- document类型适合返回 HTML / XML 文档的情况，这意味着，对于那些打开 CORS 的网站，可以直接用 Ajax 抓取网页，然后不用解析 HTML 字符串，直接对抓取回来的数据进行 DOM 操作。
- blob类型适合读取二进制数据，比如图片文件。

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status === 200) {
    var blob = new Blob([xhr.response], {type: 'image/png'});
    // 或者
    var blob = xhr.response;
  }
};
xhr.send();
```
如果将这个属性设为ArrayBuffer，就可以按照数组的方式处理二进制数据。


```js
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  var uInt8Array = new Uint8Array(this.response);
  for (var i = 0, len = binStr.length; i < len; ++i) {
    // var byte = uInt8Array[i];
  }
};

xhr.send();
```

如果将这个属性设为json，浏览器就会自动对返回数据调用JSON.parse()方法。也就是说，从xhr.response属性（注意，不是xhr.responseText属性）得到的不是文本，而是一个 JSON 对象。


### onreadystatechange
XMLHttpRequest.onreadystatechange属性指向一个监听函数。readystatechange事件发生时（实例的readyState属性变化），就会执行这个属性。

另外，如果使用实例的abort()方法，终止 XMLHttpRequest 请求，也会造成readyState属性变化，导致调用XMLHttpRequest.onreadystatechange属性。

下面是一个例子。


```js
var xhr = new XMLHttpRequest();
xhr.open( 'GET', 'http://example.com' , true );
xhr.onreadystatechange = function () {
  if (xhr.readyState !== 4 || xhr.status !== 200) {
    return;
  }
  console.log(xhr.responseText);
};
xhr.send();
```

### responseText
XMLHttpRequest.responseText属性返回从服务器接收到的字符串，该属性为只读。只有 HTTP 请求完成接收以后，该属性才会包含完整的数据。
```JS
var xhr = new XMLHttpRequest();
xhr.open('GET', '/server', true);

xhr.responseType = 'text';
xhr.onload = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};

xhr.send(null);
```

### responseXML
XMLHttpRequest.responseXML属性返回从服务器接收到的 HTML 或 XML 文档对象，该属性为只读。如果本次请求没有成功，或者收到的数据不能被解析为 XML 或 HTML，该属性等于null。

该属性生效的前提是 HTTP 回应的Content-Type头信息等于text/xml或application/xml。

这要求在发送请求前，XMLHttpRequest.responseType属性要设为document。

如果 HTTP 回应的Content-Type头信息不等于text/xml和application/xml，但是想从responseXML拿到数据（即把数据按照 DOM 格式解析），那么需要手动调用XMLHttpRequest.overrideMimeType()方法，强制进行 XML 解析。

该属性得到的数据，是直接解析后的文档 DOM 树。

```JS
var xhr = new XMLHttpRequest();
xhr.open('GET', '/server', true);

xhr.responseType = 'document';
xhr.overrideMimeType('text/xml');

xhr.onload = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseXML);
  }
};

xhr.send(null);
```

### responseURL
XMLHttpRequest.responseURL属性是字符串，表示发送数据的服务器的网址。
```JS
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/test', true);
xhr.onload = function () {
  // 返回 http://example.com/test
  console.log(xhr.responseURL);
};
xhr.send(null);
```

注意，这个属性的值与open()方法指定的请求网址不一定相同。  
如果服务器端发生跳转，这个属性返回最后实际返回数据的网址。  
另外，如果原始 URL 包括锚点（fragment），该属性会把锚点剥离。

### status
==XMLHttpRequest.status属性返回一个整数==，表示服务器回应的 HTTP 状态码。

一般来说，如果通信成功的话，这个状态码是200；   
如果服务器没有返回状态码，那么这个属性默认是200。   
请求发出之前，该属性为0。该属性只读。 

- 200, OK，访问正常
- 301, Moved Permanently，永久移动
- 302, Move temporarily，暂时移动
- 304, Not Modified，未修改
- 307, Temporary Redirect，暂时重定向
- 401, Unauthorized，未授权
- 403, Forbidden，禁止访问
- 404, Not Found，未发现指定网址
- 500, Internal Server Error，服务器发生错误
基本上，只有2xx和304的状态码，表示服务器返回是正常状态。

```JS
if (xhr.readyState === 4) {
  if ( (xhr.status >= 200 && xhr.status < 300)
    || (xhr.status === 304) ) {
    // 处理服务器的返回数据
  } else {
    // 出错
  }
}
```
### statusText
XMLHttpRequest.statusText属性返回一个字符串，表示服务器发送的状态提示。
不同于status属性，该属性包含整个状态信息，==比如“OK”和“Not Found”==。

在请求发送之前（即调用open()方法之前），该属性的值是空字符串；如果服务器没有返回状态提示，该属性的值默认为”“OK”。该属性为只读属性。

### timeout，XMLHttpRequestEventTarget.ontimeout
XMLHttpRequest.timeout属性返回一个整数，==表示多少毫秒后，如果请求仍然没有得到结果，就会自动终止==。如果该属性==等于0==，就表示==没有时间限制==。

XMLHttpRequestEventTarget.==ontimeout==属性用于设置一个监听函数，如果发生 ==timeout== 事件，就会执行这个监听函数。

下面是一个例子。


```js
var xhr = new XMLHttpRequest();
var url = '/server';

xhr.ontimeout = function () {
  console.error('The request for ' + url + ' timed out.');
};

xhr.onload = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      // 处理服务器返回的数据
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.open('GET', url, true);
// 指定 10 秒钟超时
xhr.timeout = 10 * 1000;
xhr.send(null);
```

## 事件监听属性

```js
interface XMLHttpRequestEventTarget : EventTarget {
  // event handlers
  attribute EventHandler onloadstart;
  attribute EventHandler onprogress;
  attribute EventHandler onabort;
  attribute EventHandler onerror;
  attribute EventHandler onload;
  attribute EventHandler ontimeout;
  attribute EventHandler onloadend;
};

interface XMLHttpRequestUpload : XMLHttpRequestEventTarget {

};

interface XMLHttpRequest : XMLHttpRequestEventTarget {
  // event handler
  attribute EventHandler onreadystatechange;
  readonly attribute XMLHttpRequestUpload upload;
};
```
从代码中我们可以看出：

XMLHttpRequestEventTarget接口定义了7个事件：
1. onloadstart
1. onprogress
1. onabort
1. ontimeout
1. onerror
1. onload
1. onloadend

每一个XMLHttpRequest里面都有一个==upload==属性，而==upload是一个XMLHttpRequestUpload对象==

==XMLHttpRequest==和==XMLHttpRequestUpload==都继承了同一个==XMLHttpRequestEventTarget==接口，所以xhr和xhr.upload都有第一条列举的7个事件

==onreadystatechange==是XMLHttpRequest独有的事件

所以这么一看就很清晰了：
xhr一共有8个相关事件：
- 7个XMLHttpRequestEventTarget事件
- 1个独有的onreadystatechange事件；
- 而xhr.upload只有7个XMLHttpRequestEventTarget事件。

### 事件列表
#### onloadstart：
loadstart 事件（HTTP 请求发出）的监听函数
#### onprogress：
progress事件（正在发送和加载数据）的监听函数
#### onabort：
abort 事件（请求中止，比如用户调用了abort()方法）的监听函数
#### onerror：
error 事件（请求失败）的监听函数
#### onload：
load 事件（请求成功完成）的监听函数
#### ontimeout：
timeout 事件（用户指定的时限超过了，请求还未完成）的监听函数
#### onloadend：
loadend 事件（请求完成，不管成功或失败）的监听函数
#### onreadystatechange

### 文件上传
xhr.upload只有7个XMLHttpRequestEventTarget事件。  
XMLHttpRequest 不仅可以发送请求，还可以发送文件，这就是 AJAX 文件上传。

发送文件以后，通过XMLHttpRequest.upload属性可以得到一个对象，通过观察这个对象，可以得知上传的进展。

主要方法就是监听这个对象的各种事件：`loadstart、loadend、load、abort、error、progress、timeout`。

假定网页上有一个`<progress>`元素。


```
<progress min="0" max="100" value="0">0% complete</progress>
```


文件上传时，对upload属性指定progress事件的监听函数，即可获得上传的进度。


```js
function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function (e) {};

  var progressBar = document.querySelector('progress');
  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      progressBar.value = (e.loaded / e.total) * 100;
      // 兼容不支持 <progress> 元素的老式浏览器
      progressBar.textContent = progressBar.value;
    }
  };

  xhr.send(blobOrFile);
}

upload(new Blob(['hello world'], {type: 'text/plain'}));
```


### 事件触发条件
下面是我自己整理的一张xhr相关事件触发条件表，其中最需要注意的是 onerror 事件的触发条件。

事件 | 	      触发条件
:---|---
onreadystatechange &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 	      每当xhr.readyState改变时触发；但xhr.readyState由非0值变为0时不触发。
onloadstart	          | 	      调用xhr.send()方法后立即触发，若xhr.send()未被调用则不会触发此事件。
onprogress	          | 	      xhr.upload.onprogress在上传阶段(即xhr.send()之后，xhr.readystate=2之前)触发，每50ms触发一次；xhr.onprogress在下载阶段（即xhr.readystate=3时）触发，每50ms触发一次。
onload	          | 	      当请求成功完成时触发，此时xhr.readystate=4
onloadend	          | 	      当请求结束（包括请求成功和请求失败）时触发
onabort	          | 	      当调用xhr.abort()后触发
ontimeout	          | 	      xhr.timeout不等于0，由请求开始即onloadstart开始算起，当到达xhr.timeout所设置时间请求还未结束即onloadend，则触发此事件。
onerror	          | 	      在请求过程中，若发生Network error则会触发此事件（若发生Network error时，上传还没有结束，则会先触发xhr.upload.onerror，再触发xhr.onerror；若发生Network error时，上传已经结束，则只会触发xhr.onerror）。注意，只有发生了网络层级别的异常才会触发此事件，对于应用层级别的异常，如响应返回的xhr.statusCode是4xx时，并不属于Network error，所以不会触发onerror事件，而是会触发onload事件。



### 事件触发顺序
当请求一切正常时，相关的事件触发顺序如下：

```js
1. 触发xhr.onreadystatechange(之后每次readyState变化时，都会触发一次)
2. 触发xhr.onloadstart

//上传阶段开始：
3. 触发xhr.upload.onloadstart
4. 触发xhr.upload.onprogress
5. 触发xhr.upload.onload
6. 触发xhr.upload.onloadend

//上传结束，下载阶段开始：
7. 触发xhr.onprogress
8. 触发xhr.onload
9. 触发xhr.onloadend
```
发生`abort/timeout/error`异常的处理

在请求的过程中，有可能发生 abort/timeout/error这3种异常。那么一旦发生这些异常，xhr后续会进行哪些处理呢？后续处理如下：

1. 一旦发生abort或timeout或error异常，先立即中止当前请求
1. 将 readystate 置为4，并触发 xhr.onreadystatechange事件
1. 如果上传阶段还没有结束，则依次触发以下事件：
    1. xhr.upload.onprogress
    1. xhr.upload.[onabort或ontimeout或onerror]
    1. xhr.upload.onloadend
1. 触发 xhr.onprogress事件
1. 触发 xhr.[onabort或ontimeout或onerror]事件
1. 触发xhr.onloadend 事件


**在哪个==xhr==事件中注册成功回调？**

从上面介绍的事件中，可以知道若xhr请求成功，就会触发==xhr.onreadystatechange==和==xhr.onload==两个事件。 

那么我们到底要将成功回调注册在哪个事件中呢？

我倾向于xhr.onload事件，因为xhr.onreadystatechange是每次xhr.readyState变化时都会触发，而不是xhr.readyState=4时才触发。


```js
xhr.onload = function () {
    //如果请求成功
    if(xhr.status == 200){
      //do successCallback
    }
  }
```

上面的示例代码是很常见的写法：先判断http状态码是否是200，如果是，则认为请求是成功的，接着执行成功回调。

这样的判断是有坑儿的，比如当返回的http状态码不是200，而是201时，请求虽然也是成功的，但并没有执行成功回调逻辑。

所以更靠谱的判断方法应该是：当http状态码为2xx或304时才认为成功。


```js
xhr.onload = function () {
    //如果请求成功
    if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
      //do successCallback
    }
  }
```
## 实例方法
### open()
XMLHttpRequest.open()方法用于指定 HTTP 请求的参数，或者说初始化 XMLHttpRequest 实例对象。它一共可以接受五个参数。
```
void open(
   string method,
   string url,
   optional boolean async,
   optional string user,
   optional string password
);
```

- method：表示 HTTP 动词方法，比如GET、POST、PUT、DELETE、HEAD等。
- url: 表示请求发送目标 URL。
- async: 布尔值，表示请求==是否为异步==，==默认为true==。如果设为false，则send()方法只有等到收到服务器返回了结果，才会进行下一步操作。该参数可选。由于同步 AJAX 请求会造成浏览器失去响应，许多浏览器已经禁止在主线程使用，只允许 Worker 里面使用。所以，这个参数轻易不应该设为false。
- user：表示用于认证的用户名，默认为空字符串。该参数可选。
- password：表示用于认证的密码，默认为空字符串。该参数可选。
注意，如果对使用过open()方法的 AJAX 请求，再次使用这个方法，等同于调用abort()，即终止请求。

下面发送 POST 请求的例子。
```js
var xhr = new XMLHttpRequest();
xhr.open('POST', encodeURI('someURL'));
```

### send()
XMLHttpRequest.send()方法用于实际发出 HTTP 请求。  
它==的参数是可选的==，如果==不带参数==，就表示 HTTP 请求只包含头信息，也就是只有一个 URL，典型例子就是 ==GET 请求==；  

如果带==有参数==，就表示除了头信息，还带有包含具体数据的信息体，典型例子就是 ==POST== 请求。

下面是 GET 请求的例子。

js
```js
var xhr = new XMLHttpRequest();
xhr.open('GET',
  'http://www.example.com/?id=' + encodeURIComponent(id),
  true
);
xhr.send(null);

// 等同于
var data = 'id=' + encodeURIComponent(id);
xhr.open('GET', 'http://www.example.com', true);
xhr.send(data);
```

上面代码中，GET请求的参数，可以作为查询字符串附加在 URL 后面，也可以作为send方法的参数。

下面是发送 POST 请求的例子。


```js
var xhr = new XMLHttpRequest();
var data = 'email='
  + encodeURIComponent(email)
  + '&password='
  + encodeURIComponent(password);

xhr.open('POST', 'http://www.example.com', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send(data);
```

注意，所有 XMLHttpRequest 的监听事件，都必须在send()方法调用之前设定。

send方法的参数就是发送的数据。多种格式的数据，都可以作为它的参数。


```js
void send();
void send(ArrayBufferView data);
void send(Blob data);
void send(Document data);
void send(String data);
void send(FormData data);
```

如果发送 DOM 对象，在发送之前，数据会先被串行化。发送二进制数据，最好使用ArrayBufferView或Blob对象，这使得通过 Ajax 上传文件成为可能。

下面是发送表单数据的例子。FormData对象可以用于构造表单数据。

```js
var formData = new FormData();

formData.append('username', '张三');
formData.append('email', 'zhangsan@example.com');
formData.append('birthDate', 1940);

var xhr = new XMLHttpRequest();
xhr.open("POST", "/register");
xhr.send(formData);
```

上面代码FormData对象构造了表单数据，然后使用send()方法发送。它的效果与发送下面的表单数据是一样的。


```js
<form id='registration' name='registration' action='/register'>
  <input type='text' name='username' value='张三'>
  <input type='email' name='email' value='zhangsan@example.com'>
  <input type='number' name='birthDate' value='1940'>
  <input type='submit' onclick='return sendForm(this.form);'>
</form>
```

下面的例子是使用FormData对象加工表单数据，然后再发送。

```js
function sendForm(form) {
  var formData = new FormData(form);
  formData.append('csrf', 'e69a18d7db1286040586e6da1950128c');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', form.action, true);
  xhr.onload = function() {
    // ...
  };
  xhr.send(formData);

  return false;
}

var form = document.querySelector('#registration');
sendForm(form);
```

### setRequestHeader()
XMLHttpRequest.setRequestHeader()方法用于设置浏览器发送的 HTTP 请求的头信息。该方法必须在open()之后、send()之前调用。如果该方法多次调用，设定同一个字段，则每一次调用的值会被合并成一个单一的值发送。

该方法接受两个参数。第一个参数是字符串，表示头信息的字段名，第二个参数是字段值。


```js
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Content-Length', JSON.stringify(data).length);
xhr.send(JSON.stringify(data));
```

上面代码首先设置头信息Content-Type，表示发送 JSON 格式的数据；然后设置Content-Length，表示数据长度；最后发送 JSON 数据。

### overrideMimeType()
XMLHttpRequest.overrideMimeType()方法用来指定 MIME 类型，覆盖服务器返回的真正的 MIME 类型，从而让浏览器进行不一样的处理。

举例来说，服务器返回的数据类型是text/xml，由于种种原因浏览器解析不成功报错，这时就拿不到数据了。

为了拿到原始数据，我们可以把 MIME 类型改成text/plain，这样浏览器就不会去自动解析，从而我们就可以拿到原始文本了。


```
xhr.overrideMimeType('text/plain')
```

注意，==该方法必须在send()方法之前调用==。

修改服务器返回的数据类型，不是正常情况下应该采取的方法。如果希望服务器返回指定的数据类型，可以用responseType属性告诉服务器，就像下面的例子。只有在服务器无法返回某种数据类型时，才使用overrideMimeType()方法。

```js
var xhr = new XMLHttpRequest();
xhr.onload = function(e) {
  var arraybuffer = xhr.response;
  // ...
}
xhr.open('GET', url);
xhr.responseType = 'arraybuffer';
xhr.send();
```

### getResponseHeader()
XMLHttpRequest.getResponseHeader()方法返回 HTTP 头信息指定字段的值，如果还没有收到服务器回应或者指定字段不存在，返回null。该方法的参数不区分大小写。

```js
function getHeaderTime() {
  console.log(this.getResponseHeader("Last-Modified"));
}

var xhr = new XMLHttpRequest();
xhr.open('HEAD', 'yourpage.html');
xhr.onload = getHeaderTime;
xhr.send();
```

如果有多个字段同名，它们的值会被连接为一个字符串，每个字段之间使用“逗号+空格”分隔。

### getAllResponseHeaders()
XMLHttpRequest.getAllResponseHeaders()方法返回一个字符串，表示服务器发来的所有 HTTP 头信息。

格式为字符串，每个头信息之间使用CRLF分隔（回车+换行），如果没有收到服务器回应，该属性为null。

如果发生网络错误，该属性为空字符串。


```js
var xhr = new XMLHttpRequest();
xhr.open('GET', 'foo.txt', true);
xhr.send();

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    var headers = xhr.getAllResponseHeaders();
  }
}
```

上面代码用于获取服务器返回的所有头信息。它可能是下面这样的字符串。


```
date: Fri, 08 Dec 2017 21:04:30 GMT\r\n
content-encoding: gzip\r\n
x-content-type-options: nosniff\r\n
server: meinheld/0.6.1\r\n
x-frame-options: DENY\r\n
content-type: text/html; charset=utf-8\r\n
connection: keep-alive\r\n
strict-transport-security: max-age=63072000\r\n
vary: Cookie, Accept-Encoding\r\n
content-length: 6502\r\n
x-xss-protection: 1; mode=block\r\n
```

然后，对这个字符串进行处理。

```js
var arr = headers.trim().split(/[\r\n]+/);
var headerMap = {};

arr.forEach(function (line) {
  var parts = line.split(': ');
  var header = parts.shift();
  var value = parts.join(': ');
  headerMap[header] = value;
});

headerMap['content-length'] // "6502"
```

### abort()
XMLHttpRequest.abort()方法用来终止已经发出的 HTTP 请求。调用这个方法以后，readyState属性变为4，status属性变为0。


```js
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.example.com/page.php', true);
setTimeout(function () {
  if (xhr) {
    xhr.abort();
    xhr = null;
  }
}, 5000);
```

上面代码在发出5秒之后，终止一个 AJAX 请求。

## HTTP response codes
附上MDN原文地址，我只列举一些常见的。
简单来说分为五类

- 1xx 消息响应
- 2xx 成功响应
- 3xx 重定向
- 4xx 客户端错误
- 5xx 服务器端错误

## 完整实例
```js
import {parseUrl, stringifyUrl} from './url'
import {parseQuery, stringifyQuery} from './query'
import {probe} from './probe'
import {camelCase} from './convert'

/**
 * ajax 方法
 * @param  {Object}   opts 请求对象
 * {
 *     method:"GET",
 *     dataType:"JSON",
 *     headers:{},
 *     url:"",
 *     data:{},
 * }
 * @param  {Function} next 回调
 * @return {XMLHttpRequest}        xhr对象
 */
export function ajax (opts, next) {
  let method = (opts.method || 'GET').toUpperCase()
  let dataType = (opts.dataType || 'JSON').toUpperCase()
  let timeout = opts.timeout
  /* global XMLHttpRequest */
  let req = new XMLHttpRequest()
  let data = null
  let isPost = method === 'POST'
  let isGet = method === 'GET'
  let isFormData = false
  let emit = function (err, data, headers) {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    req.onload = req.onreadystatechange = req.onerror = null
    if (next) {
      let tmp = next
      next = null
      tmp(err, data, headers)
    }
  }
  if (isGet) {
    if (opts.data || opts.query) {
      let u = parseUrl(opts.url)
      let q = parseQuery(u.query)
      if (opts.query) {
        for (let x in opts.query) {
          q[x] = opts.query[x]
        }
      }
      if (opts.data) {
        for (let x in opts.data) {
          q[x] = opts.data[x]
        }
        opts.data = null
      }
      u.query = stringifyQuery(q)
      opts.url = stringifyUrl(u)
    }
  } else if (isPost) {
    data = opts.data
    /* global FormData */
    if (probe.FormData) {
      isFormData = data instanceof FormData
      if (!isFormData) {
        data = stringifyQuery(data)
      }
    }
  }
  if (timeout) {
    timeout = setTimeout(function () {
      req.abort()
      emit(new Error('error_timeout'))
    }, timeout)
  }
  try {
    opts.xhr && opts.xhr(req)
    if (dataType === 'BINARY') {
      req.responseType = 'arraybuffer'
    }
    req.open(method, opts.url, true)
    if (opts.headers) {
      for (let x in opts.headers) {
        req.setRequestHeader(x, opts.headers[x])
      }
    }
    if (isPost && !isFormData) {
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    if (opts.headerOnly) {
      req.onreadystatechange = function () {
        // console.log('state', req.readyState, req);
        if (req.readyState === 2) { // HEADERS_RECEIVED
          let headers = parseHeaders(req.getAllResponseHeaders(), opts.camelHeaders, req.status)
          req.abort()
          emit(null, undefined, headers)
        }
      }
    }
    req.onload = function () {
      // if(req.readyState != 4) return;
      if ([
        200,
        204,
        304,
        206,
        0
      ].indexOf(req.status) === -1) { // error
        let err = new Error('error_status_' + req.status)
        err.status = req.status
        emit(err)
      } else {
        let data = req.response
        let parse = (req.status !== 204)
        if (parse) {
          try {
            if (dataType === 'JSON') {
              data = JSON.parse(req.responseText)
            } else if (dataType === 'XML') {
              data = req.responseXML
            } else if (dataType === 'TEXT') {
              data = req.responseText
            } else if (dataType === 'BINARY') {
              let arrayBuffer = new Uint8Array(data)
              let str = ''
              for (let i = 0; i < arrayBuffer.length; i++) {
                str += String.fromCharCode(arrayBuffer[i])
              }
              data = str
            }
          } catch (err) {
            return emit(err)
          }
        }
        emit(null, data, parseHeaders(req.getAllResponseHeaders(), opts.camelHeaders, req.status))
      }
    }
    req.onerror = function (e) {
      emit(new Error('error_network'))
    }
    // 进度
    if (opts.onprogress && !opts.headerOnly) {
      req.onloadend = req.onprogress = function (e) {
        let info = {
          total: e.total,
          loaded: e.loaded,
          percent: e.total ? Math.trunc(100 * e.loaded / e.total) : 0
        }
        if (e.type === 'loadend') {
          info.percent = 100
        } else if (e.total === e.loaded) {
          return
        }
        if (e.total < e.loaded) {
          info.total = info.loaded
        }
        if (info.percent === 0) {
          return
        }
        opts.onprogress(info)
      }
    }
    req.send(data)
  } catch (e) {
    emit(e)
  }
  return req
}

function parseHeaders (str, camelHeaders, status) {
  let ret = {}
  str.trim().split('\n').forEach(function (key) {
    key = key.replace(/\r/g, '')
    let arr = key.split(': ')
    let name = arr.shift().toLowerCase()
    ret[camelHeaders ? camelCase(name) : name] = arr.shift()
  })
  if (!(status in ret)) {
    ret.status = status.toString()
  }
  return ret
}

```

```js
return new Promise((resolve, reject) => {
  ajax({
    url,
    data,
    method: 'POST'
  }, function (err, res, headers) {
    if (err instanceof Error) {
      if (err.message === 'error_network') {
        err.message = '网络异常，请稍后再试'
      } else if (err.message === 'error_timeout') {
        err.message = '访问超时，请稍后再试'
      } else if (typeof err.message === 'string' && err.message.indexOf('error_status_') === 0) {
        err.message = '服务异常，请稍后再试'
      }
    }
    if (res && res.data) {
      return resolve(res.data)
    } else {
      return reject(err)
    }
  })
})
```