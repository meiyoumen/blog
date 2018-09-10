# HTML5的媒体标签(audio, video)的属性、方法和事件汇总
## <video>标签属性：
src：视频的URL
poster：视频封面，没有播放时显示的图片
preload：预加载
autoplay：自动播放
loop：循环播放
controls：浏览器自带的控制条
width：视频宽度
height：视频高度
videoWidth：视频内容宽度（初始状态下为0，加载metadata之后才有值）
videoHeight：视频内容高度（初始状态下为0，加载metadata之后才有值）

## <audio>标签属性：
src：音乐的URL
preload：预加载
autoplay：自动播放
loop：循环播放
controls：浏览器自带的控制条

## 获取HTMLVideoElement和HTMLAudioElement对象
JS代码

```
//audio可以直接通过new创建对象
Media = new Audio("http://www.abc.com/test.mp3");
//audio和video都可以通过JS获取对象,JS通过id获取video和audio的对象
Media = document.getElementById("media");
Media方法和属性：
HTMLVideoElement 和HTMLAudioElement 均继承自HTMLMediaElement
```

JS代码

```
//错误状态
Media.error; //null:正常
Media.error.code; //1.用户终止 2.网络错误 3.解码错误 4.URL无效

//网络状态
Media.currentSrc; //返回当前资源的URL
Media.src = value; //返回或设置当前资源的URL
Media.canPlayType(type); //是否能播放某种格式的资源
Media.networkState; //0.此元素未初始化 1.正常但没有使用网络 2.正在下载数据 3.没有找到资源
Media.load(); //重新加载src指定的资源
Media.buffered; //返回已缓冲区域，TimeRanges
Media.preload; //none:不预载 metadata:预载资源信息 auto:

//准备状态
Media.readyState;  //1:HAVE_NOTHING 2:HAVE_METADATA 3.HAVE_CURRENT_DATA 4.HAVE_FUTURE_DATA 5.HAVE_ENOUGH_DATA
Media.seeking; //是否正在seeking

//回放状态
Media.currentTime = value; //当前播放的位置，赋值可改变位置
Media.startTime; //一般为0，如果为流媒体或者不从0开始的资源，则不为0
Media.duration; //当前资源长度 流返回无限
Media.paused; //是否暂停
Media.defaultPlaybackRate = value;//默认的回放速度，可以设置
Media.playbackRate = value;//当前播放速度，设置后马上改变
Media.played; //返回已经播放的区域，TimeRanges，关于此对象见下文
Media.seekable; //返回可以seek的区域 TimeRanges
Media.ended; //是否结束
Media.autoPlay; //是否自动播放
Media.loop; //是否循环播放
Media.play();  //播放
Media.pause();  //暂停

//控制
Media.controls;//是否有默认控制条
Media.volume = value; //音量
Media.muted = value; //静音

//TimeRanges(区域)对象
TimeRanges.length; //区域段数
TimeRanges.start(index) //第index段区域的开始位置
TimeRanges.end(index) //第index段区域的结束位置
```


## Media相关的事件：
"loadstart"：客户端开始请求数据
"progress"：客户端正在请求数据
"suspend"：延迟下载
"abort"：客户端主动终止下载（不是因为错误引起），
"error"：请求数据时遇到错误
"stalled"：网速失速
"play"：play()和autoplay开始播放时触发
"pause"：pause()触发
"loadedmetadata"：成功获取资源长度
"loadeddata"：
"waiting"：等待数据，并非错误
"playing"：开始回放
"canplay"：可以播放，但中途可能因为加载而暂停
"canplaythrough"：可以播放，歌曲全部加载完毕
"seeking"：寻找中
"seeked"：寻找完毕
"timeupdate"：播放时间改变
"ended"：播放结束
"ratechange"：播放速率改变
"durationchange"：资源长度改变
"volumechange"：音量改变

Media使用常见问题：
- 某些Android手机的原生浏览器（Android Browser），在第一次点击播放video的时候会触发error事件然后自动暂停，需要用户再次点击播放才能顺利播放。
- 某些比较老版本（例如2.3以下的）的Android手机的原生浏览器（Android Browser）不支持全屏播放video，但是控制条还是会有全屏按钮，点击会导致浏览器crash。
- Android Browser、Chrome for mobile、iOS Safari以及大部分的手机浏览器都不支持自动播放video。
- 在QQ手机浏览器for iOS中，video标签不能在页面初始阶段或JS插入DOM是，src为空或者文件地址不可用，否则页面会同时存在原生的视频播放控件和QQ浏览器的视频播放控件。
- 国内很多浏览器厂商（如UC、QQ、百度等），甚至手机厂商（如小米），都会拦截video标签使用自己的视频播放控件，由于各厂商实现机制和标准不一，上面列出的事件页面JS不一定都能监听到。


