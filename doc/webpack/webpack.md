[TOC]
# webpack4学习
## 1.webpack是什么？
WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其打包为合适的格式以供浏览器使用。并且跟具你的在项目中的各种需求，实现自动化处理，解放我们的生产力

- 代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS 。
- 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等。
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
- 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

## 2.webpack核心概念
- Entry：入口，webpack执行构建的第一步将从Entry开始，可抽象理解为输入
- Module：模块，在webpacl中一切皆为模块，一个模块对应一个文件，webpack会从配置的Entry开始递归找出所有依赖的模块
- Chunk：代码块，一个chunk由多个模块组合而成，用于将代码合并和分割
- Loader：模块转换器，用于把模块原内容按照需求转换为需要的新内容
- Plugin：扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果和想要做的事情
- Output：输入结果，在webpack经过一系列处理并得到最终想要的代码然后输出结果
- Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的Loader去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。
##  项目搭建
项目搭建，我们对webpack的诉求是：
- js的处理：转换 ES6 代码，解决浏览器兼容问题
- css的处理：编译css，自动添加前缀，抽取css到独立文件
- html的处理：复制并压缩html文件
- dist的清理：打包前清理源目录文件
- assets的处理：静态资源处理
- server的启用：development 模式下启动服务器并实时刷新

## 使用 webpack 4 建立 vue 项目
同样地，我们模仿 vue-cli 的结构，自己搭建一个 vue 项目，这次我们的css预编译语言用 scss：

```js
├── public
  │   └── index.html      # html 模板
  ├── src
  │   ├── assets          # 静态资源
  │   │   └── logo.png
  │   ├── components      # 组件
  │   │   └── App.vue
  │   ├── main.js        # 入口文件
  │   └── styles
  │       └── index.scss
  ├── .babelrc
  ├── package-lock.json
  ├── package.json
  ├── postcss.config.js
  └── webpack.config.js
```

## 配置最基本的 Webpack
安装Webpack
```
npm i webpack webpack-cli -D
```
build 文件夹，然后创建以下几个文件：
```js
webpack.base.conf.js
webpack.dev.conf.js
webpack.prod.conf.js
build.j
```
- webpack.base.conf.js 是最基础的打包配置，是开发环境和生产环境都要用到的配置。
- webpack.dev.conf.js 就是在开发环境要使用的配置。
- webpack.prod.conf.js 就是在生产环境要使用的配置了。
- build.js 是通过 Node 接口进行打包的脚本。


## 处理JS
### 了解babel
说起编译es6，就必须提一下babel和相关的技术生态：
- babel-loader: 负责 es6 语法转化
- babel-preset-env: 包含 es6、7 等版本的语法转化规则，编译es6中的一些新语法，但是不能够编译es6中的一些api
- babel-polyfill: es6 内置方法和函数转化垫片
- babel-plugin-transform-runtime: 避免 polyfill 污染全局变量

安装好必须依赖后，我们还需要安装编译ES6的预设（preset），它的作用就是编译es6中的一些新语法，但是不能够编译es6中的一些api,编译api需要一些插件。  
babel-preset-env es6的预设只能编译一些新的语法，不能编译es6的一些新的API，比如：
- Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象
- 以及一些定义在全局对象上的方法（比如Object.assign）。
这时候我们要用的ES6的一些插件babel-plugin-transform-runtime，另外还需要安装babel-runtime插件来配合babel-plugin-transform-runtime的使用

```
npm i -D babel-plugin-transform-runtime babel-runtime
```


##### ==需要注意的是:==
- babel-loader   负责语法转化，比如：箭头函数；
- babel-polyfill 负责内置方法和函数，比如：new Set()。

##### package.josn
```js
{
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "webpack": "^4.15.1"
  },
  "dependencies": {
    "babel-polyfill": "^6.26.0",
    "babel-runtime": "^6.26.0"
  }
}
```

babel的相关配置，推荐单独写在.babelrc文件中。的相关配置：
```
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 2 versions"]
        }
      }
    ]
  ],
  "plugins": ["transform-runtime"]
}
```

### 压缩JS
设置 mode 为 production 配置后，webpack v4+ 会默认压缩你的代码。生产环境下默认使用 TerserPlugin ，并且也是代码压缩方面比较好的选择。

