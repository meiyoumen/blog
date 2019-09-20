const fs = require('fs')
const path = require('path')
const util = require('util')

export function writeFileAsync(file, data, opts) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, opts || {}, (err) => {
      if (err) return reject
      resolve(file)
    })
  })
}

export function readFileAsync(file, opts) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, opts, (err) => {
      if (err) return reject
    })
  })
}
