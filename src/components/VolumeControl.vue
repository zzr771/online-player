<template>
  <div class="volume-control">
    <i class="iconfont icon-zuidayinliang"></i>
    <div class="progress-bar" draggable="false">
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
       -->
      <div class="mask" ref="mask"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue"
export default {
  setup() {
    // slider的X坐标相对轨道总长度的百分比
    let percent = ref(30)
    const slider = ref(null)
    const trackLeft = ref(null)
    const mask = ref(null)
    onMounted(() => {
      mask.value.onmousedown = () => {
        mask.value.onmousemove = mouseMove
        // 鼠标仅单击时也要移动slider, 所以执行一次mouseMove()
        mouseMove()
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
        mask.value.onmousemove = null
      }
      // 初始化slider的位置和红色轨道的长度
      moveSlider(0, percent)
    })

    let timer = null //节流
    function mouseMove() {
      if (timer) {
        return
      }
      const event = window.event
      let mouseX = event.offsetX
      timer = setTimeout(() => {
        // 改变slider位置和红色轨道的长度
        moveSlider(mouseX)
        // 重新计算百分比
        let width = mask.value.clientWidth
        percent.value = Math.round((mouseX / width) * 100)
        console.log(percent.value)
        timer = null
      }, 10)
    }

    // 根据mouseX或percent的值改变slider的位置. percent优先级更高
    function moveSlider(mouseX, percent) {
      let width = mask.value.clientWidth
      if (percent) {
        mouseX = (percent.value / 100) * width
      }
      slider.value.style.left = mouseX - 6 + "px"
      trackLeft.value.style.width = mouseX - 6 + "px"
    }

    // 监视percent, 根据值的大小改变音量图标
    watch(percent, (newValue) => {})

    return {
      slider,
      trackLeft,
      mask,
    }
  },
}
</script>

<style lang="less" scoped>
.volume-control {
  display: flex;
  align-items: center;
  margin-right: 22px;
  margin-top: -3px;
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
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  // // 都有效
  // input[type="range"] {
  //   // 去除滑动条默认样式
  //   -webkit-appearance: none;
  //   -moz-appearance: none;
  //   width: 150px;
  //   border-radius: 10px; /*这个属性设置使填充进度条时的图形为圆角*/
  // }
  // // 去除默认的获得焦点时的样式
  // input[type="range"]:focus {
  //   outline: none;
  // }
  // // 滑块的样式 firefox有效 chrome无效
  // input[type="range"]::-webkit-slider-thumb,
  // input[type="range"]::-moz-range-thumb {
  //   width: 12px;
  //   height: $width;
  //   border-radius: 50%;
  //   border: none;
  //   background: @theme-color;
  // }
  // // 轨道的样式  firefox有效 chrome无效
  // input[type="range"]::-webkit-slider-runnable-track,
  // input[type="range"]::-moz-range-track {
  //   height: 2px;
  //   border-radius: 1px; /*将轨道设为圆角的*/
  //   background-color: @theme-color;
  // }
}
</style>
