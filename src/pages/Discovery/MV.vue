// "发现音乐"页面中的"推荐MV"组件
<template>
  <div class="recommended-mv">
    <TitleH2 title="推荐MV"></TitleH2>
    <div class="mv-list">
      <MVCard v-for="(newMV, index) in newMVs" :key="index" :mv="newMV"></MVCard>
    </div>
  </div>
</template>

<script>
import TitleH2 from "@/components/TitleH2"
import MVCard from "@/components/MVCard"
import { reqNewMVs } from "@/api/discovery"
import { reactive } from "vue"
export default {
  setup() {
    let newMVs = reactive({})
    ;(async function () {
      let response = await reqNewMVs()
      newMVs = Object.assign(newMVs, response.result)
    })()

    return { newMVs }
  },
  components: { TitleH2, MVCard },
}
</script>

<style lang="less" scoped>
.mv-list {
  display: flex;
  margin: 0 -12px;
}
</style>
