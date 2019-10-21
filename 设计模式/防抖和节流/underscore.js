/**
 * https://juejin.im/post/5cbc68095188251ae95d3f4a#heading-5
 * https://www.cnblogs.com/yangzhou33/p/8910945.html
 */
const throttle = function(func, wait, options) {
  //timeout存储定时器  context存储上下文 args存储func的参数  result存储func执行的结果
  let timeout, context, args, result;

  // 上一次执行回调的时间戳
  let previous = 0;

  // 无传入参数时，初始化 options 为空对象
  if (!options) options = {};

  //定时器函数
  let later = () => {
    // 当设置 { leading: false } 时
    // 每次触发回调函数后设置 previous 为 0
    // 不然为当前时间
    previous = options.leading === false ? 0 : Date.now();

    // 防止内存泄漏，置为 null 便于后面根据 !timeout 设置新的 timeout
    timeout = null;

    // 执行函数
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  // 每次触发事件回调都执行这个函数
  // 函数内判断是否执行 func
  // func 才是我们业务层代码想要执行的函数
  let throttled = function() {

    // 记录当前时间
    let now = Date.now();

    // 第一次执行时（此时 previous 为 0，之后为上一次时间戳）
    // 并且设置了 { leading: false }（表示第一次回调不执行）
    // 此时设置 previous 为当前值，表示刚执行过，本次就不执行了
    //如果第一次不执行，previous等于当前时间
    if (!previous && options.leading === false) previous = now;

    // 距离下次触发 func 还需要等待的时间
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;

    // 要么是到了间隔时间了，随即触发方法（remaining <= 0）
    // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
    // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
    // 之后便会把 previous 值迅速置为 now
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);

        // clearTimeout(timeout) 并不会把 timeout 设为 null
        // 手动设置，便于后续判断
        timeout = null;
      }

      // 设置 previous 为当前时间
      previous = now;

      // 执行 func 函数
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // 最后一次需要触发的情况
      // 如果已经存在一个定时器，则不会进入该 if 分支
      // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
      // 间隔 remaining milliseconds 后触发 later 方法
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  // 手动取消
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  // 执行 _.throttle 返回 throttled 函数
  return throttled;
}

const debounce = function(func, wait, immediate) {
  //timeout存储定时器的返回值  result返回func的结果
  let timeout, result;

  //定时器触发函数
  let later = function(context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  let debounced = restArguments(function(args) {
    //如果存在定时器，先清除原先的定时器
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(later, wait); //启动一个定时器
      if (callNow) result = func.apply(this, args) //如果immediate为true，那么立即执行函数
    } else {
      timeout = _.delay(later, wait, this, args) //同样启动一个定时器
    }

    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};


function restArguments(func, startIndex) {
  //不输入startIndex则自动取最后一个为rest
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  //接受一个函数为参数，返回一个包装后的函数，参数用arguments获取
  return function() {
    let length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length),
      index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      //原函数只接受一个rest参数
      case 0: return func.call(this, rest);
      //原函数接受1个参数 + rest参数
      case 1: return func.call(this, arguments[0], rest);
      //原函数接受2个参数 + rest参数
      case 2: return func.call(this, arguments[0], arguments[1], rest);
    }
    let args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    //原函数接受2个以上参数 + rest参数
    return func.apply(this, args);
  };
};
