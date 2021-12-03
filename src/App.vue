<template>
  <div id="app">
    <!-- Layout 里面包括了顶部header,左侧菜单menu,中间的主内容区 -->
    <Layout></Layout>
    <!-- 页面底部的条形播放器 -->
    <MiniPlayer />
  </div>
</template>

<script>
import Layout from "@/layout/index"
import MiniPlayer from "@/components/MiniPlayer"
export default {
  name: "App",
  components: {
    Layout,
    MiniPlayer,
  },
}
</script>

<style lang="less">
#app {
  height: 100%;
  background-color: var(--body-bgcolor);
  font-size: @font-size;
}
</style>
