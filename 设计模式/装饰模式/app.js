(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

var _dec;
var _dec2;
var _dec3;
var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

/**
 https://juejin.im/post/5cb7cc7e518825329c3eaab0
 Decorator 函数签名如下：
 @param   target  作用对象
 @param   prop    作用的属性名
 @param   descriptor  属性描述符
 function decorator(target,prop,descriptor){}

 target ： 作用的对象，有如下情况：
   作用于 class 时，target 为该 class 函数
   作用于 class 中的函数、属性 时，target 为该 class 的 prototype 对象
   作用于 对象字面量中的函数、属性 时，target 为该对象
 prop ： 描述的属性名，若decorator作用于class时，该参数为空
 descriptor ： 属性原本的描述符，该描述符可通过 Object.getOwnPropertyDescriptor() 获取，若decorator作用于class时，该参数为空
 */

let log = type => {
  return (target, name, descriptor) => {
    const method = descriptor.value;
    descriptor.value = (...args) => {
      console.info(`(${type}) 正在执行: ${name}(${args}) = ?`);
      let ret;
      try {
        ret = method.apply(target, args);
        console.info(`(${type}) 成功 : ${name}(${args}) => ${ret}`);
      } catch (error) {
        console.error(`(${type}) 失败: ${name}(${args}) => ${error}`);
      }
      return ret;
    };
  };
};
let IronMan = (_dec = log('IronMan 自检阶段'), _dec2 = log('IronMan 攻击阶段'), _dec3 = log('IronMan 机体报错'), (_class = class IronMan {
  check() {
    return '检查完毕';
  }

  attack() {
    return '击倒敌人';
  }

  error() {
    throw 'Something is wrong!';
  }
}, (_applyDecoratedDescriptor(_class.prototype, 'check', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'check'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'attack', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'attack'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'error', [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, 'error'), _class.prototype)), _class));


let tony = new IronMan();
tony.check();
tony.attack();
tony.error();

// 输出：
// (IronMan 自检阶段) 正在执行: check() = ?
// (IronMan 自检阶段) 成功 : check() => 检查完毕
// (IronMan 攻击阶段) 正在执行: attack() = ?
// (IronMan 攻击阶段) 成功 : attack() => 击倒敌人
// (IronMan 机体报错) 正在执行: error() = ?
// (IronMan 机体报错) 失败: error() => Something is wrong!

})));
//# sourceMappingURL=app.js.map
