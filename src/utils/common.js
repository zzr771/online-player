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
