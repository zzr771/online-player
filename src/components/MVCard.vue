// 位于"最新mv"页面的, 长方形MV单元. 也是discovery页面的"最新mv"部分的单元
<template>
  <div class="mv-card" @click="routeGo">
    <div class="img-part">
      <img v-lazy="genImgURL(img, 500, 260)" alt="" :key="img" />
      <div class="play-count">
        <i class="iconfont icon-bofang"></i>
        {{ simplifyPlayCount(mv.playCount) }}
      </div>
      <div class="duration" v-if="mv.duration">
        {{ parseTime(mv.duration / 1000) }}
      </div>
      <PlayIcon :size="45"></PlayIcon>
    </div>
    <p class="name">{{ mv.name }}</p>
    <p class="author">{{ mv.artistName }}</p>
  </div>
</template>

<script>
import PlayIcon from "@/components/PlayIcon"
import { useRouter } from "vue-router"
import { genImgURL, simplifyPlayCount, parseTime } from "@/utils/common"
import { computed } from "vue"
export default {
  props: { mv: Object },
  setup(props) {
    let img = computed(() => {
      if (props.mv.picUrl) return props.mv.picUrl
      if (props.mv.cover) return props.mv.cover
    })

    const router = useRouter()
    function routeGo() {
      router.push({ path: `/mv/${props.mv.id}` })
    }

    return { img, routeGo, genImgURL, simplifyPlayCount, parseTime }
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
      width: 216px;
      height: 115px;
      border-radius: 5px;
    }
    .play-count {
      position: absolute;
      top: 3px;
      right: 5px;
      font-size: @font-size-sm;
      color: #fff;
      i {
        font-size: 100%;
      }
    }
    .duration {
      position: absolute;
      bottom: 5px;
      right: 5px;
      font-size: @font-size-sm;
      color: #fff;
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
