// 该模块动态改变rem值, 实现元素大小随视口缩放而改变

export const remBase = 14

let htmlFontSize
;(function () {
  const calc = function () {
    const maxFontSize = 18
    const minFontSize = 14
    const html = document.documentElement
    const width = html.clientWidth

    // 以1440宽度下rem为14px作为基准, 按比例调节rem大小
    let size = remBase * (width / 1440)
    // 如果计算出来size过大,就取maxFontSize; 过小,就取minFontSize; 否则就取size
    size = Math.min(maxFontSize, size)
    size = Math.max(minFontSize, size)
    html.style.fontSize = size + "px"
    htmlFontSize = size
  }

  //页面加载时执行一次
  calc()
  //页面缩放时持续执行节流)
  window.addEventListener("resize", throttle(calc, 300))
})()

// 用于静态样式(一些组件由库生成,尺寸无法经过postcss编译)  基于固定的remBase计算
export function toRem(px) {
  return `${px / remBase}rem`
}
//用于一些js的动态计算  基于动态的htmlFontSize计算
export function toCurrentRem(px) {
  return `${px / htmlFontSize}rem`
}

// 节流
function throttle(callback, time = 300) {
  let timer
  // 闭包保存timer, 不使用全局命名空间
  return function () {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      timer = null
      callback && callback()
    }, time)
  }
}