```js
const path = require('path');
const HtmlWebpackPlugin  = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    mode:"production",
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
            title: "15- webpack 压缩 JavaScript 代码",
            minify: {
                collapseWhitespace: true,//删除空格、换行
            },
        }),
    ],
};
```



## 处理CSS
### loader
>在js中导入css文件，我们需要使用style-loader 和 css-loader
```
npm install --save-dev style-loader css-loader
```
- css-loader 会找出 CSS 代码中的 @import 和 url() 这样的导入语句，告诉 Webpack 依赖这些资源。同时还支持 CSS Modules、压缩 CSS 等功能。处理完后再把结果交给 style-loader 去处理。
- style-loader 会把 CSS 代码转换成字符串后，注入到 JavaScript 代码中去，通过 JavaScript 去给DOM 增加样式。如果你想把 CSS 代码提取到一个单独的文件而不是和 JavaScript 混在一起，可以使用 MiniCssExtractPlugin


```js
module.exports = {
    context: path.resolve(__dirname),
    mode: 'none',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
               test: /\.css/,
               use: ['style-loader','css-loader']
            }
        ]
    }
};
```
我们执行npx webpack，打开index.html可以看到效果，并且css样式是直接嵌在html中的<style type="text/css">***</style>。

### 分离CSS
#### 注意：
- webpack v3.0+ 使用 ExtractTextPlugin
- ==webpack v4.0+ 使用 MiniCssExtractPlugin==

因为上面的css是嵌在html中的，我们可以使用MiniCssExtractPlugin插件将css与html分离。  
首先安装MiniCssExtractPlugin 插件
```
npm install -D mini-css-extract-plugin
```
使用后html中不存在内嵌的css代码了，使用link引入css代码

### 使用Postcss
PostCSS是一个用JS插件转换CSS的工具。它可以使css支持变量和mixin，使用未来的CSS语法，内联图片等等。  
在使用PostCss时我们需要先把css文件交给PostCss-loader处理，然后在交给css-loader处理。  
如果你使用less或sass,需要先交给less-loader或sass-loader处理。  

另外PostCss提供了很多插件来处理css，比如postcss-preset-env插件允许使用未来的css特性，比如autoprefixer插件可以自动补全浏览器前缀（关于PostCss 的更多插件）。

这些插件我们需要下载，并在项目的根目录下新建一个postcss.config.js 文件(或.postcssrc.js文件)，在该文件中进行插件的配置，当postcss编译时会自动读取该文件下的配置。
现在我们来实现使用postcss-preset-env插件和autoprefixer插件。首先安装
```
// 安装 postcss-loader
npm install -D postcss-loader
// 安装postcss插件
npm install -D postcss-preset-env  autoprefixer
```
我们在根目录下新建postcss.config.js 文件(或.postcssrc.js文件)，并使用上面下载的两个插件

```js
//允许你使用未来的 CSS 特性。
const postcssPresetEnv = require('postcss-preset-env');
// 自动添加浏览器前缀
const autoprefixer = require('autoprefixer');
module.exports = {
    plugins: [
      postcssPresetEnv,
      autoprefixer({
      // 配置要兼容的浏览器版本
      // 也可以在package.json中的browserslist字段中添加浏览器版本
        "browsers": [
          "defaults",
          "not ie < 11",
          "last 100 versions",
          "> 1%",
          "iOS 7",
          "last 3 iOS versions"
        ]
      })
    ]
  };
```

然后我们来修改webpack.config.js


```js
module: {
    rules: [
        {
            test: /\.less$/,
            use: [
                 MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'less-loader'
            ]
        }
    ]
}
```

#### ==提示==
- 首先css要先经过postcss-loader处理交给css-loader，如果使用less或类似的css预处理器，要先交给less-loader处理在交给postcss-loader处理，最后交给css-loader;  

```
{
    test: /\.less$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
}
```

- 在使用autoprefixer做兼容性前缀时，我们要指定浏览器版本来确定在指定版本中添加兼容性前缀。可以像上面的方式指定，也可以在package.json中的browserslist 字段中指定。

