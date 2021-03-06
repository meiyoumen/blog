Node.js 到底能解决我们哪些的问题和痛点呢？
- 首先，提高开发效率，因为有了 Node 之后就不需要配置 Nginx 了，也不需要配置一些代理工具了，所有的页面生命周期都是由前端统一去管理的，这时候不需要其他人进行合作。
- 第二，降低沟通成本，除了接口格式外，不需要和后端进行交互了；
- 第三，前后端职责也更为清晰，因为这时候，界限更为清晰了，后端只负责生产数据，它只提供数据就可以了，至于数据怎么消费，以及怎么用，都由前端去做；
- 第四，可以同时使用 React SSR 技术，做到首屏渲染，提高用户体验，除了首屏之外，还可以做异步的加载、SEO 等操作。
- 最后，Node.js 可提供一些服务，不仅能让我们使用，还可以对外使用，如 RESTful API，这样就不用有求于后端了。


三年前，公司内部就搞了一套基于 Express 的 Node.js 解决方案，包含日志收集，监控，多进程，异常，模板等插件，方案本身也很全面，但在实际项目使用过程中，或多或少的有些不便，主要体现：
- 如何确定项⽬目⽬目录划分的规范，命名规范 (view or views)；
- 确定规范后，如何保证⼤大家都认可，并且严格遵守；
- 如何保证系统的安全性、稳定性和扩展性，怎么保证和我们内部系统做很无缝的去对接，这就要求有很好的扩展性；
- 守护进程程序的选择 (pm2 or supervisor)；
- 怎么保证多环境运⾏行行规则 (local / beta / prod)，因为在我们实际项目中，可能对我们的 Local 或者对 Bata 或者对 PID 都有不同的规则，如果这时候没有去做这件事，就有可能对我们的实际应用有可能造成一定的障碍；
- 如何利利⽤用系统 cpu 多核，以及多进程之间的通信。



针对这些问题，内部也进行了一些改进，但有些功能还是有些不尽人意。



在 17 年 4 月份，团队内部又重新开始 Review 和调研。发现国内有两个框架做的比较好，一个是 360 团队的 `Thinkjs` ，另一个是阿里的 `Eggjs` ，两个框架实现目的也是一致，只是使用的方式有些差别。


团队内部针对这两款框架，分别做了不同尝试，最终从框架扩展的易用性，插件数量，以及部署等方面，选择使用的是 Eggjs 作为团队内部的框架，以替代之前的框架。
插件开发

为了对接我们的内部系统，我们还开发了不同功能的一些插件。
- egg-qversion，作用是关联前后端静态资源版本号
- egg-qconfig，对接公司内部的 qconfig 系统
- egg-qwatcher，对接公司内容的 watercher 系统
- egg-accesslog，产生 access.log 日志
- egg-swift，对接 swift 系统
- egg-healthcheck，系统健康检查
- egg-checkurl，应用存活检查