// 点击miniPlayer中左侧歌曲图片, 弹出的播放页面. 包含歌词,评论,相关歌曲等
<template>
  <transition name="slide">
    <div class="play-page" v-if="currentSong.id" v-show="showPlayPage">
      <div class="content-wrapper">
        <div class="song">
          <div class="rotating-album">
            <img src="@/assets/images/play-bar-bearing.png" alt="" class="play-bar-bearing" />
            <img src="@/assets/images/play-bar.png" alt="" class="play-bar" :class="{ playing: isPlaying }" />
            <div class="img-outer-border">
              <div class="img-inner-border" :class="{ paused: !isPlaying }">
                <img v-lazy="genImgURL(currentSong.img, 400)" class="album-cover" :key="currentSong.img" />
              </div>
            </div>
          </div>
          <div class="song-info">
            <div class="title">
              {{ currentSong.name }}
              <span v-if="currentSong.mvId" @click="clickMV">MV</span>
            </div>
            <div class="desc">
              歌手：<span class="author">{{ currentSong.artistsText }}</span>
            </div>
            <div class="lyric-wrapper">
              <Scroller :parsedLyric="parsedLyric"></Scroller>
            </div>
          </div>
        </div>
        <div class="others">
          <div class="comments-wrapper">
            <Comments :id="currentSong.id" type="song"></Comments>
          </div>
          <div class="relative">
            <!-- 包含这首歌的歌单 -->
            <div class="relevant-playLists" v-if="relevantPlayLists.length">
              <p class="title">包含这首歌的歌单</p>
              <div class="list">
                <SongCardMini
                  v-for="(relevantPlayList, index) in relevantPlayLists"
                  :key="index"
                  :data="relevantPlayList"
                  type="playlist"
                >
                  <div class="slot">
                    <i class="iconfont icon-bofang"></i>
                    <span class="play-count">{{ simplifyPlayCount(relevantPlayList.playCount) }}</span>
                  </div>
                </SongCardMini>
              </div>
            </div>
            <!-- 相似歌曲 -->
            <div class="similiar-songs" v-if="simiSongs.length">
              <p class="title">相似歌曲</p>
              <div class="list">
                <SongCardMini
                  v-for="(simiSong, index) in simiSongs"
                  :key="index"
                  :data="simiSong"
                  type="song"
                >
                  {{ simiSong.artistsText }}
                </SongCardMini>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { reactive, computed, watchEffect } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import Scroller from "@/components/Scroller"
import Comments from "@/components/Comments"
import SongCardMini from "@/components/SongCardMini"
import { reqLyric, reqRelevantPlayLists, reqSimiSongs } from "@/api/music"
import LyricPaser from "@/utils/lrcparse"
import { genImgURL, simplifyPlayCount } from "@/utils/common"
import { standardizeSongObj } from "@/utils/business"
export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    let currentSong = computed(() => store.state.music.currentSong)
    let showPlayPage = computed(() => store.state.music.showPlayPage)
    let isPlaying = computed(() => store.state.music.isPlaying)

    let previousSongId = ""
    watchEffect(() => {
      // 打开播放页面的时候才去请求歌词和相关歌曲歌单, 并且如果歌没有变化,就不重新请求
      if (showPlayPage.value && currentSong.value.id !== previousSongId) {
        previousSongId = currentSong.value.id
        getSongData(currentSong.value.id)
      }
    })

    // 解析后的歌词,类型为数组,每个元素都是对象,各包含一句歌词的信息(时间,原文歌词,译文歌词). 结构: {time,contents:[lyric,tlyric]}
    let parsedLyric = reactive([])
    let relevantPlayLists = reactive([])
    let simiSongs = reactive([])
    // 获取歌曲相关数据
    async function getSongData(id) {
      let [_lrc, _relevantPlayLists, _simiSongs] = await Promise.all([
        reqLyric(id),
        reqRelevantPlayLists(id),
        reqSimiSongs(id),
      ])
      //-----------------------歌词
      // 先清除上一首歌的歌词
      parsedLyric.length = 0
      //如果歌词存在
      if (_lrc) {
        // 把LyricPaser解析后的数组赋值给parsedLyric,这里用Object.assign. 能够在不改变parsedLyric的响应式和内存指针的前提下把一个对象的所有属性赋值给它
        parsedLyric = Object.assign(parsedLyric, LyricPaser(_lrc))
      }
      //-----------------------相关歌单
      relevantPlayLists.length = 0
      relevantPlayLists = Object.assign(relevantPlayLists, _relevantPlayLists.playlists)
      //-----------------------相似歌曲
      // 歌曲对象标准化
      _simiSongs = _simiSongs.songs.map((s) => {
        const { id, name, album, duration, mvid } = s
        return standardizeSongObj({
          id,
          name,
          img: album.picUrl,
          artists: album.artists,
          duration,
          albumId: album.id,
          albumName: album.name,
          albumImg: album.picUrl,
          mvId: mvid,
        })
      })
      simiSongs.length = 0
      simiSongs = Object.assign(simiSongs, _simiSongs)
    }

    // 点击歌名后面的MV图标后的处理
    function clickMV() {
      router.push(`/mv/${currentSong.value.mvId}`)
      store.commit("music/toggleShowPlayPage")
    }

    return {
      parsedLyric,
      showPlayPage,
      isPlaying,
      currentSong,
      relevantPlayLists,
      simiSongs,
      genImgURL,
      simplifyPlayCount,
      clickMV,
    }
  },
  components: { Scroller, Comments, SongCardMini },
}
</script>