### 压缩CSS

```js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')  
plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      hash: true,                     // 防止缓存
      minify: {                       // 压缩
        removeAttributeQuotes: true,  // 去掉引号
        removeComments: true,         // 移除 HTML 中的注释
        collapseWhitespace: true,     // 删除空白符与换行符
        minifyCSS: true               // 压缩内联 css
      }
    }),
    // 压缩CSS
    new OptimizeCSSAssetsPlugin({})
  ],
```


## 处理静态资源
### 使用 url-loader
们打包出来的图片，在展示到页面时会发很多http请求，会降低页面性能。这个问题可以通过url-loader解决。url-loader会将引入的图片编码，生成dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。

配置

```
npm i -D url-loader
module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif|svg)$/,
      use: {
          loader: 'url-loader',
      }
    }
  ]
}
```

当然，如果图片较大，编码会消耗性能  
因此url-loader提供了一个limit参数:
- 小于limit字节的文件会被转为DataURl，
- ==大于limit的还会使用file-loader进行copy==。所==用url-loader中已经包含了file-loader==, 我们在开发时==可以只使用url-loader就可以==。除了limit参数，url-loader还提供一些额外的参数


```
module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif)$/,
      use: {
          loader: 'url-loader',
          options:{
            // name 同flie-loader
            name:'[path][name][hash:8].[ext]',
            // 小于10000字节的转换为DataUrl格式
            limit:10000,
            // 是否采用file-loader， 默认采用
            // 还可以用responsive-loader等一些其他loader
            fallback: 'file-loader',
            // 设置要处理的MIME类型，
            mimetype:'image/png',
          }
      }
    }
  ]
}
```

#### 提示
url-loader 不仅仅可以处理图片，还可以处理音频视频、文档等等。如vue教程加中使用url-loader处理的资源：

```js
//图片
/\.(png|jpe?g|gif|svg)(\?.*)?$/   
//音频视频
/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/ 
//字体
/\.(woff2?|eot|ttf|otf)(\?.*)?$/
```
#### 压缩图片
我们在使用webpack打包图片时，除了将小图片转化为DataURL格式，我们还可以将图片进行压缩，这时候我们可以使用image-webpack-loader。

npm i -D image-webpack-loader
然后我们在webpack.config.js中进行配置

```
module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
              name: '[path][name][hash:8].[ext]',
              limit: 20 * 10
          }
        },
        {
          loader: 'image-webpack-loader',// 压缩图片
          options: {
              disable: false //是否禁止压缩，默认false
              quality: 80, //压缩质量，也可以是'70-80'
          }
        }
      ]
    }
  ]
}
```

现在我们就可以对图片进行压缩，并且压缩之后再判断图片是否转化为DataURL格式。

#### 其他处理插件
webpack-spritesmith插件 生成雪碧图

## 使用 DevServer
Webpack v4.0+注意该中提供了几个大模块:
- 核心模块 webpack,
- 命令模块 webpack-cli 
- 服务器模块 webpack-dev-server。

实现浏览器的自动刷新和模块热替换我们可以使用服务器模块 webpack-dev-server。

### 实现自动刷新
以前在写页面的时候，我们每次修改完代码需要刷新浏览器才可以看到页面修改后的效果，为提高效率现在我们可以使用DevServer 实现我们的效果。

### 启动监听模式
在webpack中可以使用watch观察模式来监听文件的变动，而不需要每次都编译。启动监听这模式有两种方式：

执行==webpack --watch==命令
在配置文件中进行配置

```js
module.exports = {
 watch: true, // 开启观察者模式
  watchOptions:{ //对watch的配置
      // 不监听的文件
      ignored:['node_modules'],
      //当第一个文件更改，会在重新构建前增加延迟。这个选项允许 webpack 
      //将这段时间内进行的任何其他更改都聚合到一次重新构建里
      aggregateTimout:300,
      // 每秒检查一次变动
      poll:1000
  },
}
```

==使用观察者模式时每次我们修改代码后，webpack都会自动检测出并重新构建我们的项目==。

其实`webpack`在这里做的就是将我们文件==最后一次修改时间记录了下来==，并==定时的去检测==我们文件的==修改时间==，如果发现我们==新的修改时间和我们的不一致就会自动去构建==。 

