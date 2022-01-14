// 歌曲卡片 用于"最新音乐"页面和歌单详情页
<template>
  <div class="song-card" :class="{ playing: song.isPlaying }">
    <div class="number">
      <i class="playingIcon iconfont icon-zuidayinliang" v-if="song.isPlaying"></i>
      <span class="number-text" v-else>{{ index + 1 }}</span>
    </div>
    <div class="img" @click="clickSong(song)">
      <img v-lazy="genImgURL(song.img, 120)" alt="" :key="song.img" />
      <PlayIcon :size="24"></PlayIcon>
    </div>
    <div class="name">
      <span @click="clickSong(song)">{{ song.name }}</span>
      <i class="iconfont icon-bofangMV" v-if="song.mvId" @click="$router.push(`/mv/${song.mvId}`)"></i>
    </div>
    <div class="author">{{ song.artistsText }}</div>
    <div class="album">{{ song.albumName }}</div>
    <div class="time">{{ parseTime(song.durationSecond) }}</div>
  </div>
</template>

<script>
import PlayIcon from "@/components/PlayIcon"
import { genImgURL, parseTime } from "@/utils/common"
import { useStore } from "vuex"
export default {
  props: {
    song: Object,
    index: Number,
  },
  setup() {
    const store = useStore()

    function clickSong(song) {
      store.dispatch("music/startSong", song)
    }
    return { clickSong, genImgURL, parseTime }
  },
  components: { PlayIcon },
}
</script>

<style lang="less" scoped>
.song-card {
  display: flex;
  align-items: center;
  height: 68px;
  padding: 4px 0;
  border-radius: 5px;
  color: #606266;
  font-size: @font-size-sm;
  .number {
    width: 100px;
    text-align: center;
    color: var(--font-color-grey-shallow);
    .playingIcon {
      width: 100%;
      text-align: center;
      color: @theme-color;
    }
  }
  .img {
    position: relative;
    margin-right: 20px;
    width: 60px;
    height: $width;
    cursor: pointer;
    img {
      width: 60px;
      height: $width;
      border-radius: 5px;
    }
  }
  .name,
  .author,
  .album {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 20px;
  }
  .name {
    display: flex;
    width: 30%;
    color: var(--font-color-white);
    span {
      overflow: hidden;
      padding: 8px 0;
      cursor: pointer;
    }
    i {
      margin-left: 10px;
      font-size: 14px;
      padding: 8px 0;

      color: @theme-color;
      cursor: pointer;
    }
  }
  .author {
    width: 20%;
  }
  .album {
    width: 20%;
  }
  .time {
    min-width: 10%;
  }
  &:hover {
    background-color: var(--playlist-hover-bgcolor);
  }
  &.playing .name {
    color: @theme-color;
  }
}
</style>