<style lang="less" scoped>
@img-left-padding: 36px;
@img-outer-border-d: 320px;
@img-inner-border-d: 300px;
.play-page {
  position: absolute;
  z-index: 150;
  top: @header-height;
  bottom: @mini-player-height;
  left: 0;
  right: 0;
  padding: 0 36px;
  overflow-y: auto;
  background: var(--player-bgcolor);
  transition: 0.5s;
  .content-wrapper {
    max-width: 870px;
    margin: 0 auto;
    .song {
      display: flex;
      margin-bottom: 48px;
      .rotating-album {
        position: relative;
        display: flex;
        justify-content: center;
        padding: 80px 70px 0 @img-left-padding;

        .play-bar-bearing {
          @support-d: 30px;
          position: absolute;
          // 要位于旋转图片的正上方
          left: @img-left-padding + @img-outer-border-d / 2 - @support-d / 2;
          // 一半藏在header下面
          top: -@support-d / 2;
          width: @support-d;
          height: $width;
          z-index: 2;
        }
        .play-bar {
          position: absolute;
          top: 0;
          left: @img-left-padding + @img-outer-border-d / 2 - 6px;
          width: 100px;
          height: 146px;
          z-index: 1;
          transform-origin: 0 0;
          transform: rotate(-30deg);
          transition: all 0.3s;
          &.playing {
            transform: rotate(5deg);
          }
        }

        .img-outer-border {
          display: flex;
          justify-content: center;
          align-items: center;
          width: @img-outer-border-d;
          height: $width;
          border-radius: 50%;
          background-color: var(--song-shallow-grey-bg);
          .img-inner-border {
            display: flex;
            justify-content: center;
            align-items: center;
            width: @img-inner-border-d;
            height: $width;
            border-radius: 50%;
            background: linear-gradient(45deg, #3d3e49, #070708, #3d3e49);

            animation: rotate 20s linear infinite;
            &.paused {
              animation-play-state: paused;
            }

            .album-cover {
              width: 200px;
              height: $width;
              border-radius: 50%;
            }
          }
        }
      }
      .song-info {
        flex: 1;
        padding-top: 45px;
        .title {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          font-size: @font-size-title-lg;
          color: var(--font-color-white);
          span {
            padding: 2px;
            margin-left: 10px;
            font-size: @font-size;
            color: @theme-color;
            border: 1px solid @theme-color;
            border-radius: 3px;
            cursor: pointer;
          }
        }
        .desc {
          margin-bottom: 30px;
          font-size: @font-size-sm;
          .author {
            margin-left: 5px;
            color: @blue;
          }
        }
        .lyric-wrapper {
          width: 380px;
          height: 350px;
          mask-image: linear-gradient(
            180deg,
            hsla(0, 0%, 100%, 0) 0,
            hsla(0, 0%, 100%, 0.6) 15%,
            #fff 25%,
            #fff 75%,
            hsla(0, 0%, 100%, 0.6) 85%,
            hsla(0, 0%, 100%, 0)
          );
          .empty {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        }
      }
    }
    .others {
      display: flex;
      .comments-wrapper {
        flex: 1;
      }
      .relative {
        width: 28%;
        padding-left: 36px;
        .relevant-playLists {
          margin-bottom: 36px;
        }
        .title {
          font-size: @font-size-lg;
          font-weight: bold;
          margin-bottom: 12px;
        }
        .slot {
          line-height: 15px;
          i {
            font-size: 8px;
          }
          span {
            margin-left: 4px;
          }
        }
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
