// "最新音乐"一级路由页
<template>
  <div class="new-songs">
    <div class="tabs-wrapper">
      <div class="play-all" @click="playAll"><span v-if="songs.length">播放全部</span></div>
      <TabsBasic></TabsBasic>
    </div>

    <!-- 歌曲部分 -->
    <div class="song-tab-title">
      <div class="place-holder"></div>
      <div class="name">歌名</div>
      <div class="author">歌手</div>
      <div class="album">专辑</div>
      <div class="time">时长</div>
    </div>
    <SongCard v-for="(song, index) in songs" :key="index" :song="song" :index="index"></SongCard>
  </div>
</template>

<script>
import SongCard from "@/components/SongCard"
import TabsBasic from "@/components/TabsBasic"
import PlayIcon from "@/components/PlayIcon"
import { reactive, provide, watch } from "vue"
import { useStore } from "vuex"
import { reqTopSongs } from "@/api/music"
import { standardizeSongObj } from "@/utils/business"
export default {
  setup() {
    const store = useStore()
    let songs = reactive([])

    const tabs = reactive([
      { name: "全部", on: true, type: 0 },
      { name: "华语", on: false, type: 7 },
      { name: "欧美", on: false, type: 96 },
      { name: "日本", on: false, type: 8 },
      { name: "韩国", on: false, type: 16 },
    ])
    provide("tabs", tabs)
    watch(tabs, () => {
      getTopSongs()
    })

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

    function playAll() {
      if (songs.length) {
        store.commit("music/addListToPlayList", { list: songs })
      }
    }

    return { songs, playAll }
  },
  components: {
    SongCard,
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
  .song-tab-title {
    display: flex;
    font-size: @font-size-sm;
    color: var(--font-color-grey);
    padding: 5px 0;
    margin-bottom: 5px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    .place-holder {
      width: 180px;
    }
    .name {
      width: 30%;
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
  }
}
</style>
