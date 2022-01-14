// "发现音乐"页面中的"推荐歌单"组件
<template>
  <div class="recommended-list">
    <TitleH2 title="推荐歌单"></TitleH2>
    <div class="lists-wrapper">
      <ListCard v-for="(playlist, index) in playlists" :key="index" :playlist="playlist"></ListCard>
    </div>
  </div>
</template>

<script>
import ListCard from "@/components/ListCard"
import TitleH2 from "@/components/TitleH2"
import { reqPerPlaylists } from "@/api/discovery"
import { reactive } from "vue"

const LIMIT = 10
export default {
  setup() {
    let playlists = reactive([])
    ;(async function getPerPlaylists() {
      let result = await reqPerPlaylists({ limit: LIMIT })
      if (result.code === 200) {
        playlists.length = 0
        playlists = Object.assign(playlists, result.result)
      }
    })()
    return { playlists }
  },
  components: { ListCard, TitleH2 },
}
</script>

<style lang="less" scoped>
.lists-wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>
