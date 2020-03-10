
```js
// erum.js
export default function enum(object) {
  return new Proxy(object, {
    get(target, prop) {
      if (target[prop]) {
        return Reflect.get(target, prop)
      } else {
        throw new ReferenceError(`Unknown enum '${prop}'`)
      }
    },

    set() {
      throw new TypeError('Enum is readonly')
    },

    deleteProperty() {
      throw new TypeError('Enum is readonly')
    }
  })
}
```
拓展一下的话，我们是不是可以写个类型校验库，在这里我们就不展开了。

## 测试，Mock
利用 apply 钩子，Proxy 可以检测一个函数的调用情况。

下面是一个简单的，用于单元测试的 spy 库。他可以获取函数的调用次数，以及调用时的参数等。


```js
// spy.js
export function spy() {
  const spyFn = function() {}
  spyFn.toBeCalledTimes = 0
  spyFn.lastCalledWith = undefined

  return new Proxy(spyFn, {
    apply(target, thisArg, argumentsList) {
      target.toBeCalledTimes += 1
      target.lastCalledWith = argumentsList.join(', ')
    }
  })
}

// spy.test.js
const colors = ['red', 'blue']
const callback = spy()

colors.forEach(color => callback(color))

expect(callback.toBeCalledTimes).toBe(colors.length)
expect(callback.lastCalledWith).toBe(colors[1])
```

## Observe，响应式系统
用 Proxy 来实现一个 pub/sub 模式也是挺简单的。


```js
// observe.js
export function observe(target, onChange) {
  return createProxy(target, onChange)
}

function createProxy(target, onChange) {
  const trap = {
    get(object, prop) {
      const value = object[prop]

      // 这里可以优化一下，不应该每次都创建新的 proxy
      if (typeof value === 'object' && value !== null) {
        return createProxy(object[prop], onChange)
      }

      return value
    },

    set(object, prop, value, ...args) {
      onChange()
      return Reflect.set(object, prop, value, ...args)
    }
  }

  return new Proxy(target, trap)
}

// observe.test.js
test('observe', () => {
  const stub = jest.fn()
  const data = {
    user: {
      name: 'foo',
    },
    colors: ['red'],
  }

  const reactiveData = observe(data, stub)

  // push 会触发两次 set 钩子
  // 第一次把 colors 的 2 属性设置为 'blue'
  // 第二次把 colors 的 length 属性设置为 2
  reactiveData.colors.push('blue')

  reactiveData.user.name = 'baz'

  // 动态增加一个新的属性
  reactiveData.type = 'zzz'

  expect(stub).toHaveBeenCalledTimes(4)
})
```

从上面可以发现，Proxy 不仅可以代理对象，也可以代理数组；还可以代理动态增加的属性如 type 。这也是 Object.defineProperty 做不到的。

加个依赖追踪的话，我们就可以实现一个类似 Vue 或者 Mobx 的响应式系统了。