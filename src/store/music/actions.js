export default {
  startSong(content, song) {
    content.commit("setCurrentSong", { song })
    // 加入播放列表
    // 更新历史记录
  },
}
