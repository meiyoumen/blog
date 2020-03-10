解决方案
知道上面原因了，解决方案就有几个了:

- 子进程的系统，不再输出日志
- maxBuffer这个传一个足够大的参数
- 直接使用spawn，放弃使用exec

我觉得最优的方案是直接使用spawn，解除maxBuffer的限制。但是实际处理中，发现直接考出normalizeExecArgs这个方法去处理平台问题，在win下还是有些不好用，mac下没有问题。所以暂时将maxBuffer设置了一个极大值，保证大家的正常使用。然后后续在优化成spawn方法。

吐槽
其实没有怎么理解，execFile对于spawn封装加maxBuffer的这个逻辑，而且感觉就算加了，是否也可以给一个方式，去掉maxBuffer的限制。

难道是子进程的log量会影响性能？