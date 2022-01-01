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
import { ref, provide, computed, watch } from "vue"
export default {
  props: {
    keyword: String,
  },
  setup(props) {
    let keyword = computed(() => props.keyword)
    watch(keyword, (newValue) => {
      console.log(newValue)
    })

    let currentPage = ref(1)
    function updateCurrentPage(page) {
      currentPage.value = page
    }
    provide("updateCurrentPage", updateCurrentPage)
    // watch(currentPage, () => {
    //   newMvs.value.scrollIntoView({ behavior: "smooth" })
    //   getAllMvs(onTabs)
    // })
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
