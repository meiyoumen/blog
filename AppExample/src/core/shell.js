/**
 ipcRenderer    从渲染器进程到主进程的异步通信。
 remote         在渲染进程中使用主进程模块。
 */

const {remote, ipcRenderer} = require('electron')
let {BrowserWindow, getGlobal} = remote

let userName = getGlobal('userName')
console.log(userName) // main process 获取主进程共享信息

// ipcRenderer.on('inter-renderer-message', (event, message) => {
//   console.log('[inter-renderer-message]', message)
//   flux.dispatch[message.method](message.data)
// })

// 监听主进程消息自定义
ipcRenderer.on('new-messages', function (event, message) {
  vm.$data.msg = message.type + ' - ' + message.now
  console.log('接收主进程消息:', message)
})


// 监听主进程消息
ipcRenderer.on('main-process-messages', function (event, message) {
  console.log('接收主进程消息:', message) // 窗口创建成功！
})

// 向主进程main.js发送消息
function sendMsgToMainProcess(type) {
  ipcRenderer.send('sendMsgToMainProcess', {type, now: Date.now()})
}

let WindowByBrowserWindow = null

function openWindowByBrowserWindow(url) {
  WindowByBrowserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    //5.x 要配置，否则无法使用require
    webPreferences: {
      nodeIntegration: true          // 注入node模块(兼容5.x版)
    }
  })
  WindowByBrowserWindow.loadURL('http://127.0.0.1:8080/src/' + url + '?' + Date.now())
  WindowByBrowserWindow.on('close', () => {
    WindowByBrowserWindow = null
  })
  WindowByBrowserWindow.webContents.openDevTools()
}

function sendToSecond() {
  WindowByBrowserWindow.send('new-messages', 'I am index.html')
}


function sendSubWindowMsg() {
  let wins = remote.getCurrentWindow().getChildWindows()
  if (wins.length) {
    wins.forEach((w) => {
      w.send('new-messages', 'I am index.html')
    })
  }
}

// 获取主进程global信息
function getGlobalData() {
  console.log('data:', getGlobal('sharedObject').newTel, 'version:', remote.app.getVersion())
}

function updateGlobalData() {
  getGlobal('sharedObject').newTel = 'I am index.html'
}


/*
渲染进程与渲染进程通信
最佳实践：渲染进程A通过remote模块，获取到需要目标窗口的webContents对象，然后通过webContents向目标窗口的发送消息。目标窗口使用ipcRenderer监听事件。
 */
function renderTorender() {
  console.log(1234)
  const allWindows = remote.BrowserWindow.getAllWindows()
  //const targetId = 2;
  const targetTitle = '3-app-sub-window'
  let targetWindow = allWindows.find(w => w.getTitle() === targetTitle)
  if (targetWindow) {
    targetWindow.webContents.send('theme-change', {type: 'ipc', msg: 'renderTorender'})
  } else {
    console.error('窗口不存在')
  }
}

ipcRenderer.on('theme-change', (e, theme) => {
  console.log('theme-change', theme)
})

// end 渲染进程与渲染进程通信

let win = remote.getCurrentWindow() // BrowserWindow 实例


