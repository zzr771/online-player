<template>
  <div class="playlist-detail" v-if="true">
    <Header :playlist="playlist.listInfo" v-if="playlist.listInfo.id"></Header>
    <div class="tabs-search">
      <TabsBasic :fontSize="14"></TabsBasic>
      <div class="search-part">
        <input type="text" placeholder="搜索歌单音乐" v-model="keyword" />
        <i class="iconfont icon-sousuo"></i>
      </div>
    </div>

    <!-- 歌曲部分 -->
    <div class="songs-wrapper" v-if="filteredSongs.length" v-show="!showComments">
      <div class="song-tab-title">
        <div class="place-holder"></div>
        <div class="name">歌名</div>
        <div class="author">歌手</div>
        <div class="album">专辑</div>
        <div class="time">时长</div>
      </div>
      <SongCard v-for="(song, index) in filteredSongs" :key="index" :song="song" :index="index"></SongCard>
    </div>
    <div class="empty" v-if="!filteredSongs.length && keyword.length">
      未能找到和
      <span class="keyword">{{ keyword }}</span>
      相关的任何音乐
    </div>

    <!-- 评论部分 -->
    <keep-alive>
      <div class="comments" v-if="showComments">
        <Comments :id="playlist.listInfo.id" type="playlist" />
      </div>
    </keep-alive>
  </div>
</template>

<script>
import TabsBasic from "@/components/TabsBasic"
import SongCard from "@/components/SongCard"
import Comments from "@/components/Comments"
import Header from "./Header"
import { ref, reactive, provide, watch, computed } from "vue"
import { useStore } from "vuex"
import { reqPlaylistDetail, reqSongDetail } from "@/api/music"
import { standardizeSongObj } from "@/utils/business"
export default {
  props: {
    id: {
      required: true,
      type: [String, Number],
    },
  },
  setup(props) {
    const store = useStore()

    // 核心变量, 包含歌单信息以及歌单中的歌曲
    let playlist = reactive({ listInfo: {}, songs: [] })
    let filteredSongs = reactive([])

    let tabs = reactive([
      { name: "歌曲列表", on: true },
      { name: "评论", on: false },
    ])
    provide("tabs", tabs)
    let showComments = computed(() => {
      return tabs[1].on
    })

    // 获取歌单详情和歌单中所有歌曲的信息
    async function getPlaylistDetail() {
      let _playlist = await reqPlaylistDetail(props.id)
      if (_playlist.code !== 200) return

      playlist.listInfo = _playlist.playlist

      // 根据歌单中的歌曲id, 请求所有歌曲的信息 (有的歌单包含的歌曲太多, 做多只取前100首)
      let idStr = ""
      playlist.listInfo.trackIds.slice(0, 100).forEach((track) => {
        idStr += track.id + ","
      })
      idStr = idStr.slice(0, -1)
      let _songs = await reqSongDetail(idStr)
      if (_songs.code !== 200) return
      // 歌曲对象重构
      _songs = _songs.songs.map((song) => {
        const { id, name, al, ar, dt, mv } = song
        return standardizeSongObj({
          id,
          name,
          img: al.picUrl,
          artists: ar,
          duration: dt,
          albumId: al.id,
          albumName: al.name,
          albumImg: al.picUrl,
          mvId: mv,
        })
      })
      playlist.songs = _songs
      filteredSongs.length = 0
      filteredSongs = Object.assign(filteredSongs, _songs)
    }
    getPlaylistDetail()

    // 播放全部歌曲
    provide("playAll", () => {
      if (playlist.songs.length) {
        store.commit("music/addListToPlayList", { list: playlist.songs })
      }
    })

    //--------------------------------歌单内搜索功能---------------------
    let keyword = ref("")
    watch(keyword, (newValue) => {
      let regExp = new RegExp(`${newValue}`, "i")
      let result = playlist.songs.filter((song) => {
        return regExp.test(song.name)
      })
      filteredSongs.length = 0
      filteredSongs = Object.assign(filteredSongs, result)
    })

    return { playlist, filteredSongs, keyword, showComments }
  },
  components: { Header, TabsBasic, SongCard, Comments },
}
</script>

<style lang="less" scoped>
.playlist-detail {
  width: 100%;

  .tabs-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24px;

    .search-part {
      position: relative;
      input {
        width: 150px;
        height: 24px;
        border-radius: 3px;
        padding-left: 30px;
        box-sizing: border-box;
        border: none;
        outline: none;
        background-color: var(--header-input-bgcolor);
        color: var(--header-input-color);
        font-size: 13px;
      }
      .icon-sousuo {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 10px;
        color: var(--header-input-color);
        font-size: 15px;
        margin-top: 1px;
        cursor: pointer;
      }
    }
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .keyword {
      margin: 0 5px;
      color: @blue;
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

  .comments {
    padding: 16px 32px;
  }
}
</style>
