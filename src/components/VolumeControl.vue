// 位于miniPlayer右侧的音量控制组件
<template>
  <div class="volume-control">
    <i class="iconfont icon-zuidayinliang" @click="mute" ref="volumeIcon"></i>
    <div class="progress-bar" ref="progressBar">
      <div class="track"></div>
      <!-- slider左侧红色轨道 -->
      <div class="track-left" ref="trackLeft"></div>
      <div class="slider" ref="slider"></div>
      <!-- 
        这里必须用一个遮罩层把全部东西都遮住, 因为下面js部分获取鼠标坐标时,
          使用的属性是offsetX,这个属性会返回指针相对定位元素左上角的坐标
        指针在哪个定位元素内, 就返回相对哪个元素的坐标. 而上面的track-left和slider
          都是定位元素,当指针位于它们上方时, offsetX的值就变成了指针相对它们的坐标
        为了排除这一干扰,就要用一个遮罩层把下面的都遮住, 让offsetX始终返回指针相对
          遮罩层的坐标
        而遮罩层要比轨道宽一些.不然在左侧,仅靠拖拽难以把slider拖到percent为0的位置;
          在右侧,slider到达轨道右边尽头后从mask后面露出来了一半的宽度,鼠标如果点击
          到了露出来的这一半再拖动, 就触发了浏览器自带的元素拖动, 无法改变音量了 
       -->
      <div class="mask" ref="mask"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, inject } from "vue"
export default {
  setup() {
    // 此组件的核心变量. slider的X坐标相对轨道总长度的百分比,也即音量百分比.
    let percent = ref(0)
    const slider = ref(null)
    const trackLeft = ref(null)
    const mask = ref(null)
    const progressBar = ref(null)
    onMounted(() => {
      mask.value.onmousedown = () => {
        mask.value.onmousemove = computePercent
        // 鼠标仅单击时也要移动slider, 所以执行一次computePercent
        computePercent()
      }
      mask.value.onmouseup = () => {
        mask.value.onmousemove = null
      }
      /*
        如果鼠标在mask内部按下后, 移动到了mask外部松开, 就无法触发mask的
          onmouseup事件,onmousemove就无法解绑
        所以当onmouseleave事件触发, 一样要解绑
      */
      mask.value.onmouseleave = () => {
        setTimeout(() => {
          mask.value.onmousemove = null
        }, 200)
      }
      // 初始化slider的位置和红色轨道的长度
      percent.value = 70
    })

    // 计算percent
    function computePercent() {
      const totalWidth = progressBar.value.clientWidth
      let mouseX = window.event.offsetX
      // mask左侧超出轨道5px,这里减去
      percent.value = ((mouseX - 5) / totalWidth) * 100
      // 检查一下percent是否小于0或者大于100
      if (percent.value < 0) {
        percent.value = 0
      } else if (percent.value > 100) {
        percent.value = 100
      }
    }

    // 监视percent, 根据值的大小移动slider,以及改变音量图标
    const volumeIcon = ref(null)
    const setVolume = inject("setVolume")
    watch(percent, (newValue) => {
      // 移动滑块
      moveSlider(newValue)
      // 改变音量
      setVolume(newValue)
      // 修改音量图标
      switch (true) {
        case newValue === 0:
          changeIconTo("icon-guanbishengyin")
          break
        case newValue <= 33:
          changeIconTo("icon-yinliang")
          break
        case newValue > 33 && newValue <= 66:
          changeIconTo("icon-zhongdengyinliang")
          break
        case newValue > 66:
          changeIconTo("icon-zuidayinliang")
          break
      }
    })
    function changeIconTo(iconName) {
      volumeIcon.value.classList.remove(
        "icon-guanbishengyin",
        "icon-zhongdengyinliang",
        "icon-zuidayinliang",
        "icon-yinliang"
      )
      volumeIcon.value.classList.add(iconName)
    }

    // 根据percent的值改变slider的位置
    function moveSlider(percent) {
      const totalWidth = progressBar.value.clientWidth
      // slider自身有宽度,取其宽度的一半作为修正值. 每次都让slider向左修正该值,这样slider的中心就和鼠标位置重合了
      const correction = (slider.value.clientWidth / 2 / totalWidth) * 100
      let position = percent - correction
      slider.value.style.left = position + "%"
      // 当position为负数时,红色轨道的width不能为负数,最小是0
      trackLeft.value.style.width = position < 0 ? "0%" : position + "%"
    }

    let previousPercent = 0
    function mute() {
      if (percent.value !== 0) {
        previousPercent = percent.value
        percent.value = 0
      } else {
        percent.value = previousPercent
      }
    }

    return {
      slider,
      trackLeft,
      mask,
      progressBar,
      mute,
      volumeIcon,
    }
  },
}
</script>

<style lang="less" scoped>
.volume-control {
  display: flex;
  align-items: center;
  margin-right: 22px;
  i {
    margin-right: 8px;
    font-size: @font-size-title;
    cursor: pointer;
  }

  .progress-bar {
    display: flex;
    align-items: center;
    position: relative;
    width: 120px;
    height: 30px;
    .track {
      width: 100%;
      height: 2px;
      background-color: var(--progress-bgcolor);
    }
    .track-left {
      position: absolute;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: @theme-color;
    }
    .slider {
      position: absolute;
      left: 20px;
      width: 12px;
      height: $width;
      border-radius: 50%;
      background-color: @theme-color;
    }
    .mask {
      position: absolute;
      top: -10px;
      bottom: -10px;
      left: -5px;
      right: -10px;
    }
  }
}
</style>
