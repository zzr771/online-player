export default {
  // 当前播放的歌曲
  currentSong: {},
  // 是否正在播放歌曲
  isPlaying: false,
  // 当前播放进度(时间), 单位:秒
  currentTime: 0,
  // 是否展示歌曲播放页
  showPlayPage: false,
  // 是否展示播放列表
  showPlayList: false,
  // 播放列表
  playList: [],
  // 播放历史记录列表
  historyPlayList: [],
  // 播放模式  0:顺序播放, 1:单曲循环, 2:随机播放
  playMode: 0,
  // 随机播放顺序
  randomPlaySequence: [],
}
