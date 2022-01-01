import ajax from "@/api/ajax"

// 歌词
export const reqLyric = (songId) => ajax("/lyric", { id: songId })
// 作者
export const reqArtist = (ArtistId) => ajax("/artists", { id: ArtistId })
// 相关歌单(播放器页面)
export const reqRelevantPlayLists = (songId) => ajax("/simi/playlist", { id: songId })
// 相似歌曲(播放器页面)
export const reqSimiSongs = (songId) => ajax("/simi/song", { id: songId })
// 新歌速递(最新音乐页面)
export const reqTopSongs = (type) => ajax("/top/song", { type })
// 歌曲详情
export const reqSongDetail = (id) => ajax("/song/detail", { ids: id })
