## 一. IndexedDB介绍

IndexedDB是一个基于JavaScript的面向对象的事务型数据库系统。
IndexedDB 分别为同步和异步访问提供了单独的 API 。同步 API 本来是要用于仅供 Web Workers 内部使用，但是还没有被任何浏览器所实现。异步 API 在 Web Workers 内部和外部都可以使用。

## 二. 异步API

异步 API 方法调用完后会立即返回，而不会阻塞调用线程。要异步访问数据库，要调用 window 对象 indexedDB 属性的 open() 方法。该方法返回一个 IDBRequest 对象 (IDBOpenDBRequest)；异步操作通过在 IDBRequest 对象上触发事件来和调用程序进行通信。

以下是异步使用IndexedDB时的相关类

- IDBFactory 提供了对数据库的访问。这是由全局对象 indexedDB 实现的接口，因而也是该 API 的入口。
- IDBCursor 遍历对象存储空间和索引。
- IDBCursorWithValue 遍历对象存储空间和索引并返回游标的当前值。
- IDBDatabase 表示到数据库的连接。只能通过这个连接来拿到一个数据库事务。
- IDBEnvironment 提供了到客户端数据库的访问。它由 window 对象实现。
- IDBIndex 提供了到索引元数据的访问。
- IDBKeyRange 定义键的范围。
- IDBObjectStore 表示一个对象存储空间。
- IDBOpenDBRequest 表示一个打开数据库的请求。
- IDBRequest 提供了到数据库异步请求结果和数据库的访问。这也是在你调用一个异步方法时所得到的。
- IDBTransaction 表示一个事务。你在数据库上创建一个事务，指定它的范围（例如你希望访问哪一个对象存储空间），并确定你希望的访问类型（只读或写入）。
- IDBVersionChangeEvent 表明数据库的版本号已经改变。

## 早期版本中的下面这些现接口已经被删除：

- IDBVersionChangeRequest 表示更改数据库版本号的请求。更改数据库版本的方式已经自此改变了(调用 IDBFactory.open() 而不需要再调用 IDBDatabase.setVersion())，并且 IDBOpenDBRequest 接口现在具有已经移除的 IDBVersionChangeRequest 的功能。
- IDBDatabaseException 表示在执行数据库操作时可能碰到的异常情况。
- 规范里面还定义了 API 的同步版本。同步 API 还没有在任何浏览器中得以实现。它原本是要和 WebWorkers 一起使用的。


## 三. 操作数据库

#### 1.打开数据库

示例代码：

// 打开我们的数据库

```
var openDBRequest = window.indexedDB.open("MyTestDatabase", 3);
```

indexedDB是IDBFactory类型，它有一个open方法，用于打开或者创建并打开指定的数据库（如果该数据库不存在，则会被创建；如果已经存在，则被打开）。

open 请求不会立即打开数据库或者开始一个事务。 对 open() 函数的调用会返回一个我们可以作为事件来处理的包含 result（成功的话）或者错误值的 IDBOpenDBRequest 对象。在 IndexedDB 中的大部分异步方法做的都是同样的事情 - 返回一个包含 result 或错误的 IDBRequest 对象。open 函数的结果是一个 IDBDatabase对象的实例。

该 open 方法接受第二个参数，就是数据库的版本号。这样我们就可以更新数据库的 schema ，也就是说如果我们打开的数据库不是我们期望的最新版本的话，我们可以对 object store 进行创建或是删除。在这种情况下，我们实现一个 onupgradeneeded 处理函数，在一个允许操作 object stores 的 versionchange 事务中 - 我们在后面的 更新数据库的版本号中会提到更多有关这方面的内容。

#### 2. 添加处理函数

为了得打开数据库的结果，我们需要给openDBRequest添加相关的事件处理程序：


```
openDBRequest.onerror = function(event) {
  // Do something with request.errorCode!
};
openDBRequest.onsuccess = function(event) {
  // Do something with request.result!
};
```

这两个函数的哪一个，onsuccess() 还是 onerror()，会被调用呢？如果一切顺利的话，一个 success 事件（即一个 type 属性被设置成 "success" 的 DOM 事件）会被触发，使用 request 作为它的 target。 一旦它被触发的话，相关 request 的 onsuccess() 函数就会被触发，使用 success 事件作为它的参数。 否则，如果不是所有事情都成功的话，一个 error 事件（即 type 属性被设置成 "error" 的 DOM 事件） 会在 request 上被触发。这将会触发使用 error 事件作为参数的 onerror() 方法。

#### 3. 创建和更新数据库版本号

要更新数据库的 schema，也就是创建或者删除对象存储空间，需要实现 onupgradeneeded 处理程序，这个处理程序将会作为一个允许你处理对象存储空间的 versionchange 事务的一部分被调用。


```
openDBRequest.onupgradeneeded = function(event) { 
   // 更新对象存储空间和索引 .... 
};
```

在onupgradeneeded处理程序中，openDBRequest的result属性是IDBDatabase类型；

