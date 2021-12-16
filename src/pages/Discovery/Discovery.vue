// "发现音乐"一级路由页
<template>
  <div class="discovery">
    <!-- 轮播图 -->
    <Banner></Banner>
    <!-- 推荐歌单 -->
    <List></List>
    <!-- 最新音乐 -->
    <Song></Song>
    <!-- 推荐MV -->
    <MV></MV>
  </div>
</template>

<script>
import Banner from "./Banner"
import List from "./List.vue"
import Song from "./Song.vue"
import MV from "./MV.vue"
export default {
  components: { Banner, List, Song, MV },
}
</script>

<style lang="less" scoped>
.discovery {
  padding: 18px 32px;
}
</style>
