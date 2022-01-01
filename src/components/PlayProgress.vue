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
import { ref, onMounted, watch, computed, inject } from "vue"
import { useStore } from "vuex"
export default {
  setup() {
    const store = useStore()

    // 是否由鼠标控制slider 当值为true,表示用户正在拖动slider, currentTime的变化将不能触发slider的移动
    let sliderControledByMouse = false
    // 本组件核心变量  当前播放到的时刻
    let currentTime = computed(() => store.state.music.currentTime)
    watch(currentTime, (newValue) => {
      if (!sliderControledByMouse) {
        moveSlider(newValue)
      }
    })
    let currentSong = computed(() => store.state.music.currentSong)
    watch(currentSong, (newValue) => {
      // 如果vuex中手动把currentSong清空,那么slider应该消失在最左边, 但是totalTime此时为undefined. 无法通过数学计算得到slider的位置. 所以要手动移动slider
      if (!newValue.id) {
        moveSlider(0)
      }
    })

    // 歌的时长, 单位:秒  durationSecond
    let totalTime = computed(() => store.state.music.currentSong.durationSecond)
    let playProgress = ref(null)
    let trackLeft = ref(null)
    let slider = ref(null)
    let mask = ref(null)

    onMounted(() => {
      // 需求:鼠标按下时不做处理, 左键按下并且移动时让进度条跟着移动,左键松开时重新计算currentTime
      // 鼠标左键在mask内部按下时, 绑定事件回调
      mask.value.onmousedown = () => {
        // 如果当前没有歌曲处于播放状态,就什么都不做
        if (!currentSong.value.id) return

        // 因为进度条细长, 用户拖动的时候很容易离开进度条的范围, 所以事件得给document绑定
        document.onmousemove = moveSlider
        sliderControledByMouse = true
        // 鼠标左键抬起时, 计算时间,改变时间,然后解除事件绑定
        document.onmouseup = () => {
          updateTime()
          document.onmousemove = null
          document.onmouseup = null
          sliderControledByMouse = false
        }
      }
    })

    const setCurrentTime = inject("setCurrentTime")
    function updateTime() {
      // 根据slider所在位置计算该位置所代表的时间
      const mouseX = window.event.clientX
      const totalWidth = playProgress.value.clientWidth
      const time = (mouseX / totalWidth) * totalTime.value
      // 调用miniPlayer中的函数,在miniPlayer中修改currentTime
      setCurrentTime(time)
    }

    // 该函数作为回调使用时,参数specialPosition是传递过来的时间;作为dom事件回调使用时,参数specialPosition其实是event
    function moveSlider(specialPosition) {
      let position
      // debugger
      // 如果是由currentTime变化所调用的本函数
      if (window.event.type === "timeupdate") {
        const totalWidth = playProgress.value.clientWidth
        position = (currentTime.value / totalTime.value) * totalWidth
      }
      // 如果是鼠标点击或拖动所调用的本函数
      else if (window.event.type === "mouseup" || window.event.type === "mousemove") {
        position = window.event.clientX
      }
      // 如果指定了specialPosition
      else if (typeof specialPosition === "number") {
        position = specialPosition
      }

      // 红色轨道的长度不用修正
      trackLeft.value.style.width = position + "px"
      // 向左修正半个slider的宽度
      const correction = slider.value.clientWidth / 2
      position = position - correction
      slider.value.style.left = position + "px"
    }
    return { playProgress, trackLeft, slider, mask, currentTime }
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
