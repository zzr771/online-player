<template>
  <div class="header">
    <div class="left">
      <!-- 三个功能按钮 -->
      <ul class="buttons">
        <li class="button home" @click="$router.push('/')">
          <i class="iconfont icon-shouye1"></i>
        </li>
        <li class="button exitFullScreen" @click="closeFullScreen">
          <i class="iconfont icon-quxiaoquanping_huaban"></i>
        </li>
        <li class="button fullScreen" @click="openFullScreen"><i class="iconfont icon-quanping"></i></li>
      </ul>
      <!-- 展示/隐藏播放页 -->
      <div class="shrink-play-page" v-if="showPlayPage" @click="clickShrinkPlayPage">
        <span><i class="iconfont icon-down"></i></span>
      </div>
      <!-- 路由前进/后退 -->
      <RouteControl v-if="!showPlayPage"></RouteControl>
    </div>
    <div class="right">
      <!-- 搜索栏 -->
      <SearchInHeader></SearchInHeader>
      <!-- 皮肤主题 -->
      <Theme></Theme>
    </div>
  </div>
</template>

<script>
import Theme from "@/components/Theme"
import RouteControl from "@/components/RouteControl"
import SearchInHeader from "@/components/SearchInHeader"
import { fullScreen, exitFullscreen } from "@/utils/common"
import { computed } from "vue"
import { useStore } from "vuex"
export default {
  setup() {
    function openFullScreen() {
      fullScreen()
    }
    function closeFullScreen() {
      exitFullscreen()
    }

    const store = useStore()
    let showPlayPage = computed(() => store.state.music.showPlayPage)
    function clickShrinkPlayPage() {
      store.commit("music/toggleShowPlayPage")
    }

    return { openFullScreen, closeFullScreen, showPlayPage, clickShrinkPlayPage }
  },
  components: { Theme, RouteControl, SearchInHeader },
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: @header-height;
  background-color: var(--header-bgcolor);
  .left {
    display: flex;
    align-items: center;
    height: 100%;
    .buttons {
      display: flex;
      height: 100%;
      align-items: center;
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        .iconfont {
          opacity: 1;
        }
      }
      .button {
        width: 15px;
        height: $width;
        line-height: $height;
        text-align: center;
        border-radius: 50%;
        margin-right: 6px;
        &.home {
          background-color: #ed655a;
        }
        &.exitFullScreen {
          background-color: #e0c04c;
        }
        &.fullScreen {
          background-color: #72be47;
        }
        i {
          opacity: 0;
          color: #fff;
          font-size: 10px;
          transition: 0.3s;
        }
      }
    }
    .shrink-play-page {
      display: flex;
      margin-left: 20px;
      span {
        width: 25px;
        height: $width;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
          background-color: var(--round-hover-bgcolor);
        }
        i {
          font-size: 25px;
          color: var(--header-font-color);
        }
      }
    }
  }
  .right {
    margin-right: 36px;
    display: flex;
    align-items: center;
  }
}
</style>
