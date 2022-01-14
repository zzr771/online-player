// discovery页面中所需要的请求

import ajax from "./ajax"

// 轮播图
export const reqBanners = () => ajax("/banner", { type: 0 }, 0.25)

// 推荐音乐
// 这里limit为40时才可以获得至少10个推荐新歌, 并且数量不固定. 不知道为什么,跟api文档介绍不一样
export const reqPerSongs = () => ajax("/personalized/newsong", { limit: 40 }, 0.25)

// 推荐mv
export const reqPerMVs = () => ajax("/personalized/mv", {}, 0.25)

// 推荐歌单
export const reqPerPlaylists = (params) => ajax("/personalized", params, 0.25)
