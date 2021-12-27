import ajax from "@/api/ajax"

export const reqLyric = (songId) => ajax("/lyric", { id: songId })
export const reqArtist = (ArtistId) => ajax("/artists", { id: ArtistId })
export const reqRelevantPlayLists = (songId) => ajax("/simi/playlist", { id: songId })
export const reqSimiSongs = (songId) => ajax("/simi/song", { id: songId })
