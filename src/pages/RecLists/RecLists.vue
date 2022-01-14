// "推荐歌单"一级路由页
<template>
  <div class="rec-lists">
    <div class="top-card" v-if="playlists.HQPlaylist.id">
      <img v-lazy="genImgURL(playlists.HQPlaylist.coverImgUrl, 280)" alt="" />
      <div class="content">
        <div class="tag">精品歌单</div>
        <p class="name">{{ playlists.HQPlaylist.name }}</p>
        <p class="description">
          {{ playlists.HQPlaylist.description }}
        </p>
      </div>
      <div class="background">
        <div class="mask"></div>
        <img v-lazy="genImgURL(playlists.HQPlaylist.coverImgUrl, 1000, 200)" alt="" />
      </div>
    </div>
    <TabsBasic></TabsBasic>
    <div class="lists-wrapper" v-if="playlists.playlists.length">
      <ListCard v-for="(playlist, index) in playlists.playlists" :key="index" :playlist="playlist"></ListCard>
    </div>
    <Pagination :totalPageNum="totalPageNum"></Pagination>
  </div>
</template>

<script>
import TabsBasic from "@/components/TabsBasic"
import ListCard from "@/components/ListCard"
import Pagination from "@/components/Pagination"
import { ref, reactive, provide, watch } from "vue"
import { reqPlaylists, reqHQPlaylists } from "@/api/music"
import { genImgURL } from "@/utils/common"

const LIMIT = 25
export default {
  setup() {
    let playlists = reactive({ HQPlaylist: {}, playlists: [] })
    // 总页数
    let totalPageNum = ref(1)
    // 页码
    let currentPage = ref(1)
    provide("currentPage", currentPage)
    watch(currentPage, () => {
      getPlaylists()
      document.querySelector(".w").scrollIntoView({ behavior: "smooth" })
    })

    let tabs = reactive([
      { name: "全部", on: true },
      { name: "欧美", on: false },
      { name: "华语", on: false },
      { name: "日语", on: false },
      { name: "流行", on: false },
      { name: "说唱", on: false },
      { name: "摇滚", on: false },
      { name: "民谣", on: false },
      { name: "轻音乐", on: false },
      { name: "影视原声", on: false },
      { name: "怀旧", on: false },
      { name: "治愈", on: false },
    ])
    provide("tabs", tabs)
    let tabOn = {}
    watch(
      tabs,
      (newValue) => {
        tabOn = newValue.find((tab) => {
          return tab.on
        })

        getPlaylists()
      },
      { immediate: true }
    )

    //-------------------------------------获取歌单----------------------------
    // 获取精品歌单
    ;(async function getHQPlaylist() {
      let result = await reqHQPlaylists()
      if (result.code === 200) {
        playlists.HQPlaylist = result.playlists[0]
      }
    })()

    //获取普通歌单
    async function getPlaylists() {
      let params = {
        cat: tabOn.name,
        limit: LIMIT,
        offset: LIMIT * (currentPage.value - 1),
      }
      let result = await reqPlaylists(params)
      if (result.code === 200) {
        playlists.playlists = []
        playlists.playlists = result.playlists
        totalPageNum.value = Math.ceil(result.total / LIMIT)
      }
    }

    return { playlists, genImgURL, totalPageNum }
  },
  components: { TabsBasic, ListCard, Pagination },
}
</script>

<style lang="less" scoped>
.rec-lists {
  padding: 12px;
}
.top-card {
  position: relative;
  z-index: 1;
  display: flex;
  height: 172px;
  border-radius: 5px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  & > img {
    margin-right: 8px;
  }
  .content {
    .tag {
      width: 90px;
      height: 26px;
      margin: 7px 0 16px;
      line-height: $height;
      text-align: center;
      color: @gold;
      border: 1px solid @gold;
      border-radius: 5px;
      cursor: pointer;
    }
    .name {
      margin-bottom: 8px;
      font-size: @font-size-lg;
      color: #fff;
    }
    .description {
      height: 60px;
      line-height: 15px;
      font-size: @font-size-sm;
      color: var(--font-color-grey-shallow);

      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
    }
  }
  /* 
    需求: 背景图模糊
    backdrop-filter在chrome有效,但在火狐浏览器无效,需要手动开启该功能 
    所以只能用filter来做. filter相当于加了一层遮罩在元素上面, 元素内部的所有东西都被影响
    但是filter不仅作用于本元素,还作用于本元素的子元素
      所以给父元素一个after伪子元素,在伪子元素内做背景模糊
      或者单独创建一个背景层, 只对背景层使用blur
  */
  .background {
    position: absolute;
    z-index: -10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    img {
      position: absolute;
      z-index: -10;
      filter: blur(20px);
    }
    .mask {
      position: absolute;
      z-index: -9;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
.lists-wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>
