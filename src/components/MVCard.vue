// 位于"最新mv"页面的, 长方形MV单元. 也是discovery页面的"最新mv"部分的单元
<template>
  <div class="mv-card" @click="routeGo">
    <div class="img-part">
      <img :src="genImgURL(mv.picUrl, 500, 260)" alt="" />
      <div class="play-count">
        <i class="iconfont icon-bofang"></i>
        {{ simplifyPlayCount(mv.playCount) }}
      </div>
      <PlayIcon :size="45"></PlayIcon>
    </div>
    <p class="name">{{ mv.name }}</p>
    <p class="author">{{ mv.artistName }}</p>
  </div>
</template>

<script>
import { useRouter } from "vue-router"
import PlayIcon from "@/components/PlayIcon"
import { genImgURL, simplifyPlayCount } from "@/utils/common"
export default {
  props: { mv: Object },
  setup(props) {
    const router = useRouter()
    function routeGo() {
      router.push({ path: `/mv/${props.mv.id}` })
    }

    return { routeGo, genImgURL, simplifyPlayCount }
  },
  components: { PlayIcon },
}
</script>

<style lang="less" scoped>
.mv-card {
  position: relative;
  width: 25%;
  padding: 0 12px;
  margin-bottom: 36px;
  cursor: pointer;
  .img-part {
    position: relative;
    img {
      width: 100%;
      border-radius: 5px;
    }
    .play-count {
      position: absolute;
      top: 3px;
      right: 3px;
      font-size: 12px;
      color: #fff;
      i {
        font-size: 100%;
      }
    }
  }
  .name,
  .author {
    font-size: @font-size-sm;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .name {
    margin-top: 8px;
  }
  .author {
    margin-top: 4px;
    color: var(--font-color-grey-shallow);
  }
}
</style>
