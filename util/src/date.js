//http://www.cnblogs.com/zhangpengshou/archive/2012/07/19/2599053.html
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
/*
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
  return fmt
}
*/


function add0(m) {
  return m < 10 ? '0' + m : m
}
//时间戳转换为年月日时分秒
export function timestampToDate(shijianchuo) {
  let time = new Date(shijianchuo)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()
  return {
    y: y,
    m: add0(m),
    d: add0(d),
    h: add0(h),
    mm: add0(mm),
    s: add0(s)
  }
}
//毫秒转换天时分秒
export function millisToDate(ms) {
  let time = ms / 1000
  //天时分秒
  let [d, h, m, s] = []
  d = Math.floor(time / 86400)
  time = time % 86400
  s = Math.floor(time % 60)
  time /= 60
  m = Math.floor(time % 60)
  time /= 60
  h = Math.floor(time % 24)

  if (d != 0) {
    return Math.abs(d) + '天 ' + add0(Math.abs(h)) + ':' + add0(Math.abs(m)) + ':' + add0(Math.abs(s))
  } else {
    return add0(Math.abs(h)) + ':' + add0(Math.abs(m)) + ':' + add0(Math.abs(s))
  }
}

export function dateTool() {
  // 一天毫秒
  let onedayMillisecond= 1000 * 60 * 60 * 24

  let today=new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  today.setMilliseconds(0)

  let yesterday=new Date(today-oneday)

  // 从 Date 对象返回一周中的某一天 (0 ~ 6)。
  let lastMonday=new Date(today- oneday * (today.getDay() + 6))
  let lastMonthLastDay = new Date(today - oneday * today.getDate())  //today.getDate()返回天数(1-31)
  let lastMonthFirstDay = new Date(lastMonthLastDay - oneday * (lastMonthLastDay.getDate() - 1))

  return{
    onedayMillisecond,
    today,
    yesterday,
    lastMonday,
    lastMonthLastDay,
    lastMonthFirstDay
  }
}