另外`webpack`在执行的时候，我们是可以设置它长时间去检测一次（设置poll），并且检测出变化后，延迟多长时间去构建项目（设置aggregateTimout）。

我们在开发项目时，建议将不不是经常改动的文件添加的ignored中，对其不进行监听来提高我们的监听性能。

### 自动刷新
使用观察者模式时每次我们修改代码后，webpack都会自动检测出并重新构建我们的项目，但是这时侯我们依然要手动动刷新页面，想要自动刷新页面我们还要使用webpack-dev-server 模块


```
// 安装
npm i -D webapck-dev-server
```
然后我们可以启动webapck-dev-server
```
npx webpack-dev-server
```
当然我们也可以在package.json中添加启动命令
```
// 在`package.json`中添加启动命令
"scripts": {
  "start": "npx webpack-dev-server"
}
```

```
// 然后执行
npm start
```

当使用`webapck-dev-server`启动时，它自动启动`webpack`，并且`webpack`的监听模式会被开启，当`webpack`监听到文件变化后，会通知`webapck-dev-server`模块，`webapck-dev-server`模块会去刷新浏览器。  

`webapck-dev-server`启动时默认会在8080端口上http://localhost:8080，此外我们还可以在webpack.config.js中根据devServer字段来来配置webapck-dev-server


```js
module.exports = {
  devServer:{
    contentBase: path.join(__dirname, 'dist'), // 设置服务器从那个目录提供内容，默认当前
    //告知服务器，观察 devServer.contentBase 下的文件。
    //文件修改后，会触发一次完整的页面重载
    watchContentBase: true, //一切服务都启用 gzip 压缩
    compress: true,         // 刷新模式，false时启用iframe模式
    inline:false,           //默认是 localhost。如果你希望服务器外部可访问设置'0.0.0.0'
    host: 'localhost',
    port: 9000             // 启动端口默认8080
    hot: false,            // 是否启动热模块替换,(启用下也会启用自动刷新)
    hotOnly: true,         // 仅启动自动刷新
    proxy:{},              // 设置请求代理
    open: true,            // 启动后是否自动打开默认浏览器
    openPage: '/different/page',//指定打开浏览器时的导航页面。
    overlay:true,       //当出现编译器错误或警告时，在浏览器中显示全屏覆盖层,默认false
    useLocalIp:true,    //允许浏览器使用本地 IP 打开。
    watchOptions:{}     // 和watch模式下的相同
  }
}
```

