import ajax from "@/api/ajax"

// 歌词 (playPage页面)
export const reqLyric = (songId) => ajax("/lyric", { id: songId })
// 作者
export const reqArtist = (ArtistId) => ajax("/artists", { id: ArtistId })
// 相关歌单(播放器页面)
export const reqRelevantPlayLists = (songId) => ajax("/simi/playlist", { id: songId })
// 相似歌曲(播放器页面)
export const reqSimiSongs = (songId) => ajax("/simi/song", { id: songId })
// 新歌速递(最新音乐页面)
export const reqTopSongs = (type) => ajax("/top/song", { type }, 1)
// 歌曲详情
export const reqSongDetail = (id) => ajax("/song/detail", { ids: id })

// 获取推荐歌单 (推荐歌单页面)
export const reqPlaylists = (params) => ajax("/top/playlist", params, 1)
// 精品推荐歌单 (推荐歌单页面)
export const reqHQPlaylists = (params) => ajax("/top/playlist/highquality", params)
// 歌单详情 (歌单详情页)
export const reqPlaylistDetail = (id) => ajax("/playlist/detail", { id }, 1)
