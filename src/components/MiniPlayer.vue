// 页面底部的长条形播放器
<template>
  <div class="mini-player">
    <!-- 左 -->
    <div class="song" v-if="currentSong.id">
      <div class="img-part" @click="clickExpandShrink">
        <img :src="currentSong.img" alt="" />
        <div class="expand-shrink">
          <i class="iconfont icon-upward" ref="expandShrinkIcon"></i>
        </div>
      </div>
      <div class="content">
        <div class="info">
          <span class="name">{{ currentSong.name }}</span>
          <span class="split">-</span>
          <span class="author">{{ currentSong.artistsText }}</span>
        </div>
        <div class="time">
          <span class="current-time">{{ parsedCurrentTime }}</span>
          <span class="split">/</span>
          <span class="total-time">{{ parsedTotalTime }}</span>
        </div>
      </div>
    </div>
    <!-- 占位,防止当<div class="song">被隐藏时,<div class="control">蹿到左边来 -->
    <div v-else></div>
    <!-- 右 -->
    <div class="options">
      <div class="icon-wrapper play-mode">
        <i class="iconfont icon-mayi-shunxubofang" ref="playModeBtn" @click="clickPlayModeBtn"></i>
        <div class="mini-player-bubble play-mode-bubble" ref="playModeBubble">{{ playModeText }}</div>
      </div>
      <div class="icon-wrapper play-list">
        <i class="iconfont icon-gedan" ref="playListBtn" @click.stop="clickPlayListIcon"></i>
        <!-- 现在的功能是点击按钮后弹出,后面必须要改成:歌单更新后弹出该气泡-->
        <div class="mini-player-bubble play-list-bubble" ref="playListBubble">已更新歌单</div>
      </div>
      <VolumeControl></VolumeControl>
      <div class="icon-wrapper">
        <a href="https://gitee.com/zzr771/online-player" target="_blank"
          ><i class="iconfont icon-gitee2"></i
        ></a>
      </div>
    </div>
    <!-- 中 -->
    <div class="control">
      <i class="iconfont icon-prev side left" @click="clickPrevBtn"></i>
      <span class="play-icon" @click="clickPlayIcon">
        <i class="iconfont" :class="{ 'icon-bofang': !isPlaying, 'icon-24gf-pause2': isPlaying }"></i>
      </span>
      <i class="iconfont icon-prev side right" @click="clickNextBtn"></i>
    </div>
    <PlayProgress></PlayProgress>
    <audio
      ref="audio"
      @canplay="ready"
      @timeupdate="updateTime"
      @ended="playEnd"
      :src="currentSong.url"
    ></audio>
  </div>
</template>

