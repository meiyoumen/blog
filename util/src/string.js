/**
 * 去除空格
 * @param str
 * @param type  1-前后空格  2-前空格  3-后空格 4-所有空格
 */
export function trim(str, type) {
  switch (type) {
    case 1:
      return str.replace(/(^\s*)|(\s*$)/g, '')
    case 2:
      return str.replace(/(^\s*)/g, '')
    case 3:
      return str.replace(/(\s*$)/g, '')
    case 4:
      return str.replace(/\s+/g, '')
    default:
      return str
  }
}

/**
 * 字母大小写切换
 * @param str
 * @param type 1:首字母大写 2：首页母小写  3：大小写转换 4：全部大写  5：全部小写
 * @returns {*}
 */
export function changeCase (str, type) {
  function ToggleCase(str) {
    let itemText = ''
    str.split('').forEach((item) => {
        if (/^([a-z]+)/.test(item)) {
          itemText += item.toUpperCase()
        } else if (/^([A-Z]+)/.test(item)) {
          itemText += item.toLowerCase()
        } else{
          itemText += item
        }
      })
    return itemText
  }

  switch (type) {
    case 1:
      return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
        return v1.toUpperCase() + v2.toLowerCase()
      })
    case 2:
      return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
        return v1.toLowerCase() + v2.toUpperCase()
      })
    case 3:
      return ToggleCase(str)
    case 4:
      return str.toUpperCase()
    case 5:
      return str.toLowerCase()
    default:
      return str
  }
}
