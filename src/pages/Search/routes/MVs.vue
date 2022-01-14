<template>
  <div class="mvs">
    <div class="mvs-wrapper">
      <MVCard v-for="(mv, index) in mvs" :key="index" :mv="mv"></MVCard>
    </div>
    <Pagination :totalPageNum="totalPage"></Pagination>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import MVCard from "@/components/MVCard"
import { ref, reactive, provide, watch, inject } from "vue"

const LIMIT = 20
export default {
  setup() {
    let data = inject("data")

    let mvs = reactive([])
    let totalPage = ref(1)
    // 当前页码, 传递给Pagination组件
    let currentPage = ref(1)
    provide("currentPage", currentPage)

    // 监视data["search-mvs"],即搜索到的mv
    watch(
      () => data["search-mvs"],
      (newValue) => {
        // 如果还没有数据或者请求错误
        if (!newValue.result || newValue.code !== 200) return

        let result = newValue.result
        totalPage.value = Math.ceil(result.mvCount / LIMIT)

        mvs.length = 0
        mvs = Object.assign(mvs, result.mvs)
      }
    )

    // 监视搜索关键词,如果变化了,就把currentPage重置为1
    watch(
      () => data.keyword,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          currentPage.value = 1
        }
      }
    )

    // 页码改变,通知search,然后search会发送新的请求
    let uploadCurrentPage = inject("uploadCurrentPage")
    watch(currentPage, (newValue) => {
      uploadCurrentPage(newValue)
    })

    return { mvs, totalPage }
  },
  components: { Pagination, MVCard },
}
</script>

<style lang="less" scoped>
.mvs-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
</style>
