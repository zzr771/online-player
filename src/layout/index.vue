<template>
  <div class="layout">
    <Header></Header>
    <div class="layout-body">
      <SideMenu></SideMenu>
      <div class="content">
        <div class="w">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./Header"
import SideMenu from "./SideMenu"
export default {
  components: {
    Header,
    SideMenu,
  },
}
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  .layout-body {
    display: flex;
    height: calc(100% - @header-height);
    .content {
      position: relative;
      flex: 1;
      overflow-y: auto;
      min-width: @layout-content-min-width;
      margin-bottom: @mini-player-height;
      .w {
        margin: 0 auto;
        max-width: 1000px;
      }
    }
  }
}
</style>
