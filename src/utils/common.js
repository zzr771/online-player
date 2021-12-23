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

// 播放量如果数字过大,就简写为"xx万"
export function simplifyPlayCount(playCount) {
  // 数据未获取到时,playCount是undefined
  if (!playCount) return
  // 如果本来就是包含"万"字的string
  if (typeof playCount === "string" && playCount.indexOf("万") !== -1) {
    return playCount
  }
  playCount = parseInt(playCount)
  if (playCount < 10000) {
    return playCount
  } else {
    playCount = Number(playCount / 10000).toFixed(1)
    return playCount + "万"
  }
}

// 获得指定尺寸的图片url
export function genImgURL(url, width, height) {
  if (!height) height = width
  url += `?param=${width}y${height}`
  return url
}
