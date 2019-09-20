function toStringType (val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

export function type(obj) {
  /*
   * 每个对象都会从Object上继承到toString()方法，
   * 如果这个方法没有被这个对象自身或者更接近的上层原型上的同名方法覆盖(遮蔽)，
   * 则调用该对象的toString()方法时会返回"[object type]"
   * */
  // DOM元素
  if (obj instanceof Element) {
    return 'element'
  }
  return {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Math]': 'math',
    '[object JSON]': 'json',
    '[object Arguments]': 'arguments',
    '[object Date]': 'date'
  }[Object.prototype.toString.call(obj)]
}

export const isArray = Array.isArray

export function isObject(arg) {
  return (arg !== null) && (toStringType (arg) == 'object')
}

export function isFunction(arg) {
  return typeof arg === 'function'
}

const PROMISE = Promise
const promise = {
  resolve: PROMISE.resolve.bind(PROMISE),
  reject: PROMISE.reject.bind(PROMISE),
  all: PROMISE.all.bind(PROMISE),
  then: (resolve, reject) => {
    return new PROMISE(resolve, reject)
  }
}

export function toPromise(target, methods) {
  let dist = Object.create(null)
  methods.forEach((name) => {
    dist[name] = function (...args) {
      return promise.then((resolve, reject) => {
        try {
          return resolve(target[name].apply(target, args))
        } catch (err) {
          return reject(err)
        }
      })
    }
  })
  return dist
}