[更多配置请查看官网 开发中 server(devServer)
](https://webpack.docschina.org/configuration/dev-server/#devserver/)
### 自动刷新原理
浏览器的自动刷新有三种方法：

借助浏览器扩展去通过浏览器提供的接口刷新。
往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。
把要开发的网页装进一个 iframe 中，通过刷新 iframe 去看到最新效果。

自动刷新原理
浏览器的自动刷新有三种方法：
- 借助浏览器扩展去通过浏览器提供的接口刷新。
- 往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。
- 把要开发的网页装进一个 iframe 中，通过刷新 iframe 去看到最新效果。  

在`webpack`中`DevServer`支持后两种方法，第二种是DevServer默认采用的。如果想要了解具体原理查看深入浅出webpack —— [使用自动刷新](http://www.xbhub.com/wiki/webpack//4%E4%BC%98%E5%8C%96/4-5%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.html)

# 实现模块热替换
上边我们使用webapck-dev-server模块自动刷新浏览器来实现我们实时预览的效果，处理自动刷新我们还可以使用模块热替换的方法来实现我们实时预览的效果。

模块热替换的方法的实现非常简单，它也集成在了webpack-dev-server中，我们可以通过下面两种方法来实现：

执行命令==npx webpack-dev-server --hot==
webpack.config.js中配置DevServer 启用，同时还要使用webpack.HotModuleReplacementPlugin 插件（在方法一种执行时，以及自动注入并使用了该插件）。

```js
const webpack = require('webpack')
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin

module.exports = {
  devServer:{
    // 是否启动热模块替换, 默认关闭(启用下也会启用自动刷新)
    hot: true, 
  },
  plugins:[
       // 模块热替换
       new HotModuleReplacementPlugin()
  ]
}
```

模块热替换并不会刷新浏览器，他只时在检测我们代码有变化时，==将变化的模块进行编译==，然后在==变化后的新模块替换浏览器中对应的旧模块==。

#### 提示
需要知道的是当设置==hot为true时==，也会启动浏览器自动刷新，所以有时候你会看到当模块修改后，我使用的是模块热替换但是浏览器会是会刷新，具体原因可以看看这篇文章[深入浅出webpack —— 开启模块热替换](http://www.xbhub.com/wiki/webpack//4%E4%BC%98%E5%8C%96/4-6%E5%BC%80%E5%90%AF%E6%A8%A1%E5%9D%97%E7%83%AD%E6%9B%BF%E6%8D%A2.html), 当我们设置 ==hotOnly为true时==，==这时就只会开启模块热替换功能==


## 升级避坑指南
- babel-loader  
    - 如果你的 babel-loader 是 7.x 版本的话，你的 babel-core 必须是 6.x 版本；  
    - 如果你的 babel-loader 是 8.x 版本的话，你的 babel-core 必须是 7.x 版本。 
    - 如果不这样的话，Webpack 会报错。
    - 安装命令如下：
```js
npm i babel-loader@7 babel-core babel-preset-env -D
```  
- webpack4不再支持Node 4，由于使用了JavaScript新语法，Webpack的创始人之一，Tobias，建议用户使用Node版本 >= 8.94，以便使用最优性能。
- vue-loader v15 需要在 webpack 中添加 VueLoaderPlugin 插件，参考如下。
```
const { VueLoaderPlugin } = require("vue-loader"); // const VueLoaderPlugin = require("vue-loader/lib/plugin"); // 两者等同

//...
plugins: [
  new VueLoaderPlugin()
]
```

- 升级到 webpack4 后，mini-css-extract-plugin 替代 extract-text-webpack-plugin 成为css打包首选，相比之前，它有如下优势：
    - 异步加载
    - 不重复编译，性能更好
    - 更容易使用
    - 缺陷，不支持css热更新。因此需在开发环境引入 css-hot-loader，以便支持css热更新，如下所示：

```
{
    test: /\.scss$/,
    use: [
        ...(isDev ? ["css-hot-loader", "style-loader"] : [MiniCssExtractPlugin.loader]),
        "css-loader",
        postcss,
        "sass-loader"
    ]
}
```
- 发布到生产环境之前，css是需要优化压缩的，使用 optimize-css-assets-webpack-plugin 插件即可，如下。

```
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

//...
plugins: [
    new OptimizeCssAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        }
    })
]
```
## 持续加速

文章开始，我曾提到，优化才刚刚开始。是的，随着项目越来越复杂，webpack也随之变慢，一定有办法可以进一步压榨性能。
经过很长一段时间的多个项目运行以及测试，以下几点经验非常有效。
缩小编译范围，减少不必要的编译工作，即 ==modules、mainFields、noParse、includes、exclude、alias==全部用起来。


```js
const resolve = dir => path.join(__dirname, '..', dir);

// ...
resolve: {
    modules: [                          // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
        resolve('src'),
        resolve('node_modules'),
        resolve(config.common.layoutPath)
    ],
    mainFields: ['main'],               // 只采用main字段作为入口文件描述字段，减少搜索步骤
    alias: {
        vue$: "vue/dist/vue.common",
        "@": resolve("src")             // 缓存src目录为@符号，避免重复寻址
    }
},
module: {
    noParse: /jquery|lodash/,           // 忽略未采用模块化的文件，因此jquery或lodash将不会被下面的loaders解析
    // noParse: function(content) {
    //     return /jquery|lodash/.test(content)
    // },
    rules: [
        {
            test: /\.js$/,
            include: [                                  // 表示只解析以下目录，减少loader处理范围
                resolve("src"),
                resolve(config.common.layoutPath)
            ],
            exclude: file => /test/.test(file),         // 排除test目录文件
            loader: "happypack/loader?id=happy-babel"   // 后面会介绍
        },
    ]
}
```
