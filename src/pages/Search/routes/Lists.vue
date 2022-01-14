<template>
  <div class="lists">
    <div class="lists-wrapper">
      <ListCard v-for="(playlist, index) in playlists" :key="index" :playlist="playlist"></ListCard>
    </div>
    <Pagination :totalPageNum="totalPage"></Pagination>
  </div>
</template>

<script>
import ListCard from "@/components/ListCard"
import Pagination from "@/components/Pagination"
import { ref, reactive, provide, inject, watch } from "vue"

const LIMIT = 20
export default {
  setup() {
    let data = inject("data")

    let playlists = reactive([])
    let totalPage = ref(1)
    // 当前页码, 传递给Pagination组件
    let currentPage = ref(1)
    provide("currentPage", currentPage)

    // 监视data["search-lists"],即搜索到的歌单
    watch(
      () => data["search-lists"],
      (newValue) => {
        // 如果还没有数据或者请求错误
        if (!newValue.result || newValue.code !== 200) return

        let result = newValue.result
        totalPage.value = Math.ceil(result.playlistCount / LIMIT)

        playlists.length = 0
        playlists = Object.assign(playlists, result.playlists)
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
    return { playlists, totalPage }
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
