// 位于"推荐歌单"页面中的, 方形歌单单元
<template>
  <div
    class="list-card"
    v-if="playlist"
    @click="$router.push({ path: '/playlistDetail', query: { id: playlist.id } })"
  >
    <div class="img-part">
      <!-- <img :src="genImgURL(imgUrl, 360)" alt="" /> -->
      <img v-lazy="genImgURL(imgUrl, 360)" alt="" :key="imgUrl" />
      <div class="tag">播放量: {{ simplifyPlayCount(playlist.playCount) }}</div>
      <div class="play-icon">
        <i class="iconfont icon-bofang"></i>
      </div>
    </div>
    <p class="list-name">{{ playlist.name }}</p>
  </div>
</template>

<script>
import { genImgURL, simplifyPlayCount } from "@/utils/common"
import { computed } from "vue"
export default {
  props: {
    playlist: Object,
  },
  setup(props) {
    const imgUrl = computed(() => {
      if (props.playlist.coverImgUrl) return props.playlist.coverImgUrl
      if (props.playlist.picUrl) return props.playlist.picUrl
    })
    return { imgUrl, genImgURL, simplifyPlayCount }
  },
}
</script>

<style lang="less" scoped>
.list-card {
  width: 20%;
  font-size: @font-size-sm;
  color: var(--font-color);
  padding: 4px 4px 32px;
  cursor: pointer;
  .img-part {
    position: relative;
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
    &:hover .tag {
      transform: translateY(0);
    }
    &:hover .play-icon {
      opacity: 1;
    }
    img {
      border-radius: 5px;
      width: 100%;
    }
    .tag {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 28px;
      line-height: $height;
      padding-left: 10px;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.4);
      transition: 0.3s;
      transform: translateY(-100%);
    }
    .play-icon {
      position: absolute;
      bottom: 7px;
      right: 4px;
      width: 36px;
      height: $width;
      line-height: $height;
      text-align: center;
      border-radius: 50%;
      background-color: @font-color-transparent;
      transition: 0.3s;
      opacity: 0;
      i {
        font-size: @font-size;
        padding-left: 2px;
        vertical-align: middle;
        color: @theme-color;
      }
    }
  }
  .list-name {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
