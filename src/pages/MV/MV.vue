// mv播放页面 一级路由
<template>
  <div class="mv">
    <div class="left">
      <h2 class="title">{{ mvDetail.name }}</h2>
      <div class="player-wrapper">
        <!-- 这里暂时用v-if限制VideoPlayer必须在mvUrl有值以后才加载,不然VideoPlayer加载故障
              后面要换成整个页面的Loading效果
         -->
        <VideoPlayer :url="mvUrl" :poster="mvDetail.cover" v-if="mvUrl" />
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
import { reactive, ref, watch, onBeforeUnmount, onUpdated } from "vue"
import { reqMvDetail, reqMvUrl, reqSimiMvs } from "@/api/mv"
export default {
  props: {
    MVID: String,
  },
  setup(props) {
    let mvDetail = reactive({})
    let mvUrl = ref()
    let simiMvs = reactive({})
    ;(async function () {
      const [{ data: _mvDetail }, { data: _mvUrl }, { mvs: _simiMvs }] = await Promise.all([
        reqMvDetail(props.MVID),
        reqMvUrl(props.MVID),
        reqSimiMvs(props.MVID),
      ])
      mvDetail = Object.assign(mvDetail, _mvDetail)
      mvUrl.value = _mvUrl.url
      simiMvs = Object.assign(simiMvs, _simiMvs)
    })()

    //-------------------------------------修改页面标题--------------------------------
    watch(mvDetail, () => {
      document.title = mvDetail.name
    })
    // 离开页面时把页面标题改回来
    onBeforeUnmount(() => {
      document.title = "online-player"
    })

    onUpdated(() => {
      window.scrollTo(0, 0)
    })

    return {
      mvDetail,
      mvUrl,
      simiMvs,
    }
  },
  components: { VideoPlayer, Comments, MVCardMini },
}
</script>

<style lang="less" scoped>
.mv {
  display: flex;
  max-width: 950px;
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
      margin-bottom: 16px;
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
