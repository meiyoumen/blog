export function unique (arr) {
  let newArr = []
  let i = 0
  for (i = 0; i < arr.length; i++) {
    (newArr.indexOf(arr[i]) === -1) && newArr.push(arr[i])
    !newArr.includes(arr[i]) && newArr.push(arr[i])
  }
  return newArr
}

//PolyFill 数组去重
Array.prototype.unique = function() {
  return Array.from(new Set(this));
}