### 音频（audio）和视频（video）

```
<audio src="m.mp3"/>
<video src="m.mp4" width=320 height=400 />
```

#### 视频（<video>）

```
autoplay    autoplay    如果出现该属性，则视频在就绪后马上播放。
controls    controls    如果出现该属性，则向用户显示控件，比如播放按钮。
height      pixels      设置视频播放器的高度。
width       pixels      设置视频播放器的宽度。
loop        loop        如果出现该属性，则循环播放。
muted       muted       如果出现该属性，视频的音频输出为静音。
poster      URL         规定视频正在下载时显示的图像，直到用户点击播放按钮。 preload     auto/metadata/none   如果出现该属性，则视频在页面加载时进行加载，并预备播放。如果使用 "autoplay"，则忽略该属性。
src         URL         要播放的视频的 URL。
```



#### 音频（<audio>）

```
autoplay   autoplay    如果出现该属性，则视频在就绪后马上播放。
controls   controls    如果出现该属性，则向用户显示控件，比如播放按钮。
loop       loop        如果出现该属性，则当媒介文件完成播放后再次开始播放。
muted      muted       如果出现该属性，视频的音频输出为静音。
preload    auto/metadata/none    如果出现该属性，则视频在页面加载时进行加载，并预备播放。如果使用 "autoplay"，则忽略该属性。
src        URL         要播放的视频的 URL。
```



#### 只读属性

```
duration    整个媒体文件的播放时长，以秒为单位。如果无法获取时长，则返回NaN
paused      如果媒体文件当前被暂停，则返回true。如果还未开始播放，默认返回true
ended       如果媒体文件已经播放完毕，则返回true
startTime   返回最早的播放起始时间，一般是0.0，除非是缓冲过的媒体文件，并且一部分内容已经不在缓冲区
error       在发生了错误的情况下返回的错误代码
currentSrc  以字符串形式返回当前正在播放或已加载的文件。对应于浏览器在source元素中选择的文件
seeking     如果播放器正在跳到一个新的播放点，那seeking的值为true。
initialTime  指定了媒体的开始时间，单位为秒

```

#### 可读写属性

```
autoplay     将媒体文件设置为创建后自动播放，或者查询是否已设置为autoplay  
loop         返回是否循环播放，或设置循环播放（或者不循环播放）  
currentTime  指定了播放器应该跳过播放的时间（秒）。在播放过程中，可设置currentTime属性来进行定点播放。
controls     显示或隐藏用户控制界面，或者查询用户控制界面当前是否可见  
volume       在0.0到1.0之间设置音频音量的相对值，或者查询当前音量相对值  
muted        布尔值，设置静音或者消除静音，或者检测当前是否为静音  
autobuffer   通知播放器在媒体文件开始播放前，是否惊醒缓冲加载。如果已设置为autoplay，则忽略此特性
playbackRate 指定媒体播放的速度。1.0表示正常速度，大于1则表示“快进”，0~1之间表示“慢放”，负值表示回放。
```

#### 三个特殊属性

```
played   返回已经播放的时间段  
buffered 返回当前已经缓冲的时间段  
seekable 返回当前播放器需要跳到的时间段
played、buffered和seekable都是TimeRanges对象，每个对象都有一个length属性以及start(index)和end(index)方法，前者表示当前一个时间段，后者分别返回当前时间段的起始时间点和结束时间点（单位为秒）。
```

#### 还有另外三个属性

> 它们包含<audio>和<video>元素的一些状态细节。每个属性都是数字类型的，而且为每个有效值都定义了对应的常量。

```
readyState
networkState
error
```

##### readyStete属性

> `readyState`属性指定当前已经加载了多少媒体内容，只读属性

