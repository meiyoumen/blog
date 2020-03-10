1.for ... in 循环遍历对象自身的和继承的可枚举属性(不含Symbol属性).

2.Obejct.keys(obj),返回一个数组,包括对象自身的(不含继承的)所有可枚举属性(不含Symbol属性).

3.Object.getOwnPropertyNames(obj),返回一个数组,包含对象自身的所有属性(不含Symbol属性,但是包括不可枚举属性).

4.Object.getOwnPropertySymbols(obj),返回一个数组,包含对象自身的所有Symbol属性.

5.Reflect.ownKeys(obj),返回一个数组,包含对象自身的所有属性,不管属性名是Symbol或字符串,也不管是否可枚举.

6.Reflect.enumerate(obj),返回一个Iterator对象,遍历对象自身的和继承的所有可枚举属性(不含Symbol属性),与for ... in 循环相同.