<script>
import VolumeControl from "@/components/VolumeControl"
import PlayProgress from "@/components/PlayProgress"
import { parseTime } from "@/utils/common"
import { ref, onMounted, computed, watch, provide } from "vue"
import { useStore } from "vuex"
export default {
  setup() {
    const store = useStore()
    // 是否正在播放,核心变量,由该变量决定播放/暂停
    let isPlaying = computed(() => store.state.music.isPlaying)
    // 当前的歌曲, 核心变量. 当currentSong变化时,<audio>的src跟着变化,就重新加载
    let currentSong = computed(() => store.state.music.currentSong)
    let currentTime = computed(() => store.state.music.currentTime)
    let playList = computed(() => store.state.music.playList)
    // 当前的播放模式  0:顺序播放  1:单曲循环  2:随机播放
    let playMode = computed(() => store.state.music.playMode)
    let randomPlaySequence = computed(() => store.state.music.randomPlaySequence)

    //----------------------------------处理页面显示的相关代码-------------------------------
    // 点击播放按钮后播放/暂停歌曲
    function clickPlayIcon() {
      if (!currentSong.value.id) return
      store.commit("music/updateIsPlaying", { isPlaying: !isPlaying.value })
    }

    // 点击"播放模式"按钮后,气泡内文字循环变化
    const playModeBtn = ref(null)
    let playModeText = ref("顺序播放")
    // 点击播放模式后的处理函数: 在三个模式之间循环,并更换提示框内的文字
    function clickPlayModeBtn() {
      store.commit("music/switchPlayMode")
      // 更换图标
      switch (playMode.value) {
        case 0:
          // 从随机变成顺序
          playModeText.value = "顺序播放"
          changeIconTo("icon-mayi-shunxubofang")
          break
        case 1:
          // 从顺序变成单曲循环
          playModeText.value = "单曲循环"
          changeIconTo("icon-danquxunhuan")
          break
        case 2:
          // 从单曲循环变成随机
          playModeText.value = "随机播放"
          changeIconTo("icon-suijibofang")
          break
      }
    }
    function changeIconTo(iconName) {
      playModeBtn.value.classList.remove("icon-danquxunhuan", "icon-suijibofang", "icon-mayi-shunxubofang")
      playModeBtn.value.classList.add(iconName)
    }

    // 点击"播放列表"按钮后,气泡出现然后自动消失
    let playListBtn = ref(null)
    let playModeBubble = ref(null)
    // 处理一些元素的显示效果
    onMounted(() => {
      // "播放模式"气泡的弹出和隐藏
      // 弹出
      playModeBtn.value.onmouseover = () => {
        // display和.show类名的改变不能同步进行,否则display的改变会使过渡效果失效
        playModeBubble.value.style.setProperty("display", "block")
        setTimeout(() => {
          playModeBubble.value.classList.add("show")
        })
      }
      // 隐藏
      playModeBtn.value.onmouseout = () => {
        playModeBubble.value.classList.remove("show")
        setTimeout(() => {
          playModeBubble.value.style.setProperty("display", "none")
        }, 300)
      }
    })

    // 播放列表中新增歌曲时, 弹出提示气泡
    let playListBubble = ref(null)
    let previousLength = 0
    watch(playList.value, (newValue) => {
      // 比较播放列表在变化前后的长度,决定是否弹出气泡
      if (newValue.length > previousLength) {
        // 弹出
        playListBubble.value.style.setProperty("display", "block")
        setTimeout(() => {
          playListBubble.value.classList.add("show")
        })
        // 延时2秒后隐藏
        setTimeout(() => {
          playListBubble.value.classList.remove("show")
          setTimeout(() => {
            playListBubble.value.style.setProperty("display", "none")
          }, 300)
        }, 2000)
      }
      previousLength = newValue.length
    })

    // 点击"播放列表"图标后,显示/隐藏播放列表
    function clickPlayListIcon() {
      store.commit("music/toggleShowPlayList")
    }

    // 点击歌曲图片后, 弹出/隐藏播放页面, 并切换图标
    const expandShrinkIcon = ref(null)
    function clickExpandShrink() {
      store.commit("music/toggleShowPlayPage")
      let showPlayPage = computed(() => store.state.music.showPlayPage)
      // 如果showPlayPage值为true
      if (showPlayPage.value) {
        expandShrinkIcon.value.classList.remove("icon-upward")
        expandShrinkIcon.value.classList.add("icon-down")
      } else {
        expandShrinkIcon.value.classList.add("icon-upward")
        expandShrinkIcon.value.classList.remove("icon-down")
      }
    }

    // 时间
    let parsedTotalTime = computed(() => parseTime(currentSong.value.durationSecond))
    let parsedCurrentTime = computed(() => parseTime(currentTime.value))

    //---------------------------------处理歌曲播放的相关代码------------------------------
    // 播放器
    let audio = ref(null)

    // 监视isPlaying,根据它的值去播放/暂停歌曲
    watch(isPlaying, (newValue) => {
      // 如果值变为true,就开始播放
      if (newValue) {
        audio.value.play()
      } else {
        audio.value.pause()
      }
    })

    // 当歌曲加载完毕,开始播放
    function ready() {
      store.commit("music/updateIsPlaying", { isPlaying: true })
      // 如果用户在播放一首歌时点击另一首歌, 那么isPlaying始终是true,不能触发上面的watch()来自动播放. 所以这里需要开启播放
      audio.value.play()
    }

    // 播放下一首或者上一首歌  isNext为true，则下一首；false，上一首
    function playNextOrPrev(isNext) {
      const indexChange = isNext ? 1 : -1
      // 如果是顺序播放
      if (playMode.value === 0) {
        // 如果播放列表只有一首歌, 那就单曲循环
        if (playList.value.length === 1) {
          audio.value.play()
        }

        let currentIndex = playList.value.findIndex((s) => s.id === currentSong.value.id)
        // 将要播放的歌的索引
        let targetIndex = currentIndex + indexChange
        // 如果索引等于播放列表的长度，说明当前歌曲是最后一首，那就去播放第一首
        if (targetIndex === playList.value.length) {
          targetIndex = 0
        }
        // 如果索引为-1，说明当前歌曲是第一首，那就去播放最后一首
        else if (targetIndex === -1) {
          targetIndex = playList.value.length - 1
        }
        const nextSong = playList.value[targetIndex]
        store.commit("music/setCurrentSong", { song: nextSong })
      }
      // 如果是单曲循环
      else if (playMode.value === 1) {
        audio.value.play()
      }
      // 如果是随机播放, 那么实际的播放列表是randomPlaySequence
      else if (playMode.value === 2) {
        if (playList.value.length === 1) {
          audio.value.play()
        }
        let currentIndex = randomPlaySequence.value.findIndex((s) => s.id === currentSong.value.id)
        let targetIndex = currentIndex + indexChange
        if (targetIndex === randomPlaySequence.value.length) {
          targetIndex = 0
        } else if (targetIndex === -1) {
          targetIndex = randomPlaySequence.value.length - 1
        }
        const nextSong = randomPlaySequence.value[targetIndex]
        store.commit("music/setCurrentSong", { song: nextSong })
      }
    }

    // 当歌曲播放完毕, 自动播放下一首歌
    function playEnd() {
      playNextOrPrev(true)
    }

    // 点击了“下一曲”按钮后的处理函数
    function clickNextBtn() {
      if (!playList.value.length) return
      playNextOrPrev(true)
    }

    // 点击了“上一曲”按钮后的处理函数
    function clickPrevBtn() {
      if (!playList.value.length) return
      playNextOrPrev(false)
    }

    // audio的事件回调 更新vuex中的currentTime
    function updateTime(e) {
      let time = e.target.currentTime
      store.commit("music/updateCurrentTime", { time })
    }

    // 播放进度控制  当进度条滑块被拖动或进度条被点击时触发
    function setCurrentTime(time) {
      audio.value.currentTime = time
      store.commit("music/updateCurrentTime", { time })
    }
    // 把回调传递给子组件PlayProgress
    provide("setCurrentTime", setCurrentTime)

    // 音量控制
    function setVolume(volume) {
      audio.value.volume = volume / 100
    }
    provide("setVolume", setVolume)

    return {
      expandShrinkIcon,
      clickPlayIcon,
      playModeBtn,
      clickPlayModeBtn,
      playListBtn,
      playModeText,
      clickPlayListIcon,
      clickExpandShrink,
      playModeBubble,
      playListBubble,
      parsedTotalTime,
      parsedCurrentTime,
      clickNextBtn,
      clickPrevBtn,

      audio,
      ready,
      playEnd,
      isPlaying,
      updateTime,
      currentSong,
    }
  },
  components: { VolumeControl, PlayProgress },
}
</script>