- HAVE_NOTHING（数字值为0）：没有获取到媒体的任何信息，当前播放位置没有可播放数据。  
- HAVE_METADATA（数字值为1）：已经获取到足够的媒体数据，但是当前播放位置没有有效的媒体数据（也就是说，获取到的媒体数据无效，不能播放）。  
- HAVE_CURRENT_DATA（数字值为2）：当前播放位置已经有数据可以播放，但没有获致到可以让播放器前进的数据。当媒体为视频时，意思是当前帖的数据已获取，但没有获取到下一帧的数据，或者当前帧已经是播放的最重一帧。  
- HAVE_FUTURE_DATA（数字值为3）：当前播放位置已经有数据可以播放，而且也获取到了可以让播放器前进的数据。当媒体为视频时，意思是当前帧的数据已获取，而且也获取到了下刺目贩数据，当前帧是播放的最后一帧时，readyState属性不可能为HAVE_FUTURE_DTAT。  HAVE_ENOUGH)DATA（数字值为4）：当前播放位置已经有数据可以播放，同时也获取到了可以让播放器前进的数据，而且浏览器确认媒体以某一种速度进行加载，可以保证有足够的后续数据进行播放。

##### networkState属性

> networkState属性读取当前的网络状态，共有如下所示的4个可能值：

- NETWORK_EMPTY（数字值为0）：元素牌初始状态。

- NETWORK_IDLE    （数字值为1）：浏览器已选择好用什么编码格式来播放媒体，但尚未建立网络连接。

- NETWORK_LOADING（数字值为2）：媒体数据加载中。

- NETWORK_NO_SOURCE（数字值为3）：没有支持的编码格式，不执行加载。

  ​

##### error属性

> 当在加载媒体或者播放媒体过程中发生错误时，浏览器就会设置

- MEDIA_ERR_ABORTED(数字值为1）：媒体数据的下载过程由于用户的操作原因而被中止。
- MEDIA_ERR_NETWORK(数字值为2）：确认媒体资源可用，但是在下载时出现网络错误，媒体数据下载过程被中止。
- MEDIA_ERR_DECODE(数字值为3)：确认媒体资源可能，但是解码时发生错误。
- MEDIA_ERR_SRC_NOT_SUPPORTED（数字值为4）：媒体格式不被支持。



#### video的额外属性：

poster	在视频加载完成之前，代表视频内容的图片的URL地址。该特性可读可修改  
width、height	读取或设置显示尺寸。如果大小不匹配视频本身，会导致边缘出现黑色条状区域  
videoWidth、videoHeight	返回视频的固有或自使用宽度和高度。只读



#### 方法

`canPlayType(type)`方法将媒体的MIME类型作为参数，用来测试浏览器是否支持指定的媒体类型。
如果它不能播放该类型的媒体文件，将返回一个空的字符串；反之，它会返回一个字串：“maybe”或“probably”。

```js
var a = new Audio();
if(a.canPlayType('audio/wav')){
  a.src = 'm.wav';
  a.play();
}
```

其他方法：

- play() 控制媒体开始播放
- pause() 暂停媒体播放
- load() 重新加载src指定的资源

#### 事件

> audio元素和video元素加载音频和视频时，以下事件按次序发生。

1. loadstart：开始加载音频和视频。  
2. durationchange：音频和视频的duration属性（时长）发生变化时触发，即已经知道媒体文件的长度。如果没有指定音频和视频文件，duration属性等于NaN。如果播放流媒体文件，没有明确的结束时间，duration属性等于Inf（Infinity）。  
3. loadedmetadata：媒体文件的元数据加载完毕时触发，元数据包括duration（时长）、dimensions（大小，视频独有）和文字轨。  
4. loadeddata：媒体文件的第一帧加载完毕时触发，此时整个文件还没有加载完。  
5. progress：浏览器正在下载媒体文件，周期性触发。下载信息保存在元素的buffered属性中。  
6. canplay：浏览器准备好播放，即使只有几帧，readyState属性变为CAN_PLAY。  
7. canplaythrough：浏览器认为可以不缓冲（buffering）播放时触发，即当前下载速度保持不低于播放速度，readyState属性变为CAN_PLAY_THROUGH。

**audio元素和video元素还支持以下事件:**

```
abort	播放中断  
emptied	媒体文件加载后又被清空，比如加载后又调用load方法重新加载。  
ended	播放结束  
error	发生错误。该元素的error属性包含更多信息。  
pause	播放暂停  
play	暂停后重新开始播放  
playing	开始播放，包括第一次播放、暂停后播放、结束后重新播放。  
ratechange	播放速率改变  
seeked	搜索操作结束  
seeking	搜索操作开始  
stalled	浏览器开始尝试读取媒体文件，但是没有如预期那样获取数据  
suspend	加载文件停止，有可能是播放结束，也有可能是其他原因的暂停  
timeupdate	网页元素的currentTime属性改变时触发。  
volumechange	音量改变时触发（包括静音）。  
waiting	由于另一个操作（比如搜索）还没有结束，导致当前操作（比如播放）不得不等待。
```
