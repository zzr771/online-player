<template>
  <div class="mvs">
    <div class="mvs-wrapper">
      <!-- <MVCard v-for="(item, index) in 15" :key="index"></MVCard> -->
    </div>
    <Pagination :totalPageNum="10"></Pagination>
  </div>
</template>

<script>
import MVCard from "@/components/MVCard"
import Pagination from "@/components/Pagination"
import { ref, reactive, provide, computed, watch, inject } from "vue"
import { reqSearch } from "@/api/search"
import { parseTime, simplifyPlayCount } from "@/utils/common"

const LIMIT = 20
export default {
  props: {
    keyword: String,
  },
  setup(props) {
    let currentPage = ref(1)
    function updateCurrentPage(page) {
      currentPage.value = page
    }
    provide("updateCurrentPage", updateCurrentPage)
    watch(currentPage, () => {
      document.getElementById("search").scrollIntoView({ behavior: "smooth" })
      getmvs(props.keyword)
    })

    let keyword = computed(() => props.keyword)
    watch(keyword, (newValue) => {
      getmvs(newValue)
    })

    let mvs = reactive([])
    let totalPage = ref(1)
    let resultsCount = inject("resultsCount")
    async function getmvs(keyword) {
      let params = {
        keywords: keyword,
        limit: LIMIT + 1,
        offset: LIMIT * (currentPage.value - 1),
        type: 1004,
      }
      let _mvs = await reqSearch(params)

      _mvs = _mvs.result
      resultsCount.value = _mvs.songCount
      totalPage.value = Math.ceil(_mvs.songCount / LIMIT)

      // 返回的搜索结果可能大于30个,多余的截去
      _mvs = _mvs.mvs.slice(0, 30)
      mvs.length = 0
      mvs = Object.assign(mvs, _mvs)
    }
    // 页面第一次打开,自动发送请求
    if (props.keyword.length) {
      getmvs(props.keyword)
    }
    return { mvs, totalPage }
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
