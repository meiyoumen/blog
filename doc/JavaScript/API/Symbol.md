ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，==保证每个属性的名字都是独一无二的就好了==，这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因。  

ES6 引入了一种新的原始数据类型==Symbol==，==表示独一无二的值  
它是 JavaScript 语言的第==七种数据类型==，前六种是：
- undefined
- null
- 布尔值（Boolean）
- 字符串（String）
- 数值（Number）
- 对象（Object）

Symbol 值通过==Symbol函数生成==。这就是说，对象的属性名现在可以有两种类型:
- 一种是==原来就有的字符==串
- 另一种就是==新增的 Symbol 类型==。  

凡是属性名属于 Symbol类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

```js
let s = Symbol();

typeof s
// "symbol"
```


上面代码中，变量s就是一个独一无二的值。typeof运算符的结果，表明变量s是 Symbol 数据类型，而不是字符串之类的其他类型。

**注意:**
Symbol函数前==不能使用new命==令，==否则会报错==。这是因为生成的 Symbol 是一个原始类型的值，不是对象。也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，==它是一种类似于字符串的数据类型==。

Symbol函数==可以接受一个字符串作为参数==，表示对 ==Symbol 实例的描==述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。


```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

上面代码中，s1和s2是两个 Symbol 值。
- 如果不加参数，它们在控制台的输出都是Symbol()，不利于区分。
- 有了参数以后，就等于为它们加上了描述，输出的时候就能够分清，到底是哪一个值。

如果 ==Symbol 的参数是一个对象==，就会调用==该对象的toString方法，将其转为字符串==，然后才生成一个 Symbol 值。

```js
const obj = {
  toString() {
    return 'abc';
  }
};
const sym = Symbol(obj);
sym // Symbol(abc)
```

注意，Symbol函数的==参数==只是表示对当前==Symbol 值的描==述，因此==相同参数==的Symbol函数的==返回值是不相等的==。


```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 // false
```

上面代码中，s1和s2都是Symbol函数的返回值，而且参数相同，但是它们是不相等的。

==Symbol 值不能与其他类型的值进行运算==，会报错。


```js
let sym = Symbol('My symbol');

"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```

但是，Symbol 值可以显式转为字符串。


```js
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```

另外==，Symbol 值也可以转为布尔值，但是不能转为数值==。


```js
let sym = Symbol();
Boolean(sym) // true
!sym  // false

if (sym) {
  // ...
}

Number(sym) // TypeError
sym + 2 // TypeError
```


## Symbol.prototype.description
创建 Symbol 的时候，可以添加一个描述。


```js
const sym = Symbol('foo');
```

上面代码中，sym的描述就是字符串foo。

但是，读取这个描述需要将 Symbol 显式转为字符串，即下面的写法。


```js
const sym = Symbol('foo');

String(sym) // "Symbol(foo)"
sym.toString() // "Symbol(foo)"
```

上面的用法不是很方便。ES2019 提供了一个实例属性description，直接返回 Symbol 的描述。


```js
const sym = Symbol('foo');

sym.description // "foo"
```
