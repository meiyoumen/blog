import * as ptr from './path-to-regexp.js'

/**
 * get hash by full url
 * @param {String} url
 * @returns {string}
 */
export function getHash(url) {
  return url.indexOf('#') !== -1 ? url.substring(url.indexOf('#') + 1) : '/'
}

/**
 * get route from routes filter by url
 * @param {Array} routes
 * @param {String} url
 * @returns {Object}
 */

/*
从routes对象中查找与url匹配的路由
let url="/article/1"
let reg= /^\/article\/((?:[^\/]+?))(?:\/(?=$))?$/i
let match=reg.exec(url)
找到返回:match = ["/article/1", "1", index: 0, input: "/article/1"]
找不到 match=null
* */
export function getRoute(routes, url) {
  for (let i = 0, len = routes.length; i < len; i++) {
    let route = routes[i]
    let keys = []
    const regex = ptr.pathToRegexp(route.url, keys)
    const match = regex.exec(url)
    if (match) {
      route.params = {}
      for (let j = 0, l = keys.length; j < l; j++) {
        const key = keys[j]
        const name = key.name
        route.params[name] = match[j + 1]
      }
      return route
    }
  }
  return null
}

/**
 * has children
 * @param {HTMLElement} parent
 * @returns {boolean}
 */
export function hasChildren(parent) {
  const children = parent.children
  return children.length > 0
}

/**
 * noop
 */
export function noop() {

}
