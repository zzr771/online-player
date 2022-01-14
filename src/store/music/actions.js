export default {
  startSong(content, song) {
    // 重置currentSong
    content.commit("setCurrentSong", { song })
    // 加入播放列表
    content.commit("addSongToPlayList", { song })
  },
}
