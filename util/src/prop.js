function prop (obj) {
  let prop = function (key, value, opts) {
    if ( opts === void 0 ) opts = {}
    opts.value = value
    Object.defineProperty(obj, key, opts)
  }

  prop.get = function (key, value, opts) {
    if ( opts === void 0 ) opts = {}
    opts.get = value;
    Object.defineProperty(obj, key, opts)
  }
  return prop
}
