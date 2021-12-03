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
            <span v-else>{{ index < 11 ? "0" + (index + 1) : index + 1 }}</span>
          </td>
          <td class="name">
            <span @click="clickSong(song)">{{ song.name }}</span>
          </td>
          <td>{{ song.author }}</td>
          <td>{{ song.album }}</td>
          <td>{{ song.duration }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :totalPageNum="10"></Pagination>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { reactive } from "vue"
export default {
  props: {
    keyword: String,
  },
  setup() {
    const songs = reactive([
      {
        name: `Hedwig's Theme (From "Harry Potter and the Philosopher's Stone")`,
        author: `Christoph Eschenbach/Wiener Philharmoniker`,
        album: `Sommernachtskonzert 2017 (Summer Night Concert 2017) [Live]`,
        duration: `05:25`,
        desc: ``,
      },
      {
        name: `Hedwig's Theme`,
        author: `The City of Prague Philharmonic Orchestra`,
        album: `Music from the Harry Potter Films`,
        duration: `04:51`,
        desc: `海德薇变奏曲`,
      },
      {
        name: `Hedwig's Theme`,
        author: `John Williams`,
        album: `Harry Potter and the Philosopher's Stone`,
        duration: `05:09`,
        desc: ``,
      },
    ])

    function clickSong(song) {
      songs.forEach((song) => {
        song.isPlaying = false
      })
      song.isPlaying = true
    }
    return { songs, clickSong }
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
  line-height: 23px;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  color: #606266;
  th {
    font-weight: normal;
    color: var(--font-color-grey2);
    &.num {
      width: 5%;
    }
    &.duration {
      width: 10%;
    }
    &.name {
      width: 35%;
    }

    &.author,
    &.album {
      width: 25%;
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
