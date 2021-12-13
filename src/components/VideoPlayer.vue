// 位于MV播放页面中的视频播放器
<template>
  <div id="video-player"></div>
</template>

<script>
import Player from "xgplayer"
import { toRem } from "@/utils/rem"
import { onMounted } from "vue"
export default {
  props: ["url", "poster"],
  setup(props) {
    onMounted(() => {
      _initPlayer()
    })
    function _initPlayer() {
      if (!props.url) return
      const vp = document.getElementById("video-player")
      const myPlayer = new Player({
        el: vp,
        url: props.url,
        poster: props.poster,
        videoInit: true,
        lang: "zh-cn",
        width: "100%",
      })

      // 把播放器的尺寸改成rem, 这样就能跟随屏幕变化
      myPlayer.on("ready", () => {
        let playerHeight = vp.style.height
        playerHeight = toRem(parseInt(playerHeight))
        vp.style.height = playerHeight
      })
    }
  },
}
</script>

<style>
.xgplayer-error {
  display: none;
}
</style>
