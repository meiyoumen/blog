import {isFunction, isObject, isArray} from './type'
/*
 * 总结一下实现深复制的的基本思路：
 1.检测当前属性是否为对象
 2.因为数组是特殊的对象，所以，在属性为对象的前提下还需要检测它是否为数组。
 3.如果是数组，则创建一个[]空数组，否则，创建一个{}空对象，并赋值给子对象的当前属性。然后，递归调用extend函数。

 推荐使用ES5
 * */

/*
 * jQuery实现方式
 * */
export function extend() {
  /*
   extend(true,{},copyObj)

   deep是否深度操作   //true
   　　target被扩展的对象 // {}
   被拷贝的对象      // copyObj
   　　length参数的数量
   　　*/
  var src, copyIsArray, copy, name, options, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  // target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
  // deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
  // 然后把第二个参数赋值给target
  if (typeof target === "boolean") {
    deep = target;

    // skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  // target既不是对象也不是函数则把target设置为空对象。
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  // 如果只有一个参数，则把jQuery对象赋值给target，即扩展到jQuery对象上
  if (i === length) {
    target = this;
    i--;// i减1，指向被扩展对象
  }

  //开始遍历需要被扩展到target上的参数
  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        src = target[name];    // 根据被扩展对象的键获得目标对象相应值，并赋值给src
        copy = options[name];  // 得到被扩展对象的值

        // Prevent never-ending loop
        //@todo这里为什么是比较target和copy？不应该是比较src和copy吗？
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        // 当用户想要深度操作时，递归合并
        // copy是纯对象或者是数组
        if (deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) )) {
          if (copyIsArray) { 　// 如果是数组
            copyIsArray = false;　// 将copyIsArray重新设置为false，为下次遍历做准备。
            clone = src && isArray(src) ? src : [];  // 判断被扩展的对象中src是不是数组

          } else {
            clone = src && isObject(src) ? src : {}; // 判断被扩展的对象中src是不是纯对象
          }

          // Never move original objects, clone them
          // 递归调用extend方法，继续进行深度遍历
          target[name] = extend(deep, clone, copy);

          // Don't bring in undefined values
          // 如果不需要深度复制，则直接把copy（第i个被扩展对象中被遍历的那个键的值）
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  // 原对象被改变，因此如果不想改变原对象，target可传入{}
  return target;
}

/**
 * ES5新增的JSON对象提供的两个方法也可以实现深度复制，分别是
 * JSON.stringify() 用来将对象转成字符串
 * JSON.parse()     把字符串转换成对象
 */

export function jsonExtendDeep(parent, child = {}) {
  let [i, proxy] = []
  proxy = JSON.stringify(parent)    // 把parent对象转换成字符串
  proxy = JSON.parse(proxy)         // 把字符串转换成对象，这是parent的一个副本

  for (i in proxy) {
    if (proxy.hasOwnProperty(i)) {
      child[i] = proxy[i]
    }
  }

  proxy = null                      // 因为proxy是中间对象，可以将它回收掉

  return child
}
