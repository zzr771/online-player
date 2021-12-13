<template>
  <div id="app">
    <!-- Layout 里面包括了顶部header,左侧菜单menu,中间的主内容区 -->
    <Layout></Layout>
    <!-- 页面底部的条形播放器 -->
    <MiniPlayer />
    <!-- 播放列表,平时隐藏 -->
    <PlayList></PlayList>
    <!-- 包含歌词的播放页面, 平时藏起来 -->
    <PlayPage></PlayPage>
  </div>
</template>

<script>
import Layout from "@/layout/index"
import MiniPlayer from "@/components/MiniPlayer"
import PlayList from "@/components/PlayList"
import PlayPage from "@/components/PlayPage"
export default {
  name: "App",
  components: {
    Layout,
    MiniPlayer,
    PlayList,
    PlayPage,
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
