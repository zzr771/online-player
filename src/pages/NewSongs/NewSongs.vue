<template>
  <div class="new-songs">
    <TabsBasic></TabsBasic>
    <ul class="songs-wrapper">
      <li
        class="song-card"
        v-for="(song, index) in songs"
        :key="song.name"
        :class="{ playing: song.isPlaying }"
      >
        <i class="playingIcon iconfont icon-zuidayinliang" v-if="song.isPlaying"></i>
        <span class="number" v-else>{{ index + 1 }}</span>
        <div class="img-part">
          <img src="./images/1.jpg" alt="" />
          <div class="play-icon">
            <i class="iconfont icon-bofang"></i>
          </div>
        </div>
        <div class="name">
          <span>{{ song.name }}</span>
          <i class="iconfont icon-bofangMV"></i>
        </div>
        <div class="author">{{ song.author }}</div>
        <div class="album">{{ song.album }}</div>
        <div class="time">{{ song.time }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import TabsBasic from "@/components/TabsBasic"
import { reactive, provide } from "vue"
export default {
  components: {
    TabsBasic,
  },
  setup() {
    const tabs = reactive([
      { name: "全部", on: false },
      { name: "华语", on: false },
      { name: "欧美", on: false },
      { name: "日本", on: false },
      { name: "韩国", on: false },
    ])
    provide("tabs", tabs)
    const songs = reactive([
      {
        img: "",
        name: "I Still Have Faith In You",
        author: "ABBA",
        album: "Voyage",
        time: "05:09",
        hasMV: true,
        isPlaying: true,
      },
      {
        img: "",
        name: "I Still Have Faith In You",
        author: "ABBA",
        album: "Voyage",
        time: "05:09",
        hasMV: true,
        isPlaying: false,
      },
      {
        img: "",
        name: "I Still Have Faith In You",
        author: "ABBA",
        album: "Voyage",
        time: "05:09",
        hasMV: true,
        isPlaying: false,
      },
      {
        img: "",
        name: "I Still Have Faith In You",
        author: "ABBA",
        album: "Voyage",
        time: "05:09",
        hasMV: true,
        isPlaying: false,
      },
    ])

    return { songs }
  },
}
</script>

<style lang="less" scoped>
.new-songs {
  padding: 12px;
}
.song-card {
  display: flex;
  align-items: center;
  height: 68px;
  padding: 4px 0;
  border-radius: 5px;
  color: #606266;
  font-size: @font-size-sm;
  .number {
    width: 70px;
    text-align: center;
    color: var(--font-color-grey-shallow);
  }
  .playingIcon {
    width: 70px;
    text-align: center;
    color: @theme-color;
  }
  .img-part {
    position: relative;
    height: 100%;
    margin-left: 14px;
    margin-right: 40px;
    cursor: pointer;
    &:hover {
      .play-icon {
        opacity: 1;
      }
    }
    img {
      height: 100%;
      border-radius: 5px;
    }
    .play-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: $width;
      line-height: $height;
      border-radius: 50%;
      text-align: center;
      background-color: @font-color-transparent;
      transition: 0.3s;
      opacity: 0;
      i {
        font-size: 12px;
        margin-left: 2px;
        color: @theme-color;
      }
    }
  }
  .name {
    display: flex;
    width: 235px;
    color: var(--font-color-white);
    span {
      cursor: pointer;
      padding: 8px 0;
    }
    i {
      margin-left: 10px;
      padding: 8px 0;
      font-size: 14px;
      color: @theme-color;
      cursor: pointer;
    }
  }
  .author {
    width: 235px;
  }
  .album {
    width: 235px;
  }
  &:hover {
    background-color: var(--playlist-hover-bgcolor);
  }
  &.playing {
    background-color: var(--playlist-hover-bgcolor);
  }
}
</style>
