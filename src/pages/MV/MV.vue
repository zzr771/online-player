<template>
  <div class="mv">
    <div class="left">
      <h2 class="title">君のせい</h2>
      <div class="player-wrapper">
        <!-- <VideoPlayer :url="mvPlayInfo.url" :poster="mvDetail.cover" /> -->
        <VideoPlayer
          :url="`http://vodkgeyttp8.vod.126.net/cloudmusic/6c2f/core/0606/bc4f816aa1decccc3f89bffcd64e09ea.mp4?wsSecret=0211ae17e5c2045a03a8e8b6b30d503d&wsTime=1637842019`"
          :poster="`http://p1.music.126.net/jSa4zdcWkbBlvP5H2VfbNw==/109951166535404987.jpg`"
        />
      </div>
      <div class="author-part">
        <img class="avatar" src="./images/avatar.png" />
        <p class="author">the peggies</p>
      </div>
      <div class="info">
        <span class="date">发布：2015-07-01</span>
        <span class="count">播放：456077次</span>
      </div>
      <Comments></Comments>
    </div>
    <div class="right">
      <h2 class="title">相关推荐</h2>
      <div class="recommend-mv-list">
        <MVCardMini v-for="(item, index) in 4" :key="index"></MVCardMini>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer"
import Comments from "@/components/Comments"
import MVCardMini from "@/components/MVCardMini"
import { onBeforeUnmount } from "vue"
export default {
  props: {
    MVID: String,
  },
  setup() {
    // 更改页面标题为mv标题
    document.title = "君のせい"
    // 离开页面时把页面标题改回来
    onBeforeUnmount(() => {
      document.title = "online-player"
    })
  },
  components: { VideoPlayer, Comments, MVCardMini },
}
</script>

<style lang="less" scoped>
.mv {
  display: flex;
  max-width: 950px;
  height: 3000px;
  margin: 0 auto;
  padding-top: 16px;
  .title {
    margin-bottom: 16px;
    font-size: @font-size-lg;
    font-weight: bolf;
  }
  .left {
    flex: 1;
    .player-wrapper {
      border-radius: 5px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .author-part {
      display: flex;
      align-items: center;
      height: 60px;
      margin-bottom: 20px;
      img {
        width: 60px;
        height: $width;
        border-radius: 50%;
        margin-right: 8px;
      }
      .author {
        font-size: @font-size-lg;
      }
    }
    .info {
      margin-bottom: 48px;
      span {
        font-size: @font-size-sm;
        color: var(--font-color-grey-shallow);
      }
    }
  }
  .right {
    width: 36%;
    padding-left: 32px;
  }
}
</style>
