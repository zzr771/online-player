import ajax from "@/api/ajax"

// 歌曲评论
export const reqSongComment = (params) => ajax(`/comment/music`, params)
// 歌单评论
export const reqPlaylistComment = (params) => ajax(`/comment/playlist`, params)
// mv评论
export const reqMvComment = (params) => ajax("/comment/mv", params)
// 热门评论
export const reqHotComment = (params) => ajax(`/comment/hot`, params)
