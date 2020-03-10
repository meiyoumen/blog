### 事件DOMContentLoaded和load的区别

他们的区别是，触发的时机不一样，先触发DOMContentLoaded事件，后触发load事件。

**DOM文档加载的步骤为**

1. 解析HTML结构。
1. 加载外部脚本和样式表文件。
1. 解析并执行脚本代码。
1. DOM树构建完成。//DOMContentLoaded
1. 加载图片等外部文件。
1. 页面加载完毕。//load
1. 在第4步，会触发DOMContentLoaded事件。在第6步，触发load事件。
1. 用原生js可以这么写

https://developer.mozilla.org/zh-CN/docs/Web/Events/DOMContentLoaded

> DOMContentLoaded 事件将被触发，当初始HTML文档已经完成加载和解析时，而无需等待样式表，图像和子帧的完全加载。
> 
> 应该使用非常不同的事件load 来检测满载页面。
> 在使用 DOMContentLoaded 更加合适的地方, 使用 load 是一个非常流行的错误, 所以要谨慎。

==Note:== 同步JavaScript会暂停DOM的解析

````html
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      document.querySelector("#abc").onclick=function(){
        console.log(1) //1
      }
    }, false);
    
    
    window.addEventListener("load", function() {
        // ...代码...
    }, false);
    
    // DOMContentLoaded
    $(document).ready(function() {
        // ...代码...
    });
    
    //load
    $(document).load(function() {
        // ...代码...
    });
    
    
  for(var i=0; i<1000000000; i++){} 
  // 这个同步脚本将延迟DOM的解析。
  // 所以DOMContentLoaded事件稍后将启动。
    
  </script>

  <div id="abc">1</div>
```

https://juejin.im/post/5a36499551882529c70f34b5