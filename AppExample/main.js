/**
 main process：主进程环境下可以访问Node及Native API
 renderer process：渲染器进程环境下可以访问Browser API和Node API及一部分Native API
 可以使用ipcMain和ipcRender 模块发送消息, 使用remote模块进行RPC方式通信

 main process：
   app          负责管理Electron 应用程序的生命周期
   BrowserWindow
     主进程使用 BrowserWindow 实例创建页面。 每个 BrowserWindow 实例都在自己的渲染进程里运行页面。
     当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。

   ipcMain        从主进程到渲染进程的异步通信。
   webContents    webContents 是 EventEmitter 的实例， 负责渲染和控制网页, 是 BrowserWindow 对象的一个属性

 renderer process：
   ipcRenderer  	从渲染器进程到主进程的异步通信。
   remote         在渲染进程中使用主进程模块。
 */

const {app, BrowserWindow, ipcMain, Menu, MenuItem, globalShortcut} = require('electron')


// 全局共享
global.sharedObject = {
  newTel: '000'
}

let mainWindow = null //主窗口
let studyWindow = null  //子窗口

const menu = new Menu()
menu.append(new MenuItem({
  label: 'Open DevTools',
  accelerator: 'Ctrl+Shift+P',
  click: (menuItem, browserWindow) => { browserWindow.webContents.openDevTools() }
}))
Menu.setApplicationMenu(menu)

// 创建窗口
function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,

    webPreferences: {
      nodeIntegration: true,          // 注入node模块(兼容5.x版)
      nodeIntegrationInWorker: true,  // 多线程
      nativeWindowOpen: true,          // window.open窗口
      affinity: 'main-window'       // main window, and addition windows should work in one process
    },
    alwaysOnTop: false,               // 应用是否始终在所有顶层之上
    frame: true,                      // 是否显示窗口边框
    resizable: true,                  // 可否缩放
    movable: true,                    // 可否移动
  })

  // 加载页面
  mainWindow.loadURL('http://127.0.0.1:8080/index.html?' +Date.now())
  mainWindow.webContents.openDevTools()
  /**
   * 当 window 被关闭，这个事件会被触发。
   */
  mainWindow.on('closed', function () {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    mainWindow = null
  })

  mainWindow.once('ready-to-show', function () {
    mainWindow.show()
    //主进程发送消息给渲染进程
    mainWindow.webContents.send('main-process-messages', '窗口创建成功！')
  })

  // 打开窗口  3.0.0版本的支持 1系列不支持
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    console.log(frameName)
    if (frameName === 'modalOpen') {
      // open window as modal
      options.webPreferences.affinity = 'main-window';
      event.preventDefault()
      Object.assign(options, {
        modal: true,
        parent: mainWindow,
        width: 1200,
        height: 800
      })
      studyWindow =  event.newGuest = new BrowserWindow({
      })
      studyWindow.on('closed', function () {
        studyWindow = null
      })
      studyWindow.webContents.openDevTools()
    }
  })
}

/**
 Electron 会在初始化后并准备
 创建浏览器窗口时，调用这个函数。
 部分 API 在 ready 事件触发后才能使用。
 */
app.on('ready', () => {
  createWindow()
  setInterval(() => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('new-messages',  {
        x: 10,
        y: 20,
        now: Date.now(),
        type: 'mainProcess'
      })
    })
  }, 6000)

  //调开web的开发者模式
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    let focusWin = BrowserWindow.getFocusedWindow()
    focusWin && focusWin.toggleDevTools()
  })

  //主进程与渲染进程的通信
  global.userName = 'main process'

})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    mainWindow = null
    studyWindow = null
    app.quit()
  }
})

// 在macOS上，当单击dock图标并且没有其他窗口打开时，
// 通常在应用程序中重新创建一个窗口。
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * 主进程接收子进程消息
 */
ipcMain.on('sendMsgToMainProcess', (event, msg) => {
  console.log('Receiving renderer process message: ', msg)
  // console.log('event: ', event)
})


//主进程接收子进程消息
ipcMain.on('sendMsgToMainProcess', (event, msg) => {
  console.log('Receiving renderer process message: ', msg)
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('new-messages', msg)
  })
  // event.sender.send('new-messages', msg)
})

ipcMain.on('open-main-window', function (e, data) {
  console.log(e, data)
})


// 渲染进程间消息中转
ipcMain.on('inter-renderer-message', (event, msg) => {
  if (!msg || !msg.dstId) { return }
  console.log('inter-renderer-message: ', msg)
  // 根据 id 查找窗口
  const win = BrowserWindow.fromId(msg.dstId)
  if (win) { win.webContents.send('inter-renderer-message', msg) }
})
