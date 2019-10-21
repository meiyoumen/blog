// 参数immediate值 true||false
function debounce(fn, wait = 50, immediate) {
  let timeout = null, result = null
  let debounced = (...args) => {
    if (timeout) clearTimeout(timeout)

    // 立即执行一次
    if (immediate && !timeout) {
      result = fn.apply(this, args)
    }

    timeout = setTimeout(() => {
      result = fn.apply(this, args)
    }, wait)
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
