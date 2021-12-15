// 页面底部的长条形播放器
<template>
  <div class="mini-player">
    <div class="song">
      <div class="img-part" @click="clickExpandShrink">
        <img src="@/pages/NewSongs/images/1.jpg" alt="" />
        <div class="expand-shrink">
          <i class="iconfont icon-upward" ref="expandShrinkIcon"></i>
        </div>
      </div>
      <div class="content">
        <div class="info" @click="playSong">
          <span class="name">Someone Like You</span>
          <span class="split">-</span>
          <span class="author">Adele</span>
        </div>
        <div class="time">
          <span class="current-time">00:00</span>
          <span class="split">/</span>
          <span class="total-time">04:09</span>
        </div>
      </div>
    </div>
    <div class="options">
      <div class="icon-wrapper"><i class="iconfont icon-fenxiang"></i></div>
      <div class="icon-wrapper play-mode">
        <i class="iconfont icon-mayi-shunxubofang" ref="playModeBtn" @click="clickPlayModeBtn"></i>
        <div class="mini-player-bubble play-mode-bubble">{{ playModeText }}</div>
      </div>
      <div class="icon-wrapper play-list">
        <i class="iconfont icon-gedan" ref="playListBtn" @click="clickPlayListIcon"></i>
        <!-- 现在的功能是点击按钮后弹出,后面必须要改成:歌单更新后弹出该气泡-->
        <div class="mini-player-bubble play-list-bubble">已更新歌单</div>
      </div>
      <VolumeControl></VolumeControl>
      <div class="icon-wrapper">
        <a href="https://gitee.com/zzr771/online-player"><i class="iconfont icon-gitee2"></i></a>
      </div>
    </div>
    <div class="control">
      <i class="iconfont icon-prev side left"></i>
      <span class="play-icon" @click="clickPlayIcon">
        <i class="iconfont" :class="{ 'icon-bofang': !isPlaying, 'icon-24gf-pause2': isPlaying }"></i>
      </span>
      <i class="iconfont icon-prev side right"></i>
    </div>
    <PlayProgress></PlayProgress>
    <audio ref="audio" @canplay="ready" @timeupdate="updateTime" :src="songURL"></audio>

    <!-- https://music.163.com/song/media/outer/url?id=16435049.mp3
     -->
  </div>
</template>

<script>
import VolumeControl from "@/components/VolumeControl"
import PlayProgress from "@/components/PlayProgress"
import { ref, onMounted, computed, watch, provide } from "vue"
import { useStore } from "vuex"
export default {
  setup() {
    const store = useStore()
    // 是否正在播放,核心变量,由该变量决定播放/暂停
    let isPlaying = computed(() => store.state.music.isPlaying)

    //----------------------------------和处理页面显示的相关代码---------------------------

    // 点击播放按钮后播放/暂停歌曲
    function clickPlayIcon() {
      store.commit("music/updateIsPlaying", { isPlaying: !isPlaying.value })
    }

    // 点击"播放模式"按钮后,气泡内文字循环变化
    const playModeBtn = ref(null)
    // 当前的播放模式  0:顺序播放  1:单曲循环  2:随机播放
    let playMode = 0
    let playModeText = ref("顺序播放")
    // 点击播放模式后的处理函数: 在三个模式之间循环,并更换提示框内的文字
    function clickPlayModeBtn() {
      // playMode在0-2之间循环
      playMode = ++playMode % 3
      // 更换图标
      switch (playMode) {
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

    onMounted(() => {
      // "播放模式"气泡的弹出和隐藏
      // 弹出
      playModeBtn.value.onmouseover = () => {
        const playModeBubble = document.querySelector(".play-mode-bubble")
        // display和.show类名的改变不能同步进行,否则display的改变会使过渡效果失效
        playModeBubble.style.setProperty("display", "block")
        setTimeout(() => {
          playModeBubble.classList.add("show")
        })
      }
      // 隐藏
      playModeBtn.value.onmouseout = () => {
        const playModeBubble = document.querySelector(".play-mode-bubble")
        playModeBubble.classList.remove("show")
        setTimeout(() => {
          playModeBubble.style.setProperty("display", "none")
        }, 300)
      }

      // "播放列表"气泡的弹出和隐藏
      playListBtn.value.onclick = () => {
        const playListBubble = document.querySelector(".play-list-bubble")
        // 弹出
        playListBubble.style.setProperty("display", "block")
        setTimeout(() => {
          playListBubble.classList.add("show")
        })
        // 延时2秒后隐藏
        setTimeout(() => {
          playListBubble.classList.remove("show")
          setTimeout(() => {
            playListBubble.style.setProperty("display", "none")
          }, 300)
        }, 2000)
      }
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

    //---------------------------------和处理歌曲播放的相关代码--------------------------
    // 播放器
    let audio = ref(null)

    watch(isPlaying, (newValue) => {
      // 如果正在播放
      if (newValue) {
        audio.value.play()
      } else {
        audio.value.pause()
      }
    })

    // 当歌曲加载完毕,开始播放
    function ready() {
      store.commit("music/updateIsPlaying", { isPlaying: true })
      console.log("ready")
    }

    function updateTime(e) {
      let time = e.target.currentTime
      store.commit("music/updateCurrentTime", { time })
    }

    // 当进度条被点击或者拖动时触发的回调
    function setCurrentTime(time) {
      audio.value.currentTime = time
      store.commit("music/updateCurrentTime", { time })
    }
    // 把回调传递给子组件PlayProgress
    provide("setCurrentTime", setCurrentTime)

    // 临时测试添加的变量和函数
    let songURL = ref("")
    function playSong() {
      songURL.value = require("/static/song/SomeoneLikeYou.mp3")
    }

    return {
      expandShrinkIcon,
      clickPlayIcon,
      playModeBtn,
      clickPlayModeBtn,
      playListBtn,
      playModeText,
      clickPlayListIcon,
      clickExpandShrink,

      audio,
      ready,
      isPlaying,
      songURL,
      updateTime,
      playSong,
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
  padding: 8px 24px 8px 24px;
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
        transition: 0.3s;
        &:hover {
          color: #c71d23;
        }
        i {
          font-size: 18px;
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
