// "最新MV"一级路由页
<template>
  <div class="new-mvs" ref="newMvs">
    <TabsRound></TabsRound>
    <div class="mv-wrapper">
      <MVCard v-for="(mv, index) in mvs" :key="index" :mv="mv"></MVCard>
    </div>
    <Pagination :totalPageNum="pageNum"></Pagination>
  </div>
</template>

<script>
import TabsRound from "@/components/TabsRound"
import MVCard from "@/components/MVCard"
import Pagination from "@/components/Pagination"
import { ref, reactive, provide, computed, watch } from "vue"
import { reqAllMvs } from "@/api/mv"

// 一页中展示多少mv
const LIMIT = 40
export default {
  setup() {
    let mvs = reactive([])
    let currentPage = ref(1)
    let pageNum = ref(0)
    // 记录所有被选中的tab
    let onTabs = {}

    async function getAllMvs(paramObj) {
      paramObj.limit = LIMIT
      paramObj.offset = (currentPage.value - 1) * LIMIT
      const _mvs = await reqAllMvs(paramObj)
      mvs = Object.assign(mvs, _mvs.data)
      if (!pageNum.value) {
        initNum(_mvs.count)
      }
    }
    function initNum(count) {
      pageNum.value = Math.ceil(count / LIMIT)
    }

    provide("updateOnTabs", (_onTabs) => {
      onTabs = _onTabs
      getAllMvs(onTabs)
    })

    // 页码
    function updateCurrentPage(page) {
      currentPage.value = page
    }
    provide("updateCurrentPage", updateCurrentPage)
    let newMvs = ref(null)
    watch(currentPage, () => {
      newMvs.value.scrollIntoView({ behavior: "smooth" })
      getAllMvs(onTabs)
    })

    return { mvs, pageNum, newMvs }
  },
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
