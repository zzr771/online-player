<template>
  <div class="mini-player">
    <div class="song">
      <div class="img-part">
        <img src="@/pages/NewSongs/images/1.jpg" alt="" />
        <div class="expand-shrink">
          <i
            class="iconfont icon-upward"
            ref="expandShrinkIcon"
            @click="clickExpandShrinkIcon"
          ></i>
        </div>
      </div>
      <div class="content">
        <div class="info">
          <span class="name">I Still Have Faith In You</span>
          <span class="split">-</span>
          <span class="author">ABBA</span>
        </div>
        <div class="time">
          <span class="current-time">00:00</span>
          <span class="split">/</span>
          <span class="total-time">05:09</span>
        </div>
      </div>
    </div>
    <div class="options">
      <div class="icon-wrapper"><i class="iconfont icon-fenxiang"></i></div>
      <div class="icon-wrapper play-mode">
        <i
          class="iconfont icon-mayi-shunxubofang"
          ref="playModeBtn"
          @click="clickPlayModeBtn"
        ></i>
        <div class="play-mode-bubble">{{ playModeText }}</div>
      </div>
      <div class="icon-wrapper"><i class="iconfont icon-gedan"></i></div>
      <VolumeControl></VolumeControl>
      <div class="icon-wrapper"><i class="iconfont icon-gitee2"></i></div>
    </div>
    <div class="control">
      <i class="iconfont icon-prev side left"></i>
      <span class="play-icon" @click="clickPlayIcon">
        <i class="iconfont icon-bofang" ref="playIcon"></i>
      </span>
      <i class="iconfont icon-prev side right"></i>
    </div>
  </div>
</template>

<script>
import VolumeControl from "@/components/VolumeControl"
import { ref, onMounted } from "vue"
export default {
  setup() {
    const expandShrinkIcon = ref(null)
    // 点击歌曲图标时, 展开/收回播放页, 并切换图标
    function clickExpandShrinkIcon() {
      // 切换图标
      expandShrinkIcon.value.classList.toggle("icon-upward")
      expandShrinkIcon.value.classList.toggle("icon-down")
    }

    const playIcon = ref(null)
    // 点击播放按钮后的处理函数
    function clickPlayIcon() {
      playIcon.value.classList.toggle("icon-bofang")
      playIcon.value.classList.toggle("icon-24gf-pause2")
    }

    const playModeBtn = ref(null)
    // 当前的播放模式  0:顺序  1:单曲循环  2:随机
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
          playModeBtn.value.classList.remove("icon-suijibofang")
          playModeBtn.value.classList.add("icon-mayi-shunxubofang")
          break
        case 1:
          // 从顺序变成单曲循环
          playModeText.value = "单曲循环"
          playModeBtn.value.classList.remove("icon-mayi-shunxubofang")
          playModeBtn.value.classList.add("icon-danquxunhuan")
          break
        case 2:
          // 从单曲循环变成随机
          playModeText.value = "随机播放"
          playModeBtn.value.classList.remove("icon-danquxunhuan")
          playModeBtn.value.classList.add("icon-suijibofang")
          break
      }
    }
    //
    onMounted(() => {
      playModeBtn.value.onmouseover = () => {
        const playModeBubble = document.querySelector(".play-mode-bubble")
        playModeBubble.style.setProperty("display", "block")
        setTimeout(() => {
          playModeBubble.classList.add("show")
        })
      }
      playModeBtn.value.onmouseout = () => {
        const playModeBubble = document.querySelector(".play-mode-bubble")
        playModeBubble.classList.remove("show")
        setTimeout(() => {
          playModeBubble.style.setProperty("display", "none")
        }, 300)
      }
    })

    return {
      expandShrinkIcon,
      playIcon,
      clickExpandShrinkIcon,
      clickPlayIcon,
      playModeBtn,
      clickPlayModeBtn,
      playModeText,
    }
  },
  components: { VolumeControl },
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
  height: 60px;
  padding: 8px 24px 8px 24px;
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
    align-items: center;
    .icon-wrapper {
      margin-right: 16px;
      font-size: @font-size-title;
      i {
        cursor: pointer;
      }
    }
    .play-mode {
      position: relative;
      .play-mode-bubble {
        position: absolute;
        z-index: 100;
        top: -60px;
        left: -73px;
        width: 120px;
        height: 45px;
        line-height: $height;
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
}
</style>
