export default {
  // 重设currentSong
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
  },
  // 显示/隐藏歌曲播放页
  toggleShowPlayPage(state) {
    state.showPlayPage = !state.showPlayPage
  },
  // 向播放列表中添加歌曲
  addSongToPlayList(state, { song }) {
    state.playList.push(song)
  },
  // 清空播放列表  (也清除currentSong)
  clearPlayList(state) {
    state.playList = []
    state.currentSong = {}
  },
  // 显示/隐藏播放列表
  toggleShowPlayList(state) {
    state.showPlayList = !state.showPlayList
  },
}
