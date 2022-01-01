// mv播放页面 一级路由
<template>
  <div class="mv">
    <div class="left">
      <h2 class="title">{{ mvDetail.name }}</h2>
      <div class="player-wrapper">
        <!-- 这里暂时用v-if限制VideoPlayer必须在mvUrl有值以后才加载,不然VideoPlayer加载故障
              后面要换成整个页面的Loading效果
         -->
        <VideoPlayer :url="mvUrl" :poster="genImgURL(mvDetail.cover, 1200, 750)" v-if="mvUrl" />
      </div>
      <div class="author-part">
        <img class="avatar" :src="genImgURL(artist.picUrl, 120)" />
        <p class="author">{{ artist.name }}</p>
      </div>
      <div class="info">
        <span class="date">发布：{{ mvDetail.publishTime }}</span>
        <span class="count">播放：{{ simplifyPlayCount(mvDetail.playCount) }}次</span>
      </div>
      <Comments :id="MVID" type="mv"></Comments>
    </div>
    <div class="right">
      <h2 class="title simi">相关推荐</h2>
      <div class="recommend-mv-list">
        <MVCardMini v-for="(simiMv, index) in simiMvs" :key="index" :mv="simiMv"></MVCardMini>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer"
import Comments from "@/components/Comments"
import MVCardMini from "@/components/MVCardMini"
import { reactive, ref, watch, onBeforeUnmount } from "vue"
import { useStore } from "vuex"
import { reqMvDetail, reqMvUrl, reqSimiMvs } from "@/api/mv"
import { reqArtist } from "@/api/music"
import { genImgURL, simplifyPlayCount } from "@/utils/common"
export default {
  props: {
    MVID: String,
  },
  setup(props) {
    const store = useStore()

    let mvDetail = reactive({})
    let mvUrl = ref()
    let simiMvs = reactive({})
    let artist = reactive({})

    // 请求页面中所需的所有数据
    async function getData() {
      const [{ data: _mvDetail }, { data: _mvUrl }, { mvs: _simiMvs }] = await Promise.all([
        reqMvDetail(props.MVID),
        reqMvUrl(props.MVID),
        reqSimiMvs(props.MVID),
      ])
      const _artist = await reqArtist(_mvDetail.artistId)

      mvDetail = Object.assign(mvDetail, _mvDetail)
      mvUrl.value = _mvUrl.url
      simiMvs = Object.assign(simiMvs, _simiMvs)
      artist = Object.assign(artist, _artist.artist)
    }
    getData()

    // id变化时,重新请求数据
    watch(
      () => props.MVID,
      () => {
        getData()
        store.commit("music/updateIsPlaying", { isPlaying: false })
      }
    )

    //-------------------------------------修改页面标题--------------------------------
    watch(mvDetail, () => {
      document.title = mvDetail.name
    })
    // 离开页面时把页面标题改回来
    onBeforeUnmount(() => {
      document.title = "online-player"
    })

    return {
      mvDetail,
      mvUrl,
      simiMvs,
      artist,

      genImgURL,
      simplifyPlayCount,
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
    margin-left: 8px;
    margin-bottom: 16px;
    font-size: @font-size-lg;
    font-weight: bolf;
    &.simi {
      font-weight: normal;
    }
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
        margin-right: 20px;
        font-size: @font-size-sm;
        color: var(--font-color-grey-shallow);
      }
    }
  }
  .right {
    width: 36%;
    padding-left: 24px;
  }
}
</style>
