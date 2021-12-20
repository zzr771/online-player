// "发现音乐"页面中的"最新音乐"组件
<template>
  <div class="new-songs">
    <TitleH2 title="最新音乐"></TitleH2>
    <ul class="songs-wrapper">
      <li class="song" v-for="(newSong, index) in newSongs" :key="index" @click="clickSong(newSong)">
        <p class="left">{{ parseInt(index) + 1 }}</p>
        <div class="middle">
          <img :src="genImgURL(newSong.img, 136, 136)" alt="" />
          <PlayIcon :size="24"></PlayIcon>
        </div>
        <div class="right">
          <p class="song-name">{{ newSong.name }}</p>
          <p class="singer">{{ newSong.artistsText }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import TitleH2 from "@/components/TitleH2"
import PlayIcon from "@/components/PlayIcon"
import { standardizeSongObj } from "@/utils/business"
import { genImgURL } from "@/utils/common"
import { reqNewSongs } from "@/api/discovery"
import { reactive } from "vue"
import { useStore } from "vuex"
export default {
  setup() {
    let store = useStore()
    let newSongs = reactive({})
    ;(async function getNewSongs() {
      const songsObj = await reqNewSongs()
      // 接口api返回的新歌数量不稳定,这里只取前十
      songsObj.result = songsObj.result.slice(0, 10)
      const restructuredSongs = restructure(songsObj.result)
      newSongs = Object.assign(newSongs, restructuredSongs)
    })()
    // 调整,精简每一个song的结构
    function restructure(songs) {
      return songs.map((song) => {
        const {
          id,
          name,
          picUrl,
          song: { album, artists, duration, mvid },
        } = song
        return standardizeSongObj({
          id,
          name,
          img: picUrl,
          artists,
          duration,
          albumId: album.id,
          albumName: album.name,
          albumImg: album.picUrl,
          mvId: mvid,
        })
      })
    }

    function clickSong(song) {
      store.dispatch("music/startSong", song)
    }

    return { newSongs, clickSong, genImgURL }
  },
  components: { TitleH2, PlayIcon },
}
</script>

<style lang="less" scoped>
.new-songs {
  margin-bottom: 30px;
}

.songs-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 420px;
  font-size: @font-size-sm;
  .song {
    display: flex;
    width: 50%;
    height: 20%;
    padding: 8px;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      background-color: var(--light-bgcolor);
    }
    .left {
      width: 30px;
      margin-right: 8px;
      text-align: center;
      line-height: 68px;
    }
    .middle {
      position: relative;
      display: flex;
      width: 68px;
      height: $width;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}
</style>