<style lang="less" scoped>
.mini-player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  height: @mini-player-height;
  padding: 8px 50px 8px;
  background-color: var(--body-bgcolor);
  .song {
    display: flex;
    height: 100%;
    max-width: 40%;
    overflow: hidden;
    .img-part {
      position: relative;
      margin-right: 8px;
      border-radius: 5px;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        img {
          filter: blur(3px);
        }
        .expand-shrink {
          opacity: 1;
        }
      }
      img {
        width: 44px;
        height: $width;
        transition: 0.3s;
      }
      .expand-shrink {
        display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: 0.3s;
        opacity: 0;
        i {
          color: @white;
          font-size: @font-size-title-lg;
          &.icon-down {
            margin-top: 4px;
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      white-space: nowrap;
      font-size: 10px;
      .info {
        .name {
          color: var(--font-color-white);
          font-size: @font-size;
        }
        .split {
          margin: 0 4px;
        }
      }
    }
    .time {
      color: var(--font-color-grey);
      .split {
        margin: 0 4px;
      }
    }
  }
  .control {
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    transform: translate(-50%, -50%);
    .side {
      color: @theme-color;
      font-size: 15px;
      cursor: pointer;
      &.right {
        margin-top: -3px;
        transform: rotate(180deg);
      }
    }
    .play-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 45px;
      height: $width;
      margin: 0 18px;
      border-radius: 50%;
      background-color: @theme-color;
      cursor: pointer;
      i {
        color: @white;
        font-size: 18px;
        &.icon-bofang {
          margin-top: 2px;
          margin-left: 3px;
        }
        &.icon-24gf-pause2 {
          margin-top: 2px;
        }
      }
    }
  }
  .options {
    display: flex;
    margin-top: 3px;
    align-items: center;
    .icon-wrapper {
      margin-right: 16px;
      i {
        font-size: @font-size-title;
        cursor: pointer;
      }
      a {
        text-decoration: none;
        color: var(--font-color);
        i {
          font-size: 18px;
          transition: 0.3s;
        }
        &:hover {
          color: #c71d23;
        }
      }
    }
    .play-mode {
      position: relative;
      .play-mode-bubble {
        top: -60px;
        left: -73px;
        width: 120px;
        height: 45px;
        line-height: $height;
      }
    }
    .play-list {
      position: relative;
      .play-list-bubble {
        top: -60px;
        left: -73px;
        width: 120px;
        height: 45px;
        line-height: $height;
      }
    }
    // bubble的公用样式
    .mini-player-bubble {
      position: absolute;
      z-index: 900;
      text-align: center;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      font-size: @font-size-medium-sm;
      transition: 0.3s;
      display: none;
      opacity: 0;
      &.show {
        opacity: 1;
      }
      &::after {
        content: "";
        position: absolute;
        z-index: 101;
        bottom: -6px;
        left: 63%;
        border: 6px solid;
        border-bottom: none;
        border-color: #fff transparent;
      }
    }
  }
}
</style>
