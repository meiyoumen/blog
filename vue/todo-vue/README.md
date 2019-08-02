# vue-communication

Vue常用的几种通信传递

相关demo可以查看views文件夹下文件

## props / emit

父 -> 子 通过props给子页面传递参数

子 -> 父 通过emit反馈给父页面，父页面通过on拿到子页面反馈的数据

## vuex

通过设置state的值，在对应页面通过vuex的getters api拿取相应的值。具体怎么用可以看官方api

[vuex](https://vuex.vuejs.org/zh/guide/)

## EventBus

通过new一个Vue实例，调用Vue实例上的`$emit`、`$on` 来实现通信，在一些不是很复杂的项目中，可以用这种方式来替换vuex

## $attrs / $listeners

这是`2.4.0`新增的api，主要用于跨级组件参数的传递，在创建高级别的组件时非常有用。

可以通过设置inheritAttrs（默认为true）来确定子组件要不要接受父组件的attrs值

![ePUE4g.png](https://s2.ax1x.com/2019/07/22/ePUE4g.png)

## provide / inject

> 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效

[provide-inject](https://cn.vuejs.org/v2/api/#provide-inject)

## 不推荐系列

### ref / refs

通过拿去组件实例来进行参数的传递，不过个人认为可以用props、attrs这种方式替换掉，因为refs不是一个响应式的

![eiFi9J.png](https://s2.ax1x.com/2019/07/22/eiFi9J.png)

### $children / $parent

![eik9qP.png](https://s2.ax1x.com/2019/07/22/eik9qP.png)

[$children / $parent](https://cn.vuejs.org/v2/api/#parent)

### mixins

实际上mixin也可以用作数据的通信，但我们并不推荐。

[mixins](https://cn.vuejs.org/v2/api/#mixins)

### Vue.prototype（这里只是举例子，原型的作用并不在于数据传递）

通过原型传递数据？当然，这也是可以的，但这看着就像通过window去传递数据一样，用在数据通信完全是没有必要的，就像localStorage这些一样

# 总结

其实进行数据通信的方式有很多，但并不是每一个方式都适合进行数据传递，对于Vue而言我们还是比较推荐props/attrs/vuex这一类

高阶组件之间的通信更推荐attrs/provide
