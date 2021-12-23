import ajax from "@/api/ajax"

export const reqLyric = (songId) => ajax("/lyric", { id: songId })
export const reqArtist = (ArtistId) => ajax("/artists", { id: ArtistId })
