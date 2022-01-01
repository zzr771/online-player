// "最新音乐"一级路由页
<template>
  <div class="new-songs">
    <div class="tabs-wrapper">
      <div class="play-all" @click="playAll"><span v-if="songs.length">播放全部</span></div>
      <TabsBasic></TabsBasic>
    </div>
    <ul class="songs-wrapper">
      <li
        class="song-card"
        v-for="(song, index) in songs"
        :key="song.index"
        :class="{ playing: song.isPlaying }"
      >
        <i class="playingIcon iconfont icon-zuidayinliang" v-if="song.isPlaying"></i>
        <span class="number" v-else>{{ index + 1 }}</span>
        <div class="img-part" @click="clickSong(song)">
          <img :src="genImgURL(song.img, 120)" alt="" />
          <PlayIcon :size="24"></PlayIcon>
        </div>
        <div class="name">
          <span @click="clickSong(song)">{{ song.name }}</span>
          <i class="iconfont icon-bofangMV" v-if="song.mvId" @click="$router.push(`/mv/${song.mvId}`)"></i>
        </div>
        <div class="author">{{ song.artistsText }}</div>
        <div class="album">{{ song.albumName }}</div>
        <div class="time">{{ parseTime(song.durationSecond) }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import TabsBasic from "@/components/TabsBasic"
import PlayIcon from "@/components/PlayIcon"
import { reactive, provide, watch } from "vue"
import { useStore } from "vuex"
import { reqTopSongs } from "@/api/music"
import { standardizeSongObj } from "@/utils/business"
import { genImgURL, parseTime } from "@/utils/common"
export default {
  setup() {
    const store = useStore()
    const tabs = reactive([
      { name: "全部", on: true, type: 0 },
      { name: "华语", on: false, type: 7 },
      { name: "欧美", on: false, type: 96 },
      { name: "日本", on: false, type: 8 },
      { name: "韩国", on: false, type: 16 },
    ])
    provide("tabs", tabs)

    let songs = reactive([])
    async function getTopSongs() {
      const tabOn = tabs.find((tab) => {
        return tab.on
      })
      let _topSongs = await reqTopSongs(tabOn.type)
      _topSongs = _topSongs.data.map((song) => {
        const { id, name, album, artists, duration, mvid } = song
        return standardizeSongObj({
          id,
          name,
          img: album.picUrl,
          artists,
          duration,
          albumId: album.id,
          albumName: album.name,
          albumImg: album.picUrl,
          mvId: mvid,
        })
      })

      songs.length = 0
      songs = Object.assign(songs, _topSongs)
    }
    getTopSongs()

    let lastIndex = 0
    watch(tabs, (newValue) => {
      const onIndex = newValue.findIndex((tab) => {
        return tab.on
      })
      if (onIndex !== lastIndex) {
        getTopSongs()
        lastIndex = onIndex
      }
    })

    function clickSong(song) {
      store.dispatch("music/startSong", song)
    }

    function playAll() {
      if (songs.length) {
        store.commit("music/addListToPlayList", { list: songs })
      }
    }

    return { songs, clickSong, playAll, genImgURL, parseTime }
  },
  components: {
    TabsBasic,
    PlayIcon,
  },
}
</script>

<style lang="less" scoped>
.new-songs {
  padding: 12px;
  .tabs-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .play-all {
      padding: 4px 8px;
      margin-left: 25px;
      color: var(--tab-item-color);
      font-size: @font-size-sm;
      cursor: pointer;
      &:hover {
        color: @theme-color;
      }
    }
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
      img {
        height: 100%;
        border-radius: 5px;
      }
    }
    .name,
    .author,
    .album {
      .text-overflow;
      padding-right: 20px;
    }
    .name {
      display: flex;
      width: 235px;
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
      width: 235px;
    }
    .album {
      width: 235px;
    }
    .time {
      min-width: 50px;
    }
    &:hover {
      background-color: var(--playlist-hover-bgcolor);
    }
    &.playing .name {
      color: @theme-color;
    }
  }
}

.text-overflow() {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
