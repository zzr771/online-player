// 位于MV播放页面中的视频播放器
<template>
  <div ref="videoPlayer" class="video-player"></div>
</template>

<script>
import Player from "xgplayer"
import { toRem } from "@/utils/rem"
import { ref, onMounted, watch } from "vue"
import { useStore } from "vuex"
export default {
  props: {
    url: String,
    poster: String,
  },
  setup(props) {
    const store = useStore()
    onMounted(() => {
      initPlayer()
    })

    let videoPlayer = ref(null)
    let myPlayer
    function initPlayer() {
      if (!props.url) return
      const vp = videoPlayer.value
      myPlayer = new Player({
        el: vp,
        url: props.url,
        // poster: props.poster,
        videoInit: true,
        lang: "zh-cn",
        width: "100%",
      })

      // 把播放器的尺寸改成rem, 这样就能跟随屏幕变化
      myPlayer.on("ready", () => {
        let playerHeight = vp.style.height
        playerHeight = toRem(parseInt(playerHeight))
        vp.style.height = playerHeight
        myPlayer.play()
      })

      // mv开始播放时,如果有音乐在播放中,就把它暂停
      myPlayer.on("play", () => {
        store.commit("music/updateIsPlaying", { isPlaying: false })
      })
    }

    // 监视url,变化时重新加载播放器
    watch(
      () => props.url,
      (newValue) => {
        // 如果是第一次打开页面
        if (!myPlayer) {
          initPlayer()
          myPlayer.play()
        } else {
          myPlayer.src = newValue
          myPlayer.reload()
        }
      }
    )

    return { videoPlayer }
  },
}
</script>

<style lang="less" scoped>
.video-player {
  border-radius: 5px;
  overflow: hidden;
}
.xgplayer-error {
  display: none;
}
</style>
