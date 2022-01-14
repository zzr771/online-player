// 位于MV播放页面右侧的, 长方形小MV单元
<template>
  <div class="mv-card-mini" @click="$router.push(`/mv/${mv.id}`)">
    <div class="img-part">
      <img v-lazy="genImgURL(mv.cover, 280, 160)" alt="" :key="mv.cover" />
      <PlayIcon :size="36"></PlayIcon>
      <div class="play-count"><i class="iconfont icon-bofang"></i> {{ simplifyPlayCount(mv.playCount) }}</div>
      <div class="duration">{{ parseTime(mv.duration / 1000) }}</div>
    </div>
    <div class="content">
      <div class="name">{{ mv.name }}</div>
      <div class="desc">{{ mv.artistName }}</div>
    </div>
  </div>
</template>

<script>
import PlayIcon from "@/components/PlayIcon"
import { genImgURL, parseTime, simplifyPlayCount } from "@/utils/common"
export default {
  props: {
    mv: Object,
  },
  setup() {
    return { genImgURL, parseTime, simplifyPlayCount }
  },
  components: { PlayIcon },
}
</script>

<style lang="less" scoped>
.mv-card-mini {
  display: flex;
  padding: 8px 0 8px 8px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: var(--light-bgcolor);
  }
  .img-part {
    position: relative;
    margin-right: 8px;
    img {
      width: 140px;
      height: 76px;
      border-radius: 4px;
    }
    .play-count {
      position: absolute;
      top: 2px;
      right: 3px;
      color: @white;
      font-size: @font-size-sm;
      i {
        font-size: 100%;
      }
    }
    .duration {
      position: absolute;
      bottom: 5px;
      right: 3px;
      color: @white;
      font-size: @font-size-sm;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    .name,
    .desc {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name {
      font-size: @font-size-medium-sm;
    }
    .desc {
      font-size: @font-size-sm;
      color: var(--font-color-grey-shallow);
    }
  }
}
</style>
