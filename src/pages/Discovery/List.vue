// "发现音乐"页面中的"推荐歌单"组件
<template>
  <div class="recommended-list">
    <TitleH2 title="推荐歌单"></TitleH2>
    <div class="lists-wrapper">
      <ListCard v-for="(item, index) in 10" :key="index"></ListCard>
    </div>
  </div>
</template>

<script>
import ListCard from "@/components/ListCard"
import TitleH2 from "@/components/TitleH2"
export default {
  components: { ListCard, TitleH2 },
}
</script>

<style lang="less" scoped>
.lists-wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>
