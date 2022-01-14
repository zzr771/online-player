// 位于顶部header右侧的搜索栏, 也包括点击后弹出的搜索面板
<template>
  <div class="search" ref="searchEle">
    <div class="search-part" @click="showPanelFn">
      <input type="text" placeholder="搜索" @keydown.enter="startSearch" v-model="keyword" />
      <i class="iconfont icon-sousuo" @click="startSearch"></i>
    </div>
    <!-- 点击搜索框后弹出的搜索面板 -->
    <div class="search-pannel" v-show="showPanel">
      <!-- 搜索建议 -->
      <div class="search-suggestions" v-if="searchSuggestions.code === 200">
        <div class="songs">
          <p class="title"><i class="iconfont icon-yinle"></i>您可能在找这些歌...</p>
          <HightText
            :text="song.name"
            :keyword="keyword"
            :artists="song.artists"
            v-for="(song, index) in searchSuggestions.result.songs"
            :key="index"
            @click="clickSong(song)"
          ></HightText>
        </div>
      </div>
      <!-- 热词 / 历史 -->
      <div class="hot-history" v-else>
        <div class="hot" v-if="hotKeywords.length">
          <h3>热门搜索</h3>
          <div class="tags">
            <!-- search-tag的click事件要阻止冒泡, 防止触发到showPanelFn, 触发showPanelFn的话面板就无法关闭 -->
            <span
              class="search-tag"
              @click.stop="clickHotTag(hot)"
              v-for="(hot, index) in hotKeywords"
              :key="index"
              >{{ hot.first }}</span
            >
          </div>
        </div>
        <div class="history" v-if="searchHistories.length">
          <div class="title-wrapper">
            <h3>搜索历史</h3>
            <i class="iconfont icon-shanchu" @click="clearHistory"></i>
          </div>
          <div class="tags">
            <span
              class="search-tag"
              @click.stop="clickHistoryTag(history)"
              v-for="(history, index) in searchHistories"
              :key="index"
              >{{ history }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HightText from "@/components/HightText"
import { ref, reactive, watch } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import { reqSearchHot, reqSearchSuggestion } from "@/api/search"
import { reqSongDetail } from "@/api/music"
import { standardizeSongObj } from "@/utils/business"
import { throttle } from "@/utils/common"
export default {
  setup() {
    let showPanel = ref(false)
    // 监视showPanel,当第一次打开搜索面板时,请求热搜词; 每次打开搜索面板,都重新读取搜索历史
    watch(showPanel, (newValue) => {
      if (newValue) {
        readSearchHistories()
        if (!hotKeywords.length) {
          getSearchHot()
        }
      }
    })

    //--------------------------------------页面显示-----------------------------------
    let searchEle = ref(null)
    function showPanelFn() {
      document.removeEventListener("click", toggleShowPanel)
      document.addEventListener("click", toggleShowPanel)
    }
    // 关于此处的做法的注释,见theme.vue
    function toggleShowPanel(event) {
      let pn = event.target.parentNode
      // 如果点的是panel外部, 就关闭panel
      while (pn !== document.documentElement && pn !== null) {
        if (pn === searchEle.value) {
          showPanel.value = true
          return
        }
        pn = pn.parentNode
      }
      showPanel.value = false
      document.removeEventListener("click", toggleShowPanel)
    }

    //--------------------------------------搜索-----------------------------------
    let keyword = ref("")
    let searchHistories = reactive([]) // 搜索历史

    function startSearch() {
      keyword.value = keyword.value.trim()
      if (keyword.value === "") return
      // 关闭showPanel
      showPanel.value = false
      // 保存搜索历史到本地存储
      searchHistories.push(keyword.value)
      localStorage.setItem("searchHistories", JSON.stringify(searchHistories))

      router.push({ path: "/search", query: { keyword: keyword.value } })
    }

    // 从本地存储中读取搜索历史
    function readSearchHistories() {
      let _searchHistories = JSON.parse(localStorage.getItem("searchHistories"))
      searchHistories.length = 0
      searchHistories = Object.assign(searchHistories, _searchHistories)
    }
    // 清空搜索历史
    function clearHistory() {
      localStorage.setItem("searchHistories", "[]")
      searchHistories.length = 0
    }

    // 热搜词
    let hotKeywords = reactive([])
    async function getSearchHot() {
      let _hotKeywords = await reqSearchHot()
      hotKeywords = Object.assign(hotKeywords, _hotKeywords.result.hots)
    }

    // 标签被点击后的处理函数
    const router = useRouter()
    function clickHotTag(hot) {
      router.push({ path: "/search", query: { keyword: hot.first } })
    }
    function clickHistoryTag(history) {
      showPanel.value = false
      router.push({ path: "/search", query: { keyword: history } })
    }

    //--------------------------------------搜索建议-----------------------------------
    let searchSuggestions = reactive({ code: 0, result: {} })
    // 节流
    let throttledGetSug = throttle(getSearchSuggestion, 150)
    async function getSearchSuggestion() {
      let _searchSuggestions = await reqSearchSuggestion(keyword.value.trim())
      searchSuggestions.code = _searchSuggestions.code
      searchSuggestions.result = _searchSuggestions.result
    }
    // 监视keyword,每次变化时去请求搜索建议
    watch(keyword, (newValue) => {
      if (!newValue.length) {
        searchSuggestions.code = 0
        searchSuggestions.result = {}
      } else {
        throttledGetSug()
      }
    })

    // 搜索建议中的歌曲被点击后的处理函数
    const store = useStore()
    async function clickSong(song) {
      // 获取歌曲图片
      const result = await reqSongDetail(song.id)
      const imgUrl = result.songs[0].al.picUrl

      const { id, name, artists, duration, album, mvid } = song
      const songObj = standardizeSongObj({
        id,
        name,
        img: imgUrl,
        artists,
        duration,
        albumId: album.id,
        albumName: album.name,
        albumImg: album.picUrl,
        mvId: mvid,
      })
      store.dispatch("music/startSong", songObj)
    }

    return {
      searchEle,
      showPanelFn,
      showPanel,
      keyword,
      startSearch,
      hotKeywords,
      clickHotTag,
      searchHistories,
      clearHistory,
      clickHistoryTag,
      searchSuggestions,
      clickSong,
    }
  },
  components: { HightText },
}
</script>

<style lang="less" scoped>
.search {
  position: relative;
  margin-right: 15px;
  vertical-align: middle;
  .search-part {
    input {
      width: 150px;
      height: 24px;
      border-radius: 3px;
      padding-left: 30px;
      box-sizing: border-box;
      border: none;
      outline: none;
      background-color: var(--header-input-bgcolor);
      color: var(--header-input-color);
      font-size: 13px;
    }
    .icon-sousuo {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 10px;
      color: var(--header-input-color);
      font-size: 15px;
      margin-top: 1px;
      cursor: pointer;
    }
  }
  .search-pannel {
    position: fixed;
    z-index: 1000;
    top: @header-height;
    right: 0;
    bottom: @mini-player-height;
    width: 350px;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.1);
    background-color: var(--search-bgcolor);
    font-size: 12px;
    .hot-history {
      .hot,
      .history {
        padding: 16px 24px;
        .title-wrapper {
          display: flex;
          justify-content: space-between;
          i {
            color: var(--font-color-grey);
            cursor: pointer;
          }
        }
        h3 {
          color: var(--font-color-grey);
          margin-bottom: 16px;
          font-size: 100%;
          font-weight: normal;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          width: 300px;
          span {
            font-size: 100%;
            padding: 5px 10px;
            margin-right: 10px;
            margin-bottom: 10px;
            border: 1px solid var(--button-border-color);
            border-radius: 4px;
            cursor: pointer;
            &:hover {
              background-color: var(--button-hover-bgcolor);
            }
          }
        }
      }
    }
    .search-suggestions {
      .title {
        margin: 16px 8px 8px;
        font-size: @font-size-sm;
        color: var(--font-color-grey-shallow);
        i {
          font-size: @font-size-sm;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
