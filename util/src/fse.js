import {isObject} from "./type"

const fs = require('fs')
const path = require('path')
const util = require('util')
const zlib = require('zlib')
const {spawn, exec, execSync} = require('child_process')

export function writeFileAsync(file, data, opts) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, opts || {}, (err) => {
      if (err) return reject(err)
      resolve(file)
    })
  })
}

export function readFileAsync(file, opts) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, opts, (err) => {
      if (err) return reject(err)
      let format = isObject(opts) ? opts.format : null
      if (format == 'text') {
        return resolve(data.toString())
      }
      if (format == 'json') {
        let ret
        try {
          ret = JSON.parse(data.toString())
        } catch (err) {
          return reject(err)
        }
        return resolve(ret)
      }
      return resolve(data)
    })
  })
}

export function copyBigFile(src, dest) {
  return new Promise((resolve, reject) => {
    let rs = fs.createReadStream(src)
    let ws = fs.createWriteStream(dest)
    // rs.pipe(ws)
    rs.on('data', (chunk) => {
      ws.write(chunk)
    })
      .on('error', e => {
        return reject(e)
      })
      .on('finish', () => {
        ws.end()
        resolve()
      })
  })
}

export function copyFileAsync(src, dest, flags) {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, flags || 0, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(dest)
    })
  })
}

export function removeFileAsync(srcPath) {
  return new Promise((resolve, reject) => {
    fs.unlink(srcPath, (err) => {
      if (err) {
        // 常见的系统错误
        // ENOENT (无此文件或目录): 通常是由 fs 操作引起的，表明指定的路径不存在，即给定的路径找不到文件或目录。
        if (err.code === 'ENOENT') {
          return resolve()
        }
        return reject(err)
      }
      resolve(srcPath)
    })
  })
}


// 压缩文件
export function comPressedFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(filePath + '.gz'))
      .on('error', e => {
        return reject(e)
      })
      .on('finish', () => {
        return resolve()
      })
  })
}

/**
 * 获取windows 进程ID 并结束
 * @param processname 进程名称 test.exe
 */
export function KillProcessPid(processNames) {
  try {
    let stdout = execSync('tasklist')
    if (stdout) {
      stdout.toString().split('\n').filter(function (line) {
        let p = line.trim().split(/\s+/)
        if (p && p.length) {
          let pname = p[0].toLowerCase()
          let pid = p[1]
          processNames.forEach((name) => {
            if (pname.indexOf(name) >= 0 && parseInt(pid)) {
              if (window.process) {
                window.process.kill(pid)
              }
            }
          })
        }
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// 检测进程是否启动
export function isExistProcessPid(processNames) {
  return new Promise((resolve, reject) => {
    try {
      let stdout = execSync('tasklist')
      let str = []
      if (stdout) {
        stdout.toString().split('\n').filter(function (line) {
          let p = line.trim().split(/\s+/)
          if (p && p.length) {
            let pname = p[0].toLowerCase()
            let pid = p[1]
            processNames.forEach((name) => {
              if (pname.indexOf(name) >= 0 && parseInt(pid)) {
                str.push(name)
              }
            })
          }
        })
        if (str.length === processNames.length) {
          return resolve()
        } else {
          str.map((it) => {
            let st = processNames.indexOf(it)
            if (st >= 0) {
              processNames.splice(st, 1)
            }
          })
          return reject(processNames)
        }
      }
    } catch (e) {
      console.error(e)
      return reject(e)
    }
  })
}
