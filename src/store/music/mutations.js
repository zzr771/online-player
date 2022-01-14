export default {
  // 重置currentSong, 即播放歌曲
  setCurrentSong(state, { song }) {
    // 去除前一首歌的isPlaying状态(如果有前一首歌的话)
    if (state.currentSong.id) {
      state.currentSong.isPlaying = false
    }
    state.currentSong = song
    song.isPlaying = true

    // 向历史记录列表中添加歌曲
    if (!state.historyPlayList.includes(song)) {
      state.historyPlayList.push(song)
    }
  },

  // 播放/暂停
  updateIsPlaying(state, { isPlaying }) {
    state.isPlaying = isPlaying
  },

  // 改变歌曲播放进度(时间)
  updateCurrentTime(state, { time }) {
    state.currentTime = time
  },

  // 显示/隐藏歌曲播放页
  toggleShowPlayPage(state) {
    state.showPlayPage = !state.showPlayPage
  },

  //-------------------------------播放列表页----------------------------
  // 向播放列表中添加歌曲
  addSongToPlayList(state, { song }) {
    if (!state.playList.includes(song)) {
      state.playList.push(song)
    }
    // 如果当前是随机播放模式, 就需要重新生成播放顺序
    if (state.playMode === 2) {
      genRandomPlaySequence(state)
    }
  },

  // 从播放列表中删除指定歌曲
  removeSongFromPlayList(state, { song }) {
    const index = state.playList.findIndex((s) => {
      return s === song
    })
    state.playList.splice(index, 1)
  },

  // 向播放列表中添加歌单
  addListToPlayList(state, { list }) {
    // 如果播放列表中已经有歌曲
    if (state.playList.length) {
      state.playList.push(...list)
      // 去重
      state.playList = [...new Set(state.playList)]
    } else {
      state.playList.push(...list)
    }

    // 播放第一首歌. 先检查currentSong是否为空
    if (state.currentSong.id) {
      state.currentSong.isPlaying = false
    }
    state.currentSong = list[0]
    state.currentSong.isPlaying = true
    // 向历史记录列表中添加歌曲
    if (!state.historyPlayList.includes(state.currentSong)) {
      state.historyPlayList.push(state.currentSong)
    }
  },

  // 清空播放列表  (也清除currentSong)
  clearPlayList(state) {
    state.playList = []
    state.randomPlaySequence = []
    state.currentSong.isPlaying = false
    state.currentSong = {}
    state.currentTime = 0
  },

  // 清空历史记录
  clearHistoryPlayList(state) {
    state.historyPlayList = []
  },

  // 显示/隐藏播放列表
  toggleShowPlayList(state) {
    state.showPlayList = !state.showPlayList
  },

  // 切换播放模式  如果切换到了随机模式,就生成随机播放列表
  switchPlayMode(state) {
    state.playMode = ++state.playMode % 3

    if (state.playMode === 2) {
      genRandomPlaySequence(state)
    }
  },

  //-------------------------------
}

// 生成随机播放列表
function genRandomPlaySequence(state) {
  state.randomPlaySequence = []
  // 首先把当前正在播放的歌曲放进列表第一个
  state.randomPlaySequence.push(state.currentSong)

  // 浅拷贝一个临时列表, 当作池, 随机从中抽取歌放入randomPlaySequence
  let temList = Object.assign([], state.playList)
  // 先从池中去除currentSong
  const currentIndex = temList.findIndex((s) => {
    return s.id === state.currentSong.id
  })
  temList.splice(currentIndex, 1)
  // 循环到池中的歌曲被抽完
  while (temList.length) {
    // 根据temList的长度,生成一个随机数,把对应索引的歌曲加入randomPlaySequence
    const random = Math.floor(Math.random() * temList.length)
    state.randomPlaySequence.push(temList[random])
    temList.splice(random, 1)
  }
}
