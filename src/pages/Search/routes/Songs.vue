<template>
  <div class="songs">
    <table class="songs-tab">
      <thead>
        <tr>
          <th class="num"></th>
          <th class="name">音乐标题</th>
          <th class="author">歌手</th>
          <th class="album">专辑</th>
          <th class="duration">时长</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="row-song"
          v-for="(song, index) in songs"
          :key="index"
          :class="{ stripe: index % 2 == 1, playing: song.isPlaying }"
        >
          <!-- 序号小于10的话, 前面加0 -->
          <td class="num">
            <i class="iconfont icon-zuidayinliang" v-if="song.isPlaying"></i>
            <span v-else>{{ index < 9 ? "0" + (index + 1) : index + 1 }}</span>
          </td>
          <td class="name tbody">
            <span @click="clickSong(song)">{{ song.name }}</span>
            <i class="iconfont icon-bofangMV" v-if="song.mvId" @click="$router.push(`/mv/${song.mvId}`)"></i>
          </td>
          <td>{{ song.artistsText }}</td>
          <td>{{ song.albumName }}</td>
          <td>{{ parseTime(song.durationSecond) }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :totalPageNum="totalPage"></Pagination>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { ref, reactive, provide, watch, inject } from "vue"
import { useStore } from "vuex"
import { reqSongDetail } from "@/api/music"
import { standardizeSongObj } from "@/utils/business"
import { parseTime } from "@/utils/common"

const LIMIT = 30
export default {
  setup() {
    let data = inject("data")

    let songs = reactive([])
    let totalPage = ref(1)
    // 当前页码, 传递给Pagination组件
    let currentPage = ref(1)
    provide("currentPage", currentPage)

    // 监视data["search-songs"],即搜索到的歌曲
    watch(
      () => data["search-songs"],
      (newValue) => {
        // 如果还没有数据或者请求错误
        if (!newValue.result.songs || newValue.code !== 200) return

        let result = newValue.result

        // 处理页码
        totalPage.value = Math.ceil(result.songCount / LIMIT)

        // 处理歌曲信息
        let _songs = result.songs.slice(0, 30).map((s) => {
          const { id, name, artists, duration, album, mvid } = s
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
        songs = Object.assign(songs, _songs)
      }
    )

    // 监视搜索关键词,如果变化了,就把currentPage重置为1
    watch(
      () => data.keyword,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          currentPage.value = 1
        }
      }
    )

    // 页码改变,通知search,然后search会发送新的请求
    let uploadCurrentPage = inject("uploadCurrentPage")
    watch(currentPage, (newValue) => {
      uploadCurrentPage(newValue)
    })

    // 点击歌曲后,根据歌曲id去请求完整信息(因为搜索结果返回的歌曲信息不全,没有图片地址,而playPage中需要显示图片)
    const store = useStore()
    async function clickSong(song) {
      const result = await reqSongDetail(song.id)
      let imgUrl = result.songs[0].al.picUrl
      song.img = imgUrl

      store.dispatch("music/startSong", song)
    }

    return { songs, totalPage, clickSong, parseTime }
  },
  components: { Pagination },
}
</script>

<style lang="less" scoped>
.songs-tab {
  width: 100%;
  margin-bottom: 15px;
  font-size: @font-size-sm;
  text-align: left;
  line-height: 24px;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  color: #606266;
  thead {
    border-bottom: 1px solid var(--border);
    th {
      font-weight: normal;
      color: var(--font-color-grey2);
      &.num {
        width: 5%;
      }
      &.name {
        width: 45%;
      }
      &.author,
      &.album {
        width: 20%;
      }
      &.duration {
        width: 10%;
      }
    }
  }
  td,
  th {
    padding: 4px 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .num {
    color: var(--font-color-grey-shallow);
    text-align: right;
  }
  .name {
    color: var(--font-color-white);
    &.tbody {
      color: @blue;
      i {
        display: inline-block;
        margin-left: 8px;
        margin-top: 1px;
        color: @theme-color;
        cursor: pointer;
      }
    }
    span {
      cursor: pointer;
    }
  }
  .row-song {
    &.stripe {
      background-color: var(--stripe-bg);
    }
    &:hover {
      background-color: var(--playlist-hover-bgcolor);
    }
    &.playing {
      .name,
      .num {
        color: @theme-color;
      }
    }
  }
}
</style>
