import ajax from "./ajax"

// 按关键词搜索歌曲,歌单或mv   params必须是对象,必有keywords属性
export const reqSearch = (params) => ajax(`/search`, params, 1)
// 热门搜索词
export const reqSearchHot = () => ajax("/search/hot")
// 搜索建议,实时更新显示在搜索面板中
export const reqSearchSuggestion = (keywords) => ajax("/search/suggest", { keywords })
