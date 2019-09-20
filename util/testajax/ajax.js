/**
 *AJAX——核心XMLHttpRequest对象
 *http://blog.csdn.net/liujiahan629629/article/details/17126727
 *
 *XMLHttpRequest2 新技巧
 * https://www.html5rocks.com/zh/tutorials/file/xhr2/
 *
 * https://xhr.spec.whatwg.org/#interface-formdata
 *
 * 你真的会使用XMLHttpRequest吗？*****
 * https://segmentfault.com/a/1190000004322487
 */

function param(object) {
  let encodedString = ''
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (encodedString.length > 0) {
        encodedString += '&'
      }
      encodedString += encodeURIComponent(prop + '=' + object[prop])
    }
  }
  return encodedString
}

function ajax(opts) {
  let method = (opts.method || 'GET').toUpperCase(),
    dataType = (opts.dataType || "JSON").toUpperCase(),
    url = opts.url,
    params = param(opts.data),
    timeout = opts.timeout,

    isGet = method === 'GET',
    isPost = method === 'POST'

  //1***** 创建连接
  let xhr = new XMLHttpRequest()

  //2***** 连接服务器,默认请为异步
  xhr.open(method, url, true)

  //设置响应头
  if (opts.headers) {
    for (let x in opts.headers) {
      xhr.setRequestHeader(x, opts.headers[x])
    }
  }

  //3***** 发送请求
  if (isGet) {
    xhr.send(null)

  } else if (isPost) {
    /**
     使用 POST 方法，并设置 enctype 属性为 application/x-www-form-urlencoded (默认)
     使用 POST 方法，并设置 enctype 属性为 text/plain
     使用 POST 方法，并设置 enctype 属性为 multipart/form-data
     */
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(params)
  }

  //4***** 接收返回值
  xhr.onreadystatechange = function () {
    /**
     * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
     1：open方法成功调用，但Sendf方法未调用；
     2：send方法已经调用，尚未开始接受数据；
     3：正在接受数据。Http响应头信息已经接受，但尚未接收完成；
     4：完成，即响应数据接受完成。
     */
    if (xhr.readyState === 2) {
      let headers = xhr.getAllResponseHeaders()
      console.log(headers)
    }

    /**
     * xhr.readyState===4 才会被调用
     */
    xhr.onload = function () {
      /**
       * xhr.status 服务器返回的http状态码
       * xhr.statusText 状态码相对应的文字消息 200表示“成功”，404表示“未找到”，500表示“服务器内部错误”等
       */
      let status = xhr.status
      if (status >= 200 && status < 300) {
        let data = xhr.response
        try {
          if (dataType === 'JSON') {
            data = JSON.parse(xhr.responseText)
          } else if (dataType === 'XML') {
            data = xhr.responseXML
          } else if (dataType === 'TEXT') {
            data = xhr.responseText
          } else if (dataType === 'BINARY') {
            let arrayBuffer = new Uint8Array(data)
            let str = ''
            for (let i = 0; i < arrayBuffer.length; i++) {
              str += String.fromCharCode(arrayBuffer[i])
            }
            data = str
          }
        } catch (err) {
          throw new Error(err)
          xhr.abort()
        }
        opts.success && opts.success(data)
      } else {
        opts.fail && opts.fail(status)
      }
    }
  }
}

