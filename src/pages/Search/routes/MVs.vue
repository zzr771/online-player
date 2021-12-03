<template>
  <div class="mvs">
    <div class="mvs-wrapper">
      <MVCard v-for="(item, index) in 15" :key="index"></MVCard>
    </div>
    <Pagination :totalPageNum="10"></Pagination>
  </div>
</template>

<script>
import MVCard from "@/components/MVCard"
import Pagination from "@/components/Pagination"
export default {
  props: {
    keyword: String,
  },
  components: {
    Pagination,
    MVCard,
  },
}
</script>

<style lang="less" scoped>
.mvs-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
</style>
