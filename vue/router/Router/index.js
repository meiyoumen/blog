/**
 * Created by Administrator on 2019/7/29.
 */
import * as util from './util/util.js'

export default class VueRouter {
  constructor(options) {
    this.options = options
    this.el = document.querySelector(this.options.el)
    this.index = 1
    this.routes = options.routes || []
    this.init()
  }

  init() {
    window.addEventListener('hashchange', event => {
      const oldUrl = util.getHash(event.oldURL)
      const newUrl = util.getHash(event.newURL)

      if (oldUrl === newUrl) return
      const state = window.history.state || {}
      this.go(newUrl, state.index <= this.index)
    })
  }

  go(url, isBack) {
    const route = util.getRoute(this.routes, url)
    if (route) {
      const enter = (html) => {
        this.el.innerHTML = html
        window.location.hash = `#${url}`
        try {
          isBack ? this.index-- : this.index++
          window.history.replaceState && window.history.replaceState({index: this.index}, '', window.location.href)
        } catch (e) {
          console.error('history error: ', e)
        }
        if (typeof route.bind === 'function') {
          route.bind(this.el) //返回的Router对象
        }
      }

      // callback
      const callback = (err, html = '') => {
        if (err) {
          throw err
        }
        // push next page
        enter(html)
      }

      const res = route.render(callback)
      // promise
      if (res && typeof res.then === 'function') {
        res.then((html) => {
          callback(null, html)
        }, callback)
      }
      // synchronous
      else if (route.render.length === 0) {
        callback(null, res)
      }
      // callback
      else {

      }
    }
    else {
      throw new Error(`url ${url} was not found`)
    }
    return this
  }
}

// const router = new VueRouter({
//   mode: 'history',
//   routes: [
//     { path: '/', component: Home },
//     { path: '/foo', component: Foo },
//     { path: '/bar', component: Bar }
//   ]
// })
