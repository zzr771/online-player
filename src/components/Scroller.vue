// 位于playPage内部, 显示和控制歌词滚动的模块
<template>
  <div class="scroller" ref="scroller">
    <div>
      <div class="place-holder"></div>
      <div class="sentence" v-for="(lyric, index) in parsedLyric" :key="index" :sindex="index">
        <p class="text" v-for="(content, index) in lyric.content" :key="index">
          {{ content }}
        </p>
      </div>
      <div class="place-holder"></div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, onMounted, computed } from "vue"
import BScroll from "@better-scroll/core"
import ScrollBar from "@better-scroll/scroll-bar"
import MouseWheel from "@better-scroll/mouse-wheel"
BScroll.use(ScrollBar)
BScroll.use(MouseWheel)
// betterscroll的基本设置
const defaultOptions = {
  mouseWheel: true,
  scrollY: true,
  scrollbar: true,
  probeType: 3,
}
// 恢复自动滚动的定时器时间
const AUTO_SCROLL_RECOVER_TIME = 2000

export default {
  props: {
    parsedLyric: Array,
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    let scroller = ref(null)
    // betterscroll
    let bs
    // 是否自动滚动  如果用户使用了鼠标滚轮,那就等待2秒再继续自动滚动
    let autoScroll = true

    onMounted(createBS)
    // 监视props.parsedLyric, 每次变化时都刷新betterscroll
    watch(() => props.parsedLyric, createBS)
    function createBS() {
      nextTick(() => {
        // 页面第一次加载
        if (!bs) {
          bs = new BScroll(scroller.value, Object.assign({}, defaultOptions, props.options))
          // 修改一下滚动条的样式
          document.querySelector(".bscroll-indicator").style.setProperty("border", "none")
          document
            .querySelector(".bscroll-indicator")
            .style.setProperty("background", "var(--scrollbar-color)")
          _initScroller(bs)
        } else {
          bs.refresh()
        }
      })
    }

    function _initScroller(scoller) {
      function onScrollStart() {
        autoScroll = false
      }
      function onScrollEnd() {
        clearTimeout(bs.timer)
        bs.timer = setTimeout(() => {
          autoScroll = true
        }, AUTO_SCROLL_RECOVER_TIME)
      }
      // 如果用户使用鼠标拖动或者滚轮滚动歌词, 就等待2秒后再自动滚动
      scoller.on("scrollStart", onScrollStart)
      scoller.on("mousewheelStart", onScrollStart)

      scoller.on("scrollEnd", onScrollEnd)
      scoller.on("mousewheelEnd", onScrollEnd)
    }

    // 根据当前时间找到对应的那句歌词
    let currentTime = ref(0)
    // setInterval(() => {
    //   currentTime.value += 1
    // }, 500)
    let activeLyricIndex = computed(() => {
      if (!props.parsedLyric.length) return null
      return props.parsedLyric.findIndex((l, index) => {
        const nextLyric = props.parsedLyric[index + 1]
        // 如果有下一句歌词
        if (nextLyric) {
          return l.time <= currentTime.value && nextLyric.time > currentTime.value
        }
        // 如果没有下一句歌词,那么当前歌词为最后一句
        else {
          return true
        }
      })
    })
    // 监视 active的那句歌词,给对应的div加上.active类
    watch(activeLyricIndex, (newValue) => {
      // 获取应该active的歌词所在的div
      const activeLyric = document.querySelector(`.sentence[sindex='${newValue}']`)
      activeLyric.classList.add("active")

      // 把上一句歌词的active类去掉
      const lastActiveLyric = document.querySelector(`.sentence[sindex='${newValue - 1}']`)
      if (lastActiveLyric) {
        lastActiveLyric.classList.remove("active")
      }

      // 如果自动滚动处于开启状态, 就滚动到active的歌词
      if (autoScroll) {
        bs.scrollToElement(activeLyric, 200, 0, true)
      }
    })

    return { scroller }
  },
}
</script>

<style lang="less" scoped>
.scroller {
  position: relative;
  height: 100%;
  overflow: hidden;
  .sentence {
    margin-bottom: 16px;
    font-size: @font-size-sm;
    &.active {
      font-size: @font-size;
      color: var(--font-color-white);
      font-weight: @font-weight-bold;
    }
    .text {
      margin-bottom: 8px;
    }
  }
  .place-holder {
    width: 100%;
    height: 120px;
  }
  .custom-indicator {
    border: none !important;
    background: var(--scrollbar-color) !important;
  }
}
</style>
