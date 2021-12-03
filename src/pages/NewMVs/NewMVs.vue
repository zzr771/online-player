<template>
  <div class="new-mvs">
    <TabsRound></TabsRound>
    <div class="mv-wrapper">
      <MVCard v-for="(item, index) in 28" :key="index"></MVCard>
    </div>
    <Pagination :totalPageNum="26"></Pagination>
  </div>
</template>

<script>
import TabsRound from "@/components/TabsRound"
import MVCard from "@/components/MVCard"
import Pagination from "@/components/Pagination"
export default {
  components: { TabsRound, MVCard, Pagination },
}
</script>

<style lang="less" scoped>
.new-mvs {
  padding: 16px 32px;
  .mv-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -12px 16px;
  }
}
</style>
