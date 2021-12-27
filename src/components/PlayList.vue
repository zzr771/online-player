// 点击miniPlayer中"歌单"按钮, 弹出的用户播放歌单模块
<template>
  <div class="play-list" v-if="showPlayList" ref="playListEle">
    <div class="tabs">
      <span class="tab" :class="{ on: !showHistory }" @click="showHistory = false">播放列表</span>
      <span class="tab" :class="{ on: showHistory }" @click="showHistory = true">历史记录</span>
    </div>
    <div class="header">
      <span class="total">共有 {{ playList.length }} 首</span>
      <span class="clear" @click="clickClearBtn">
        <i class="iconfont icon-shanchu"></i>
        清空
      </span>
    </div>
    <!-- 播放列表 -->
    <div class="songs-list-wrapper playing-list" v-show="!showHistory">
      <table class="songs-list" v-if="playList.length">
        <thead>
          <tr>
            <th class="name">音乐标题</th>
            <th class="author">歌手</th>
            <th class="duration">时长</th>
            <th class="delete"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="song" :class="{ playing: song.isPlaying }" v-for="song in playList" :key="song.id">
            <td class="name" @click="clickSong(song)">
              <div class="content-wrapper">
                {{ song.name }}
              </div>
              <!-- 检查此歌是否有mv,决定是否显示mv图标 -->
              <i class="iconfont icon-bofangMV"></i>
            </td>
            <td class="author">
              <div class="content-wrapper">
                {{ song.artistsText }}
              </div>
            </td>
            <td class="duration">{{ parseTime(song.durationSecond) }}</td>
            <td class="delete" @click="deleteSong(song)"><i class="iconfont icon-shanchu"></i></td>
          </tr>
        </tbody>
      </table>
      <div class="empty" v-else>播放列表中还没有添加歌曲哦~</div>
    </div>
    <!-- 历史记录 -->
    <div class="songs-list-wrapper history-list" v-show="showHistory">
      <table class="songs-list" v-if="historyPlayList.length">
        <thead>
          <tr>
            <th class="name">音乐标题</th>
            <th class="author">歌手</th>
            <th class="duration">时长</th>
            <th class="delete"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="song" :class="{ playing: false }" v-for="song in historyPlayList" :key="song.id">
            <td class="name">
              <div class="content-wrapper">
                {{ song.name }}
              </div>
              <i class="iconfont icon-bofangMV"></i>
            </td>
            <td class="author">
              <div class="content-wrapper">
                {{ song.artistsText }}
              </div>
            </td>
            <td class="duration">{{ parseTime(song.durationSecond) }}</td>
            <td class="delete"></td>
          </tr>
        </tbody>
      </table>
      <div class="empty" v-else>历史记录为空</div>
    </div>
    <!-- 确定框 -->
    <transition name="fade">
      <div class="confirm-window" v-show="showConfirmWindow">
        <div class="text">确定要清空列表吗?</div>
        <div class="button-wrapper">
          <div class="button confirm" @click="clearList">确定</div>
          <div class="button" @click="showConfirmWindow = false">取消</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue"
import { useStore } from "vuex"
import { parseTime } from "@/utils/common"
export default {
  setup() {
    const store = useStore()

    // 显示"历史记录"还是"播放列表"
    let showHistory = ref(false)
    let showConfirmWindow = ref(false)
    let showPlayList = computed(() => store.state.music.showPlayList)
    let playList = computed(() => store.state.music.playList)
    let historyPlayList = computed(() => store.state.music.historyPlayList)

    // 点击"清空列表"按钮,就弹出确认框
    function clickClearBtn() {
      showConfirmWindow.value = true
    }

    // 清空列表
    function clearList() {
      // 先确定要清空的是播放列表还是历史记录
      if (!showHistory.value) {
        store.commit("music/clearPlayList")
      } else {
        store.commit("music/clearHistoryPlayList")
      }
      // 隐藏确定框
      showConfirmWindow.value = false
    }

    // 删除歌曲
    function deleteSong(song) {
      store.commit("music/removeSongFromPlayList", { song })
    }

    // 列表中的歌曲被点击, 就播放
    function clickSong(song) {
      store.dispatch("music/startSong", song)
    }

    //每次显示playList, 就立即绑定click事件的回调. 该回调的作用: 点击播放列表以外的任何地方, 播放列表都隐藏
    let playListEle = ref(null)
    watch(showPlayList, (newValue) => {
      if (newValue === true) {
        document.addEventListener("click", hidePlayList)
      }
    })
    function hidePlayList(event) {
      let pn = event.target.parentNode
      while (pn !== document.documentElement) {
        if (pn === playListEle.value) {
          return
        }
        pn = pn.parentNode
      }
      store.commit("music/toggleShowPlayList")
      document.removeEventListener("click", hidePlayList)
    }

    return {
      showPlayList,
      showHistory,
      showConfirmWindow,

      playList,
      historyPlayList,
      parseTime,
      clickClearBtn,
      clearList,
      deleteSong,
      clickSong,
      playListEle,
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
  width: 450px;
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
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        .name {
          width: 48%;
        }
        .author {
          width: 30%;
        }
        .duration {
          width: 15%;
        }
        .delete {
          width: 7%;
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
      th.author,
      th.duration {
        color: var(--font-color-grey2);
      }
      tbody tr {
        &:hover {
          background-color: var(--playlist-hover-bgcolor);
          .delete i {
            opacity: 1;
          }
        }
        &.playing {
          .name {
            color: @theme-color;
          }
        }
      }
      .name {
        display: flex;
        color: var(--font-color-white);
        cursor: pointer;
      }
      .author,
      .duration {
        color: #606266;
      }
      .delete {
        padding-left: 0;
        i {
          margin-left: 0;
          opacity: 0;
          color: var(--font-color-grey2);
        }
      }
      .content-wrapper {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80%;
  }

  .confirm-window {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 110px;
    border-radius: 5px;
    overflow: hidden;
    background-color: @white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    .text {
      height: 75px;
      line-height: $height;
      text-align: center;
    }
    .button-wrapper {
      display: flex;
      height: 35px;
      line-height: $height;
      font-size: @font-size-medium-sm;
      border-top: 1px solid var(--border);
      .button {
        flex: 50%;
        text-align: center;
        cursor: pointer;
        &.confirm {
          background-color: @theme-color;
          color: @white;
        }
      }
    }
  }
}
</style>
