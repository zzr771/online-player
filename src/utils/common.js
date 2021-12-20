// 进入全屏
export function fullScreen() {
  const doc = document.documentElement
  if (doc.requestFullscreen) {
    doc.requestFullscreen()
  } else if (doc.msRequestFullscreen) {
    doc.msRequestFullscreen()
  } else if (doc.mozRequestFullScreen) {
    doc.mozRequestFullScreen()
  } else if (doc.webkitRequestFullScreen) {
    doc.webkitRequestFullScreen()
  }
}
// 检查是否处于全屏模式
function isFullScreen() {
  return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
}
// 退出全屏
export function exitFullscreen() {
  // 如果当前不是全屏模式,退出
  if (!isFullScreen()) return

  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

// 节流
export function throttle(callback, interval) {
  let timer = 0
  return function () {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      callback && callback()
      timer = 0
    }, interval)
  }
}

// 把秒数变成标准时间格式字符串
export function parseTime(time) {
  let h, min, sec
  let timeStr
  time = Math.round(time)
  h = Math.floor(time / 3600)
  if (h > 0) {
    min = Math.floor((time - 3600 * h) / 60)
    sec = (time - 3600 * h) % 60
    timeStr =
      `${h < 10 ? "0" + h : h}` +
      ":" +
      `${min < 10 ? "0" + min : min}` +
      ":" +
      `${sec < 10 ? "0" + sec : sec}`
  } else {
    min = Math.floor(time / 60)
    sec = time % 60
    timeStr = `${min < 10 ? "0" + min : min}` + ":" + `${sec < 10 ? "0" + sec : sec}`
  }
  return timeStr
}

// 获得指定尺寸的图片url
export function genImgURL(url, width, height) {
  if (!height) height = width
  url += `?param=${width}y${height}`
  return url
}
