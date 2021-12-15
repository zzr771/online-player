export default {
  // 重写currentSong
  setCurrentSong(state, { song }) {
    state.currentSong = song
  },
  // 播放/暂停
  updateIsPlaying(state, { isPlaying }) {
    state.isPlaying = isPlaying
    // console.log(state.isPlaying)
  },
  // 改变歌曲播放进度(时间)
  updateCurrentTime(state, { time }) {
    state.currentTime = time
    // console.log(state.currentTime)
  },
  // 显示/隐藏歌曲播放页
  toggleShowPlayPage(state) {
    state.showPlayPage = !state.showPlayPage
  },
  // 显示/隐藏播放列表
  toggleShowPlayList(state) {
    state.showPlayList = !state.showPlayList
  },
}
