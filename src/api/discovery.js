import ajax from "./ajax"

// 轮播图
export const reqBanners = () => ajax("/banner", { type: 0 })

// 最新音乐
// 这里limit为40时才可以获得10个推荐新歌. 不知道为什么,跟api文档介绍不一样
export const reqNewSongs = () => ajax("/personalized/newsong", { limit: 40 })

// 最新mv
export const reqNewMVs = () => ajax("/personalized/mv")
