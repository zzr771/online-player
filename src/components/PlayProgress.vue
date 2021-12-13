// 位于miniPlayer顶部, 显示和控制歌曲播放进度的控制条
<template>
  <div class="play-progress" ref="playProgress">
    <div class="track-left" ref="trackLeft"></div>
    <div class="slider" ref="slider"></div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
// 该组件还需添加的功能: 当没有歌曲处于播放状态时, 点击进度条没有响应
import { ref, onMounted, watch } from "vue"
export default {
  setup() {
    // 本组件核心变量  当前播放到的时刻
    let playingTime = ref(0)
    // 歌的时长, 单位:秒
    let totalTime = 309

    let playProgress = ref(null)
    let trackLeft = ref(null)
    let slider = ref(null)
    let mask = ref(null)

    onMounted(() => {
      // 鼠标左键在mask内部按下时, 绑定事件回调
      mask.value.onmousedown = () => {
        document.onmousemove = computeTime
        // 立即执行一次computeTime,改变slider的位置
        computeTime()
        // 鼠标左键抬起时, 解除computeTime的绑定
        // 因为进度条细长, 用户拖动的时候很容易离开进度条的范围, 所以onmouseup事件得给document绑定
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    })

    function computeTime() {
      const mouseX = window.event.clientX
      const totalWidth = playProgress.value.clientWidth
      playingTime.value = (mouseX / totalWidth) * totalTime
    }

    watch(playingTime, (newValue) => {
      moveSlider(newValue)
    })
    function moveSlider(time) {
      const totalWidth = playProgress.value.clientWidth
      let position = (time / totalTime) * totalWidth

      // 红色轨道的长度不用修正
      trackLeft.value.style.width = position + "px"

      // 向左修正半个slider的宽度
      const correction = slider.value.clientWidth / 2
      position = position - correction
      slider.value.style.left = position + "px"
    }

    return { playProgress, trackLeft, slider, mask }
  },
}
</script>

<style lang="less" scoped>
.play-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--progress-bgcolor);
  cursor: pointer;
  &:hover .slider {
    opacity: 1;
  }
  .track-left {
    position: absolute;
    left: 0;
    width: 0;
    height: 2px;
    background-color: @theme-color;
  }
  .slider {
    position: absolute;
    left: -15px;
    top: -5px;
    width: 12px;
    height: $width;
    border-radius: 50%;
    background-color: @theme-color;
    opacity: 0;
  }
  .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -5px;
    transform: translateY(-50%);
    right: -10px;
    height: 15px;
  }
}
</style>
