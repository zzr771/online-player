<template>
  <div class="lists">
    <div class="lists-wrapper">
      <ListCard v-for="(item, index) in 20" :key="index"></ListCard>
    </div>

    <Pagination :totalPageNum="10"></Pagination>
  </div>
</template>

<script>
import ListCard from "@/components/ListCard"
import Pagination from "@/components/Pagination"
export default {
  props: {
    keyword: String,
  },
  components: { ListCard, Pagination },
}
</script>
<style lang="less" scoped>
.lists-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
</style>
