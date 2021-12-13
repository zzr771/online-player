// 搜索页面, 一级路由页. 通过页面右上方的搜索框来触发弹出
<template>
  <div class="search clearfix">
    <div class="header">
      <div class="title">
        哈利波特
        <span>找到503个结果</span>
      </div>
      <div class="tabs">
        <router-link :to="{ path: '/search/songs', query: { keyword: keyword } }">歌曲</router-link>
        <router-link :to="{ path: '/search/lists', query: { keyword: keyword } }">歌单</router-link>
        <router-link :to="{ path: '/search/mvs', query: { keyword: keyword } }">MV</router-link>
      </div>
    </div>
    <div class="router-view-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  props: { keyword: String },
}
</script>

<style lang="less" scoped>
.header {
  // position: absolute;
  // left: 0;
  // right: 0;
  border-bottom: 1px solid var(--border);
  .title {
    padding: 20px 12px;
    // padding: 20px 32px;
    font-size: @font-size-title-lg;
    font-weight: bold;
    span {
      margin-left: 5px;
      font-size: @font-size-sm;
      color: var(--font-color-grey-shallow);
      letter-spacing: 1px;
      font-weight: normal;
    }
  }
  .tabs {
    display: flex;
    // padding-left: 25px;
    a {
      padding: 12px 0;
      margin: 0 12px;
      text-decoration: none;
      color: var(--font-color-grey2);
      &.router-link-active {
        color: var(--tab-item-active-color);
      }
    }
  }
}
// .router-view-wrapper {
//   margin-top: 110px;
// }
</style>
