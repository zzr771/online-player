// 点击miniPlayer中"歌单"按钮, 弹出的用户播放歌单模块
<template>
  <div class="play-list" v-show="showPlayList">
    <div class="tabs">
      <span class="tab" :class="{ on: !showHistory }" @click="showHistory = false">播放列表</span>
      <span class="tab" :class="{ on: showHistory }" @click="showHistory = true">历史记录</span>
    </div>
    <div class="header">
      <span class="total">共有 53 首</span>
      <span class="clear">
        <i class="iconfont icon-shanchu"></i>
        清空
      </span>
    </div>
    <!-- 要先检查播放列表中是否有歌曲 -->
    <div class="songs-list-wrapper playing-list" v-if="!showHistory && true">
      <table class="songs-list">
        <thead>
          <tr>
            <th class="name">音乐标题</th>
            <th class="author">歌手</th>
            <th class="duration">时长</th>
          </tr>
        </thead>
        <tbody>
          <tr class="song" :class="{ playing: true }">
            <td class="name">
              <div class="song-name-wrapper">
                <span class="song-name-span">someone like you someone like you</span>
              </div>
              <!-- 检查此歌是否有mv,决定是否显示mv图标 -->
              <i class="iconfont icon-bofangMV"></i>
            </td>
            <td class="author">Adele</td>
            <td class="duration">04:45</td>
          </tr>
          <tr class="song" :class="{ playing: false }" v-for="(item, index) in 20" :key="index">
            <td class="name">
              <div class="song-name-wrapper">
                <span class="song-name-span">单车</span>
              </div>
            </td>
            <td class="author">陈奕迅</td>
            <td class="duration">03:52</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 要先检查历史列表中是否有歌曲 -->
    <div class="songs-list-wrapper history-list" v-if="showHistory && true">
      <table class="songs-list">
        <thead>
          <tr>
            <th class="name">音乐标题</th>
            <th class="author">歌手</th>
            <th class="duration">时长</th>
          </tr>
        </thead>
        <tbody>
          <tr class="song" :class="{ playing: false }" v-for="(item, index) in 5" :key="index">
            <td class="name">
              <div class="song-name-wrapper">
                <span class="song-name-span">单车</span>
              </div>
            </td>
            <td class="author">陈奕迅</td>
            <td class="duration">03:52</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="empty">列表中没有添加任何歌曲</div>
  </div>
</template>

<script>
import { ref, computed } from "vue"
import { useStore } from "vuex"
export default {
  setup() {
    // 显示"历史记录"还是"播放列表"
    let showHistory = ref(false)
    const store = useStore()
    let showPlayList = computed(() => store.state.music.showPlayList)

    return {
      showHistory,
      showPlayList,
    }
  },
}
</script>

<style lang="less" scoped>
.play-list {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 800;
  top: 0;
  bottom: @mini-player-height;
  right: 0;
  width: 400px;
  background-color: @white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);

  .tabs {
    height: 42px;
    line-height: $height;
    text-align: center;
    font-size: @font-size-medium;
    color: var(--tab-item-color);
    span:first-child {
      margin-right: 25px;
    }
    span {
      cursor: pointer;
      &:hover {
        color: var(--tab-item-hover-color);
      }
      &.on {
        color: var(--tab-item-hover-color);
      }
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    margin: 0 20px;
    font-size: @font-size-sm;
    border-bottom: 1px solid var(--border);
    .clear {
      cursor: pointer;
      display: flex;
      i {
        margin-top: -2px;
        margin-right: 5px;
      }
    }
  }
  .songs-list-wrapper {
    flex: 1;
    overflow-y: auto;
    .songs-list {
      font-size: @font-size-sm;
      text-align: left;
      width: 100%;
      table-layout: fixed;
      thead tr {
        .name {
          width: 50%;
        }
        .author,
        .duration {
          width: 25%;
        }
      }
      th,
      td {
        line-height: 23px;
        padding: 4px 14px;
        padding-right: 5px;
        font-weight: normal;
        i {
          position: relative;
          top: 1px;
          margin-left: 8px;
          color: @theme-color;
          cursor: pointer;
        }
      }
      .name {
        display: flex;
        color: var(--font-color-white);
        .song-name-wrapper {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }
      }
      .author,
      .duration {
        color: #606266;
      }
      th.author,
      th.duration {
        color: var(--font-color-grey2);
      }
      tbody tr {
        &:hover {
          background-color: var(--playlist-hover-bgcolor);
        }
        &.playing {
          .song-name-span {
            color: @theme-color;
          }
        }
      }
    }
  }
  .empty {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