在数据库第一次被打开时或者当指定的版本号高于当前被持久化的数据库的版本号时，这个 versionchange 事务将被创建。
版本号是一个 unsigned long long 数字，这意味着它可以是一个非常大的整数。

#### 4. 构建数据库

现在来构建数据库。IndexedDB 使用对象存储空间而不是表，并且一个单独的数据库可以包含任意数量的对象存储空间。每当一个值被存储进一个对象存储空间时，它会被和一个键相关联。键的提供可以有几种不同的方法，这取决于对象存储空间是使用 key path 还是 key generator。

你也可以使用对象存储空间持有的对象，不是基本数据类型，在任何对象存储空间上创建索引。索引可以让你使用被存储的对象的属性的值来查找存储在对象存储空间的值，而不是用对象的键来查找。

此外，索引具有对存储的数据执行简单限制的能力。通过在创建索引时设置 unique 标记，索引可以确保不会有两个具有同样索引 key path 值的对象被储存。因此，举例来说，如果你有一个用于持有一组 people 的对象存储空间，并且你想要确保不会有两个拥有同样 email 地址的 people，你可以使用一个带有 unique 标识的索引来确保这些。

这听起来可能有点混乱，但下面这个简单的例子应该可以演示这些个概念：

// 我们的客户数据看起来像这样。

```js
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];
const dbName = "the_name";

var request = indexedDB.open(dbName, 2);

request.onerror = function(event) {
  // 错误处理程序在这里。
};
request.onupgradeneeded = function(event) {
  //request(即event.target)的result属性是IDBDatabase类型；
  var db = event.target.result;

  // 创建一个对象存储空间来持有有关我们客户的信息。
  // 我们将使用 "ssn" 作为我们的 key path 因为它保证是唯一的。
  // createObjectStore()方法返回的是IDBObjectStore类型的对象；
  var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

  // 创建一个索引来通过 name 搜索客户。
  // 可能会有重复的，因此我们不能使用 unique 索引。
  objectStore.createIndex("name", "name", { unique: false });

  // 创建一个索引来通过 email 搜索客户。
  // 我们希望确保不会有两个客户使用相同的 email 地址，因此我们使用一个 unique 索引。
  objectStore.createIndex("email", "email", { unique: true });

  // 在新创建的对象存储空间中保存值
  for (var i in customerData) {
    objectStore.add(customerData[i]);
  }
};
```

正如前面提到的，onupgradeneeded 是我们唯一可以修改数据库结构的地方。在这里面，我们可以创建和删除对象存储空间以及构建和删除索引。

对象存储空间仅调用 createObjectStore() 就可以创建。这个方法使用存储空间的名称，和一个对象参数。即便这个参数对象是可选的，它还是非常重要的，因为它可以让你定义重要的可选属性和完善你希望创建的对象存储空间的类型。在我们的示例中，我们请求了一个名为“customers” 的对象存储空间并且定义了一个 使得存储空间中每个单独的对象都是唯一的属性作为 key path。在这个示例中的属性是 “ssn”，因为社会安全号码被确保是唯一的。被存储在对象存储空间中的所有对象都必须存在“ssn”。
我们也请求了一个名为 “name” 的着眼于存储的对象的 name 属性的索引。如同 createObjectStore()，createIndex() 使用了一个完善了我们希望创建的索引类型的可选的 options 对象。添加一个不带 name 属性的对象也会成功，但是这个对象不会出现在 "name" 索引中。

我们现在可以使用存储的用户对象的 ssn 直接从对象存储空间中把它们提取出来，或者通过使用索引来使用他们的 name 进行提取。

#### 5. 增删改查

在你可以对新数据库做任何事情之前，你需要开始一个事务。事务来自于数据库对象，而且你必须指定你想让这个事务跨越哪些对象存储空间。另外，你需要决定你是否将要对数据库进行更改或者你只是需要从它里面进行读取。虽然事务具有三种模式（只读，读写，和版本变更），在可以的情况下你最好还是使用只读事务，因为它们可以并发运行。

##### 5.1 向数据库中增加数据

如果你刚刚创建了一个数据库，你可能想往里面写点东西。看起来会像下面这样:


```js
//transaction()方法返回的是IDBTransaction类型的对象
var transaction = db.transaction(["customers"], "readwrite");
// 注意: 旧版实验性的实现使用不建议使用的常量 IDBTransaction.READ_WRITE 而不是 "readwrite"。
// 如果你想支持这样的实现，你只要这样写就可以了： 
// var transaction = db.transaction(["customers"], IDBTransaction.READ_WRITE);
```

transaction() 方法接受三个参数（虽然两个是可选的）并返回一个IDBTransaction类型的事务对象。第一个参数是事务希望跨越的对象存储空间的列表。如果你希望事务能够跨越所有的对象存储空间你可以传入一个空数组。如果你没有为第二个参数指定任何内容，你得到的是只读事务。因为这里我们是想要写入所以我们需要传入 "readwrite" 标识。

