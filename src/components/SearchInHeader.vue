// 位于顶部header右侧的搜索栏
<template>
  <div class="search" ref="searchEle">
    <div class="search-part" @click="showPanelFn">
      <input type="text" placeholder="搜索" @keydown.enter="openSearch" v-model="keyword" />
      <i class="iconfont icon-sousuo" @click="openSearch"></i>
    </div>
    <div class="hot-history-pannel" v-show="showPanel">
      <div class="hot">
        <h3>热门搜索</h3>
        <div class="tags">
          <!-- search-tag的click事件要阻止冒泡, 防止触发到showPanelFn, 触发showPanelFn的话面板就无法关闭 -->
          <span class="search-tag" @click.stop="clickTag">adele</span>
        </div>
      </div>
      <div class="history">
        <div class="title-wrapper">
          <h3>搜索历史</h3>
          <i class="iconfont icon-shanchu"></i>
        </div>
        <div class="tags">
          <span class="search-tag" @click.stop="clickTag">someone like you</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import { useRouter } from "vue-router"
export default {
  setup() {
    let showPanel = ref(false)
    function showPanelFn() {
      document.removeEventListener("click", toggleShowPanel)
      document.addEventListener("click", toggleShowPanel)
    }

    let searchEle = ref(null)
    // 关于此处的做法的注释,见theme.vue
    function toggleShowPanel(event) {
      let pn = event.target.parentNode
      // 如果点的不是tab,那就是点击到了Panel的空白,就不关闭panel
      while (pn !== document.documentElement) {
        if (pn === searchEle.value) {
          showPanel.value = true
          return
        }
        pn = pn.parentNode
      }
      showPanel.value = false
      document.removeEventListener("click", toggleShowPanel)
    }

    // 标签被点击后的处理函数
    const router = useRouter()
    function clickTag() {
      showPanel.value = false
      router.push({ path: "/search", query: { keyword: "222" } })
    }

    //-------------------------------搜索------------------------------
    let keyword = ref("")
    function openSearch() {
      // 关闭showPanel
      showPanel.value = false
      router.push({ path: "/search", query: { keyword: keyword.value } })
    }

    return { searchEle, showPanelFn, showPanel, clickTag, keyword, openSearch }
  },
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
  .hot-history-pannel {
    position: fixed;
    z-index: 1000;
    top: @header-height;
    right: 0;
    bottom: @mini-player-height;
    width: 350px;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.1);
    background-color: var(--search-bgcolor);
    font-size: 12px;
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
}
</style>
