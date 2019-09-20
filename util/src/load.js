
function getAppUrl () {
  let RE_APP = /js\/(app)(\.js(\?(\w+)?)?)$/
  let scripts = document.querySelectorAll('script')
  for (let i = 0; i < scripts.length; ++i) {
    if (RE_APP.test(scripts[i].src)) {
      return scripts[i].src
    }
  }
}

// 注入script
export function injectScripts (resUrl, arr) {
  let url = getAppUrl()
  let pArr = []
  arr.forEach(function (name) {
    pArr.push(new Promise((resolve, reject) => {
      let pathFull = ''
      url.replace(RE_APP, function (_, app, jsversion) {
        if (resUrl.indexOf('hfjy') > -1) {
          pathFull = resUrl + name + jsversion
        } else {
          pathFull = resUrl + name + '.js'
        }
      })
      if (!document.querySelector('script[src="' + pathFull + '"]')) {
        var s = document.createElement('script')
        s.type = 'text/javascript'
        s.async = true
        s.src = pathFull
        s.onload = function () {
          return resolve()
        }
        s.onerror = function () {
          return reject()
        }
        document.body.appendChild(s)
      } else {
        resolve()
      }
    }))
  })
  return Promise.all(pArr)
}

export function injectPrerender (urls) {
  urls.forEach((url) => {
    if (!document.querySelector('link[href="' + url + '"]')) {
      let s = document.createElement('link')
      s.rel = 'prefetch'
      s.href = url
      document.head.appendChild(s)
    }
  })
}
