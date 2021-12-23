// 点击miniPlayer中左侧歌曲图片, 弹出的播放页面. 包含歌词,评论,相关歌曲等
<template>
  <div class="play-page" v-if="currentSong.id" :class="{ hide: !showPlayPage }">
    <div class="content-wrapper">
      <div class="song">
        <div class="rotating-album">
          <img src="@/assets/images/play-bar-bearing.png" alt="" class="play-bar-bearing" />
          <img src="@/assets/images/play-bar.png" alt="" class="play-bar" :class="{ playing: isPlaying }" />
          <div class="img-outer-border">
            <div class="img-inner-border" :class="{ paused: !isPlaying }">
              <img src="@/assets/images/album-cover.jpg" alt="" class="album-cover" />
            </div>
          </div>
        </div>
        <div class="song-info">
          <div class="title">Someone Like You <span>MV</span></div>
          <div class="desc">歌手：<span class="author">Adele</span></div>
          <div class="lyric-wrapper">
            <Scroller v-if="parsedLyric.length" :parsedLyric="parsedLyric"></Scroller>
            <div class="empty" v-else>还没有歌词哦~</div>
          </div>
        </div>
      </div>
      <div class="others">
        <div class="comments-wrapper">
          <Comments></Comments>
        </div>
        <div class="relative">
          <div class="inclusion-lists">
            <p class="title">包含这首歌的歌单</p>
            <div class="list">
              <SongCardMini>
                <div class="slot">
                  <i class="iconfont icon-bofang"></i>
                  <span class="play-count">187 万</span>
                </div>
              </SongCardMini>
              <SongCardMini>
                <div class="slot">
                  <i class="iconfont icon-bofang"></i>
                  <span class="play-count">187 万</span>
                </div>
              </SongCardMini>
            </div>
          </div>
          <div class="similiar-songs">
            <p class="title">相似歌曲</p>
            <div class="list">
              <SongCardMini> Adele </SongCardMini>
              <SongCardMini> Adele </SongCardMini>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqLyric } from "@/api/music"
import LyricPaser from "@/utils/lrcparse"
import { ref, reactive, computed } from "vue"
import { useStore } from "vuex"
import Scroller from "@/components/Scroller"
import Comments from "@/components/Comments"
import SongCardMini from "@/components/SongCardMini"
export default {
  setup() {
    // 解析后的歌词,类型为数组,每个元素都是对象,包含一句歌词的信息(时间,原文歌词,译文歌词). 结构: {time,contents:[lyric,tlyric]}
    let parsedLyric = reactive([])
    let noLyric = ref(true)

    getLyric("16435049")

    // 获取歌词
    async function getLyric(id) {
      let lrc = await reqLyric(id)
      //如果歌词存在
      if (lrc) {
        // 把LyricPaser解析后的数组赋值给parsedLyric,这里用深拷贝. 否则parsedLyric的内存指针就变了
        parsedLyric = Object.assign(parsedLyric, LyricPaser(lrc))
      }
    }

    const store = useStore()
    let currentSong = computed(() => store.state.music.currentSong)
    let showPlayPage = computed(() => store.state.music.showPlayPage)
    let isPlaying = computed(() => store.state.music.isPlaying)
    return { noLyric, parsedLyric, showPlayPage, isPlaying, currentSong }
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
  z-index: 100;
  top: @header-height;
  bottom: @mini-player-height;
  left: 0;
  right: 0;
  padding: 0 36px;
  overflow-y: auto;
  background: var(--player-bgcolor);

  transition: 0.5s;

  &.hide {
    transform: translateY(100%);
  }
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
        .inclusion-lists {
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
.scroll-enter-from,
.scroll-leave-to {
  transform: translateY(100%);
}
.scroll-enter-active,
.scroll-leave-active {
  transition: 0.5s;
}
</style>
