import ajax from "@/api/ajax"

export const reqLyric = (songId) => ajax("/lyric", { id: songId })
