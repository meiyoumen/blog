let DEBUG_MODE = 1
class Flux {
  constructor (win, ipcRenderer) {
    this.ipcRenderer = ipcRenderer
    this.win = win
    this.name = 'AppElectronDemo'
    this.process = window.process
    this.rpcService = {}
    this.dispatch = {}
    this.init()
  }

  init () {
    this.recv()
    this.setDispatch()
    this.setRpc()
    this.setModule()
    this.rpcService.onRequest = this.dispatch
  }

  recv () {
    // this.ipcRenderer.on('inter-renderer-message', (event, message) => {
    //   console.log('[inter-renderer-message]', message)
    //   flux.dispatch[message.method](message.data)
    // })

    this.ipcRenderer.on('inter-renderer-message', (event, message) => {
      console.log('[inter-renderer-message]', message)
      if (message.type === 1) {
        if (DEBUG_MODE) { console.log('[IPC request] ', message) }
        this.rpcService._onRequest(message)
      } else if (message.type === 2) {
        if (DEBUG_MODE) { console.log('[IPC response] ', message) }
        this.rpcService.callbacks[message.uuid][message.status](message.data)
        delete this.rpcService.callbacks[message.uuid]
      } else {
        if (DEBUG_MODE) { console.log('[IPC message] ', message) }
        if (this.rpcService.onData && typeof this.rpcService.onData === 'function') {
          this.rpcService.onData(message.data)
        }
      }
    })
  }

  setRpc () {
    let me = this
    this.rpcService = {
      callbacks: {},
      srcId: this.win.id,
      send (dstId, data) {
        const message = {srcId: this.srcId, dstId, type: 3, data}
        me.ipcRenderer.send('inter-renderer-message', message)
      },
      call (dstId, method, data, timeout) {
        const query = {
          srcId: this.srcId,
          dstId,
          uuid: uuidv4(),
          type: 1,  // 1 请求 2 响应 3 消息
          method,
          data
        }
        me.ipcRenderer.send('inter-renderer-message', query)
        return new Promise((resolve, reject) => {
          this.callbacks[query.uuid] = [resolve, reject]
          if (timeout) {
            setTimeout(() => {
              reject(new Error('[RPC] 调用其他渲染进程方法失败'))
              delete this.callbacks[query.uuid]
            }, timeout)
          }
        })
      },
      _onRequest (message) {
        ;[message.type, message.dstId, message.srcId] = [2, message.srcId, message.dstId]
        this.onRequest[message.method](message.data).then(response => {
          message.status = 0 // 成功为 0 失败为 1
          message.data = response
          me.ipcRenderer.send('inter-renderer-message', message)
        }).catch(err => {
          message.status = 1
          if (err instanceof Error) { err = err.message }
          message.data = err
          me.ipcRenderer.send('inter-renderer-message', message)
        })
      },
      // 占位用，实际实现由外部提供(重写)
      onRequest (method, data) {
        if (DEBUG_MODE) { console.log('onRequest', method, data) }
        return Promise.resolve()
      }
    }
  }

  setModule () {
    this.studyModule = {
      dispatch (method, payload) {
        return flux.rpcService.call(1, method, payload)
      }
    }
  }

  setDispatch() {
    let me = this
    this.dispatch = {
      showName (payload) {
        console.log(me.name)
        return new Promise((resolve, reject) => {
          if (payload) {
            me.name = payload
            return resolve(me.name)
          }
          if (me.name) {
            return resolve(me.name)
          }
          reject('error name')
        })
      }
    }
  }
}

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

let flux = new Flux(win, ipcRenderer)
window.flux = flux