现在我们已经有了一个事务，我们需要理解它的生命周期。事务和事件循环的联系非常密切。如果你创建了一个事务但是并没有使用它就返回给事件循环，那么事务将变得无效。保持事务活跃的唯一方法就是在其上构建一个请求。当请求完成时你将会得到一个 DOM 事件，并且，假设请求成功了，你将会有另外一个机会在回调中来延长这个事务。如果你没有延长事务就返回到了事件循环，那么事务将会变得不活跃，依此类推。只要还有待处理的请求事务就会保持活跃。事务生命周期真的很简单但是可能需要一点时间你才能对它变得习惯。还有就是来几个例子也会有所帮助。如果你开始看到 TRANSACTION_INACTIVE_ERR 错误代码，那么你已经把某些事情搞乱了。

事务可以接收三种不同类型的 DOM 事件： error，abort，以及 complete。我们已经讨论过 error事件冒泡，所以一个事务要接收所有可能产生错误事件的请求所产生的错误事件。更微妙的一点是一个 error 的默认行为是终止发生错误的事务。除非你在 error 事件上通过调用 preventDefault() 处理了这个错误，整个事务被回滚了。这样的设计迫使你去思考和处理错误，但是如果细粒度的错误处理太过繁琐的话，你也可以总是对数据库添加一个总的错误处理程序。如果你不处理一个错误事件或者你在事务中调用 abort()，那么事务被回滚并且有关事物的一个 abort 事件被触发。否则，在所有的未处理请求都完成后，你将得到一个 complete 事件。如果你正在做大量的数据库操作，那么追踪事务而不是单个的请求当然可以帮助你进行决断。

现在你有了一个事务了，你将需要从它拿到一个对象存储空间。事务只能让你拿到一个你在创建事务时已经指定过的对象存储空间。然后你可以增加所有你需要的数据。


```js
// 当所有的数据都被增加到数据库时执行一些操作
transaction.oncomplete = function(event) {
  alert("All done!");
};

transaction.onerror = function(event) {
  // 不要忘记进行错误处理！
};


//因为transaction可以跨越多个对象存储空间（IDBObjectStore类型的对象），所以，当需要获取特定的对象存储空间时还需要再通过事务对象transaction的objectStore()方法来获取；
var objectStore = transaction.objectStore("customers");
for (var i in customerData) {
  var request = objectStore.add(customerData[i]);
  request.onsuccess = function(event) {
    // event.target.result == customerData[i].ssn
  };
}

```

产生自 add() 调用的请求的 result 是被添加的值的键。因此在这种情况下，它应该等于被添加的对象的 ssn 属性， 因为对象存储空间使用 ssn 属性作为 key path。 注意 add() 函数要求数据库中不能已经有相同键的对象存在。如果你正在试图修改一个现有条目，或者你并不关心是否有一个同样的条目已经存在，使用 put()函数。

##### 5.2从数据库中删除数据

删除数据是非常类似的：


```js
var request = objectStore.delete("444-44-4444");
                
request.onsuccess = function(event) {
  // 删除数据成功！
};
```

##### 5.3 从数据库中获取数据

现在数据库里已经有了一些信息，你可以通过几种方法对它进行提取。首先是简单的 get()。你需要提供键来提取值，像这样：


```js
var request = objectStore.get("444-44-4444");
request.onerror = function(event) {
  // 错误处理!
};
request.onsuccess = function(event) {
  // 对 request.result 做些操作！
  alert("Name for SSN 444-44-4444 is " + request.result.name);
};
```

5.4 使用游标

使用 get() 要求你知道你想要检索哪一个键。如果你想要遍历对象存储空间中的所有值，那么你可以使用游标。看起来会像下面这样：


```js
//openCursor()方法返回一个IDBRequest类型的请求对象cursorRequest，如果该请求对象cursorRequest成功，则cursorRequest的result属性是IDBCursorWithValue类型的对象；
var cursorRequest = objectStore.openCursor();

cursorRequest.onsuccess = function(event) {
  //cursorRequest的result属性是IDBCursorWithValue类型的对象
  var cursor = event.target.result;
  if (cursor) {
    alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
    cursor.continue();
  }
  else {
    alert("No more entries!");
  }
};
```

openCursor() 函数需要几个参数。首先，你可以使用一个 key range 对象来限制被检索的项目的范围。第二，你可以指定你希望进行迭代的方向。在上面的示例中，我们在以升序迭代所有的对象。游标成功的回调有点特别。游标对象本身是请求的 result （上面我们使用的是简写形式，所以是 event.target.result）。然后实际的 key 和 value 可以根据游标对象的 key 和 value 属性被找到。如果你想要保持继续前行，那么你必须调用游标上的 continue() 。当你已经到达数据的末尾时（或者没有匹配 openCursor() 请求的条目）你仍然会得到一个成功回调，但是 result 属性是 undefined。

默认情况下，每个游标只发起一次请求。要想发起另一次请求，必须调用游标的下面2个方法之一：

- continue(key):移动到结果集中的下一项。参数 key 是可选的，不指定这个参数，游标移动 到下一项;指定这个参数，游标会移动到指定键的位置。
- advance(count):向前移动 count 指定的项数。这两个方法都会导致游标使用相同的请求，因此相同的 onsuccess 和 onerror 事件处理程序也会得到重用。

