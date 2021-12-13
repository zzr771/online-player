// "发现音乐"页面中的"推荐MV"组件
<template>
  <div class="recommended-mv">
    <TitleH2 title="推荐MV"></TitleH2>
    <div class="mv-list">
      <MVCard v-for="(item, index) in 4" :key="index"></MVCard>
    </div>
  </div>
</template>

<script>
import TitleH2 from "@/components/TitleH2"
import MVCard from "@/components/MVCard"
export default {
  components: { TitleH2, MVCard },
}
</script>

<style lang="less" scoped>
.mv-list {
  display: flex;
  margin: 0 -12px;
}
</style>
